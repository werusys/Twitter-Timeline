const express = require('express');
const path = require('path');
const compression = require('compression');
const libName = require('./package.json').name;
const camelCase = require('camelcase');
const app = express();
const networkInterfaces = require('os').networkInterfaces;
const build = require('./build');
let server;

const https = require('https');
const fs = require('fs');
const config = require('./server-config.json');

const options = {
  key: fs.readFileSync(config.ssl.key),
  cert: fs.readFileSync(config.ssl.cert),
  requestCert: false,
  rejectUnauthorized: false
};

// BEGIN: Twitter proxy

var cors = require('cors')

app.use(cors());

const Twitter  = require('twitter');
const client = new Twitter({
  consumer_key: 'your keys',
  consumer_secret: 'your keys',
  access_token_key: 'your keys',
  access_token_secret: 'your keys',  
});

let cache = [];
let cacheAge = 0;

app.get('/twitter', (req, res) => {

  // https://api.twitter.com/1.1/search/tweets.json?q=nasa&result_type=popular'
  // .get(`statuses/home_timeline`, params)
  // .get(`search/tweets.json?q=WerusysEnergy%20OR%20WerusysServiceNotification%20OR%20@realdonaldtrump&result_type=popular`, params)

  if (Date.now() - cacheAge > 60000) {
    cacheAge = Date.now();
    const params = { tweet_mode: 'extended', count: 40 };
    if (req.query.since) {
      params.since_id = req.query.since;
    }
    client
      .get(`search/tweets.json?q=WerusysEnergy%20OR%20WerusysServiceNotification&result_type=popular`, params)
      .then(timeline => {
        cache = timeline;
        res.send(timeline);
      })
      .catch(error => res.send(error));
  } else {
    res.send(cache);
  }
});

https.createServer(options, app).listen(3000, () => console.log('Twitter proxy running'));

// END: Twitter proxy

app.use(compression());

app.use((req, res, next) => {
 
  const reqOrigin = req.header('Origin');

  if (reqOrigin && config.cors.origin === '*' || config.cors.origin.includes(reqOrigin)) {
    res.header("Access-Control-Allow-Origin", reqOrigin);    
    res.header('Access-Control-Allow-Credentials', config.cors.credentials);
    if (req.method === 'OPTIONS') {
      res.header("Access-Control-Allow-Headers", config.cors.headers);
      res.header('Access-Control-Allow-Methods', config.cors.methods);
      res.sendStatus(200);
    }
  }
  next();
});

app.use('/', express.static(path.join(__dirname, 'dist')));

app.get('/manifest', (req, res) => {
  const { address, port } = server.address();
  res.json({
    extensions: [{
      name: camelCase(libName),
      path: `https://${address}:${port}/${libName}.js`
    }]
  });
});

build.start().then(() => {
  server = https.createServer(options, app);
  server.listen(config.port, config.hostname, () => {
    const { address, port } = server.address();
    console.log('Listening on %s:%s', address, port);
  });  
});
