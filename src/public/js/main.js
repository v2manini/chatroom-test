const socket = io()

const chatbox = document.querySelector('#chatbox')
let user
let firstTime = false;

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
  if (e.key === 'Enter' && e.target.value.trim().length) {
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

  renderonce(log,data);
  log.innerHTML += sanitized(data[data.length - 1].user,data[data.length - 1].message);  

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

function sanitized(User,msg) {
  let strong = document.createElement("STRONG");
  strong.textContent = `${User}: ${msg}\n`;
  strong.appendChild(document.createElement("br"));
  
  return strong.innerHTML;
};  

function renderonce(log,data) {
  if (firstTime) return;
    for (let i = 0; i < data.length-1; i++) {
      log.innerHTML += sanitized(data[i].user,data[i].message);
    };  
  firstTime = true;
}