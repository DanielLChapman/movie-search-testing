var mongoose = require('mongoose');


//movie scheme
var MovieSchema = new mongoose.Schema({
  movie: String,
  votes: {type: Number, default: 0},
  score: {type: Number, default: 0},
  genre: String
});

mongoose.model('Movies', MovieSchema);