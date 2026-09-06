let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Display products on homepage
const productContainer = document.getElementById("productContainer");

if (productContainer) {
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
}

// Add product to cart
function addToCart(product) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(product + " added to cart! 🛒");
}

// Show cart
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

// Add product to wishlist
function addToWishlist(product) {
    if (!wishlist.includes(product)) {
        wishlist.push(product);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert(product + " added to wishlist! ❤️");
    } else {
        alert(product + " is already in your wishlist ❤️");
    }
}
