var {usuario} = require('../../repositories');
var auth = require('../authorization')
const bcrypt = require('bcrypt');
const { builtinModules } = require('module');
var {filme} = require('../../repositories');


module.exports = {
    update: async function(token,body){
        return new Promise((reject, resolve) => {
            if (!token){reject({ auth: false, message: 'No token provided.' })}
            token=token.substring(7); //remove tag 'Bearer '
            auth.getUser(token).then(username=>{ // trocar aqui para classe se necessário
                if (username!="admin"){reject({ auth: false, message:"Unauthorized"})}      
                else{
                    filme.get({nome:body['nome']})
                        .then(filme => {
                            var query={};
                            if(body['genero']){query['genero']=body['genero']}
                            if(body['diretor']){query['diretor']=body['diretor']}
                            if(body['atores']){query['atores']=body['atores']}
                            filme.update(query).then(function(){
                                resolve({ auth: true, message: 'Alterado com sucesso.'});
                            }).catch(function(err){
                                reject({message:err});
                            });
                    }).catch(function(err){
                        reject({message:err})
                    });
                }
            }).catch(function(err){
                reject({message:err})
            });       
        })
    },
    remove: async function(token,name){
        return new Promise((reject, resolve) => {
            if (!token){reject({ auth: false, message: 'No token provided.' })}
            token=token.substring(7); //remove tag 'Bearer '
            auth.getUser(token).then(username=>{ // trocar aqui para classe se necessário
                if (username!="admin"){reject({ auth: false, message:"Unauthorized"})}      
                else{
                    filme.destroy(name).then(function (){
                        resolve({ auth: true, message:'Operação concluída.'});
                    }).catch(function (err){
                        reject({ auth: false, message:err})
                    });
                }
            }).catch(function(err){
                reject({message:err})
            });       
        })
    },
    verify: async function(token){ // a ser implementado posteriormente
        return new Promise((reject, resolve) => {
            if (!token){reject("")}
            token=token.substring(7); //remove tag 'Bearer '
            auth.getUser(token).then(username=>{ // trocar aqui para classe se necessário
                if (username!="admin"){reject("");}      
                else{
                    resolve("admin");
                }
            }).catch(function(err){
                reject(err)
            });       
        })

    }

}