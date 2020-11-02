
const nota = db.define('notas', {
    nota: {
        type: sequelize.INTEGER
    }
});
nota.assosciate
  nota.belongsTo(filme,{
      foreignKey: "filmeId"
  });
  filme.hasMany(nota);
  nota.belongsTo(usuario,{
      foreignKey:"usuarioId"
  });
  usuario.hasMany(nota);


module.exports = nota;