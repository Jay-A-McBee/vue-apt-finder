var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpack = require('webpack');
var config = require('../../webpack.config');
var compiler = webpack(config);
var childProcess = require('child_process');
var craigslist = require('node-craigslist');
  

var app = express();

app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname,'../app')));

app.get('/', function(req,res){
  res.sendFile(path.resolve(__dirname, '../../index.html'))
})

client = new craigslist.Client({
  city : 'seattle'
});

let allListings, listingMap

var [start, finish] = [0,10]

var sortByMostRecent = (listA, listB) => {
  const {
    postedAt: aPosted,
    updatedAt: aUpdated,
  } = listA;

  const {
    postedAt: bPosted,
    updatedAt: bUpdated
  } = listB;

  return (aUpdated || aPosted) > (bUpdated || bPosted);
};

app.get('/more', function(req,res){
  const {
    zip,
    mileage,
    minPrice,
    maxPrice
  } = req.query;

  var options = {
    category: 'apa',
    search_distance: mileage,
    postal: zip
  }

  client
  .search(options)
  .then((listings) => {
    console.log('filtering listings', listings[0]);
    allListings = listings
      .filter( listing => {
        let price = Number(listing.price.replace(/\$/,''));
        // console.log('price after strip', price);
        // console.log('truthy test', price <= 2200 && price >= 1500 )
        return price <= 2200 && price >= 1500;
      })

    // console.log('listings post filter', listings)
    // play with listings here...
    // Promise.all(listings.map((listing) => client.details(listing)));
    // return Promise.all(listings.map( listing => client.details(listing)));
    var [cut, end] = [start, finish];
    
    start+=10;
    finish+=10

    listingMap = allListings.reduce( (acc, listing) => {
        acc[listing.pid] = listing;
        return acc;
    },{});

    return Promise.all(allListings.slice(cut,end).map( listing => client.details(listing)));
  })
  .then(detailsArr => {
    console.log('detailsArr', detailsArr);
    return res.send(
      detailsArr
        .sort(sortByMostRecent)
        .map( detailObj => Object.assign({}, detailObj, {price:listingMap[detailObj.pid].price, attributes: Object.keys(detailObj.attributes)})))
  })
  .catch((err) => {
    console.error(err);
  });
})

app.get('/more', function(req,res){
  let [cut, end] = [start, finish];
  start+=10;
  finish+=10

  if(finish > allListings.length){
    start = 0;
    finish = 10;
  }

  return Promise.all(allListings.slice(cut,end).map( listing => client.details(listing)))
    .then(detailsArr => res.send(detailsArr.map( detailObj => Object.assign({}, detailObj, {price:listingMap[detailObj.pid].price,attributes: Object.keys(detailObj.attributes)}))))
})

app.get('/fetch', function(req,res){
  
  client = new craigslist.Client({
    city : 'seattle'
  });

  var options = {
    category: 'apa',
    search_distance:'2',
    postal: '98118'
  }

 
  client
  .search(options)
  .then((listings) => {
    console.log('filtering listings', [listings[0], listings.length]);
    allListings = listings
      .filter( listing => {
        let price = Number(listing.price.replace(/\$/,''));
        // console.log('price after strip', price);
        // console.log('truthy test', price <= 2200 && price >= 1500 )
        return price <= 2200 && price >= 1500;
      })

    console.log('listings post filter', allListings)
    // play with listings here...
    // Promise.all(listings.map((listing) => client.details(listing)));
    // return Promise.all(listings.map( listing => client.details(listing)));
    var [cut, end] = [start, finish];
    
    start+=10;
    finish+=10

    listingMap = allListings.reduce( (acc, listing) => {
        acc[listing.pid] = listing;
        return acc;
    },{});

    return Promise.all(allListings.slice(cut,end).map( listing => client.details(listing)));
  })
  .then(detailsArr => {
    return res.send(
      detailsArr
        .sort(sortByMostRecent)
        .map( detailObj => Object.assign({}, detailObj, {price:listingMap[detailObj.pid].price, attributes: Object.keys(detailObj.attributes)})))
  })
  .catch((err) => {
    console.error(err);
  });

})

var isProd = process.env.NODE_ENV === 'production';
var hasRun = false;

var port = process.env.PORT || 3000;

app.listen(port);

// if(!isProd && !hasRun){
//   hasRun = true;
//   console.log('server is up on --> '+port);
//   childProcess.exec("/usr/bin/open -a '/Applications/Google Chrome.app' 'http://localhost:3000/'", (error, stdout, stderr) => {
//     if(error){
//       console.err('******************err***********:', err);
//     }
//     console.log(`stdout: ${stdout}`);
//     console.log(`stderr: ${stderr}`);
//   })
// }
