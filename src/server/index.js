/*eslint no-console: "off"*/
var express = require( 'express' );
var movieRouter = require( './api/movies' );
var app = express();

app.get( '/', function ( req, res ) {
  res.status( 200 ).send( 'hello' );
});

app.use( '/api/movies', movieRouter );

module.exports = function( port = 3000, options = { verbose: false }){
  var server = app.listen( port, () => {
    if( options.verbose ) console.log( 'Server listening on port %s', port );
  });

  return server;
};