let socket;
const dashboard = async () => {
    try {
        const token = localStorage.getItem('token');
        let response = await axios.get('http://localhost:4000/user/dashboard', { headers: { 'Authorization': token } });
        console.log(response);
        socket = io('http://localhost:7000/user-namespace', { auth: { token1: response.data.response.id } });
        document.querySelector('.welcome').textContent = `Welcome ${response.data.response.name}`;
        localStorage.setItem('senderId', response.data.response.id);
        for (let i = 0; i < response.data.users.length; i++){
           if (response.data.users[i].name != response.data.response.name) {
                if (response.data.users[i].isOnline == true) {
                    document.querySelector(".list-group").innerHTML += `
                        <li class="list-group-item list-group-item-dark user-list" id="${response.data.users[i].id}-status" onclick="getChatBox(${response.data.users[i].id})">${response.data.users[i].name}
                            <sub class="online-status">Online</sub>
                        </li>
                    `;
                } else {
                    document.querySelector(".list-group").innerHTML += `
                        <li class="list-group-item list-group-item-dark user-list" id="${response.data.users[i].id}-status" onclick="getChatBox(${response.data.users[i].id})">${response.data.users[i].name}
                            <sub class="offline-status">Offline</sub>
                        </li>
                    `;
                }
           }
        }
        socket.emit('getOnlineUser', (data) => {
            document.querySelector('#'+data.id+'-status').textContent = 'Online';
            document.querySelector('#'+data.id+'-status').classList.remove('offline-status');
            document.querySelector('#'+data.id+'-status').classList.add('online-status');
        })
        socket.emit('getOfflineUser', (data) => {
            document.querySelector('#'+data.id+'-status').textContent = 'Offline';
            document.querySelector('#'+data.id+'-status').classList.remove('online-status');
            document.querySelector('#'+data.id+'-status').classList.add('offline-status');
        })
    } catch (error) {
        console.log(error);
    }
}

dashboard();

const getChatBox = async (id) => {
    try {
        localStorage.setItem('receiverId', id);
        document.querySelector('.chat-section').style.display = 'block';
        socket.emit('existsChat', { senderId: localStorage.getItem('senderId'), receiverId: localStorage.getItem('receiverId') });

        socket.on('loadChats', (data) => {
            document.querySelector('.chat-container').innerHTML = '';
            let chats = data.chats;
            let html = '';
            for (let i = 0; i < chats.length; i++){
                let addClass = '';
                if (chats[i].senderId == localStorage.getItem('senderId')) {
                    addClass = 'my-chat';
                } else {
                    addClass = 'other-chat';
                }

                html += `
                    <div class="${addClass}" id="${chats[i].id}">
                        ${chats[i].message} <button onclick="deleteChat(${chats[i].id})">Delete</button>
                    </div>
                `;
            }
            document.querySelector('.chat-container').innerHTML = html;
            scrollChat();
        })
    } catch (error) {
        console.log(error);
    }
}

const validateForm = () => {
    let message = document.getElementById('message').value;

    if (message == '') {
        alert('Type Some Message');
        return false;
    }
    return true;
}

const sendMessage = async () => {
    try {
        const token = localStorage.getItem('token');
        const receiverId = localStorage.getItem('receiverId');
        if (validateForm() == true) {
            let message = document.getElementById('message').value;
            let response = await axios.post('http://localhost:4000/user/saveChat', {
                message: message,
                receiverId: receiverId,
            }, { headers: { 'Authorization': token } });
            console.log(response);
            document.getElementById('message').value = '';
            let html = `
                <div class="my-chat" id="${response.data.chat.id}">
                    <h5>You-</h5>
                    ${response.data.chat.message} <button onclick="deleteChat(${response.data.chat.id})">Delete</button>
                </div>
            `;
            document.querySelector('.chat-container').innerHTML += html;
            socket.emit('newChat', response.data.chat, response.data.name);
            scrollChat();
        }

        socket.on('loadNewChat', (data, name) => {
            if (localStorage.getItem('senderId') == data.receiverId && localStorage.getItem('receiverId') == data.senderId) {
                let html = `
                    <div class="other-chat" id="${data.id}">
                        <h5>${name}-</h5>
                        ${data.message} <button onclick="deleteChat(${data.id})">Delete</button>
                    </div>
                `
            }
            document.querySelector(".chat-container").innerHTML = html;
            scrollChat();
        })
    } catch (error) {
        console.log(error);
    }
}

const scrollChat = () => {
    document.querySelector('.chat-container').scroll({
        top: document.querySelector('.chat-container').scrollHeight,
        behavior: 'smooth',
    })
}

const deleteChat = async (id) => {
    try {
        const token = localStorage.getItem('token');
        let ans = confirm('Are you sure you want to delete this message?');
        if (ans == true) {
            let response = await axios.delete(`http://localhost:4000/user/deleteChat/${id}`, { headers: { 'Authorization': token } });
            console.log(response);
            socket.emit('chatDeleted', id);
            socket.on('chatMessageDeleted', (id) => {
                document.getElementById(id).remove();
            })
        }
    } catch (error) {
        console.log(error);
    }
}