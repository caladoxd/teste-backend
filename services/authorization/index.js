var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = require('../../config');

module.exports = {
    getUser: async function(token){
        return new Promise((resolve,reject)=>{
            if(!token){reject('')}
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {reject(err);}      
                else{resolve(decoded['name'])}
            });   
        })
    },
    getId: async function(token){
        return new Promise((resolve,reject)=>{
            if(!token){reject('')}
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {reject(err);}      
                else{resolve(decoded['id'])}
            });   
        })
    },
    checkPassword: async function(password,hash){
        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,hash,function(err,auth){
                if (err || !auth) {reject("Não foi possível confirmar a senha")}      
                resolve(auth);
            });        
        })
    },
    login: async function(user,senha){
        return new Promise((resolve,reject)=>{
            if(!user){reject("Usuário inexistente.")}
            else{
                this.checkPassword(senha,user.dataValues.hash)
                    .then(confirm=> {
                        if(confirm){
                            var token = jwt.sign({ name:user.dataValues.nome, id:user.dataValues.id }, secret, {
                                expiresIn: 3600, // expira em 1h
                                header:{
                                    "alg": "HS256",
                                    "typ": "JWT"
                                }
                              });
                            resolve({ auth: true, token: token });
                        }
                        else{reject({auth:false,message:"Senha incorreta"})}
                    })
                    .catch(err=>reject({auth:false,message:err}))
            } 
        })
    }
}