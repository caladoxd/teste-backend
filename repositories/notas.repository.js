const { nota } = require('../models');
var sequelize = require('sequelize');

module.exports = {
  avg: (id) => nota.findAll({
      where: {filmeId:id},      
      attributes:['nota',[sequelize.fn('AVG',sequelize.col('nota')),'media']]
  }),
  add: (params) => nota.create(params),
  get: (params) => nota.findOne(params),
};