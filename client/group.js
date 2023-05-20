const dashboard = async () => {
    try {
        const token = localStorage.getItem('token');
        let response = await axios.get('http://localhost:4000/user/dashboard', { headers: { 'Authorization': token } });
        console.log(response);
        let html = "";
        for (let i = 0; i < response.data.users.length; i++){
            if (response.data.users[i].name != response.data.response.name) { 
                html += "<tr>";
                html += `<td><input type='checkbox' name='check' onclick="checkedBox(this)" class='check' id='check' value="${response.data.users[i].name}" /></td>`;
                html += "<td>" + response.data.users[i].name + "</td>";
                html += "</tr>";
            }
        }
        document.querySelector('#crudTable tbody').innerHTML = html;
        document.querySelector('.welcome').textContent = `Welcome ${response.data.response.name}`;
    } catch (error) {
        console.log(error);
    }
}

dashboard();

const createGroup = async () => {
    try {
        const token = localStorage.getItem('token');
        let name = document.getElementById('name').value;
        let response = await axios.post('http://localhost:4000/user/createGroup', { groupName: name }, { headers: { 'Authorization': token } });
        console.log(response);
        document.getElementById('name').value = '';
        $('#createGroupModal').modal('hide');
        location.href = 'group.html';
    } catch (error) {
        console.log(error);
    }
}

const getGroup = async () => {
    try {
        const token = localStorage.getItem('token');
        let response = await axios.get('http://localhost:4000/user/getGroup', { headers: { 'Authorization': token } });
        console.log(response);
        if (response.data.response.length > 0) {
            document.querySelector('.list-group').style.display = 'block';
            document.querySelector('.no-group').style.display = 'none';
            document.querySelector('.start-head').style.display = 'block';
        } else {
            document.querySelector(".list-group").style.display = "none";
            document.querySelector(".no-group").style.display = "block";
            document.querySelector('.start-head').style.display = 'none';
        }
        for (let i = 0; i < response.data.response.length; i++){
            document.querySelector(".list-group").innerHTML += `
                <li class="list-group-item list-group-item-dark" onclick="openChatContainer(${response.data.response[i].id})">${response.data.response[i].groupName} <button class="btn btn-primary add-member" data-toggle="modal" data-target="#addMemberModal">Add Members</button><button class="btn btn-secondary ml-2" data-toggle="modal" data-target="#memberModal" onclick="getMember(${response.data.response[i].id})">Members</button></li>
            `;
        }
    } catch (error) {
        console.log(error);
    }
}

getGroup();

const openChatContainer = (groupId) => {
    try {
        console.log(`My Group Id=${groupId}`);
        localStorage.setItem('groupId', groupId);
        document.querySelector('.start-head').style.display = 'none';
        document.querySelector('.chat-section').style.display = 'block';
    } catch (error) {
        console.log(error);
    }
}

let nameList = document.getElementById('nameList');
let text = '<span>you have selected:</span>';
let nameArray = [];
let checkboxs = document.querySelectorAll('.check');
const checkedBox = (ele) => {
    if (ele.checked == true) {
        nameArray.push(ele.value);
        nameList.innerHTML = text + nameArray.join('/');
    } else {
        nameArray = nameArray.filter(e => e != ele.value);
        nameList.innerHTML = text + nameArray.join('/');
    }
}

const addMember = async () => {
    try {
        if (nameArray.length == 0) {
            alert('Please Select Atleast 1 Member');
        } else {
            const token = localStorage.getItem('token');
            let groupId = localStorage.getItem('groupId');
            let response = await axios.post('http://localhost:4000/user/addMember', { nameArray: nameArray, groupId: groupId }, { headers: { 'Authorization': token } });
            console.log(response);
            $('#addMemberModal').modal('hide');
            document.getElementById('check').checked = false;
            document.getElementById('nameList').innerHTML = '';
            nameArray.length = 0;
        }
    } catch (error) {
        console.log(error);
    }
}

const getMember = async (groupId) => {
    try {
        const token = localStorage.getItem('token');
        let response = await axios.get('http://localhost:4000/user/getMember', { headers: { 'Authorization': token,'groupId':groupId } });
        console.log('My Group Members=', response);
        document.querySelector(".groupMember").innerHTML = `
            <li class="list-group-item list-group-item-dark">${response.data.name}(You)<h6>Admin</h6></li>
        `;
        for (let i = 0; i < response.data.members.length; i++){
            document.querySelector(".groupMember").innerHTML += `
                <li class="list-group-item list-group-item-dark">${response.data.members[i].memberName} <button class="btn btn-secondary">Make Admin</button><button class="btn btn-secondary ml-2">Remove</button></li>
            `;
        }
    } catch (error) {
        console.log(error);
    }
}