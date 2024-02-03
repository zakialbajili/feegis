const userData = JSON.parse(localStorage.getItem('userData'))
if(!userData){
    window.location.href="login.html"
}
const cartItems = JSON.parse(localStorage.getItem('cartItems'));
console.log(cartItems)
let totalPrice;
let quantity;
let discount;
let paymentTotal;
let banyakPrice = [];
let banyakQuantity = [];
async function getTotalPrice(lengthElement) {
    let seluruhPrice = 0;
    for (i = 0; i < lengthElement; i++) {
        seluruhPrice += banyakPrice[i]
    }
    return seluruhPrice
}
async function getQuantity(lengthElement) {
    let seluruhQuantity = 0;
    for (i = 0; i < lengthElement; i++) {
        seluruhQuantity += banyakQuantity[i]
    }
    return seluruhQuantity
}
async function calculateDiscount(totalPrice, numRooms) {
    if (numRooms >= 5 && numRooms <= 10) {
        const discount = totalPrice * 0.05
        return discount;
    } else if (numRooms > 10) {
        const discount = totalPrice * 0.15
        return discount;
    }
    return 0;
}

let responseSavedRoom;
const paymentRoom = async (totalPrice, discount, finalTotal, event) => {
    try {
        // ... (seperti kode yang Anda berikan)
        const postPaymentUrl = `https://be2surabaya9-dot-befitoutfit.et.r.appspot.com/payment`;
        const doPostPayment = async () => {
            // Menggunakan Fetch API dengan async/await
            const response = await fetch(postPaymentUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "totalPrice": totalPrice,
                    "discount": discount,
                    "finalTotal": finalTotal,
                })
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
            window.location.href = "myBooking.html";
        }
        event.preventDefault();
        await doPostPayment();
        // window.location.href = 'roomsPayment.html';
    } catch (err) {
        // ...
        console.log(err)
    }
}
async function renderRoomPayment() {
    try {
        if (cartItems && cartItems.length > 0) {
            const cartContents = document.getElementById('cartContents');
            cartItems.forEach((item) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${item.name} - Rp ${item.price} x ${item.quantity}`;
                cartContents.appendChild(listItem);
                const result = item.price * item.quantity
                banyakPrice.push(result)
                banyakQuantity.push(item.quantity)
            });
            totalPrice = await getTotalPrice(banyakPrice.length)
            quantity = await getQuantity(banyakQuantity.length)
            discount = await calculateDiscount(totalPrice, quantity)
            paymentTotal = totalPrice - discount
            document.getElementById('totalPrice').textContent = totalPrice;
            document.getElementById('discount').textContent = discount;
            document.getElementById('finalTotal').textContent = paymentTotal;
            const payButton = document.getElementById('payButton');
            payButton.addEventListener('click', (event)=>paymentRoom(totalPrice, discount, paymentTotal, event));
        }
    }
    catch (err) {
        console.error(err)
    }
}
renderRoomPayment()

function showDialog(title, message) {
    const result = confirm(title + "\n" + message);
    if (result) {
        window.location.href = "home.html";
    }
}

function buyItems() {
    // localStorage.setItem('bookedItems', JSON.stringify(cartItems));

    showDialog("Thank you for Your Booking!", "Your receipt will be sent to your email.");

    console.log("Items purchased:", cartItems);

    window.location.href = "myBooking.html";
}