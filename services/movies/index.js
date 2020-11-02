var {filme,nota} = require('../../repositories');
var auth = require('../authorization');
const bcrypt = require('bcrypt');
const {admin} = require('../users');
const {user} = require('../users');



module.exports = {
    add: async function(token,body){
        return new Promise((resolve,reject) => {     
            if (!token){reject({ auth: false, message:"Unauthorized"})}
            token=token.substring(7); //remove tag 'Bearer '
            auth.getUser(token).then(username=>{ // trocar aqui para classe se necessário
                if (username!="admin"){reject({ auth: false, message:"Unauthorized"})}      
                else{
                    filme.create({
                            nome:body['nome'],
                            genero:body['genero'],
                            diretor:body['diretor'],
                            atores:body['atores']        
                        }).then(function (){
                            resolve('Adicionado com sucesso.');
                        }).catch(function (err){
                            reject('Erro '+err);
                    });
                }
            }).catch(err => reject(err));
        });
    },
    list: async function(query){
        return new Promise((resolve, reject) => {
            var filtro={};
            if(query.diretor){filtro['diretor']={[Op.like]:"%"+query.diretor+"%"}};
            if(query.nome){filtro['nome']={[Op.like]:"%"+query.nome+"%"}};
            if(query.genero){filtro['genero']={[Op.like]:"%"+query.genero+"%"}};
            if(query.ator){filtro['atores']={[Op.like]:"%"+query.ator+"%"}};
            filme.list(filtro).then(filmes => resolve(filmes))
            .catch(err=> reject(err));       
        })
    },
    get: async function(nome){ //get by name
        return new Promise((resolve, reject) => {   
            filme.get(nome).then(filmes => {
                this.calculaNota(filmes.dataValues.id).then(nota=> {
                    filmes.dataValues.nota=nota;
                    resolve(filmes)
                }).catch(err=> reject(err));
            }).catch(err=> reject(err));       
        })
    },
    calculaNota: async function(filmeId){
        return new Promise((resolve, reject) => { 
            nota.avg(filmeId).then(nota => {
                resolve(nota[0].dataValues.media);
            }).catch(err=>{reject(err);console.log(err)});
        })
    },
    vote: async function(token,body){
        return new Promise((resolve, reject) => { 
            if (!token){reject({ auth: false, message: 'No token provided.' });}
            token=token.substring(7); //remove tag 'Bearer '
            auth.getId(token).then(userId=>{
                if(!userId){reject({message:"Usuário inválido"})}
                filme.get(body['filme']).then(filme=> {
                    if(!filme){reject({message:"Filme não encontrado."})}
                    let filmeId=filme.dataValues.id;
                    if(body.nota>4 || body.nota<0){reject({message:"Nota inválida."})}
                    else{
                        nota.get({where:{filmeId:filmeId,usuarioId:userId}}).then(rating=>{
                            if(!nota){
                                nota.add({filmeId:filmeId,usuarioId:userId,nota:body.nota})
                                    .then(resolve({message:"Nota registrada."}))
                                    .catch(err => reject(err));
                            }
                            else{
                                rating.update({nota:body.nota});
                                resolve({message:"Nota registrada."})
                            }
                        })
                        
                    }
                }).catch(err => reject(err));
            }).catch(err => reject(err));
        })
    },
}
