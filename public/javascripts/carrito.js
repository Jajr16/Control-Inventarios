var carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function addToCart(fecha, id, name, marca, cantidad, cart) {
    // Buscar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        // Si el producto ya existe, actualizar la cantidad
        existingItem.cantidad += cantidad;
    } else {
        // Si el producto no existe en el carrito, añadirlo
        cart.push({ fecha, id, name, marca, cantidad });
    }

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