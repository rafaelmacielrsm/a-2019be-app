const request = require( 'supertest' );
const faker = require( 'faker' );
const createServer = require( '../../../server' );
const moviesBulkData = require( '../../test-helpers/movie-seed-data' );
const { Movie, sequelize } = require( '../../../app/models' );
const sample = require( 'lodash/sample' );

describe( 'Movies API', () => {
  let server;
  
  beforeAll( async () => {
    await Movie.bulkCreate( moviesBulkData );
    server = await createServer( 5000 );
  });
  afterAll( async () => {
    await sequelize.getQueryInterface().bulkDelete( 'Movies' );
    sequelize.close();
    server.close();
  });

  describe( 'GET index', () => {
    it( 'should respond with status 200', done => {
      request( server ).get( '/api/movies' )
        .then( response => {
          expect( response.status ).toBe( 200 );
          done();
        });
    });

    it( 'should return json with a list movies', done => {
      request( server ).get( '/api/movies' )
        .then( response => {
          expect( response.body.constructor ).toBe( Array );
          expect( sample( response.body )).toHaveProperty( 'plot' );
          done();
        });
    });

    describe( 'url query param: limit', () => {
      it( 'should the specified number of records', async ( done ) => {
        let limit = faker.random.number({ min: 2, max: 8 });
        let records = await Movie.count();
        let expected = Math.min( limit, records );
        
        request( server ).get( `/api/movies/?limit=${limit}` )
          .then( response => {
            expect( response.body.length ).toEqual( expected );
            done();
          });
      });
    });

    describe( 'url query param: skip', () => {
      it( 'should the skip the specified number of records', async ( done ) => {
        let records = await Movie.count();
        let skipAllButOne = records - 1;
        
        request( server ).get( `/api/movies/?skip=${skipAllButOne}` )
          .then( response => {
            expect( response.body.length ).toEqual( 1 );
            done();
          });
      });
    });

    describe( 'url query param: order ', () => {
      describe( 'when no value is set', () => {
        it( 'should sort records in ascending order', done => {
          request( server ).get( '/api/movies/?limit=2' )
            .then( response => {
              let [{ id: first }, { id: second }] = response.body;
              expect( first < second ).toBe( true );
              done();
            });
        });
      });

      describe( 'when order is set to \'desc\'', () => {
        it( 'should sort records in descending order', done => {
          request( server ).get( '/api/movies/?limit=2&order=desc' )
            .then( response => {
              let [{ id: first }, { id: second }] = response.body;
              expect( first > second ).toBe( true );
              done();
            });
        });
      });
    });

    describe( 'url query param: sortBy ', () => {
      describe( 'when no value is set', () => {
        it( 'should sort records by id in ascending order', done => {
          request( server ).get( '/api/movies/?limit=2' )
            .then( response => {
              let [{ id: first }, { id: second }] = response.body;
              expect( first < second ).toBe( true );
              done();
            });
        });
      });

      describe( 'when the value is set to title', () => {
        let order = sample([ 'asc', 'desc' ]);

        it( 'should sort records by title', done => {
          request( server ).get( `/api/movies/?limit=2&order=${order}&sortBy=title` )
            .then( response => {
              let [{ title: first }, { title: second }] = response.body;
              let expected = order === 'desc' ? 1 : -1;

              expect( first.localeCompare( second )).toBe( expected );
              done();
            });
        });
      });
    });

    describe( 'url query param: search', () => {
      let record = sample( moviesBulkData );
      let searchTerm = record.title.slice( 0, Math.ceil( record.title.length ));

      it( 'should filter results based on the term received', done => {
        request( server ).get( `/api/movies/?limit=5&search[term]=${searchTerm}` )
          .then(({ body: [ firstRecord ] }) => {
            expect( firstRecord.title ).toEqual( record.title );
            done();
          });
      });
    });
  });

  describe( 'GET show', () => {
    let lastRecord;

    beforeAll( async () => {
      lastRecord = await Movie.findAll({ limit: 1, order: [[ 'id', 'DESC' ]]});
    });

    describe( 'when searching for a valid id', () => {
      it( 'should return a movie object', done => {
        request( server ).get( `/api/movies/${lastRecord[ 0 ].id}` )
          .then( response => {
            expect( response.body.title ).toEqual( lastRecord[ 0 ].title );
            done();
          });
      });
    });

    describe( 'when searching for a not existing id', () => {
      it( 'should return a not found status code', done => {
        let inexistentId = lastRecord[ 0 ].id + 1;

        request( server ).get( `/api/movies/${inexistentId}` )
          .then( response => {
            expect( response.status ).toEqual( 404 );
            done();
          });
      });
    });
  });
});

