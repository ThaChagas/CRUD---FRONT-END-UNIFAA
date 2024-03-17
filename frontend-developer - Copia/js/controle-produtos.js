const URL = 'http://localhost:3400/produtos'

let listaProdutos = [];
let btnAdicionar = document.querySelector('#btn-adicionar');
let tabelaProduto = document.querySelector('tabela>tdoby');

let formModal = {
    id: document.querySelector("#id"),
    nome: document.querySelector("#nome"),
    quantidadeEstoque: document.querySelector("#quantidadeEstoque"),
    valor: document.querySelector("#valor"),
    observacao: document.querySelector("#observacao"),
    dataCadastro: document.querySelector("#dataCadastro"),
    btnSalvar: document.querySelector("#btn-salvar"),
    btnCancelar: document.querySelector("#btn-cancelar"),
}


function obterProdutos() {
    fetch(URL, {
        method: 'GET',
        headers: {
            'Authorization': obterToken()
        }
    })
    .then(response => response.json())
    .then(produtos => {
        listaProdutos = produtos;
        popularTabela(produtos);
    })
    .catch((erro) => {});
}

obterProdutos();

function popularTabela(produtos){

    tabelaProduto.textContent = '';

    produtos.forEach(produto => {

        criarLinhaNaTabela(produto);        
    });

}

function criarLinhaNaTabela(produto){

    let tr = document.createElement('tr')

    let tdId = document.createElement('td');
    let tdNome = document.createElement('td');
    let tdQuantidadeEstoque = document.createElement('td');
    let tdValor = document.createElement('td');
    let tdObservacao = document.createElement('td');
    let tdDataCadastro = document.createElement('td');
    let tdAcoes = document.createElement('td');

    tdId.textContent = produto.id
    tdNome.textContent = produto.nome;
    tdQuantidadeEstoque.textContent = produto.quantidadeEstoque;
    tdValor.textContent = produto.valor;
    tdObservacao.textContent = produto.observacao;
    tdDataCadastro.textContent = new Date(produto.dataCadastro).toLocaleDateString();

    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdQuantidadeEstoque);
    tr.appendChild(tdValor);
    tr.appendChild(tdObservacao);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes);

    tabelaProduto.appendChild(tr);
}

formModal.btnSalvar.addEventListener('click', () => {

    let produto = obterProdutoDoModal();

    if(!produto.validar()){
        alert("Quantidade e Valor são obrigatórios.");
        return;
    }

    adicionarProdutoNoBackend(produto);

});

function obterProdutoDoModal(){
    return new Produto({
        id: formModal.id.value,
        nome: formModal.nome.value,
        quantidadeEstoque: formModal.quantidadeEstoque.value,
        valor: formModal.valor.value,
        observacao: formModal.observacao.value,
        dataCadastro: (formModal.dataCadastro.value)
        ? new Date(formModal.dataCadastro.value).toISOString()
        : new Date().toISOString()
    });

}

function adicionarProdutoNoBackend(produto){

    fetch(URL, {
        method: 'POST',
        headers: {
            Authorization: obterToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(response => {
        let novoProduto = new Produto(response);
        listaProdutos.push(novoProduto);

        popularTabela(listaProdutos);


    })
}