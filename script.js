let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const productContainer = document.getElementById("productContainer");

function displayProducts(productList) {
    productContainer.innerHTML = "";

    if (productList.length === 0) {
        productContainer.innerHTML = "<p>No gifts found 😔</p>";
        return;
    }

    productList.forEach((product) => {
        productContainer.innerHTML += `
            <article>
                <div class="product-image">${product.emoji}</div>

                <h3>
                    <a href="product.html">${product.name}</a>
                </h3>

                <p>₹${product.price}</p>
                <p>${product.description}</p>
                <p><strong>Category:</strong> ${product.category}</p>

                <button onclick="addToCart('${product.name}')">
                    🛒 Add to Cart
                </button>

                <button onclick="addToWishlist('${product.name}')">
                    ❤️ Wishlist
                </button>
            </article>
        `;
    });
}

displayProducts(products);

function addToCart(product) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(product + " added to cart! 🛒");
}

function addToWishlist(product) {
    if (!wishlist.includes(product)) {
        wishlist.push(product);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert(product + " added to wishlist! ❤️");
    } else {
        alert(product + " is already in your wishlist ❤️");
    }
}

function searchProducts() {
    const searchText = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText)
    );

    displayProducts(filteredProducts);
}

function filterCategory(category) {
    if (category === "All") {
        displayProducts(products);
        return;
    }

    const filteredProducts = products.filter((product) =>
        product.category.toLowerCase() === category.toLowerCase()
    );

    displayProducts(filteredProducts);
}
