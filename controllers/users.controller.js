const {users} = require('../services/users');
const auth = require('../services/authorization');
const movies = require('../services/movies');


module.exports = {
    login: async function(req, res){
        return new Promise((resolve, reject) => {
            users.get(req.body['nome']).then(user => {
                auth.login(user,req.body['senha'])
                    .then(msg => resolve(msg))               
                    .catch(err => reject(err))
            }).catch(err=> {
                reject(err);
            })
        })
    },
    register: async function(req,res){
        return new Promise((resolve, reject) => {
            users.add(req.body['nome'],req.body['senha']).then(status => {
                resolve(status);               
            }).catch(err=> {
                reject(err);
            })
        })
    },
    changePassword: async function(req,res){
        token=req.headers['authorization'];
        senhaAtual=req.body['senha-atual'];
        novaSenha=req.body['nova-senha'];
        return new Promise((resolve,reject) => {
            if(!token){reject({ auth: false, message: 'No token provided.' });}
            token=token.substring(7); //remove tag 'Bearer '           
            auth.getUser(token).then((nome)=>
                users.update(nome,senhaAtual,novaSenha).then(msg => resolve(msg)).catch(err=>reject(err))
            ).catch(err => {
                reject(err);            
            })
        })
    },
    remove: async function(req,res){
        token=req.headers['authorization'];
        senha=req.body['senha'];
        return new Promise((resolve,reject) => {
            if(!token){reject({ auth: false, message: 'No token provided.' });}
            token=token.substring(7); //remove tag 'Bearer '           
            auth.getUser(token).then((nome)=>
                users.remove(nome,senha).then(msg => resolve(msg)).catch(err=>reject(err))
            ).catch(err => {
                reject(err);            
            })
        })
    },
    list: async function(req,res){
        return new Promise((resolve, reject) => {
            movies.list(req.query).then(res => {
                resolve(res);               
            }).catch(err=> {
                reject(err);
            })
        })
    },
    detail: async function(req,res){
        return new Promise((resolve, reject) => {
            movies.get(req.query.filme).then(res => {
                resolve(res);               
            }).catch(err=> {
                reject(err);
            })
        })
    },
    vote: async function(req,res){
        return new Promise((resolve, reject) => {
            movies.vote(req.headers['authorization'],req.body).then(res => {
                resolve(res);               
            }).catch(err=> {
                reject(err);
            })
        })
    }
}