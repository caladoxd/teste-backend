
var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
const sequelize = require('sequelize');
const db = require('./dbinit');
const bcrypt = require('bcrypt');
app.use(express.json());
const secret = require('./config.js');
const { Op } = require('sequelize');
const { EDESTADDRREQ } = require('constants');
const { fileURLToPath } = require('url');

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('home page');
});

app.post('/login', (req, res) => { // auth
    db.usuario.findOne({
        where:{nome:req.body['nome']}
    }).then(function(user){ //usuario encontrado
        pwd=user.dataValues.hash;
        bcrypt.compare(req.body['senha'],pwd,function(err,auth){
            if(auth){
                var token = jwt.sign({ name:user.dataValues.nome }, secret, {
                    expiresIn: 3600, // expira em 1h
                    header:{
                        "alg": "HS256",
                        "typ": "JWT"
                    }
                  });
                  return res.json({ auth: true, token: token });
            }
            else{
                res.status(500).json({message: 'Login inválido!'});
            }
        })
    }).catch(function(){res.send("Usuario inexistente.")});
})

app.post('/admin/edit', function(req,res){ //editar usuarios
    var token = req.headers['authorization'];
    if (!token) res.status(401).json({ auth: false, message: 'No token provided.' });
    token=token.substring(7); //remove tag 'Bearer '
    jwt.verify(token, secret, function(err, decoded) {
        if (err || decoded['name']!="admin") res.status(500).json({ auth: false, message: 'Unauthorized.' });      
        else{
            bcrypt.hash(req.body['senha'],1, (err, hash) => { //criptografa senha
                console.log(hash);
                db.usuario.update({ //atualiza registro
                    hash:hash
                },
                {
                    where:{"nome":req.body['nome']}
                }).then(function (){
                    res.send('Alterado com sucesso.');
                }).catch(function (err){
                    res.send("Erro ."+err)
                });
            })
        }
    });   
});

app.post('/admin/remove', function(req,res){ //excluir usuarios
    var token = req.headers['authorization'];
    if (!token) res.status(401).json({ auth: false, message: 'No token provided.' });
    token=token.substring(7); //remove tag 'Bearer '
    jwt.verify(token, secret, function(err, decoded) {
        if (err || decoded['name']!="admin" || req.body['nome']=="admin") res.status(500).json({ auth: false, message: 'Unauthorized.' });      
        else{
            db.usuario.destroy({
                where:{"nome":req.body['nome']}
            }).then(function (){
                res.send('Usuario removido.');
            }).catch(function (err){
                res.send("Erro ."+err)
            });
        }
    });   
});

app.post('/cadastro', function(req, res) { //adiciona usuário
    bcrypt.hash(req.body['senha'],1, (err, hash) => { //criptografa senha
        db.usuario.create({
            nome:req.body['nome'],
            hash:hash
        }).then(function (){
            res.send('Adicionado com sucesso.');
        }).catch(function (err){
            res.send("Erro ."+err)
        });
    })
});

app.post('/usuario/editar', (req, res) => { // alterar senha
    var token = req.headers['authorization'];
    if (!token) res.status(401).json({ auth: false, message: 'No token provided.' });
    token=token.substring(7); //remove tag 'Bearer '
    jwt.verify(token, secret, function(err, decoded) {
        if (err) res.status(500).json({ auth: false, message: 'Unauthorized.' });      
        else{
            db.usuario.findOne({
                where:{nome:decoded['name']}
            }).then(function(user){ //usuario encontrado
                pwd=user.dataValues.hash;
                bcrypt.compare(req.body['senha-atual'],pwd,function(err,auth){ //pede senha para confirmar
                    if(auth){
                        bcrypt.hash(req.body['nova-senha'],1, (err, hash) => { //criptografa senha
                            user.update({
                                hash:hash
                            }).then(function (){
                                res.send('Senha alterada com sucesso.');
                            }).catch(function (err){
                                res.send("Erro ."+err)
                            });   
                        })                  
                    }
                    else{
                        res.status(500).json({message: 'Senha incorreta!'});
                    }
                })
            }).catch(function(){res.send("Usuario inexistente.")});      
        }
    });   
})

