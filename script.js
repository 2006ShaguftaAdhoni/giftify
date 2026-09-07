let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const sellerProducts =
    JSON.parse(localStorage.getItem("sellerProducts")) || [];

const allProducts = [...products, ...sellerProducts];

const productContainer = document.getElementById("productContainer");

function displayProducts(productList) {
    if (!productContainer) return;

    productContainer.innerHTML = "";

    if (productList.length === 0) {
        productContainer.innerHTML = "<p>No gifts found 😔</p>";
        return;
    }

    productList.forEach((product) => {
        productContainer.innerHTML += `
            <article>
                <img 
                    src="${product.image || 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=600&q=80'}"
                    alt="${product.name}"
                    class="product-image"
                >

                <h3>${product.emoji || "🎁"} ${product.name}</h3>

                <p class="price">₹${product.price}</p>

                <p>${product.description}</p>

                <p>
                    <strong>Category:</strong> ${product.category}
                </p>

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

displayProducts(allProducts);

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
    const searchText =
        document.getElementById("searchInput").value.toLowerCase();

    const filteredProducts = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText)
    );

    displayProducts(filteredProducts);
}

function filterCategory(category) {
    if (category === "All") {
        displayProducts(allProducts);
        return;
    }

    const filteredProducts = allProducts.filter((product) =>
        product.category.toLowerCase() === category.toLowerCase()
    );

    displayProducts(filteredProducts);
}
