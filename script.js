let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const productContainer = document.getElementById("productContainer");

// DISPLAY PRODUCTS
function displayProducts(productList) {
    productContainer.innerHTML = "";

    if (productList.length === 0) {
        productContainer.innerHTML = "<p>No gifts found 😔</p>";
        return;
    }

    productList.forEach((product) => {
        productContainer.innerHTML += `
            <article class="product-card">

                <div class="product-image">
                    ${product.emoji}
                </div>

                <h3>
                    ${product.name}
                </h3>

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

// SHOW ALL PRODUCTS WHEN PAGE LOADS
displayProducts(products);


// ADD TO CART
function addToCart(productName) {

    const product = products.find(
        (item) => item.name === productName
    );

    if (!product) {
        alert("Product not found!");
        return;
    }

    cart.push(product);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert(product.name + " added to cart! 🛒");
}


// ADD TO WISHLIST
function addToWishlist(productName) {

    const product = products.find(
        (item) => item.name === productName
    );

    if (!product) {
        alert("Product not found!");
        return;
    }

    const alreadyExists = wishlist.some(
        (item) => item.name === productName
    );

    if (!alreadyExists) {

        wishlist.push(product);

        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );

        alert(product.name + " added to wishlist! ❤️");

    } else {

        alert(product.name + " is already in your wishlist ❤️");

    }
}


// SEARCH PRODUCTS
function searchProducts() {

    const searchInput = document.getElementById("searchInput");

    if (!searchInput) return;

    const searchText = searchInput.value.toLowerCase().trim();

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText) ||
        product.description.toLowerCase().includes(searchText)
    );

    displayProducts(filteredProducts);
}


// FILTER BY CATEGORY
function filterCategory(category) {

    if (category === "All") {
        displayProducts(products);
        return;
    }

    const filteredProducts = products.filter(
        (product) =>
            product.category.toLowerCase() ===
            category.toLowerCase()
    );

    displayProducts(filteredProducts);
}
