
let cart = [];

const productContainer = document.getElementById("productContainer");

products.forEach((product) => {
    productContainer.innerHTML += `
        <article>
            <div class="product-image">${product.emoji}</div>
            <h3>
                <a href="product.html">${product.name}</a>
            </h3>
            <p>₹${product.price}</p>
            <p>${product.description}</p>

            <button onclick="addToCart('${product.name}')">
                Add to Cart 🛒
            </button>

            <button onclick="addToWishlist('${product.name}')">
                ❤️ Wishlist
            </button>
        </article>
    `;
});

function addToCart(product) {
    cart.push(product);
    alert(product + " added to cart! 🛒");
}

function showCart() {
    const cartDisplay = document.getElementById("cartDisplay");

    if (cart.length === 0) {
        cartDisplay.innerHTML = "<h2>Your cart is empty 🛒</h2>";
        return;
    }

    cartDisplay.innerHTML = "<h2>Your Cart 🛒</h2>";

    cart.forEach((product) => {
        cartDisplay.innerHTML += `<p>🎁 ${product}</p>`;
    });
}

let wishlist = [];

function addToWishlist(product) {
    wishlist.push(product);
    alert(product + " added to wishlist! ❤️");
}
