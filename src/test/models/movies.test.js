var movieFactory = require( '../factory/movies-factory' );
var { Movie: Subject, sequelize } = require( '../../app/models' );

describe( 'properties', () => {
  let movieInstance;

  beforeAll( async () => {
    movieInstance = await Subject.create( await movieFactory());
  });
  
  afterAll( async () => {
    await sequelize.getQueryInterface().bulkDelete( Subject.tableName );
    sequelize.close();
  });

  it( 'should have the specified properties', () => {
    let expected = [ 
      'id', 'title', 'genre', 'releaseDate', 'cast', 'plot', 'trailer', 'poster' ];
    let actual = Object.keys( movieInstance.dataValues );

    expect( actual ).toEqual( expect.arrayContaining( expected ));
  });

  describe( '.title', () => {
    describe( 'when using an empty string as value', async () => {
      it( 'should throw an error', done => {
        expect.assertions( 1 );

        return Subject.create({ title: '' })
          .catch(({ errors: [ error ] }) => {
            expect( error ).toHaveProperty( 'type', 'Validation error' );
            done();
          });
      });
    });
  });
});