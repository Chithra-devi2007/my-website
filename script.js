/* =====================================================
   KUTTY CHAT 💕
   Frontend Chat Application
===================================================== */


/* ================= VARIABLES ================= */

let currentUser = "";
let currentChat = "";
let recording = false;
let mediaRecorder = null;
let audioChunks = [];

const APP_PASSWORD = "chithu2007";


/* ================= LOGIN ================= */

function login() {

  const username =
    document.getElementById("loginUsername").value.trim();

  const password =
    document.getElementById("loginPassword").value;

  const error =
    document.getElementById("loginError");


  if (!username) {

    error.textContent = "Please enter username 💕";
    return;
  }


  if (password !== APP_PASSWORD) {

    error.textContent = "Wrong password ❌";
    return;
  }


  currentUser = username;

  localStorage.setItem(
    "kuttyChatUser",
    username
  );


  document
    .getElementById("loginPage")
    .classList.add("hidden");

  document
    .getElementById("app")
    .classList.remove("hidden");


  document.getElementById("myName")
    .textContent = username;

}


/* ================= AUTO LOGIN ================= */

window.addEventListener("load", () => {

  const savedUser =
    localStorage.getItem("kuttyChatUser");

  if (savedUser) {

    currentUser = savedUser;

    document
      .getElementById("loginPage")
      .classList.add("hidden");

    document
      .getElementById("app")
      .classList.remove("hidden");

    document.getElementById("myName")
      .textContent = savedUser;
  }

});


/* ================= PASSWORD ================= */

function togglePassword() {

  const input =
    document.getElementById("loginPassword");

  input.type =
    input.type === "password"
      ? "text"
      : "password";
}


/* ================= LOGOUT ================= */

function logout() {

  localStorage.removeItem("kuttyChatUser");

  location.reload();
}


/* ================= OPEN CHAT ================= */

function openChat(name, avatar) {

  currentChat = name;

  document
    .getElementById("chatName")
    .textContent = name;


  document
    .getElementById("chatAvatar")
    .textContent = avatar;


  const onlineUsers =
    ["Anu", "Kavin", "Friends Group"];

  document
    .getElementById("chatStatus")
    .textContent =
      onlineUsers.includes(name)
        ? "Online"
        : "Offline";


  document
    .getElementById("app")
    .classList.add("chat-open");


  loadMessages();

}


/* ================= CLOSE CHAT ================= */

function closeChat() {

  document
    .getElementById("app")
    .classList.remove("chat-open");

  currentChat = "";

}


/* ================= MESSAGE STORAGE ================= */

function getStorageKey() {

  return `chat_${currentUser}_${currentChat}`;
}


function getMessages() {

  try {

    return JSON.parse(
      localStorage.getItem(
        getStorageKey()
      )
    ) || [];

  } catch {

    return [];

  }

}


function saveMessages(messages) {

  localStorage.setItem(
    getStorageKey(),
    JSON.stringify(messages)
  );

}


/* ================= LOAD MESSAGES ================= */

function loadMessages() {

  const box =
    document.getElementById("messages");

  box.innerHTML = "";

  const messages = getMessages();


  if (messages.length === 0) {

    box.innerHTML = `
      <div class="welcome-message">
        <div class="big-teddy">🧸</div>
        <h2>Say Hello 💕</h2>
        <p>Start chatting with ${currentChat}</p>
      </div>
    `;

    return;
  }


  messages.forEach((msg, index) => {

    renderMessage(msg, index);

  });


  scrollMessages();

}


/* ================= RENDER MESSAGE ================= */

function renderMessage(msg, index) {

  const box =
    document.getElementById("messages");


  const div =
    document.createElement("div");


  div.className =
    `message ${msg.sender === currentUser ? "sent" : "received"}`;


  let content = "";


  if (msg.type === "image") {

    content = `
      <img
        src="${msg.content}"
        alt="sent image"
      >
    `;

  } else {

    content =
      escapeHTML(msg.content);

  }


  div.innerHTML = `

    ${content}

    <span class="message-time">
      ${msg.time}
      ${msg.sender === currentUser ? "✓✓" : ""}
    </span>

    <div class="message-actions">

      <button onclick="reactMessage(${index},'❤️')">
        ❤️
      </button>

      <button onclick="deleteMessage(${index})">
        🗑️
      </button>

    </div>

    ${
      msg.reaction
        ? `<span class="reaction">${msg.reaction}</span>`
        : ""
    }

  `;


  box.appendChild(div);
}


/* ================= SEND MESSAGE ================= */

function sendMessage() {

  const input =
    document.getElementById("messageInput");

  const text =
    input.value.trim();


  if (!text || !currentChat) return;


  const messages =
    getMessages();


  messages.push({

    sender: currentUser,

    content: text,

    type: "text",

    time: getTime(),

    reaction: ""

  });


  saveMessages(messages);


  input.value = "";

  loadMessages();


  fakeReply(text);

}


