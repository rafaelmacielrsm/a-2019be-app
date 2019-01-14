const isEmpty = require( 'lodash/isEmpty' );
const sortable = require( '../models/movie' ).sortableFields;
const searchable = require( '../models/movie' ).searchableField;
const Op = require( 'sequelize' ).Op;

/** @description Transforms and prepare a query options object 
 * @param {Object} [queryObj] - queryObjs
 * @param {number} [queryObj.limit] - number of result to show, should be > 0. 
 * @param {number} [queryObj.skip] - number of result to skip over, should be > 0.
 * @param {string} [queryObj.sortBy] - name of the field to sort results.
 * @param {'ASC'|'DESC'} [queryObj.order] - sort direction.
 * @param {string} [query.search.term] - Term to search in movies
 * @param {string} [query.search.field] - Field name which should be searched by
 * @return {object} queryObj ready for a ORM query
 */
module.exports.queryOptions = ( queryObj = {}) => {
  let query = { offset: 0, limit: 10, order: [[ 'id' ]]};
  let field, direction = 'ASC';
  const { limit, skip, sortBy, order, search } = queryObj;

  if( isEmpty( queryObj )) return query;

  if( limit && limit > 0 ) query.limit = parseInt( limit );

  if( skip && skip >= 0 ) query.offset = parseInt( skip );
 
  field = sortBy && sortable.some( field => field === sortBy ) ? sortBy: 'id';

  if( order && order.toUpperCase() === 'DESC' ) direction = 'DESC';

  query.order = [[ field, direction ]];

  if( !search || !search.term ) return query;

  let searchField = 
    search.field && searchable.some( fld => fld === search.field.toLowerCase()) 
      ? search.field.toLowerCase()
      : 'title';

  query.where = { 
    [ searchField ]: {
      [ Op.iLike ]: `%${search.term}%`
    }
  };

  return query;
};