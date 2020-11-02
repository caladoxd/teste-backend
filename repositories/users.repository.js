const { usuario } = require('../models');

module.exports = {
  get: (params) => usuario.findOne({ where: params }),
  create: (params) => usuario.create(params),
  destroy: (user) => usuario.destroy({ where: {nome:user} })
};