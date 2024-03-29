const userData = JSON.parse(localStorage.getItem('registrationData'));
if (userData && userData.name) {
    const userNameElement = document.getElementById('userName');
    userNameElement.textContent = userData.username;
}
document.addEventListener('DOMContentLoaded', function() {
    const savedCartItems = JSON.parse(localStorage.getItem('savedItems'));

    const savedRoomsContainer = document.getElementById('savedRooms');

    if (savedCartItems && savedCartItems.length > 0) {
        savedRoomsContainer.innerHTML = savedCartItems.map((item) => `
            <div class="SavedRoomCard">
                <img class="SavedRoomImage" src="images/${item.id}.png" alt="${item.name}">
                <div class="SavedRoomDetail">
                    <div class="SavedRoomName">${item.name}</div>
                    <div class="SavedRoomPrice">Price: Rp ${item.price}</div>
                    <div class="SavedMaxOccupancy">Quantity: ${item.quantity}</div>
                    <button class="BookNowButton" onclick="redirectToPayment('${item.id}', '${item.name}', ${item.price}, ${item.quantity})">Book Now</button>
                </div>
            </div>
        `).join('');
    } else {
        savedRoomsContainer.innerHTML = '<div class="NoSavedRooms">No saved rooms</div>';
    }
});

function redirectToPayment(roomId) {
    window.location.href = 'payment.html';
    console.log(`Redirect to payment for room with ID: ${roomId}`);
}