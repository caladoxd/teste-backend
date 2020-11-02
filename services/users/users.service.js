var {usuario} = require('../../repositories');
var auth = require('../authorization')
const bcrypt = require('bcrypt');


module.exports = {
    add: async function(user,senha){
        return new Promise((resolve,reject) => {
            hash = bcrypt.hash(senha,1).catch(err => {console.log(err);}).then(function (hash){ //criptografa senha
                usuario.create({
                    nome:user,
                    hash:hash
                }).then(function (){
                    resolve('Adicionado com sucesso.');
                }).catch(function (err){
                    reject('Erro '+err);
                });
            })
        });
    },
    get: async function(nome){
        return new Promise((resolve,reject) => {
            usuario.get({
                nome:nome,
            }).then(function (user){
                resolve(user);
            }).catch(function (err){
                reject(null);
            });
        })
    },
    update: async function(nome, senhaAtual, novaSenha){
        return new Promise((resolve, reject) => {
            this.get(nome).then(async function (user){
                if (!user){reject("Usuário não encontrado");}      
                else{
                    auth.checkPassword(senhaAtual,user.dataValues.hash).then(async function(){
                        hash = await bcrypt.hash(novaSenha,1).catch(err => reject(err)); //criptografa senha
                        await user.update({hash:hash});
                        resolve("Atualizado com sucesso");
                    }).catch(err => reject(err));
                }
            }).catch(err => reject(err));
        })
    },
    remove: async function(nome, senha){
        return new Promise((resolve, reject) => {
            this.get(nome).then(user => {
                if (!user){reject("Não autorizado");}      
                else{        
                    auth.checkPassword(senha,user.dataValues.hash).then(auth => {
                        if(auth){
                            usuario.destroy(nome)
                            .then(resolve({message:"Usuário removido."}))
                            .catch(err => reject({message:err}))
                        }
                        else{reject({message:"Senha incorreta."})}
                    }).catch(err => reject({message:err}));
                }
            }).catch(err => reject(err));
        })
    },
}