/* ================= ENTER ================= */

function handleEnter(event) {

  if (event.key === "Enter") {

    event.preventDefault();

    sendMessage();

  }

}


/* ================= FAKE REPLY ================= */

function fakeReply(text) {

  const typing =
    document.getElementById("typing");


  typing.classList.remove("hidden");


  setTimeout(() => {

    typing.classList.add("hidden");


    const messages =
      getMessages();


    messages.push({

      sender: currentChat,

      content: getAutoReply(text),

      type: "text",

      time: getTime(),

      reaction: ""

    });


    saveMessages(messages);

    loadMessages();

  }, 1200);

}


function getAutoReply(text) {

  const msg =
    text.toLowerCase();


  if (
    msg.includes("hi") ||
    msg.includes("hello")
  ) {
    return "Hii 💕😊";
  }


  if (msg.includes("how are you")) {
    return "I'm good 🥰 How are you?";
  }


  if (msg.includes("bye")) {
    return "Bye bye 🧸💕";
  }


  const replies = [

    "Okayyy 💕",

    "Super 😍",

    "Haha 😂",

    "Niceee ✨",

    "Really? 🥹",

    "Aww 🧸💜",

    "Seri seri 😄"

  ];


  return replies[
    Math.floor(
      Math.random() * replies.length
    )
  ];
}


/* ================= TIME ================= */

function getTime() {

  return new Date()
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

}


/* ================= IMAGE ================= */

function sendImage(event) {

  const file =
    event.target.files[0];

  if (!file || !currentChat) return;


  if (!file.type.startsWith("image/")) {

    alert("Please select an image 📷");
    return;

  }


  const reader =
    new FileReader();


  reader.onload = function(e) {

    const messages =
      getMessages();


    messages.push({

      sender: currentUser,

      content: e.target.result,

      type: "image",

      time: getTime(),

      reaction: ""

    });


    saveMessages(messages);

    loadMessages();

  };


  reader.readAsDataURL(file);

  event.target.value = "";

}


/* ================= EMOJI ================= */

function toggleEmoji() {

  document
    .getElementById("emojiPicker")
    .classList.toggle("hidden");

}


function addEmoji(emoji) {

  const input =
    document.getElementById("messageInput");


  input.value += emoji;

  input.focus();

}


/* ================= TYPING ================= */

let typingTimer;

function showTyping() {

  if (!currentChat) return;


  const typing =
    document.getElementById("typing");


  typing.classList.remove("hidden");


  clearTimeout(typingTimer);


  typingTimer =
    setTimeout(() => {

      typing.classList.add("hidden");

    }, 1000);

}


/* ================= DELETE MESSAGE ================= */

function deleteMessage(index) {

  const messages =
    getMessages();


  if (!confirm("Delete this message?")) {
    return;
  }


  messages.splice(index, 1);

  saveMessages(messages);

  loadMessages();

}


/* ================= REACTION ================= */

function reactMessage(index, reaction) {

  const messages =
    getMessages();


  messages[index].reaction =
    reaction;


  saveMessages(messages);

  loadMessages();

}


/* ================= SCROLL ================= */

function scrollMessages() {

  const box =
    document.getElementById("messages");

  box.scrollTop =
    box.scrollHeight;

}


/* ================= SEARCH ================= */

function searchUsers() {

  const search =
    document
      .getElementById("searchInput")
      .value
      .toLowerCase();


  document
    .querySelectorAll(".chat-user")
    .forEach(user => {

      const name =
        user.dataset.name || "";


      user.style.display =
        name.toLowerCase()
          .includes(search)
          ? "flex"
          : "none";

    });

}


/* ================= GROUP ================= */

function createGroup() {

  const name =
    prompt("Enter group name 👥");


  if (!name || !name.trim()) {
    return;
  }


  const groupName =
    name.trim();


  const groupList =
    document.getElementById("groupList");


  const div =
    document.createElement("div");


  div.className = "chat-user";

  div.dataset.name =
    groupName;


  div.innerHTML = `

    <div class="avatar pink">
      👥
    </div>

    <div class="user-info">

      <b>${escapeHTML(groupName)}</b>

      <span class="status online">
        New group
      </span>

    </div>

  `;


  div.onclick = () =>
    openChat(groupName, "👥");


  groupList.appendChild(div);


  alert(
    `${groupName} group created successfully 💕`
  );

}


/* ================= OPTIONS ================= */

function toggleOptions() {

  document
    .getElementById("optionsMenu")
    .classList.toggle("hidden");

}


/* ================= PROFILE ================= */

function editProfile() {

  const name =
    prompt(
      "Enter new username:",
      currentUser
    );


  if (!name || !name.trim()) {
    return;
  }


  currentUser =
    name.trim();


  localStorage.setItem(
    "kuttyChatUser",
    currentUser
  );


  document
    .getElementById("myName")
    .textContent = currentUser;


  toggleOptions();

}


