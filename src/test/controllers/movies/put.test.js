const request = require( 'supertest' );
const createServer = require( '../../../server' );
const { sequelize, Movie } = require( '../../../app/models' );
const subjectFactory = require( '../../factory/movies-factory' );


describe( 'PUT update', () => {
  let Subject = Movie;
  let server, knownID, record;
  
  beforeAll( async () => {
    server = await createServer( 8001 );
    record = await Subject.create( await subjectFactory());
    knownID = await record.id;
  });

  afterAll( async () => {
    await sequelize.getQueryInterface().bulkDelete( Subject.tableName );
    sequelize.close();
    server.close();
  });

  describe( 'when the content-type header is not set', () => {
    it( 'should return Unsupported Media Type status code', async done => {
      request( server ).put( `/api/movies/${knownID}` )
        .send( JSON.stringify( await subjectFactory()))
        .then( response => {
          expect( response.status ).toEqual( 415 );
          done();
        });
    });
  });

  describe( 'when updating a record with valid props', () => {
    let newProps;

    beforeAll( async () => newProps = await subjectFactory());

    it( 'should return a ok status code', async done => {
      request( server ).put( `/api/movies/${knownID}` )
        .set( 'Content-type', 'application/json' )
        .send( JSON.stringify( await subjectFactory()))
        .then( response => {
          expect( response.status ).toBe( 200 );
          done();
        });
    });

    it( 'should return the record with the new properties', async done => {
      request( server ).put( `/api/movies/${knownID}` )
        .set( 'Content-type', 'application/json' )
        .send( JSON.stringify( newProps ))
        .then( response => {
          expect( response.body.title ).toEqual( newProps.title );
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
      request( server ).put( `/api/movies/${knownID}` )
        .set( 'Content-type', 'application/json' )
        .send( JSON.stringify( recordDataWithErrors ))
        .then( response => {
          expect( response.status ).toEqual( 422 );
          done();
        });
    });

    it( 'should return an error explanation', done => {
      request( server ).put( `/api/movies/${knownID}` )
        .set( 'Content-type', 'application/json' )
        .send( JSON.stringify( recordDataWithErrors ))
        .then( response => {
          expect( response.body ).toHaveProperty( 'errors' );
          done();
        });
    });
  });

  describe( 'when trying to update an inexistant record', () => {
    it( 'should return a not found status code', async ( done ) => {
      request( server ).put( `/api/movies/${knownID + 1}` )
        .set( 'Content-type', 'application/json' )
        .send( JSON.stringify( await subjectFactory()))
        .then( response => {
          expect( response.status ).toEqual( 404 );
          done();
        });
    });
  });
});