var app = angular.module('movieFinder', []);

//Services to get JSON information from database

app.service('movies', ['$http', function($http) {
  var o = {
    movies: []
  };
  //for testing, getAll to make sure the data exists
  o.getAll = function() {
    return $http.get('/movies').success(function(data){
      angular.copy(data, o.movies);
    });
  };
  //Testing purposes, to get all movies from a single genre
  o.getAllSpecific = function(genre) {
    return $http.get('/movies' + genre).success(function(data){
      angular.copy(data, o.movies);
    });
  };
  //Create movies, used when parsing
  o.create = function(movies){
    return $http.post('/movies', movies).success(function(data){
      o.movies.push(data);
    });
  };
  //Service that gets the actual movie information. 
  o.get = function(genre, score) {
    return $http.get('/movies/' + genre + "/" + score).then(function(res){
      return res.data;
    });
  };
  return o;
}]);

//Controller for whole app, contains index and parsing information, parsing could be and probably will be moved out
app.controller('MainCtrl', [
'$scope', 'movies',
function($scope, movies){
  //Variables for app
  /* 
    movies = Title, Voters = number of voters, searchScore = the value to be searched
    score = returned score, oldGenre = searched genre incase it gets cleared from an empty 
    response, genre = returned genre, errorMessages isnt implemented yet
    movies gets the movies from services, isnt being used at the moment
    data arrays are used when parsing.
    Get Data handles the actual index. It gets information in, checks to make sure the search information exists, no validation yet. 
    Queries the mongoDB, and then gets the information and deals with it. 
  */
  $scope.movie = "";
  $scope.voters = 0;
  $scope.searchScore = 0;
  $scope.score = 0;
  $scope.oldGenre = "Action";
  $scope.genre = "Action";
  $scope.errorMessages = [];
  $scope.movies = movies.movies;
  var data = new Array();
  var dataId = new Array();
  var dataCount = new Array();
  $scope.getData = function() {
    if ($scope.score == null) {
      $scope.score = 0;
      $scope.errorMessages.push("Score was null");
    }
    if ($scope.genre == null) {
      $scope.genre = $scope.oldGenre;
      $scope.errorMessages.push("Genre was null");
    }
    oneMovie = movies.get($scope.genre, $scope.searchScore).then(function(data) {
      if (data != null) {
        $scope.movie = data.movie;
        $scope.voters = data.votes;
        $scope.score = data.score;
        $scope.oldGenre = $scope.genre;
        $scope.genre = data.genre;
      }
      else {
        $scope.movie = "Error, invalid input"
        $scope.score = $score.serchScore
        $scope.genre = $scope.oldGenre;
      }
      
      //Handles empty returns so if they smash the button repeatedly, error is avoided. 
      if ($scope.movie == null) {
        $scope.movie = "No movie found, try changing the rating";
        $scope.genre = $scope.oldGenre;
      }
    });
  };
  
  //ratings.csv isnt included as its a 620mb file. 
  //Uses Papa Parse library.
  /* Parses local to cloud
  $scope.parseData = function() {
    $scope.buttonC = true;
      Papa.parse("../csv/ratings.csv", {
              download: true,
            step: function(row) {
              //Each row, it checks if the array position exists, if it doesnt, initialize it.
              if (data[row.data[0][1]] == null) {
                data[row.data[0][1]] = 0;
              }
              if (dataCount[row.data[0][1]] == null) {
                dataCount[row.data[0][1]] = 0;
              }
              //Populates the arrays with the data 
              //ID of the movie
              dataId[row.data[0][1]] = parseInt(row.data[0][1]);
              //Ratings of the movie
              data[row.data[0][1]] += parseFloat(row.data[0][2]);
              //For the select movie, incrememnts the number of votes
              dataCount[row.data[0][1]]++;
             },
        //On complete, logs that we are done parsing the votes, moves to connecting the movie titles.
            complete: function(results) {
                console.log("connecting movie titles");
                $scope.connectMovies();
            }
          });
      }
      
  $scope.connectMovies = function() {
        Papa.parse("../csv/movies.csv", {
            download: true,
            step: function(row) {
              //each step, checks if the genre is null. If it is, give it an empty value
              //Sets the movie ID equal to the movie title. 
              dataId[row.data[0][0]] = row.data[0][1];
              var genresStr = row.data[0][2];
              if (genresStr == null) {
                genresStr = "";
              }
              //for each genre, upload the information to the database. 
              var genres = genresStr.split("|");
              genres.forEach(function(entry) {
                var doubleArray = new Array();
                $scope.movie = dataId[row.data[0][0]];
                $scope.voters = dataCount[row.data[0][0]];
                $scope.score = parseFloat(data[row.data[0][0]]/dataCount[row.data[0][0]])*2;
                $scope.genre = entry;
                movies.create({
                  movie: $scope.movie,
                  votes: $scope.voters,
                  score: $scope.score,
                  genre: $scope.genre
                });
                //resets the information incase something funny happens.
                $scope.movie = "";
                $scope.voters = 0;
                $scope.score = 0;
                $scope.genre = "";
              });
             },
            complete: function(results) {
            }
          });
      }*/
}]);