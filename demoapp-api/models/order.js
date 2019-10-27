'use strict';
module.exports = (sequelize, DataTypes) => {
  const order = sequelize.define('order', {
    customer_id: DataTypes.INTEGER,
    room_id: DataTypes.INTEGER,
    is_done: DataTypes.BOOLEAN,
    is_booked: DataTypes.BOOLEAN,
    duration: DataTypes.INTEGER,
    order_end_time: DataTypes.DATE
  }, {});
  order.associate = function(models) {
    // associations can be defined here
    // order.belongsToMany(models.room, {
    //   through: 'roomOrders',
    //   as: 'rooms',
    //   foreignKey: 'orderId',
    //   otherKey: 'roomId'
    // })

    // order.belongsToMany(models.customer, {
    //   through: 'customerOrders',
    // })
  };
  return order;
};