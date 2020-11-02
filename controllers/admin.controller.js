const {users} = require('../services/users');
const auth = require('../services/authorization');
const movies = require('../services/movies/index');
const {admin} = require('../services/users');

module.exports = {
    update: async function(req, res){
        return new Promise((resolve, reject) => {
            admin.update(req.headers['authorization'],req.body).then(msg => resolve(msg))
            .catch(err=> {reject(err)})
        })
    },
    remove: async function(req, res){
        return new Promise((resolve, reject) => {
            admin.remove(req.headers['authorization'],req.body['nome']).then(msg => resolve(msg))
            .catch(err=> {reject(err)})
        })
    },
    addMovie: async function(req, res){
        return new Promise((resolve, reject) => {
            movies.add(req.headers['authorization'],req.body).then(msg => resolve(msg))
            .catch(err=> {reject(err)})
        })
    }
}
