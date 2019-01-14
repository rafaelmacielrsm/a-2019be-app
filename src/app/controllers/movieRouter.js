var express = require( 'express' );
var router = express.Router();
var { Movie } = require( '../models' );
var { queryOptions } = require( '../helpers/movie' );

router.get( '/', ( req, res ) => { 
  Movie.scope( 'whitelist' ).findAll( queryOptions( req.query ))
    .then( movies => {
      return res.status( 200 ).json( movies );
    })
    .catch(() => {
      return res.sendStatus( 500 );
    });
});

module.exports = router;