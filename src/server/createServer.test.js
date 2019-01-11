const createServer = require( '.' );
var faker = require( 'faker' );

describe( 'createServer function', () => {
  describe( 'when using a specified port', () => {
    let port = faker.random.number({ min: 5000, max: 8000 });

    it( 'should successfully create a server with the specified port', done => {
      let actual = createServer( port );
  
      expect( actual.address().port ).toEqual( port );
  
      actual.close(() => done());
    });
  });
});
