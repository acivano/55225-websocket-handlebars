
socket.on('users-list', (usersList) => {
    let users = document.querySelector('#users_datos')
    users.innerHTML=''

    let nodo = document.createElement("div")
    nodo.classList='container d-flex flex-column justify-content-between'


    usersList.forEach(item => {
        let admindiv = ''
        if(!item.admin){
            let inactivodiv = ''
            if(item.inactivo){
                inactivodiv = '<span class="badge bg-warning text-dark ">Inactivo</span>'
            }else{
                inactivodiv = '<span class="badge bg-success">Activo</span>'
            }
            admindiv = `<div class="d-flex flex-column justify-content-between align-items-center">
                                       ${inactivodiv}
                                        <button class="btn btn-primary botonPersonalizado mt-2 " onclick="changeRol('${item._id.toString()}')">Cambiar Rol</button>
                                        <button class="btn txtColorCarrito carrito " onclick="deleteUser('${item._id.toString()}')"><i class="bi bi-trash"></i></button>
                            </div>`
        }

        nodo.innerHTML = nodo.innerHTML +`
                                            <div class="d-flex flex-row justify-content-between align-items-center border-bottom mt-3">
                                                
                                                <div class="d-flex flex-column columnaNombreCarrito w-50">
                                                    <h2 class="align-self-start mt-1">${item.user}</h2>
                                                    <div class="d-flex flex-row justify-content-between align-items-end">
                                                        <h4 class=" text-start mt-1 w-75">${item.firstname} ${item.lastname} </h4>   
                                                    </div>
                                                        <h4 class=" text-start mt-1 w-75">${item.role}</h4>  
                                                </div> 
                                                ${admindiv}     
                                            </div> 
                                        `
        users.appendChild(nodo)

    })

})

function deleteUser(uid) {

    socket.emit('deleteUser', {uid})    
} 
function changeRol(uid) {
    socket.emit('changeRol', {uid})    
} 

