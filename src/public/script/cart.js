
socket.on('cart-productos', (cart) => {
    let messagesEl = document.querySelector('#cartPrd')
    let totalEl = document.querySelector('#total')
    messagesEl.innerHTML=''
    totalEl.innerHTML=''

    let nodo = document.createElement("div")
    nodo.classList='container d-flex flex-column justify-content-between mt-3'


    let precioTotal = 0

    cart.products.forEach(item => {
        nodo.innerHTML = nodo.innerHTML +`  <div key=${item._id._id} class="d-flex flex-row justify-content-between align-items-center border-bottom">
                                                <img class="imgCarrito" src=${item._id.thumbnail} alt="Producto1"/>
                                                <div class="d-flex flex-column columnaNombreCarrito w-50">
                                                    <h2 class="align-self-start mt-5">${item._id.title}</h2>
                                                    <div class="d-flex flex-row justify-content-between align-items-end">
                                                        <h4 class=" text-start mt-1 w-75">${item.quantity} u. x $${(item._id.price)} = <span class='h2'>$${item._id.price * item.quantity} </span></h4>   
                                                    </div>
                                                    <div class="form-floating mb-3 w-50 align-self-center d-flex flex-row justify-content-between">
                                                        <button class="btn txtColorCarrito carrito" onClick="deleteProduct('${cart._id.toString()}', '${item._id._id}')"><i class="bi bi-trash"></i></button>
                                                    </div>
                                                </div> 
                                            </div>  `
        
        precioTotal+= item.quantity* item._id.price
    })
    messagesEl.appendChild(nodo)

    let total = document.createElement("div")
    total.classList='container d-flex flex-column justify-content-between mt-3 d-flex flex-column justify-content-center w-75 align-self-center'
    total.innerHTML = `
                            <div class='d-flex flex-column justify-content-center align-self-end w-50'>
                                <div class="d-flex flex-column justify-content-center align-self-center">
                                    <p>Total:</p>
                                    <h2 class='h1'id='total'>$${precioTotal}</h2> 
                                </div>
                                <button  class="botonPersonalizado mt-1" onclick="generateTicket('${cart._id.toString()}')">Finalizar Compra</button>
                            </div>`
    totalEl.appendChild(total) 

})

function deleteProduct(cid, pid) {
    socket.emit('delteProduct', {cid, pid})    
} 
async function generateTicket(id) {

    try {
        const requestOptions = {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
            }
        }
        const response = await fetch(`${window.location.origin}/api/carts/${id}/ticket`, requestOptions)

        socket.emit('cart', id)  
    } catch (error) {
        console.log('error en la generación de la orden')        
    }
    
} 
