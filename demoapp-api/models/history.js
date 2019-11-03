'use strict';
module.exports = (sequelize, DataTypes) => {
  const history = sequelize.define('history', {
    room_name: DataTypes.STRING,
    customer_name: DataTypes.STRING,
    identity_number: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    order_end_time: DataTypes.DATE,
    is_done: DataTypes.BOOLEAN
  }, {});
  history.associate = function(models) {
    // associations can be defined here
  };
  return history;
};