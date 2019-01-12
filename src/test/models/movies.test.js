var movieFactory = require( '../factory/movies-factory' );
var db = require( '../../app/models' );

describe( 'properties', () => {
  let subject = 'Movie';
  let movieInstance;

  beforeAll( async () => {
    movieInstance = await movieFactory();
  });
  
  afterAll( async () => {
    await db.sequelize.getQueryInterface().bulkDelete( 'Movies' );
    db.sequelize.close();
  });

  it( 'should have the specified properties', () => {
    let expected = [ 
      'id', 'title', 'genre', 'releaseDate', 'cast', 'plot', 'trailer', 'poster' ];
    let actual = Object.keys( movieInstance.dataValues );

    expect( actual ).toEqual( expect.arrayContaining( expected ));
  });

  describe( '.title', () => {
    describe( 'when using an empty string as value', async () => {
      it( 'should throw an error', () => {
        expect.assertions( 1 );

        return db[ subject ].create({ title: '' })
          .catch(({ errors: [ error ] }) => (
            expect( error ).toHaveProperty( 'type', 'Validation error' )));
      });
    });
  });
});