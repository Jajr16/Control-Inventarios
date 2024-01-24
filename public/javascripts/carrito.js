var carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function addToCart(num, cart) {
        cart.push({num});

    localStorage.setItem('carrito', JSON.stringify(cart));
    // Actualizar el carrito
    updateCart(cart);
}

function removeFromCart(id, cart) {
    // Filtrar el carrito para excluir el artículo con el ID dado
    const updatedCart = cart.filter(item => item.id !== id);
    localStorage.setItem('carrito', JSON.stringify(updatedCart));
    window.location.reload()
}

function updateCart(cart) {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    // Total de productos
    let total = 0;
    // Manda los productos con su cantidad
    cartItems.innerHTML = "";
    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ${item.cantidad}`;
        cartItems.appendChild(li);
        // Con cada producto nuevo aumenta la cantidad total
        total += item.cantidad;
    });
    // Manda la cantidad total
    cartTotal.textContent = total;
}