/**
 * @description - Check if request with POST, PATCH or PUT have the json
 * media type header
 */
module.exports = ( req, res, next ) => {
  if( req.method.match( /POST|PATCH|PUT/ )){
    let contentType = req.headers[ 'content-type' ];

    if( contentType && contentType !== 'application/json' ){
      return res.sendStatus( 415 ); 
    }
  }

  next();
};