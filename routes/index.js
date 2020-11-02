var express = require('express');
var app = express();
app.use(express.json());
var {userController} = require('../controllers/')
var {adminController} = require('../controllers')


app.post('/login', (req, res) => { // auth
    userController.login(req,res)
        .then(retorno => res.status(200).send(retorno))
        .catch(err => res.status(200).send(err));
})

app.post('/admin/editar', function(req,res){ //editar info
    adminController.update(req,res)
        .then(retorno => res.status(200).send(retorno))
        .catch(err => res.status(200).send(err));
});

app.post('/admin/remove', function(req,res){ //excluir filme
    adminController.remove(req,res)
        .then(retorno => res.status(200).send(retorno))
        .catch(err => res.status(200).send(err));
});

app.post('/cadastro', function(req, res) { //adiciona usuário
    userController.register(req,res)
        .then(retorno => res.status(200).send(retorno))
        .catch(err => res.status(200).send(err));
});

app.post('/usuario/editar', (req, res) => { // alterar senha
    userController.changePassword(req,res)
        .then(msg => res.status(200).json({message: msg}))
        .catch(err => res.status(200).json({message: err}));
})

app.post('/usuario/remove', function(req,res){ //cancelar cadastro
    userController.remove(req,res)
        .then(msg => res.status(200).json({message: msg}))
        .catch(err => res.status(200).json({message: err}));
});

app.get('/filmes', function(req, res) { //lista filmes
    userController.list(req,res)
    .then(lista => res.status(200).json(lista))
    .catch(err => res.status(200).json({message: err}));
});

app.post('/filmes/cadastro', function(req, res) { //adiciona filme
    adminController.addMovie(req,res)
        .then(msg => res.status(200).json({message: msg}))
        .catch(err => res.status(200).json({message: err}));
});

app.post('/filmes/votar', function(req, res) { //voto
    userController.vote(req,res)
        .then(msg => res.status(200).json({message: msg}))
        .catch(err => res.status(200).json({message: err}));
});

app.get('/filmes/detalhes', function(req, res) { //detalhes
    userController.detail(req,res)
        .then(msg => res.status(200).json({message: msg}))
        .catch(err => res.status(200).json({message: err}));
});

module.exports=app;