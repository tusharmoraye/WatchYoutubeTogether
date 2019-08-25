let isLoggedIn = false;

function getLoginStatus() {
    return isLoggedIn;
}

function setLoginStatus(status) {
    isLoggedIn = status;
}

function userLoggedIn() {
    const loginBtn = document.querySelector("#logout-btn");
    loginBtn.style.display = 'block';
    const login = document.querySelector("#login");
    login.style.display = 'none';
    const watchRoom = document.querySelector("#watch-room");
    watchRoom.style.display = 'block';
}

function userLoggedOut() {
    const loginBtn = document.querySelector("#logout-btn");
    loginBtn.style.display = 'block';
}