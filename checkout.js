document.addEventListener('DOMContentLoaded', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    let totalPrice = 0;
    const orderItemsContainer = document.getElementById('order-items');

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;

        const orderItem = document.createElement('div');
        orderItem.classList.add('order-item');

        const itemImage = document.createElement('img');
        itemImage.src = item.imageUrl;
        itemImage.alt = item.title;

        const itemInfo = document.createElement('div');
        itemInfo.classList.add('order-item-info');

        const itemTitle = document.createElement('h4');
        itemTitle.innerText = item.title;

        const itemQuantity = document.createElement('span');
        itemQuantity.innerText = `Количество: ${item.quantity}`;

        itemInfo.appendChild(itemTitle);
        itemInfo.appendChild(itemQuantity);

        orderItem.appendChild(itemImage);
        orderItem.appendChild(itemInfo);

        orderItemsContainer.appendChild(orderItem);
    });

    document.getElementById('order-total-price').innerText = totalPrice;
});

// Initialize Leaflet map
var map = L.map('map').setView([48.708, 44.514], 13); // Default view coordinates and zoom level

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Initialize an empty layer group to store the markers
var markers = L.layerGroup().addTo(map);

// Add a marker when user clicks on the map
map.on('click', function(e) {
    var latlng = e.latlng;

    // Clear previous markers
    markers.clearLayers();

    // Add a marker at the clicked position
    L.marker(latlng).addTo(markers);

    // Save marker coordinates to localStorage
    localStorage.setItem('markerLat', latlng.lat);
    localStorage.setItem('markerLng', latlng.lng);
});

async function getAddressFromCoordinates(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Извлекаем необходимые данные для простого адреса
        let address = '';

        if (data.address) {
            if (data.address.road) {
                address += data.address.road;
            }
            if (data.address.house_number) {
                address += " " + data.address.house_number;
            }
            if (data.address.neighbourhood) {
                address += ', ' + data.address.neighbourhood;
            }
            if (data.address.city) {
                address += ', ' + data.address.city;
            }
            if (data.address.postcode) {
                address += ', ' + data.address.postcode;
            }
            
        }

        if (!address) {
            address = 'Адрес не найден';
        }

        return address;
    } catch (error) {
        console.error('Ошибка получения адреса:', error);
        return 'Адрес не найден';
    }
}

// Form submission logic
document.getElementById('order-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Function to get order summary
    function getOrderSummary(cart, totalPrice, markerAddress, name, phone) {
        let summary = '';

        summary += `Чек<br>`

        // Add customer info
        summary += `Имя: ${name}<br>`;
        summary += `Телефон: ${phone}<br><br>`;

        summary += `Заказ<br>`

        // Iterate through cart items
        cart.forEach(item => {
            summary += `${item.title} - Количество: ${item.quantity}<br>`;
        });

        // Add total price
        summary += `<br>Общая сумма заказа: ${totalPrice} ₽<br>`;

        // Add marker address
        summary += `Адрес доставки: ${markerAddress}<br>`;

        return summary;
    }

    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Calculate total price
    let totalPrice = 0;
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
    });

    // Get marker coordinates
    const markerLat = parseFloat(localStorage.getItem('markerLat'));
    const markerLng = parseFloat(localStorage.getItem('markerLng'));

    // Get address from coordinates
    const markerAddress = await getAddressFromCoordinates(markerLat, markerLng);

    // Get form inputs
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    // Get order summary
    const orderSummary = getOrderSummary(cart, totalPrice, markerAddress, name, phone);

    // Display order summary in modal
    const orderSummaryContainer = document.getElementById('order-summary');
    orderSummaryContainer.innerHTML = orderSummary;

    // Show the modal
    const modal = document.getElementById('modal');
    modal.style.display = 'block';

    // Close the modal when user clicks on the close button (×)
    const closeModal = document.getElementsByClassName('close')[0];
    closeModal.onclick = function() {
        modal.style.display = 'none';
    };
});


    


    