app.post('/usuario/remove', function(req,res){ //cancelar cadastro
    var token = req.headers['authorization'];
    if (!token) res.status(401).json({ auth: false, message: 'No token provided.' });
    token=token.substring(7); //remove tag 'Bearer '
    jwt.verify(token, secret, function(err, decoded) {
        if (err || decoded['name']=="admin") res.status(500).json({ auth: false, message: 'Unauthorized.' });      
        else{
            db.usuario.findOne({
                where:{nome:decoded['name']}
            }).then(function(user){ //usuario encontrado
                pwd=user.dataValues.hash;
                bcrypt.compare(req.body['senha'],pwd,function(err,auth){ //pede senha para confirmar
                    if(auth){
                        user.destroy({
                            where:{"nome":decoded['name']}
                        }).then(function (){
                            res.send('Usuario removido.');
                        }).catch(function (err){
                            res.send("Erro ."+err)
                        });   
                    }
                    else{
                        res.status(500).json({message: 'Senha incorreta!'});
                    }
                })
            }).catch(function(){res.send("Usuario inexistente.")});      
        }
    });   
});

app.get('/filmes', function(req, res) { //lista filmes
    var filtro={};
    if(req.query.diretor){filtro['diretor']={[Op.like]:"%"+req.query.diretor+"%"}};
    if(req.query.nome){filtro['nome']={[Op.like]:"%"+req.query.nome+"%"}};
    if(req.query.genero){filtro['genero']={[Op.like]:"%"+req.query.genero+"%"}};
    if(req.query.ator){filtro['atores']={[Op.like]:"%"+req.query.ator+"%"}};
    console.log(filtro);
    const lista = db.filme.findAll({where:filtro}).then(function (filme){
        res.send(filme);
    }).catch(function (err){
        res.send(err);
    });
});

app.post('/filmes/cadastro', function(req, res) { //adiciona filme
    var token = req.headers['authorization'];
    if (!token) res.status(401).json({ auth: false, message: 'No token provided.' });
    token=token.substring(7); //remove tag 'Bearer '
    jwt.verify(token, secret, function(err, decoded) {
        if (err || decoded['name']!="admin") res.status(500).json({ auth: false, message: 'Unauthorized.' });      
        else{      
            db.filme.create({
                nome:req.body['nome'],
                genero:req.body['genero'],
                diretor:req.body['diretor'],
                atores:req.body['atores']    
            }).then(function (){
                res.send('Filme adicionado com sucesso.');
            }).catch(function (err){
                res.send("Erro ."+err)
            });
        }
    })
});

app.post('/filmes/votar', function(req, res) { //voto
    var token = req.headers['authorization'];
    if (!token) res.status(401).json({ auth: false, message: 'No token provided.' });
    token=token.substring(7); //remove tag 'Bearer '
    jwt.verify(token, secret, function(err, decoded) {
        if (err || decoded['name']=="admin") res.status(500).json({ auth: false, message: 'Unauthorized.' });      
        else{
            db.usuario.findOne({
                where:{nome:decoded['name']}
            }).then(function(user){ 
                console.log(user.id);
                db.filme.findOne({
                    where:{nome:req.body['filme']}
                }).then(function(filme){
                    console.log(filme.id);
                    db.nota.findOne({
                        where:{
                            filmeId:filme.dataValues.id,
                            usuarioId:user.dataValues.id    
                        }
                    }).then(function(nota){
                        nota.update({nota:req.body['nota']});
                    }).catch(function(){
                        db.nota.create({                       
                            filmeId:filme.dataValues.id,
                            usuarioId:user.dataValues.id,
                            nota:req.body['nota']                    
                        }).then(function(){
                            res.send('Nota registrada');
                        }).catch(function(err){
                            res.send(err);
                        })
                    })
                }).catch(function(err){
                    res.send("Filme não encontrado.");
                })
            }).catch(function(err){
                res.send(err);
            })
        }
    })
});

app.get('/filmes/detalhes', function(req, res) { //detalhes
    var f=db.filme.findOne({
        where:{
            nome:req.query.filme
        },
        attributes:[
            "id","nome","genero","diretor","atores"
        ]
    }).then(function (filme){
        db.nota.findAll({
            where:{
                filmeId:filme.dataValues.id
            },
            //calcula nota
            attributes:['nota',[sequelize.fn('AVG',sequelize.col('nota')),'media']]
        }).then(function(nota){
            filme.dataValues.nota=nota[0].dataValues.media;
            res.send(filme.dataValues);
        })
    });
});



app.listen(3000, function(){
    console.log('ready');
});