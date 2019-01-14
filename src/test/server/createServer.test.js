const createServer = require( '../../server' );
var faker = require( 'faker' );

describe( 'createServer function', () => {
  describe( 'when using a specified port', () => {
    let port = faker.random.number({ min: 5000, max: 8000 });

    it( 'should successfully create a server with the specified port', async () => {
      let actual = await createServer( port, { verbose: false });
  
      expect( actual.address().port ).toEqual( port );
  
      actual.close();
    });
  });
});
