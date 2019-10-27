'use strict';
module.exports = (sequelize, DataTypes) => {
  const room = sequelize.define('room', {
    name: DataTypes.STRING
  }, {});
  room.associate = function(models) {
    // associations can be defined here
    room.belongsTo(models.order, {
      as: 'roomOrder',
      foreignKey: 'id'
    });

    room.belongsTo(models.customer, {
      as: 'customerOrder',
      foreignKey: 'id'
    })
  };
  return room;
};