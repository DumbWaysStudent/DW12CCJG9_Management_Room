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
    return queryInterface.bulkInsert('orders', [{
      customer_id: 1,
      room_id: 1,
      is_done: false,
      is_booked: false,
      duration: 10,
      order_end_time: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, {
      customer_id: 2,
      room_id: 2,
      is_done: false,
      is_booked: false,
      duration: 10,
      order_end_time: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, {
      customer_id: 3,
      room_id: 3,
      is_done: false,
      is_booked: false,
      duration: 10,
      order_end_time: new Date().toISOString(),
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
    return queryInterface.bulkDelete('orders', null, {});
  }
};
