async function postRegisData(name, email, username, password){
    try{
        const regisUrl = 'https://be2surabaya9-dot-befitoutfit.et.r.appspot.com/registrasi'
        const response =await fetch(regisUrl,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                email: email,
                name:name,
                username:username,
                password:password
            })
        })
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseFetchUser=await response.json()
        // console.log(responseFetchUser)
        return responseFetchUser
    }catch(err){
        console.error(err)
    }
}

function showDialog(title, message) {
    alert(message);
}

async function registerUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmpassword = document.getElementById('confirmpassword').value;

    if (confirmpassword !== password) {
        showDialog("Failed", "Password and Confirm Password do not match.");
    } else {
        if (name && email && password && username) {
            // saveDataLocally(name, email, username, password);
            const response=await postRegisData(name, email, username, password)
            if(!response){
                showDialog("Error", "Sorry, Network Error");                
            }
            showDialog("Successful", "Congrats! Your account has been created.");
            window.location.href = "login.html";
        } else {
            showDialog("Failed", "Please fill in all the required fields.");
        }
    }
}