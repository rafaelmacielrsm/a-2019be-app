const express = require( 'express' );
const router = express.Router();
const { Movie } = require( '../models' );
const checkHeaders = require( '../middlewares/check-post-request-headers' );
const { 
  queryOptions, 
  permitedParams, 
  prepareErrorMsgs } = require( '../helpers/movie' );

router.use( checkHeaders );

router.get( '/', ( req, res ) => { 
  Movie.findAll( queryOptions( req.query ))
    .then( movies => {
      return res.status( 200 ).json( movies );
    })
    .catch(() => {
      return res.sendStatus( 500 );
    });
});

router.get( '/:id', ( req, res ) => { 
  Movie.findByPk( req.params.id )
    .then( data => {
      if( !data ) return res.sendStatus( 404 );
      return res.status( 200 ).json( data );
    })
    .catch(() => {
      return res.sendStatus( 500 );
    });
});

router.post( '/', ( req, res ) => {
  const params = permitedParams( req.body );

  Movie.create( params )
    .then( movie => {
      return res.status( 201 ).send( movie );
    })
    .catch(({ errors }) => res.status( 422 ).json( prepareErrorMsgs( errors )))
    .catch(() => res.sendStatus( 500 ));
});

router.put( '/:id', ( req, res ) => {
  const params = permitedParams( req.body );

  Movie.findByPk( req.params.id )
    .then( movie => {
      movie.update( params )
        .then(() => res.status( 200 ).json( movie ))
        .catch(({ errors }) => res.status( 422 ).json( prepareErrorMsgs( errors )))
        .catch(() => res.sendStatus( 500 ));
    })
    .catch(() => res.sendStatus( 404 ));
});

router.delete( '/:id', ( req, res ) => {
  Movie.findByPk( req.params.id )
    .then( movie => {
      movie.destroy()
        .then(() => res.sendStatus( 204 ))
        .catch(() => res.sendStatus( 500 ));
    })
    .catch(() => res.sendStatus( 404 ));
}); 

module.exports = router;