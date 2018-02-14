(() => {
  const socket = io();

  let messageList = document.querySelector('#messages'),
  chatForm = document.querySelector('form'),
  nameInput = document.querySelector('.nickname'),
  chatMessage = chatForm.querySelector('.message'),

  colorInput = document.querySelectorAll('.userColor');
  handle = document.querySelector('.handle');

  buttonGo = document.querySelector('#buttonGo');
  overlay = document.querySelector('#nicknameOverlay'),

  //user list
  usersList = document.querySelector("#onlineUsers");

  nickName = null,
  userColor = "#1e1e1e";

  var greetings = ["just rolled in! Let them know you're here too!", "has arrived!", "has joined! Say hi!", "has graced us with their presence.", "joined the party! Welcome!", "has stumbled across this chatroom!"];
  var randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

  function setColor() {
    for(i=0;i<colorInput.length;i++) {
    colorInput[i].style.border ="solid 5px white";
    }

    userColor = `#${this.dataset.color}`;
    this.style.border = "solid 8px red";
    //handle.style.color = userColor;
    }


  function setNickname() {
    //debugger;
    nickName = this.value;
  }

  function closeOverlay() {
    overlay.style.display = "none";
    nickName = (nickName && nickName.length > 0) ? nickName : 'user';
    joinMsg = `<span style="color:${userColor}">${nickName}</span> ${randomGreeting}`;
    socket.emit('chat message', joinMsg);
    //console.log(socket);
  }

  function handleSendMessage(e) {
    e.preventDefault(); //block default behaviour (page refresh)
    //debugger;
    nickName = (nickName && nickName.length > 0) ? nickName : 'user';
    msg = `<span class="handle" style="color:${userColor}">${nickName}</span>  ${chatMessage.value}`;

    socket.emit('chat message', {
      message: msg,
      nickName: nickName
    });
    chatMessage.value = "";
    return false;
  }

  function appendMessage(msg) {
    //debugger;
    let newMsg = `<li><p class="messageContent">${msg.message}</p></li>`;
    messageList.innerHTML += newMsg;
    var messageAudio = new Audio('../audio/message.mp3'); //I created these audio files myself
    messageAudio.play();
     window.scrollTo(0, document.body.scrollHeight);
  }

  function appendDiscMessage(msg) {
    //debugger;

    let newMsg = `<li>${msg}</li>`;
    messageList.innerHTML += newMsg;
    var disconnectAudio = new Audio('../audio/disconnected.mp3');
    disconnectAudio.play();
  }



  nameInput.addEventListener('change', setNickname, false);
  chatForm.addEventListener('submit', handleSendMessage, false);
  socket.addEventListener('chat message', appendMessage, false);
  socket.addEventListener('disconnect message', appendDiscMessage, false);

  for(i=0;i<colorInput.length;i++) {
  colorInput[i].addEventListener('click', setColor, false);
  }

  buttonGo.addEventListener('click', closeOverlay, false);

})();
