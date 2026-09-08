/* =========================
   LOGIN
========================= */

const APP_PASSWORD = "chithu2007";

let enteredPassword = "";
let currentChat = "";

const loginPage = document.getElementById("loginPage");
const chatPage = document.getElementById("chatPage");
const passwordDisplay = document.getElementById("passwordDisplay");
const loginMessage = document.getElementById("loginMessage");


function pressNumber(number) {

    if (enteredPassword.length >= 20) {
        return;
    }

    enteredPassword += number;

    updatePasswordDisplay();
}


function updatePasswordDisplay() {

    if (enteredPassword.length === 0) {

        passwordDisplay.textContent = "Enter password";

        passwordDisplay.parentElement.classList.remove("active");

        return;
    }

    passwordDisplay.textContent =
        "•".repeat(enteredPassword.length);

    passwordDisplay.parentElement.classList.add("active");
}


function clearPassword() {

    enteredPassword = "";

    updatePasswordDisplay();
}


function backspace() {

    enteredPassword =
        enteredPassword.slice(0, -1);

    updatePasswordDisplay();
}


function login() {

    const username =
        document.getElementById("username").value.trim();

    if (username === "") {

        loginMessage.textContent =
            "Please enter your username 💗";

        return;
    }


    if (enteredPassword !== APP_PASSWORD) {

        loginMessage.textContent =
            "Wrong password 🥺 Try again!";

        enteredPassword = "";

        updatePasswordDisplay();

        return;
    }


    localStorage.setItem(
        "chatUsername",
        username
    );


    document.getElementById(
        "currentUsername"
    ).textContent = username;


    loginPage.style.display = "none";

    chatPage.style.display = "flex";

    loginMessage.textContent = "";
}


/* ENTER KEY */

document
    .getElementById("username")
    .addEventListener("keydown", function(event) {

        if (event.key === "Enter") {
            login();
        }

    });


/* =========================
   CHAT
========================= */

function openChat(name) {

    currentChat = name;

    document.getElementById(
        "chatName"
    ).textContent = name;


    document.getElementById(
        "chatStatus"
    ).textContent =
        name === "Kavin"
            ? "offline"
            : "online";


    chatPage.classList.add("chat-open");

    loadMessages();
}


function closeChat() {

    chatPage.classList.remove("chat-open");

    currentChat = "";
}


function handleEnter(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendMessage();
    }
}


/* SEND MESSAGE */

function sendMessage() {

    const input =
        document.getElementById("messageInput");

    const text = input.value.trim();

    if (!text || !currentChat) {
        return;
    }


    const key =
        "messages_" + currentChat;


    let messages =
        JSON.parse(
            localStorage.getItem(key) || "[]"
        );


    messages.push({

        text: text,

        mine: true,

        time: getTime()

    });


    localStorage.setItem(
        key,
        JSON.stringify(messages)
    );


    input.value = "";

    loadMessages();

    fakeReply();
}


/* LOAD MESSAGES */

function loadMessages() {

    const container =
        document.getElementById("messages");

    if (!currentChat) {
        return;
    }


    const key =
        "messages_" + currentChat;


    const messages =
        JSON.parse(
            localStorage.getItem(key) || "[]"
        );


    container.innerHTML = "";


    messages.forEach((message, index) => {

        const div =
            document.createElement("div");


        div.className =
            "message " +
            (message.mine ? "mine" : "");


        div.innerHTML =
            escapeHTML(message.text) +
            `<span class="message-time">
                ${message.time}
            </span>`;


        div.onclick = function() {

            if (message.mine) {

                if (
                    confirm(
                        "Delete this message?"
                    )
                ) {

                    messages.splice(index, 1);

                    localStorage.setItem(
                        key,
                        JSON.stringify(messages)
                    );

                    loadMessages();
                }

            }

        };


        container.appendChild(div);

    });


    container.scrollTop =
        container.scrollHeight;
}


/* FAKE REPLY */

