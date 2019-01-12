/*eslint no-console: "off"*/
var express = require( 'express' );
var movieRouter = require( '../app/controllers/api/movies' );
var app = express();
// var waterline = require( '../config/database' );

app.get( '/', function ( req, res ) {
  res.status( 200 ).send( 'hello' );
});

app.use( '/api/movies', movieRouter );

/** @description Creates and start an express server  
 * @param {number} port - The port the server should be listening on
 * @param {object} [options] - Options object
 * @param {boolean} [options.verbose] - The boolean flag to output log messages
 * @return {Express} 
 */
module.exports = function( port, options = { verbose: false }){
  var server = app.listen( port, () => {
    if( options.verbose ) console.log( 'Server listening to requests on port %s', port );
  });

  return server;
};