function changePicture() {

  document
    .getElementById("profileInput")
    .click();

}


function changeProfileImage(event) {

  const file =
    event.target.files[0];

  if (!file) return;


  const reader =
    new FileReader();


  reader.onload = function(e) {

    const avatar =
      document.getElementById(
        "profileAvatar"
      );


    avatar.style.backgroundImage =
      `url(${e.target.result})`;

    avatar.style.backgroundSize =
      "cover";

    avatar.style.backgroundPosition =
      "center";

    avatar.textContent = "";

  };


  reader.readAsDataURL(file);

}


/* ================= DARK MODE ================= */

function toggleDarkMode() {

  document
    .body
    .classList.toggle("dark");


  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark")
  );

}


/* LOAD DARK MODE */

if (
  localStorage.getItem("darkMode") === "true"
) {

  document.body.classList.add("dark");

}


/* ================= NOTIFICATION ================= */

function toggleNotifications() {

  if (
    "Notification" in window
  ) {

    if (
      Notification.permission === "granted"
    ) {

      alert("Notifications are already enabled 🔔");

    } else {

      Notification.requestPermission();

    }

  } else {

    alert(
      "Notifications are not supported."
    );

  }

}


/* ================= CHANGE PASSWORD ================= */

function changePassword() {

  const oldPassword =
    prompt("Enter old password:");

  if (oldPassword !== APP_PASSWORD) {

    alert("Wrong old password ❌");

    return;

  }


  alert(
    "For this demo, password is fixed as chithu2007."
  );

}


/* ================= CALL ================= */

function startCall() {

  if (!currentChat) {

    alert("Select a chat first.");

    return;

  }


  alert(
    `📞 Calling ${currentChat}...`
  );

}


function startVideo() {

  if (!currentChat) {

    alert("Select a chat first.");

    return;

  }


  alert(
    `📹 Video calling ${currentChat}...`
  );

}


/* ================= CHAT OPTIONS ================= */

function toggleChatOptions() {

  document
    .getElementById("chatOptions")
    .classList.toggle("hidden");

}


function closeChatOptions() {

  document
    .getElementById("chatOptions")
    .classList.add("hidden");

}


function clearChat() {

  if (!currentChat) return;


  if (
    confirm(
      "Clear all messages?"
    )
  ) {

    localStorage.removeItem(
      getStorageKey()
    );

    loadMessages();

  }


  closeChatOptions();

}


function blockUser() {

  alert(
    `${currentChat} blocked 🚫`
  );

  closeChatOptions();

}


/* ================= VOICE RECORDING ================= */

async function toggleRecording() {

  const button =
    document.getElementById("voiceBtn");


  if (recording) {

    if (mediaRecorder) {
      mediaRecorder.stop();
    }

    recording = false;

    button.textContent = "🎤";

    return;

  }


  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {

    alert(
      "Voice recording is not supported in this browser."
    );

    return;

  }


  try {

    const stream =
      await navigator.mediaDevices
        .getUserMedia({
          audio: true
        });


    mediaRecorder =
      new MediaRecorder(stream);


    audioChunks = [];


    mediaRecorder.ondataavailable =
      event => {

        if (event.data.size > 0) {

          audioChunks.push(
            event.data
          );

        }

      };


    mediaRecorder.onstop =
      () => {

        const audioBlob =
          new Blob(
            audioChunks,
            {
              type: "audio/webm"
            }
          );


        const audioURL =
          URL.createObjectURL(
            audioBlob
          );


        const messages =
          getMessages();


        messages.push({

          sender: currentUser,

          content: audioURL,

          type: "audio",

          time: getTime(),

          reaction: ""

        });


        saveMessages(messages);

        renderAudioMessage(
          audioURL
        );


        stream
          .getTracks()
          .forEach(track =>
            track.stop()
          );

      };


    mediaRecorder.start();

    recording = true;

    button.textContent = "⏹️";


  } catch (error) {

    alert(
      "Microphone permission denied 🎤"
    );

  }

}


/* ================= AUDIO MESSAGE ================= */

function renderAudioMessage(url) {

  const box =
    document.getElementById("messages");


  const div =
    document.createElement("div");


  div.className =
    "message sent";


  div.innerHTML = `

    <audio controls src="${url}">
    </audio>

    <span class="message-time">
      ${getTime()} ✓✓
    </span>

  `;


  box.appendChild(div);

  scrollMessages();

}


/* ================= ESCAPE HTML ================= */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


/* ================= CLOSE POPUPS ================= */

document.addEventListener(
  "click",
  function(event) {

    const emoji =
      document.getElementById(
        "emojiPicker"
      );

    if (
      emoji &&
      !emoji.contains(event.target) &&
      !event.target.closest(".input-icon")
    ) {

      emoji.classList.add("hidden");

    }

  }
);
