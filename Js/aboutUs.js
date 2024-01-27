const userData = JSON.parse(localStorage.getItem('userData'));
if (userData && userData.username) {
    const userNameElement = document.getElementById('userName');
    userNameElement.textContent = userData.username;
}