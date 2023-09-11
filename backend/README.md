### Description 
The application for creating the short by long url.

### The main stack
```
mongodb, express, express-session, redis
```

### Steps for start application
```
run to terminal 'sudo docker-compose up'
```

### Methods in to application
```
1. Post request '/sorten'
    body: { originalUrl: string, subpart?:string }
    The method return short subpart to access the original link
```
```
2. Get request '/:shortUrl'
    param 'shortUrl' - string from first method
    The method redirect to original url
```
```
3. Post request '/links-list'
    body: { limit: number, offset: number }
    The method return list of all urls for the session
```