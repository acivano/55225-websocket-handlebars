const socket = io()

let idCarrito = document.querySelector('#carritoId')?.innerHTML
console.log(idCarrito)
let users_datos = document.querySelector('#users_datos')?.innerHTML
console.log(users_datos)

socket.emit('products', {}) 
if (idCarrito) {
    
    socket.emit('cart', idCarrito)    
    
    
    socket.on('quantity-cart-productos', (quantity)=>{
        let spanCarrito = document.querySelector('#cantidadEnCarrito').innerHTML = quantity
    
    })
}
if(users_datos){
    console.log('estoy parado en users')
    socket.emit('users-list', {})

}

socket.on('searchProducto', (product)=>{
    console.log('llegó searchProducto al front')
    
    console.log(product)
    document.querySelector('#_id').value = product._id
    document.querySelector('#Title').value = product.title
    document.querySelector('#Code').value = product.code
    document.querySelector('#Description').value = product.description
    document.querySelector('#Price').value = product.price
    document.querySelector('#Thumbnail').value = product.thumbnail
    document.querySelector('#Stock').value = product.stock
    document.querySelector('#Category').value = product.category
    document.querySelector('#Owner').value = product.owner

    console.log(document.querySelector('#_id').value)
})

socket.on('products', (products) => {
    let nodopadre = document.getElementById("contenedorPadre")

    if(nodopadre){
        nodopadre.innerHTML = ''

        if(products){
            for (const producto of products) {
                let nodo = document.createElement("div");
                nodo.className = "d-flex justify-content-center";
                nodo.innerHTML = `<div class="seccion_datos">
                                    <div class="card-body d-flex flex-column align-content-center justify-content-center">
                                        <img class="img-fluid" src="${producto.thumbnail}" alt="${producto.title}">
                                    </div>
                                    <div>
                                        <p class="card-text text-center mt-1 altotexto">${producto.title}</p>
                                        <h3 class="montoDonacion text-center mt-1">${redondeo(producto.price)}</h3>
                                       
                                        <h6 id="idProducto" class="display-none">${producto.code}</h6>
                                        <button  class="botonPersonalizado mt-1" onclick="addProductoCarrito('${producto._id.toString()}')">Agregar</button>
                                    </div>
                                </div>`;
                nodopadre.classList = ''
                nodopadre.classList = 'd-flex flex-column align-content-center justify-content-start gap-4 flex-lg-row flex-lg-wrap mt-5';
                nodopadre.appendChild(nodo);
            }
        }
    }
})

// socket.on('addProductoCarrito', ()=>{
//     let cantCarrito = document.querySelector('#cantidadEnCarrito')

//     let cantidad = parseInt(cantCarrito.innerHTML) +1
//     cantCarrito.innerHTML = cantidad

// })

function searchProduct (user, role){
    // console.log(user)
    console.log('entró al searchProduct')
    let codeSearch = document.querySelector('#SearchByCode').value
    console.log({ codeSearch, user, role })
    socket.emit('searchProducto', { codeSearch, user, role })
}

async function enviarMail() {

    const user = document.querySelector('#email').value
    console.log(user)
    socket.emit('enviarmail', { user})
    
    render
}


function addProducto() {
    
    let _id = document.querySelector('#_id').value || null
    console.log(_id)
    let title = document.querySelector('#Title').value
    let code = document.querySelector('#Code').value
    let description = document.querySelector('#Description').value
    let price = document.querySelector('#Price').value
    let thumbnail = document.querySelector('#Thumbnail').value
    let stock = document.querySelector('#Stock').value
    let category = document.querySelector('#Category').value
    let owner = document.querySelector('#Owner').value
    let action = document.getElementById("dropdown").value

    switch (action) {
        case '1':
                if(title,code, description, price, thumbnail, stock, category, owner){
            
                    socket.emit('addProduct', {  title, code, description, price, thumbnail, stock, category, owner })
                }
            break;
        case '2':
                if(title,code, description, price, thumbnail, stock, category, owner){
                
                    socket.emit('editProduct', { _id ,title, code, description, price, thumbnail, stock, category, owner })
                }
            break;
        case '3':
                if(title,code, description, price, thumbnail, stock, category, owner){
                    
                    socket.emit('deleteProduct', { _id ,title, code, description, price, thumbnail, stock, category, owner })
                }
            break;
        default:
            break;
    }

} 
function addProductoCarrito(id) {

    socket.emit('addProductoCarrito', {idCarrito , id})    

} 

function redondeo(numero) {
    return (Math.round((numero * 100)) / 100).toLocaleString("es-CO", {
        style: "currency",
        currency: "COP"
    });; 
};



