// let responseFetchUser;
function showDialog(title, message) {
    alert(message);
    document.getElementById('loginMessage').innerText = message;
}
async function fetchDataUser(loginUsername, loginPassword){
    try{
        const fetchUrl = "http://localhost:3000/login"
        const response =await fetch(fetchUrl,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username":loginUsername,
                "password":loginPassword
            })
        })
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseFetchUser=await response.json()
        // console.log(responseFetchUser)
        return responseFetchUser
    }
    catch(err){
        showDialog("Error", "No registration data found. Please register first.");
        return;
    }
}
// const username="user"
// const password="user"
// fetchDataUser(username,password)

async function loginUser(){
    const loginUsername = document.getElementById('loginUsername').value;
    const loginPassword = document.getElementById('loginPassword').value;
    const response = await fetchDataUser(loginUsername,loginPassword)
    const {data} = response
    if (!response) {
        showDialog("Error", "No registration data found. Please register first.");
        return;
    }
    if (loginUsername === data.username && loginPassword === data.password) {
        showDialog("Success", "Login successful!");
        window.location.href = "home.html";
    } else {
        showDialog("Error", "Invalid username or password.");
    }
    console.log(data)
    localStorage.setItem('userData', JSON.stringify(data))
    window.location.href = "home.html";
}

// async function renderLoginUser(){
//     try{
        // const loginUsername = document.getElementById('loginUsername').value;
        // const loginPassword = document.getElementById('loginPassword').value;
//         const fetchData = await fetchDataUser(loginUsername, loginPassword);
//         if(fetchData){
//             console.log(fetchData)
//         }
//     }catch(err){
//         console.error(err)
//     }
// }




// function loginUser() {
//     const loginUsername = document.getElementById('loginUsername').value;
//     const loginPassword = document.getElementById('loginPassword').value;

//     const registrationDataString = localStorage.getItem('registrationData');
    // if (!registrationDataString) {
    //     showDialog("Error", "No registration data found. Please register first.");
    //     return;
    // }

//     const registrationData = JSON.parse(registrationDataString);

//     if (loginUsername === registrationData.username && loginPassword === registrationData.password) {
//         showDialog("Success", "Login successful!");
//         window.location.href = "home.html";
//     } else {
//         showDialog("Error", "Invalid username or password.");
//     }
// }

// function showDialog(title, message) {
//     alert(message);
//     document.getElementById('loginMessage').innerText = message;
// }