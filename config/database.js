if(process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: 'your external source'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/nodeblog'}
}