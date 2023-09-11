require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const shortid = require('shortid');
const cors = require('cors')
const redis = require('redis');
const logger = require('./logger');

const UrlModel = require('./models/urls.model')


const app = express()
const port = process.env.PORT

const redisClient = redis.createClient({
    url: 'redis://redis:6379'
})

redisClient.connect()

redisClient.on('error', function (err) {
    logger.info('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    logger.info('Connected to redis successfully');
});

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => logger.info('Connection success'))
    .catch((error) => error)

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: process.env.FRONT_URL,
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE', 'PATCH'],
    credentials: true,
    withCredentials: true
}))

app.use(session({
    secret: process.env.SECRET_KEY,
    cookie: {
        httpOnly: false,
        maxAge: null,
        secure: false,
    },
    store: MongoStore.create({mongoUrl: process.env.MONGO_DB_CONNECTION_STRING})
}))


app.listen( port, () => {
    logger.info(`Example app listening on port ${port}`)
})

/**
 * generate short url for resource by original url resource
 *  @method Post
 *  @body - { originalUrl: string, subpart?:string }
 *  @return { shortUrl: string }
 *  @example we try to send body looks like { "originalUrl": "https://github.com/" }, if we didn`t set "subpart" value
 *          we receive response like { shortUrl: "anyrandomstring" }. If we set subpart value as "random" string and if
 *          this subpart doesn`t exist for this session, we receive response like this { shortUrl: "random"}
 */
app.post('/shorten', async (req, res) => {

    const { originalUrl, subpart } = req.body;
    const sessionId = req.session.id;
    const existUrlModel = await UrlModel.findOne({ originalUrl, sessionId })
    if(existUrlModel) {
        logger.debug(`[${sessionId}] The short link was created earlier for ${originalUrl} url `)
        return res.send({shortUrl: existUrlModel.shortUrl})
    }
    const shortUrl = subpart ? subpart : shortid.generate()
    const existUrlModelByShortUrl = await UrlModel.findOne({ shortUrl });
    if(existUrlModelByShortUrl) {
        logger.error(`[${sessionId}] model with short url - "${shortUrl}" is exist`)
        return res.status(400).send(`model with short url - "${shortUrl}" is exist`)
    }
    const urlsModel = new UrlModel({
        originalUrl,
        shortUrl,
        sessionId
    })
    await urlsModel.save()
    res.send({shortUrl})
});


/**
 * method for redirect to originalUrl by shortUrl string
 *  @method Get
 *  @param shortUrl
 *  @expected redirect to original url
 *  @example we know short url for redirection, we open link like http://localhost:3030/random, if this short link is
 *           existed, we will be redirected to https://github.com/
 */
app.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;
    const sessionId = req.session.id

    if (!shortUrl) {
        logger.error(`[${sessionId}] The shortUrl wasn\`t sent`)
        return res.status(400).send('url doesn`t correct, you need to send correct subpart')
    }

    const valueFromRedis = await redisClient.get(`${shortUrl}_${sessionId}`)

    console.log(`valueFromRedis - ${valueFromRedis}`)

    if (valueFromRedis) {
       return res.redirect(valueFromRedis);
    }

    const url = await UrlModel.findOne({ shortUrl, sessionId });

    if (!url) {
        logger.error(`[${sessionId}] The subpart - ${shortUrl} doesn\`t exist`)
        return res.sendStatus(404);
    }

    await redisClient.set(`${url.shortUrl}_${url.sessionId}`, url.originalUrl)

    res.redirect(url.originalUrl);
});


/**
 * method finds and returns the list of all url for session
 *  @method Post
 *  @body { limit: number, offset: number}
 *  @return list of all urls for session
 */

app.post('/links-list', async (req, res) => {
    const { limit, offset } = req.body;
    const sessionId = req.session.id

    logger.info(`[${sessionId}] limit - ${limit}, offset - ${offset}`)

    const result = await UrlModel.find({sessionId}).skip(offset).limit(limit)
    const count = await UrlModel.count({sessionId})

    res.send({data: result, totalCount: count});
});