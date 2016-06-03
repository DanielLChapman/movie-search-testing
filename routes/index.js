var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var movie = mongoose.model('Movies');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Movie Picker' });
});

//Get parse page
router.get('/parse', function(req, res, next) {
  res.render('parse', { title: 'Express parser' });
});

//Get movie page to get list of movies
router.get('/movies', function(req, res, next) {
  movie.find(function(err, movies){
    if(err){ return next(err); }

    res.json(movies);
  });
});

//Creates a movie
router.post('/movies', function(req, res, next) {
  var post = new movie(req.body);

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

//Gets all movie by genre
router.get('/movies/:genre/', function(req, res) {
  var query = movie.find({genre: req.params.genre}).where('score').gt(8);
  
  query.exec(function (err, movie){
    if (err) { console.log(err); }
    if (!movie) { console.log(movie); }
    else {
      req.movie = movie;
    }
    res.json(req.movie);
  });
});

//Get all movies higher then a score
router.get('/movies/search/:score/', function(req, res) {
  var query = movie.find().where('score').gt(req.params.score);
  
  query.exec(function (err, movie){
    if (err) { console.log(err); }
    if (!movie) { console.log(movie); }
    else {
      req.movie = movie;
    }
    res.json(req.movie);
  });
});

//Main route, gets a single movie based on a genre with a score higher
//then the requested score - .1
router.get('/movies/:genre/:score', function(req, res) {
  
  var query = movie.find({genre: req.params.genre}).where('score').gt(req.params.score - .1);

  query.exec(function (err, movie){
    if (err) { console.log(err); }
    if (!movie) { console.log(movie); }
    else {
      req.movie = movie;
    }
    if (movie.length > 1) {
      var j = Math.floor(Math.random() * (movie.length-0) + 0);
      res.json(movie[j]);
    }
    else {
      res.json(req.movie);
    }
  });
});

//Deletes the entire database, as a just incase if multiple data is uploaded.
router.get('/delete', function(req, res) {
  movie.remove({}, function(err) {
    console.log(err);
  });
});

module.exports = router;
