const mongoose = require('mongoose');
const {model} = require("mongoose");
const Schema = mongoose.Schema

const urlsSchema = new Schema({
    shortUrl: {
        type: String,
        required: true
    },
    originalUrl: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        required: true
    }
})

const UrlModel = mongoose.model('UrlModel', urlsSchema)

module.exports = UrlModel