'use strict';

module.exports = {
  up: ( queryInterface, Sequelize ) => {
    return queryInterface.addIndex(
      'Movies',
      {
        fields: [ 'title' ]
      }
    );
  },

  down: ( queryInterface, Sequelize ) => {
    return queryInterface.removeIndex(
      'Movies',
      'title'
    );
  }
};
