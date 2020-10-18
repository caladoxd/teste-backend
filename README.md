# Documentação da API do teste-backend
Esta é uma API de dados e avaliação de filmes.
Usar content-type:application/json e Authorization:'Bearer '+token no header (padrão JWT).
Está configurado para a porta 3000.

# Rotas

## POST /login
Rota para autenticação. Fornecer no corpo atributos 'nome' e 'senha', em caso de sucesso é retornado um token JWT.

## POST /admin/editar
Rota para alterar dados do filme. Acesso exlusivo para o admin.
Fornecer 'nome' para buscar o nome do filme e os demais atributos que serão alterados.

## POST /admin/remove
Rota para alterar dados do filme. Acesso exlusivo para o admin.
Fornecer 'nome' do filme para remover.

## POST /cadastro
Rota para cadastro de novo usuário.
Fornecer 'nome' e 'senha'. A senha é criptografada e armazenada.

## POST /usuario/editar
Rota para alterar senha.
Fornecer 'senha-atual' e 'nova-senha'.

## POST /usuario/remove
Exclusão do usuário.
Fornecer 'senha'.

## GET /filmes
Retorna lista de filmes.
É possível filtrar a lista com query na url pelos atributos diretor, nome, 'genero' e ator.

## POST /filmes/cadastro
Cadastrar novo filme.  Acesso exlusivo para o admin.
Fornecer nome, genero, diretor e atores(String).

## POST /filmes/votar
Rota para o usuário votar em um filme.
Fornecer os atributos 'filme'(nome do filme) e 'nota'.

## GET /filmes/detalhes
Exibir detalhes do filme, incluindo a média das notas dos usuários.
Fornecer 'filme' (nome do filme) na query na url.