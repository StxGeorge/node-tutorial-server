const express = require('express'),
      hbs = require('hbs'),
      fs = require('fs');

var app = express();

var greeting = ['Hi there', 'Hello, How are ya', 'Howdy partner!']
var r = Math.floor(Math.random() * 3);

hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.set('view engine', 'hbs');

//app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs', {
//     pageTitle: 'Maintenance',
//     errorMessage: 'You are fucked!'
//   });
// });   //toggle comment to activate/deactivate

app.use(express.static(__dirname + '/public'));// I had to move this here to
//prevent it from executing before the maintenance page, so while maintenance
// is active no other content is served.

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home page.',
    greetingMessage: greeting[r]
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About page.'
  });
});


app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
