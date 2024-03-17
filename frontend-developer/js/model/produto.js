class Produto {
    constructor(obj){
        obj = obj || {}
        this.id = obj.id;
        this.produto = obj.produto;
        this.marca = obj.marca;
        this.quantidade = obj.quantidade;
        this.preço = obj.preço;
        this.dataCadastro = obj.dataCadastro;
    }

    validar(){
        return !!(this.marca && this.quantidade);  
    }
}