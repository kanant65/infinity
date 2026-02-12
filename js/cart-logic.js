// Function to update the Data Layer with current cart state
function updateCartDataLayer() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    window.digitalData.cart = {
        itemCount: cart.length,
        cartTotal: total,
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price
        }))
    };
}

// Function to render items on the Cart Page
function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    cartContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <span>${item.name} - $${item.price}</span>
            <button class="btn" onclick="removeFromCart(${index})">Remove</button>
        </div>
    `).join('');
    
    document.getElementById('cart-total').innerText = cart.reduce((sum, i) => sum + i.price, 0);
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const removedItem = cart[index];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Adobe Analytics: Track Remove from Cart
    analytics.trackAction('scRemove', removedItem);
    
    renderCart();
    updateCartDataLayer();
}

// Initialize cart data on every page load
updateCartDataLayer();