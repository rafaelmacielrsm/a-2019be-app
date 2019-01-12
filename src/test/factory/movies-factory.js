var models = require( '../../app/models' );
var Faker = require( 'faker' );

// Movie.sync().then();

/**
 * Generate a movie object
 * @param  {Object} [props] Properties to use to create an movie.
 * @return {Object} Movie data.
 */
async function movieData( props = {}){
  var properties = {
    title: Faker.lorem.words( 3 ),
    genre: Faker.lorem.word(),
    releaseDate: Faker.date.past( 1 ),
    cast: `${Faker.name.findName()}, ${Faker.name.findName()}`,
    plot: Faker.lorem.words( 20 ),
    trailer: `https://www.youtube.com/watch?v=${Faker.random.alphaNumeric( 11 )}`,
    poster: ''
  };
  
  return Object.assign({}, properties, props );
}

/**
 * Creates and saves a movie in the db
 * @param  {Object} [props] Properties to use overrides values, in case no 
 * values are set faker js will stub each property.
 * @param  {String} [props.title] Movie Title.
 * @param  {String} [props.genre] Movie genres.
 * @param  {Date} [props.releaseDate] Movie release date.
 * @param  {String} [props.cast] Starring actors names.
 * @param  {String} [props.plot] Plot of the movie.
 * @param  {String} [props.trailer] Youtube video link.
 * @param  {String} [props.poster] Poster url.
 * @return {Object} Sequelize Movie Instance.
 */
module.exports = async ( props = {}) => {
  return models.Movie.create( await movieData( props ));
};
