'use strict';
/* eslint no-unused-vars: off */
module.exports = ( sequelize, DataTypes ) => {
  const Movie = sequelize.define( 'Movie', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 255,
        notEmpty: true,
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