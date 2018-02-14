(() => {
  const socket = io();

  let messageList = document.querySelector('#messages'),
  chatForm = document.querySelector('form'),
  chatInput = document.querySelector('#m');
  nameInput = document.querySelector('.nickname'),
  chatMessage = chatForm.querySelector('.message'),

  colorInput = document.querySelectorAll('.userColor');
  handle = document.querySelector('.handle');

  buttonGo = document.querySelector('#buttonGo');
  overlay = document.querySelector('#nicknameOverlay'),

  //typingFeed
  typingFeedCon = document.querySelector('#typingFeed');

  //user list
  usersList = document.querySelector("#users");

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
    }

/*
  function setNickname() {
    //debugger;
    nickName = this.value;
  }*/

  function closeOverlay() {
    overlay.style.display = "none";
    nickName = (nickName && nickName.length > 0) ? nickName : 'user';
    socket.emit('join notification', {
      handle: nameInput.value ? nameInput.value : 'guest',
      userColor: userColor
    });

  //  joinMsg = `<span style="color:${userColor}">${nickName}</span> ${randomGreeting}`;
    //socket.emit('chat message', joinMsg);
    //console.log(userColor);
  }



  function userJoin(data) {
    messageList.innerHTML += `<li><span style="color:${data.userColor}">${data.handle}</span> ${randomGreeting}</li>` //I suppose I could have sent this to the server but I like how each client recieves a different random greeting
    var connectedAudio = new Audio('../audio/connected.mp3'); //I created these audio files myself
    connectedAudio.play();
  }

  function userList(data) {
    usersList.innerHTML += `<li><span style="color:${data.userColor}">&#64;</span>${data.handle}</li>`;
    console.log(data.handle);
  }


  function handleSendMessage(e) {
    e.preventDefault();
    socket.emit('chat message', {
      message: chatMessage.value,
      handle: nameInput.value ? nameInput.value : 'guest',
      userColor: userColor,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: true, hour: "numeric", minute: "numeric"}) // taken from developer.mozilla.org
    });
    chatMessage.value = "";
  }

  function appendMessage(data) {
      typingFeedCon.innerHTML = "";
      messageList.innerHTML += `<li><span class="handle" style="color:${data.userColor}">${data.handle}</span> <span class="date">${data.timestamp}</span> <p class="messageContent">${data.message}</p></li>`;
      var messageAudio = new Audio('../audio/message.mp3'); //I created these audio files myself
      messageAudio.play();
      window.scrollTo(0, document.body.scrollHeight);
  }

  function typingFeed() {
    socket.emit('typing', {
      handle: nameInput.value ? nameInput.value : 'guest',
      userColor: userColor
    });
  }

  function typingFeedOutput(data) {
    typingFeedCon.innerHTML = `<li><span style="color:${data.userColor}">${data.handle}</span> is typing...</li>`;
  }

/*
  function handleSendMessage(e) {
    e.preventDefault(); //block default behaviour (page refresh)
    //debugger;
    nickName = (nickName && nickName.length > 0) ? nickName : 'user';
    msg = `<span class="handle" style="color:${userColor}">${nickName}</span>  ${chatMessage.value}`;

    socket.emit('chat message', msg);
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


*/
//  nameInput.addEventListener('change', setNickname, false);
  chatInput.addEventListener('keypress', typingFeed, false);
  chatForm.addEventListener('submit', handleSendMessage, false);
  socket.addEventListener('chat message', appendMessage, false);
  socket.addEventListener('typing', typingFeedOutput, false);
  socket.addEventListener('join notification', userJoin, false);
  socket.addEventListener('join notification', userList, false);
  //socket.addEventListener('disconnect message', appendDiscMessage, false);

  for(i=0;i<colorInput.length;i++) {
  colorInput[i].addEventListener('click', setColor, false);
  }

  buttonGo.addEventListener('click', closeOverlay, false);

})();
