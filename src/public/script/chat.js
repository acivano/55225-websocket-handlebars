const messagesEl = document.querySelector('#chat-content')
const inputElement = document.querySelector('#inputMessage')
const inputName = document.querySelector('#inputName')


const appendMessageElement = (own,user, time, msg) => {
  const div = document.createElement('div')
  div.classList.add('media')
  div.classList.add('media-chat')
  const style = own ==true? null : `style="background-color: powderblue"`
  div.innerHTML = `<div class="media-body">
                    <p ${style}><span class="text-dark">${user}:</span> ${msg}</p>
                    <p class="meta"><time datetime="2018">${time}</time></p>
                  </div>`
  
  messagesEl.appendChild(div)


  setTimeout(() => {
    messagesEl.scrollTo(0, messagesEl.scrollHeight);
  }, 250)
}

let currentMessages = []

socket.on('chat-messages', (messagesList) => {
  
  
  currentMessages = messagesList
  currentMessages.forEach(element =>  {
    appendMessageElement(false,element.user, element.datetime, element.text)
  });

})

socket.on('chat-message', (msg) => {


  appendMessageElement(false, msg.user ,  msg.datetime, msg.message)

})

inputElement.addEventListener('keyup', ({ key, target }) => {
  if (key !== 'Enter') {
    return
  }

  const { value } = target

  if (!value) {
    return
  }
  const inputName = document.querySelector('#inputName').value

  if(inputName){

    const fecha = new Date()
    const datetime = fecha.toLocaleTimeString('en-US')
  
    const msg = { user: inputName, message: value, datetime:  datetime }
  
    socket.emit('chat-message', msg)
    target.value = ""
    appendMessageElement(true,inputName, datetime, value)
  }
})
