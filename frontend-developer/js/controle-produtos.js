const URL = 'http://localhost:3400/produtos'

let listaProdutos = [];
let btnCadastrar = document.querySelector('#btn-cadastrar');
let tabelaProdutos = document.querySelector('.table>body');
let modalProduto = new bootstrap.Modal(document.getElementById('modal-produto'));

let formModal = {
    id: document.querySelector("#id"),
    produto: document.querySelector("#produto"),
    marca: document.querySelector("#marca"),
    quantidade: document.querySelector("#quantidade"),
    preço: document.querySelector("#preço"),
    dataCadastro: document.querySelector("#dataCadastro"),
    btnSalvar:document.querySelector("#btn-salvar"),
    btnCancelar:document.querySelector("#btn-cancelar")
}

btnCadastrar.addEventListener('click', () =>{
    limparModalProduto();
    modalProduto.show();
});

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

    tabelaProdutos.textContent = '';

    produtos.forEach(produto => { 
        criarLinhaNaTabela(produto);
    });
}

function criarLinhaNaTabela(produto){

    let tr = document.createElement('tr');

    let tdId = document.createElement('td');
    let tdProduto = document.createElement('td');
    let tdMarca = document.createElement('td');
    let tdQuantidade = document.createElement('td');
    let tdPreço = document.createElement('td');
    let tdDataCadastro = document.createElement('td');
    let tdAcoes = document.createElement('td');

    tdId.textContent = produto.id;
    tdProduto.textContent = produto.produto;
    tdMarca.textContent = produto.marca;
    tdQuantidade.textContent = produto.quantidade;
    tdPreço.textContent = produto.preço;
    tdDataCadastro.textContent = new Date(produto.DataCadastro).toLocaleDateString();
    tdAcoes.innerHTML = `<button onclick="editarCliente(${produto.id})" class="btn btn-outline-primary btn-sm mr-3">
                                Editar
                            </button>
                            <button onclick="excluirCliente(${produto.id})" class="btn btn-outline-primary btn-sm mr-3">
                                Excluir
                        </button>`

    tr.appendChild(tdId);
    tr.appendChild(tdProduto);
    tr.appendChild(tdMarca);
    tr.appendChild(tdQuantidade);
    tr.appendChild(tdPreço);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes);

    tabelaProdutos.appendChild(tr);

}

formModal.btnSalvar.addEventListener('click', () => {

    let produto = obterProdutoDoModal();

    if(!produto.validar()){
        alert("Marca e Quantidade são obrigatórios.");
        return;
    }

    adicionarProdutoNoBackend(produto);
});

function obterProdutoDoModal(){
    return new Produto({
        id: formModal.id.value,
        produto: formModal.produto.value,
        marca: formModal.marca.value,
        quantidade: formModal.quantidade.value,
        preço: formModal.preço.value,
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
        
        modalProduto.hide();
    
        alert(`Produto ${produto.produto}, foi cadastrado com sucesso!`)
    })
}

function limparModalProduto(){
    formModal.id.value = '';
    formModal.produto.value = '';
    formModal.marca.value = '';
    formModal.quantidade.value = '';
    formModal.preço.value = '';
    formModal.dataCadastro.value = '';

}

function excluirProduto(id){
    let produto = listaProdutos.find(produto => produto.id == id);

    if(confirm("Deseja realmente excluir o produto " + produto.produto)){
        excluirProdutoNoBackEnd(id);
    }
}

function excluirProdutoNoBackEnd(id){
    fetch(`${URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: obterToken()
        }
    })
    .then(() => {
        removerProdutoDaLista(id);
        popularTabela(listaProdutos);
    })
}

function removerProdutoDaLista(id){
    let indice = listaProdutos.findIndex(produto => produto.id == id);

    listaProdutos.splice(indice, 1);
}
