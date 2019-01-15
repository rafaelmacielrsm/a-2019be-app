'use strict';
/* eslint no-unused-vars: off */
module.exports.sortableFields = [ 'id', 'title', 'updatedAt', 'createdAt' ];
module.exports.searchableField = [ 'title', 'cast' ];
module.exports.permitedFields = [ 
  'title', 
  'cast', 
  'plot', 
  'releaseDate', 
  'poster',
  'trailer'
];

module.exports.default = ( sequelize, DataTypes ) => {
  const Movie = sequelize.define( 'Movie', {
    title: {
      type: DataTypes.STRING,
      validate: {
        max: 255,
        notEmpty: {
          args: [ false ],
          msg: 'cannot be empty'
        },
      } 
    },
    genre: {
      type: DataTypes.STRING,
      defaultValue: 'unknown',
      validate: {
        max: 255,
      }
    },
    releaseDate: DataTypes.DATE,
    cast: DataTypes.STRING,
    plot: DataTypes.TEXT,
    trailer: DataTypes.STRING,
    poster: DataTypes.STRING
  }, {});
  Movie.associate = function( models ) {
    // associations can be defined here
  };

  return Movie;
};