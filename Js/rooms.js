const userData = JSON.parse(localStorage.getItem('userData'));
if(!userData){
    window.location.href="login.html"
}
const token = userData.token
if (userData && userData.username) {
    const userNameElement = document.getElementById('userName');
    userNameElement.textContent = userData.username;
}

const categorySelect = document.getElementById("categorySelect")
const productCategory = document.getElementById('Rooms');

const cartItems = document.getElementById('cartItems');
const cart = [];

productCategory.addEventListener('click', bookRoom);
let result;
const fetchData = async (token) => {
    try {
        // ... (seperti kode yang Anda berikan)
        const apiUrl = 'https://be2surabaya9-dot-befitoutfit.et.r.appspot.com/rooms';
        // Menggunakan Fetch API dengan async/await
        const response = await fetch(apiUrl,{
            method:'GET',
            headers:{
                'Authorization':'Bearer '+token
            }

        });
        // Memeriksa apakah responsenya berhasil (status kode 200 OK)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Mengambil data dalam format JSON
        result = await response.json();
    } catch (err) {
        // ...
        console.log(err)
    }
};

async function displayRooms() {
    const { data } = result
    const selectedCategory = categorySelect.value;
    const roomsInCategory = data[selectedCategory];
    if (roomsInCategory) {
        productCategory.innerHTML = roomsInCategory
            .map((room) => `
                            <div class="RoomCard">
                                <img class="RoomImage" src="Images/room1.png" alt="room1">
                                <div class="RoomDetail">
                                    <div class="RoomName">${room.name}</div>
                                    <div class="RoomPrice">Price: Rp ${room.price}</div>
                                    <div class="MaxOccupancy">Max Occupancy: ${room.maxOccupancy} person(s)</div>
                                    <div class="Description">${room.description.replace(/\n/g, '<br>')}</div>
                                    <button data-id="${room.id}" data-name="${room.name}" data-price="${room.price}" class="addCart">Add to Cart</button>
                                </div>
                            </div>
                            `
            )
            .join('');
    }
}
async function getData() {
    await fetchData(token);
    await displayRooms
}
getData();
categorySelect.addEventListener('change', displayRooms);

async function formatCurrency(amount) {
    const price = amount.toFixed(0);
    return price;
}

async function bookRoom(e) {
    if (e.target.classList.contains('addCart')) {
        const idRooms = parseInt(e.target.getAttribute('data-id'));
        const name = e.target.getAttribute('data-name');
        const price = parseFloat(e.target.getAttribute('data-price'));
        const item = { idRooms, name, price, quantity: 1,idUser:userData.id };
        const existingItem = cart.find((cartItem) => cartItem.idRooms === idRooms);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(item);
        }
        await renderCart();
    }
}

async function renderCart() {
    cartItems.innerHTML = cart
        .map((item) => `<li>${item.name} - Rp ${item.price} x ${item.quantity} = Rp ${item.price * item.quantity}</li>`)
        .join('');

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    document.getElementById('totalPrice').textContent = await formatCurrency(totalPrice);
    await displayRooms()
}

async function showDialog(title, message) {
    const result = confirm(title + "\n" + message);
    // if (result) {
    //     window.location.href = "home.html";
    // }
}
let responseSavedRoom;
const savedRoom = async () => {
    try {
        // ... (seperti kode yang Anda berikan)
        const postUrl = `https://be2surabaya9-dot-befitoutfit.et.r.appspot.com/saved`;
        // Menggunakan Fetch API dengan async/await
        const response = await fetch(postUrl, {
            method: 'POST',
            headers: {
                'Authorization':'Bearer '+token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cart)
        })
        // Memeriksa apakah responsenya berhasil (status kode 200 OK)
        if (!response.ok) {

            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Mengambil data dalam format JSON
        responseSavedRoom = await response.json();
        showDialog("Booking Rooms", "Are you sure to booking this room?")
        localStorage.setItem('cartItems', JSON.stringify(cart));
        window.location.href = 'saved.html';
    } catch (err) {
        // ...
        console.log(err)
    }
}
const bookButton = document.getElementById('bookButton');
bookButton.addEventListener('click', savedRoom);