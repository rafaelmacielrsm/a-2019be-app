const createServer = require( '../../server' );
const request = require( 'supertest' );

describe( 'GET /', () => {
  let server;

  beforeAll( async () => server = await createServer());
  afterAll(() => server && server.close());

  it( 'should respond with status 200', done => {
    request( server ).get( '/' ).then( response => {
      expect( response.status ).toBe( 200 );
      done();
    });
  });
});