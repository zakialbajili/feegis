const userData = JSON.parse(localStorage.getItem('userData'));
if (userData && userData.username) {
    const userNameElement = document.getElementById('userName');
    userNameElement.textContent = userData.username;
}

let bookedItems;
const fetchData = async () => {
    try {
        // ... (seperti kode yang Anda berikan)
        const getBooking = 'http://localhost:3000/myBooking';
        // Menggunakan Fetch API dengan async/await
        const response = await fetch(getBooking);
        // Memeriksa apakah responsenya berhasil (status kode 200 OK)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Mengambil data dalam format JSON
        const {data} = await response.json();
        bookedItems = {data}
    } catch (err) {
        // ...
        console.log(err)
    }
};
async function renderBookingHistory(){
    if (bookedItems && bookedItems.data.length > 0) {
        const bookingHistory = document.getElementById('bookingHistory');
        bookedItems.data.forEach((item) => {
            const bookingCard = document.createElement('li');
            bookingCard.classList.add('BookingCard');
    
            bookingCard.innerHTML = `
                <img class="RoomImage" src="images/room1.png" alt="${item.name}">
                <div class="RoomDetail">
                    <div class="RoomName">${item.name}</div>
                    <div class="RoomPrice">Price: Rp ${item.price}</div>
                    <div class="MaxOccupancy">Quantity: ${item.quantity}</div>
                    <button data-id="${item.id}" class="CancelButton">Cancel</button>
                </div>
            `;
    
            bookingHistory.appendChild(bookingCard);
        });
    }
}
let responseSavedRoom
async function actionCancelBooking(e, event) {
    try{
        if (e.target.classList.contains('CancelButton')) {
            const id = e.target.getAttribute('data-id');
                // window.location.reload();
            const idCancel = {"id":id}
            const cancelUrl= "http://localhost:3000/cancelBooking"
            const doCancelBooking = async () => {
                // Menggunakan Fetch API dengan async/await
                const response = await fetch(cancelUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({idCancel})
                })
                // Memeriksa apakah responsenya berhasil (status kode 200 OK)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // Mengambil data dalam format JSON
                responseSavedRoom = await response.json();
                console.log(responseSavedRoom);
                showDialog("Thank you for Your Booking!", "Your receipt will be sent to your email.");
                console.log("Items purchased:", cartItems);
                // window.location.href = "myBooking.html";
            }
        event.preventDefault();
        await doCancelBooking();
        }
        // window.location.href = 'roomsPayment.html';
    } catch (err) {
        // ...
        console.log(err)
    }
}
async function myBookingPage(){
    await fetchData()
    console.log(bookedItems.data)
    await renderBookingHistory()
    const bookingHistory = document.getElementById('bookingHistory')
    bookingHistory.addEventListener('click',(event)=> actionCancelBooking(event));
}
myBookingPage()