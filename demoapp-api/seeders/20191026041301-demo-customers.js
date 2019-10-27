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
    return queryInterface.bulkInsert('customers', [{
      name: 'Axes',
      identity_number: '4584566955',
      phone_number: '+628591321312',
      image: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, {
      name: 'Exes',
      identity_number: '544788556',
      phone_number: '+628591453312',
      image: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, {
      name: 'Oxos',
      identity_number: '545621345646',
      phone_number: '+6285912212312',
      image: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('customers', null, {});
  }
};
