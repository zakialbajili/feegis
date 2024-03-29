const userData = JSON.parse(localStorage.getItem('userData'))
if(!userData){
    window.location.href="login.html"
}
var urlParams = new URLSearchParams(window.location.search);
var paramValue = urlParams.get('roomId');
let cartItems;
async function fetchData() {
    try {
        // ... (seperti kode yang Anda berikan)
        const getSaved = `https://be2surabaya9-dot-befitoutfit.et.r.appspot.com/payment.html?roomId=${paramValue.toString()}`;
        // Menggunakan Fetch API dengan async/await
        const response = await fetch(getSaved,{
            method:'GET',
            headers:{
                'Authorization': `Bearer ${userData.token}`
            }
        });
        // Memeriksa apakah responsenya berhasil (status kode 200 OK)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Mengambil data dalam format JSON
        const { data } = await response.json();
        cartItems = { data }
    } catch (err) {
        // ...
        console.log(err)
    }
};
async function renderPayment(price, discount, totalPrice) {
    try {
        const cartContents = document.getElementById('cartContents');
        const listItem = document.createElement('li');
        listItem.textContent = `${cartItems.data.name} - Rp ${cartItems.data.price} x ${cartItems.data.quantity}`;
        cartContents.appendChild(listItem);

        document.getElementById('totalPrice').textContent = price;
        document.getElementById('discount').textContent = discount;
        document.getElementById('finalTotal').textContent = totalPrice;

    }
    catch (err) {
        console.error(err)
    }
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
let responsePutSavedRoom;
const paymentRoom = async (id, totalPrice, discount, finalTotal, event) => {
    try {
        // ... (seperti kode yang Anda berikan)
        const putUrl = `https://be2surabaya9-dot-befitoutfit.et.r.appspot.com/savedPayment`;
        const postUrl = `https://be2surabaya9-dot-befitoutfit.et.r.appspot.com/payment`;
        const doPost = async () => {
            // Menggunakan Fetch API dengan async/await
            const response = await fetch(postUrl, {
                method: 'POST',
                headers: {
                    'Authorization':`Bearer ${userData.token}`,
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
        }
        const doPut =async ()=>{
            const response = await fetch(putUrl, {
                method: 'PUT',
                headers: {
                    'Authorization':`Bearer ${userData.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"id":id,"status":"verified"})
            })
            // Memeriksa apakah responsenya berhasil (status kode 200 OK)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Mengambil data dalam format JSON
            responsePutSavedRoom = await response.json();
            showDialog("Thank you for Your Booking!", "Your receipt will be sent to your email.");
            // window.location.href = "myBooking.html";
        }
        event.preventDefault();
        await doPost();
        await doPut();
        // window.location.href = 'roomsPayment.html';
    } catch (err) {
        // ...
        console.log(err)
    }
}
async function pagePayment() {
    try {
        await fetchData()
        const id =cartItems.data.id
        const price = cartItems.data.price
        const quantity = cartItems.data.quantity
        const totalPrice = price * quantity
        const discount = await calculateDiscount(totalPrice, quantity)
        const finalTotal = totalPrice - discount
        await renderPayment(totalPrice, discount, finalTotal)
        const payButton = document.getElementById('payButton');
        payButton.addEventListener('click', (event) => paymentRoom(id,totalPrice, discount, finalTotal, event));
        // await calculatePrice()
    } catch (err) {
        console.error(`error render payment:${err}`)
    }
}
pagePayment()

function showDialog(title, message) {
    const result = confirm(title + "\n" + message);
    if (result) {
        window.location.href = "saved.html";
    }
}

function buyItems() {
    showDialog("Thank you for Your Booking!", "Your receipt will be sent to your email.");
    window.location.href = "myBooking.html";
}
