const socket = io()

const chatbox = document.querySelector('#chatbox')
let user

//Logging In
Swal.fire({
  title: 'Bienvenido',
  text: 'Ingrese su nombre para continuar',
  input: 'text',
  inputValidator: (value) => {
    return !value && 'Se necesita ingresar un nombre!'
  },
  allowOutsideClick: false,
}).then((data) => {
  user = data.value
  console.log(data.value)
  socket.emit('userLoggedIn', { user })
})

//Emit Message
chatbox.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    socket.emit('message', {
      user,
      message: e.target.value,
    })
    chatbox.value = ''
  }
})

//Listen
socket.on('messages', (data) => {
  const log = document.querySelector('#messages')
  let messages = ''

  data.forEach((element) => {
    messages +=
      '<strong>' + element.user + '</strong>: ' + element.message + '</br>'
  })

  log.innerHTML = messages

  console.log(data)
})

socket.on('userNotification', (data) => {
    if (user) {
        Swal.fire({
            text: "Nuevo usuario conectado " + data.user,
            toast: true,
            position: "top-right"
        })
    }
  console.log('userNotification', data.user)
})