function fakeReply() {

    if (currentChat === "Friends Group") {
        return;
    }


    const chatAtSend = currentChat;


    document.getElementById(
        "typing"
    ).style.display = "block";


    setTimeout(function() {

        if (currentChat !== chatAtSend) {
            return;
        }


        const replies = [

            "Hii 💗",

            "How are you? 🧸",

            "Aww cutee ✨",

            "11:11 make a wish 🌸",

            "Okayyy 💕",

            "Hehe 😍"

        ];


        const reply =
            replies[
                Math.floor(
                    Math.random() *
                    replies.length
                )
            ];


        const key =
            "messages_" + chatAtSend;


        let messages =
            JSON.parse(
                localStorage.getItem(key) || "[]"
            );


        messages.push({

            text: reply,

            mine: false,

            time: getTime()

        });


        localStorage.setItem(
            key,
            JSON.stringify(messages)
        );


        document.getElementById(
            "typing"
        ).style.display = "none";


        loadMessages();

    }, 1200);
}


/* TIME */

function getTime() {

    return new Date().toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


/* HTML SECURITY */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =========================
   IMAGE
========================= */

function sendImage(event) {

    const file =
        event.target.files[0];

    if (!file || !currentChat) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload = function(e) {

        const container =
            document.getElementById("messages");


        const img =
            document.createElement("img");


        img.src = e.target.result;

        img.style.maxWidth = "250px";

        img.style.borderRadius = "15px";


        const div =
            document.createElement("div");


        div.className =
            "message mine";


        div.appendChild(img);


        container.appendChild(div);

        container.scrollTop =
            container.scrollHeight;
    };


    reader.readAsDataURL(file);

    event.target.value = "";
}


/* =========================
   TYPING
========================= */

let typingTimer;


function showTyping() {

    clearTimeout(typingTimer);


    document.getElementById(
        "typing"
    ).style.display = "block";


    typingTimer = setTimeout(function() {

        document.getElementById(
            "typing"
        ).style.display = "none";

    }, 1000);
}


/* =========================
   SEARCH
========================= */

function searchUsers() {

    const search =
        document
            .getElementById("searchUser")
            .value
            .toLowerCase();


    document
        .querySelectorAll(".user")
        .forEach(function(user) {

            user.style.display =
                user.textContent
                    .toLowerCase()
                    .includes(search)
                        ? "flex"
                        : "none";

        });
}


/* =========================
   OPTIONS
========================= */

function toggleOptions() {

    const menu =
        document.getElementById("optionsMenu");


    menu.style.display =
        menu.style.display === "block"
            ? "none"
            : "block";
}


function editProfile() {

    const newName =
        prompt(
            "Enter your new username:"
        );


    if (!newName) {
        return;
    }


    document.getElementById(
        "currentUsername"
    ).textContent = newName;


    localStorage.setItem(
        "chatUsername",
        newName
    );


    document.getElementById(
        "optionsMenu"
    ).style.display = "none";
}


function createGroup() {

    const group =
        prompt(
            "Enter group name:"
        );


    if (group) {

        alert(
            "Group '" +
            group +
            "' created 💗"
        );

    }
}


function clearChat() {

    if (!currentChat) {
        return;
    }


    localStorage.removeItem(
        "messages_" + currentChat
    );


    loadMessages();
}


function toggleDarkMode() {

    document.body.classList.toggle(
        "dark"
    );
}


/* =========================
   VOICE
========================= */

function startVoice() {

    if (!navigator.mediaDevices) {

        alert(
            "Voice recording is not supported."
        );

        return;
    }


    navigator.mediaDevices
        .getUserMedia({
            audio: true
        })
        .then(function(stream) {

            const recorder =
                new MediaRecorder(stream);


            let chunks = [];


            recorder.ondataavailable =
                function(e) {

                    chunks.push(e.data);

                };


            recorder.onstop =
                function() {

                    stream
                        .getTracks()
                        .forEach(
                            track =>
                                track.stop()
                        );

                    alert(
                        "Voice recorded 🎙️"
                    );

                };


            recorder.start();


            setTimeout(function() {

                recorder.stop();

            }, 3000);

        })
        .catch(function() {

            alert(
                "Microphone permission denied."
            );

        });
}


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem(
        "chatUsername"
    );


    chatPage.style.display = "none";

    loginPage.style.display = "flex";


    enteredPassword = "";

    document.getElementById(
        "username"
    ).value = "";


    updatePasswordDisplay();


    document.getElementById(
        "optionsMenu"
    ).style.display = "none";
}


/* AUTO LOGIN */

window.addEventListener(
    "load",
    function() {

        const savedUser =
            localStorage.getItem(
                "chatUsername"
            );


        if (savedUser) {

            document.getElementById(
                "currentUsername"
            ).textContent =
                savedUser;

            loginPage.style.display =
                "none";

            chatPage.style.display =
                "flex";
        }

    }
);
