const { filme } = require('../models');

module.exports = {
  get: (nome) => filme.findOne({ where: {nome:nome} }),
  create: (params) => filme.create(params),
  destroy: (nome) => filme.destroy({ where: {nome:nome} }),
  list: (params) => filme.findAll({ where: params })
};