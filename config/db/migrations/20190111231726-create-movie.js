'use strict';
/* eslint no-unused-vars: off */
module.exports = {
  up: ( queryInterface, Sequelize ) => {
    return queryInterface.createTable( 'Movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      genre: {
        type: Sequelize.STRING,
        defaultValue: 'unknown',
      },
      releaseDate: {
        type: Sequelize.DATE
      },
      cast: {
        type: Sequelize.STRING
      },
      plot: {
        type: Sequelize.TEXT
      },
      trailer: {
        type: Sequelize.STRING
      },
      poster: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: ( queryInterface, Sequelize ) => {
    return queryInterface.dropTable( 'Movies' );
  }
};