'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('rooms', [{
      name: 'A1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, {
      name: 'A2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, {
      name: 'A3',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, {
      name: 'A4',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('rooms', null, {});
  }
};
