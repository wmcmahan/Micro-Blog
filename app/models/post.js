var mongoose = require('mongoose'),
	Schema = mongoose.Schema


// Shcema
var ArticleSchema =  new Schema({
    title: { type: String, required: true },
    content: String,
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
    img: String,
    longitude: Number,
    latitude: Number,
    city: String
})


// Register
module.exports = mongoose.model('Article', ArticleSchema);
