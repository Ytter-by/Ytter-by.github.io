let cart = [];

function showDetails(title, description, price, imageUrl) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-description').innerText = description;
    document.getElementById('modal-price').innerText = price;
    document.getElementById('modal-image').src = imageUrl;
    document.getElementById('details-modal').style.display = 'block';
}

function closeDetails() {
    document.getElementById('details-modal').style.display = 'none';
    document.getElementById('quantity').value = 1; // Reset the quantity to 1
}

function addToCart() {
    let quantity = document.getElementById('quantity').value;
    let title = document.getElementById('modal-title').innerText;
    let price = document.getElementById('modal-price').innerText;
    let imageUrl = document.getElementById('modal-image').src;

    // Проверяем, есть ли уже такой товар в корзине
    let existingItem = cart.find(item => item.title === title);
    if (existingItem) {
        existingItem.quantity += parseInt(quantity);
    } else {
        cart.push({
            title: title,
            quantity: parseInt(quantity),
            price: parseInt(price),
            imageUrl: imageUrl // Сохраняем imageUrl в объект корзины
        });
    }

    closeDetails();
}

function openCart() {
    let cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    let totalPrice = 0;
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        let cartItem = document.createElement('div');
        cartItem.classList.add('cart-item'); // Добавляем класс для стилизации

        // Создаем изображение товара в корзине
        let itemImage = document.createElement('img');
        itemImage.src = item.imageUrl;
        itemImage.alt = item.title;
        itemImage.style.maxWidth = '50px'; // Можно задать другие стили для изображения
        itemImage.style.borderRadius = '5px';
        itemImage.style.marginRight = '10px';

        // Создаем блок информации о товаре
        let itemInfo = document.createElement('div');
        itemInfo.classList.add('cart-item-info'); // Добавляем класс для стилизации

        // Создаем заголовок (название товара)
        let itemTitle = document.createElement('h4');
        itemTitle.innerText = item.title;

        // Создаем количество товара и кнопки управления количеством
        let itemQuantity = document.createElement('span');
        itemQuantity.innerText = ` x ${item.quantity}`;

        let removeOneButton = document.createElement('button');
        removeOneButton.innerText = 'Убрать 1';
        removeOneButton.addEventListener('click', function() {
            removeOneFromCart(item.title);
        });
        removeOneButton.classList.add('cart-button'); // Добавление класса "cart-button"
        document.body.appendChild(removeOneButton);

        let removeAllButton = document.createElement('button');
        removeAllButton.innerText = 'Убрать все';
        removeAllButton.addEventListener('click', function() {
            removeAllFromCart(item.title);
        });
        removeAllButton.classList.add('cart-button'); // Добавление класса "cart-button"
        document.body.appendChild(removeAllButton);

        // Собираем все элементы вместе
        itemInfo.appendChild(itemTitle);
        itemInfo.appendChild(itemQuantity);
        itemInfo.appendChild(removeOneButton);
        itemInfo.appendChild(removeAllButton);

        cartItem.appendChild(itemImage);
        cartItem.appendChild(itemInfo);

        cartItems.appendChild(cartItem);
    });

    document.getElementById('total-price').innerText = totalPrice;
    document.getElementById('cart-modal').style.display = "block";
}

function closeCart() {
    document.getElementById('cart-modal').style.display = "none";
}

function proceedToCheckout() {
    window.location.href = 'checkout.html';
}

function decreaseQuantity() {
    let quantityInput = document.getElementById('quantity');
    if (quantityInput.value > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
}

function increaseQuantity() {
    let quantityInput = document.getElementById('quantity');
    quantityInput.value = parseInt(quantityInput.value) + 1;
}

document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', function() {
        const title = this.querySelector('h4').innerText;
        const description = this.getAttribute('data-description');
        const price = this.querySelector('span').innerText.replace(' ₽', '');
        const imageUrl = this.querySelector('img').src;
        showDetails(title, description, price, imageUrl);
    });
});

document.querySelectorAll('.main-nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Добавление обработчика для открытия корзины
document.getElementById('cart-link').addEventListener('click', function(e) {
    e.preventDefault();
    openCart();
});

function removeFromCart(title) {
    cart = cart.filter(item => item.title !== title);
    openCart(); // Обновляем отображение корзины
}

function removeOneFromCart(title) {
    let item = cart.find(item => item.title === title);
    if (item) {
        item.quantity -= 1;
        if (item.quantity === 0) {
            cart = cart.filter(item => item.title !== title);
        }
    }
    openCart(); // Обновляем отображение корзины
}

function removeAllFromCart(title) {
    cart = cart.filter(item => item.title !== title);
    openCart(); // Обновляем отображение корзины
}

function proceedToCheckout() {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}
