const socket = io()

let idCarrito = document.querySelector('#carritoId')?.innerHTML
let users_datos = document.querySelector('#users_datos')?.innerHTML

socket.emit('products', {}) 
if (idCarrito) {
    
    socket.emit('cart', idCarrito)    
    
    
    socket.on('quantity-cart-productos', (quantity)=>{
        if(document.querySelector('#cantidadEnCarrito')?.innerHTML){
            document.querySelector('#cantidadEnCarrito').innerHTML= quantity || 0
        }
    })
}
if(users_datos){
    socket.emit('users-list', {})

}

socket.on('searchProducto', (product)=>{
    
    document.querySelector('#_id').value = product._id
    document.querySelector('#Title').value = product.title
    document.querySelector('#Code').value = product.code
    document.querySelector('#Description').value = product.description
    document.querySelector('#Price').value = product.price
    document.querySelector('#Thumbnail').value = product.thumbnail
    document.querySelector('#Stock').value = product.stock
    document.querySelector('#Category').value = product.category
    document.querySelector('#Owner').value = product.owner

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
                                    <div class="d-flex flex-column align-content-center">
                                        <p class="card-text text-center mt-1 altotexto">${producto.title}</p>
                                        <p class="card-text text-center ">${producto.code}</p>

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
    let codeSearch = document.querySelector('#SearchByCode').value
    socket.emit('searchProducto', { codeSearch, user, role })
}

async function enviarMail() {

    const user = document.querySelector('#email').value
    socket.emit('enviarmail', { user})
    
    render
}


function addProducto(e) {
    // e.preventDefault()
    let _id = document.querySelector('#_id').value || null
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



