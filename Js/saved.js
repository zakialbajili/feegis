const userData = JSON.parse(localStorage.getItem('userData'));
if(!userData){
    window.location.href="login.html"
}
if (userData && userData.username) {
    const userNameElement = document.getElementById('userName');
    userNameElement.textContent = userData.username;
}    
const savedRoomsContainer = document.getElementById('savedRooms');
let savedCartItems;
const fetchData = async () => {
    try {
        // ... (seperti kode yang Anda berikan)
        const getSaved = 'http://localhost:3000/saved';
        // Menggunakan Fetch API dengan async/await
        const response = await fetch(getSaved,{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${userData.token}`
            }
        });
        // Memeriksa apakah responsenya berhasil (status kode 200 OK)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Mengambil data dalam format JSON
        const {data} = await response.json();
        savedCartItems = {data}
    } catch (err) {
        // ...
        console.log(err)
    }
};
async function renderSaved(){
    if (savedCartItems && savedCartItems.data.length > 0) {
        savedRoomsContainer.innerHTML = savedCartItems.data.map((item) => `
            <div class="SavedRoomCard">
                <img class="SavedRoomImage" src="images/room1.png" alt="${item.name}">
                <div class="SavedRoomDetail">
                    <div class="SavedRoomName">${item.name}</div>
                    <div class="SavedRoomPrice">Price: Rp ${item.price}</div>
                    <div class="SavedMaxOccupancy">Quantity: ${item.quantity}</div>
                    <button class="BookNowButton" onclick="redirectToPayment('${item.id}', '${item.name}', ${item.price}, ${item.quantity})">Book Now</button>
                </div>
            </div>
        `).join('');
    } else {
        savedRoomsContainer.innerHTML = '<div class="NoSavedRooms" style="margin-left:45vw;">No saved rooms</div>';
    }   
}
async function getData() {
    await fetchData();
    await renderSaved();
}
getData();


function redirectToPayment(roomId) {
    
    // localStorage.setItem('cartItems',JSON.stringify(getIdRoom))
    window.location.href = `payment.html?roomId=${roomId}`;
}