const request = require( 'supertest' );
const createServer = require( '../../../server' );
const { sequelize, Movie } = require( '../../../app/models' );
const subjectFactory = require( '../../factory/movies-factory' );

describe( 'DELETE destroy', () => {
  let Subject = Movie;
  let server, record;
  
  beforeAll( async () => {
    server = await createServer( 8003 );
  });
  
  beforeEach( async () => {
    record = await Subject.create( await subjectFactory());
  });

  afterAll( async () => {
    await sequelize.getQueryInterface().bulkDelete( Subject.tableName );
    sequelize.close();
    server.close();
  });

  describe( 'when deleting an existing record', () => {
    it( 'should return no content status code', done => {
      request( server ).delete( `/api/movies/${record.id}` )
        .then( response => {
          expect( response.status ).toEqual( 204 );
          done();
        });
    });

    it( 'should return not found status code when querying for the record', done => {
      request( server ).delete( `/api/movies/${record.id}` )
        .then(() => {
          request( server ).get( `/api/movies/${record.id}` )
            .then( response => {
              expect( response.status ).toEqual( 404 );
              done();
            });
        });
    });
  });

  describe( 'when trying to delete an inexistant record', () => {
    it( 'should respond with a not found status code', done => {
      request( server ).delete( `/api/movies/${record.id + 9999}` )
        .then( response => {
          expect( response.status ).toEqual( 404 );
          done();
        });
    });
  });
});