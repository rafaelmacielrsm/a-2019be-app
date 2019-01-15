/*eslint no-console: "off"*/
/** 
 * @typedef {Object} http.Server
*/
var express = require( 'express' );
var movieRouter = require( '../app/controllers/moviesRouter' );
var bodyParser = require( 'body-parser' );
var cors = require( 'cors' );
var app = express();

app.get( '/', function ( req, res ) {
  res.sendStatus( 200 );
});

app.use( cors());
app.use( bodyParser.json());
app.use( '/api/movies', movieRouter );

/**
 * @description Creates and start an express server  
 * @param {number} port - The port the server should be listening on
 * @param {object} [options] - Options object
 * @param {boolean} [options.verbose] - The boolean flag to output log messages
 * @resolves {http.Server} Node http.Server-like
 */
module.exports = function( port, options = { verbose: false, database: false }){
  return new Promise(( resolve ) => {
    var httpServer;
    httpServer = app.listen( port, () => {
      if( options.verbose ) console.log( 'Server listening to requests on port %s', port );
      resolve( httpServer );
    });
  });
};