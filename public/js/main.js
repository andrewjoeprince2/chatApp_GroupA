(() => {
  const socket = io();

  let messageList = document.querySelector('#messages'),
  chatForm = document.querySelector('form'),
  chatInput = document.querySelector('#m'),
  nameInput = document.querySelector('.nickname'),
  chatMessage = chatForm.querySelector('.message'),

  colorInput = document.querySelectorAll('.userColor'),
  handle = document.querySelector('.handle'),

  buttonGo = document.querySelector('#buttonGo'),
  overlay = document.querySelector('#nicknameOverlay'),

  //typingFeed
  typingFeedCon = document.querySelector('#typingFeed'),

  //user list
  usersDiv = document.querySelector('#onlineUsers'),
  usersHeader = usersDiv.querySelector('h2');
  usersList = document.querySelector("#users"),

  nickName = null,
  userColor = "#1e1e1e";


//Random greetings
  var greetings = ["just rolled in! Let them know you're here too!", "has arrived!", "has joined! Say hi!", "has graced us with their presence.", "joined the party! Welcome!", "has stumbled across this chatroom!"];
  var randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

  var goodbye = ["has left the building!", "disconnected.", "has mysteriously vanished!", "blasted off!", "is no more.", "peaced out!"];
  var randomGoodbye = goodbye[Math.floor(Math.random() * goodbye.length)];

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

  }



  function userJoin(data) {
    messageList.innerHTML += `<li><span style="color:${data.userColor}">${data.handle}</span> ${randomGreeting}</li>`;
    var connectedAudio = new Audio('../audio/connected.mp3'); //I created these audio files myself
    connectedAudio.play();
  }

  function userList(data) {
    //usersList.innerHTML += `<li><span style="color:${data.userColor}">&#64;</span>${data.handle}</li>`;
    //console.log(data.handle);
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
  //    window.scrollTo(0,document.querySelector("#testJump").scrollHeight);

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


  function appendDiscMessage(data) {
    //debugger;

    let newMsg = `<li>${data} ${randomGoodbye}</li>`;
    messageList.innerHTML += newMsg;
    var disconnectAudio = new Audio('../audio/disconnected.mp3');
    disconnectAudio.play();
  }

  function logUsers(data) {
    usersList.innerHTML = " ";
    //console.log(data);
    console.log(data.userColor);
    usersHeader.innerHTML = `<span class="numUsers">${data.length}</span> Online Users`;
    for(i=0;i<data.length;i++) {
    usersList.innerHTML += `<li><span>${data[i]}</span></li>`;
  }
  }



//  nameInput.addEventListener('change', setNickname, false);
  chatInput.addEventListener('keypress', typingFeed, false);
  chatForm.addEventListener('submit', handleSendMessage, false);
  socket.addEventListener('chat message', appendMessage, false);
  socket.addEventListener('typing', typingFeedOutput, false);
  socket.addEventListener('join notification', userJoin, false);
  socket.addEventListener('join notification', userList, false);
  socket.addEventListener('disconnect message', appendDiscMessage, false);
  socket.addEventListener('usersList', logUsers, false);
//  socket.addEventListener('disconnect message', logDisc, false);

  for(i=0;i<colorInput.length;i++) {
  colorInput[i].addEventListener('click', setColor, false);
  }

  buttonGo.addEventListener('click', closeOverlay, false);

})();
