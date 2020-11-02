const sequelize = require('sequelize');
const { fileURLToPath } = require('url');
const db = new sequelize('testebackend','root','femonemo',{
    host: "localhost",
    dialect: "mysql"
});


const filme = db.define('filmes', {
    nome:{
        type: sequelize.STRING,
        unique: true
    },
    genero:{
        type: sequelize.STRING
    },
    diretor:{
        type: sequelize.STRING
    },
    atores:{
        type: sequelize.STRING
    }
})
/*
Filme.create({
    nome:"Um Sonho de Liberdade",
    genero:"drama",
    diretor:"Frank Darabont",
    atores:"Tim Robbins, Morgan Freeman, Bob Gunton"
})

Filme.create({
    nome:"O Poderoso Chefão",
    genero:"drama, crime",
    diretor:"Francis Ford Coppola",
    atores:"Marlon Brando, Al Pacino, James Caan"
})
Filme.create({
    nome:"Batman: O Cavaleiro das Trevas",
    genero:"ação, crime, drama",
    diretor:"Christopher Nolan",
    atores:"Christian Bale, Heath Ledger, Aaron Eckhart"
})
Filme.create({
    nome:"12 Homens e uma Sentença",
    genero:"crime, drama",
    diretor:"Sidney Lumet",
    atores:"Henry Fonda, Lee J. Cobb, Martin Balsam"
})
Filme.create({
    nome:"O Senhor dos Anéis: O Retorno do Rei",
    genero:"ação, aventura, drama",
    diretor:"Peter Jackson",
    atores:"Elijah Wood, Viggo Mortensen, Ian McKellen"
})
Filme.create({
    nome:"Pulp Fiction: Tempo de Violência",
    genero:"crime, drama",
    diretor:"Quentin Tarantino",
    atores:" John Travolta, Uma Thurman, Samuel L. Jackson"
})
Filme.create({
    nome:"O Senhor dos Anéis: A Sociedade do Anel",
    genero:"ação, aventura, drama",
    diretor:"Peter Jackson",
    atores:"Elijah Wood, Ian McKellen, Orlando Bloom"
})
Filme.create({
    nome:"Os Oito Odiados",
    genero:"crime, drama, suspense",
    diretor:"Quentin Tarantino",
    atores:"Samuel L. Jackson, Kurt Russell, Jennifer Jason Leigh"
})
*/