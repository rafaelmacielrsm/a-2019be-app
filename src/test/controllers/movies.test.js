const createServer = require( '../../server' );
const request = require( 'supertest' );
const faker = require( 'faker' );

describe( 'Movies API', () => {
  let server;
  let port = faker.random.number({ min: 4000, max: 4500 });
  
  beforeAll(() => server = createServer( port, { verbose: false }));
  afterAll(() => server && server.close());

  describe( 'GET api/movies', () => {
    it( 'should respond with status 200', done => {
      request( server ).get( '/api/movies' ).then( response => {
        expect( response.status ).toBe( 200 );
        done();
      });
    });
  });
});

