const request = require( 'supertest' );
const createServer = require( '../../../server' );
const { sequelize } = require( '../../../app/models' );
const subjectFactory = require( '../../factory/movies-factory' );


describe( 'POST create', () => {
  let server;
  let recordData;
  let expected;
  
  beforeAll( async () => {
    server = await createServer( 8000 );
    recordData =await subjectFactory();
    expected = await subjectFactory({ releaseDate: '24 jan 2018' });
  });

  afterAll( async () => {
    await sequelize.getQueryInterface().bulkDelete( 'Movies' );
    sequelize.close();
    server.close();
  });

  describe( 'when the content-type header is not set', () => {
    it( 'should return Unsupported Media Type status code', done => {
      request( server ).post( '/api/movies' )
        .send( JSON.stringify( recordData ))
        .then( response => {
          expect( response.status ).toEqual( 415 );
          done();
        });
    });
  });

  describe( 'when the content-type header to application/json', () => {
    it( 'should return a created status code', done => {
      request( server ).post( '/api/movies' )
        .set( 'Content-type', 'application/json' )
        .send( JSON.stringify( recordData ))
        .then( response => {
          expect( response.status ).toBe( 201 );
          done();
        });
    });

    it( 'should return the created record', done => {
      request( server ).post( '/api/movies' )
        .set( 'Content-type', 'application/json' )
        .send( JSON.stringify( expected ))
        .then( response => {
          expect( response.body ).toHaveProperty( 'title', expected.title );
          done();
        });
    });
  });

  describe( 'when the request has invalid values', () => {
    let recordDataWithErrors;

    beforeAll( async () => {
      recordDataWithErrors = await subjectFactory({ title: '' });
    });      

    it( 'should return a unprocessable entity status code', done => {
      request( server ).post( '/api/movies' )
        .set( 'Content-type', 'application/json' )
        .send( JSON.stringify( recordDataWithErrors ))
        .then( response => {
          expect( response.status ).toEqual( 422 );
          done();
        });
    });

    it( 'should return an error explanation', done => {
      request( server ).post( '/api/movies' )
        .set( 'Content-type', 'application/json' )
        .send( JSON.stringify( recordDataWithErrors ))
        .then( response => {
          expect( response.body ).toHaveProperty( 'errors' );
          done();
        });
    });
  });

  describe( 'when trying to insert client side script as a value', () => {
    let taintedData;

    beforeAll( async () => {
      taintedData = await subjectFactory({ title: 'Bird Box <script>alert();</script>' });
    });

    it( 'should escape the entry', done => {
      request( server ).post( '/api/movies' )
        .set( 'Content-type', 'application/json' )
        .send( JSON.stringify( taintedData ))
        .then( response => {
          expect( response.body.title ).not.toMatch( /<script>/ );
          done();
        });
    });
  });
});