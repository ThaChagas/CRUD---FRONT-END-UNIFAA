const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sQuantidade = document.querySelector('#m-quantidade')
const sValor = document.querySelector('#m-valor')
const sDataCadastro = document.querySelector('#m-dataCadastro')
const btnSalvar = document.querySelector('#btnSalvar')

let itens
let id

function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  if (edit) {
    sNome.value = itens[index].nome
    sQuantidade.value = itens[index].quantidade
    sValor.value = itens[index].valor
    sDataCadastro = itens[index].dataCadastro
    id = index
  } else {
    sNome.value = ''
    sQuantidade.value = ''
    sValor.value = ''
    sDataCadastro = ''
  }
  
}

function editItem(index) {

  openModal(true, index)
}

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  loadItens()
}

function insertItem(item, index) {
  let tr = document.createElement('tr')

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.quantidade}</td>
    <td>R$ ${item.valor}</td>
    <td>${item.dataCadastro }</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
  tbody.appendChild(tr)
}

btnSalvar.onclick = e => {
  
  if (sNome.value == '' || sQuantidade.value == '' || sValor.value == '' || sDataCadastro.value == '') {
    return
  }

  e.preventDefault();

  if (id !== undefined) {
    itens[id].nome = sNome.value
    itens[id].quantidade = sQuantidade.value
    itens[id].valor = sValor.value
    itens[id].dataCadastro = sDataCadastro.value
  } else {
    itens.push({'nome': sNome.value, 'quantidade': sQuantidade.value, 'valor': sValor.value, 'dataCadastro': sDataCadastro.value})
  }

  setItensBD()

  modal.classList.remove('active')
  loadItens()
  id = undefined
}

function loadItens() {
  itens = getItensBD()
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })

}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))

loadItens()