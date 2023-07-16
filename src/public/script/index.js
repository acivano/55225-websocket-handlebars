console.log('se conectó')

const socket = io()

let nodopadre = document.getElementById("contenedorPadre")
if(nodopadre){

    socket.on('products', products => {

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
                                        <form class="">
                                            <div class="form-floating mb-3">
                                                <input type="number" class="form-control focusColor text-center cantidadMenu" id="cantidad${producto.id}" placeholder="Cantidad" value="1" min="1" max="10" required>
                                                <label>Cantidad: </label>
                                            </div>
                                        </form>
                                        <h6 id="idProducto" class="display-none">${producto.code}</h6>
                                        <button  class="botonPersonalizado mt-1">Agregar</button>
                                    </div>
                                </div>`;
                nodopadre.classList = ''
                nodopadre.classList = 'd-flex flex-column align-content-center justify-content-start gap-4 flex-lg-row flex-lg-wrap mt-5';
                nodopadre.appendChild(nodo);
            }
        }
    })
}


function addProducto() {
    let title = document.querySelector('#Title').value
    let code = document.querySelector('#Code').value
    let description = document.querySelector('#Description').value
    let price = document.querySelector('#Price').value
    let thumbnail = document.querySelector('#Thumbnail').value
    let stock = document.querySelector('#Stock').value
    let category = document.querySelector('#Category').value

    if(title,code, description, price, thumbnail, stock, category){

        socket.emit('addProduct', { title, code, description, price, thumbnail, stock, category })
    }

} 

function redondeo(numero) {
    return (Math.round((numero * 100)) / 100).toLocaleString("es-CO", {
        style: "currency",
        currency: "COP"
    });; 
};



