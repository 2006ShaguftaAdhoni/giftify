
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

let allProducts = [];

const productContainer = document.getElementById("productContainer");

// LOAD PRODUCTS FROM SUPABASE
async function loadProducts() {
    const { data: sellerProducts, error } = await supabaseClient
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error loading seller products:", error);

        // Show default products if Supabase fails
        allProducts = [...products];
    } else {
        allProducts = [...products, ...(sellerProducts || [])];
    }

    displayProducts(allProducts);
}

// DISPLAY PRODUCTS
function displayProducts(productList) {
    if (!productContainer) return;

    productContainer.innerHTML = "";

    if (productList.length === 0) {
        productContainer.innerHTML = "<p>No gifts found 😔</p>";
        return;
    }

    productList.forEach((product) => {
        const imageUrl =
            product.image_url ||
            product.image ||
            "https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=600&q=80";

        productContainer.innerHTML += `
            <article>
                <img
                    src="${imageUrl}"
                    alt="${product.name}"
                    class="product-image"
                >

                <h3>
    <a href="product.html?id=${product.id}">
        ${product.emoji || "🎁"} ${product.name}
    </a>
</h3>

                <p class="price">₹${product.price}</p>

                <p>${product.description}</p>

                <p>
                    <strong>Category:</strong> ${product.category}
                </p>

                <button onclick="addToCart(${product.id})">
                    🛒 Add to Cart
                </button>

                <button onclick="addToWishlist(${product.id})">
                    ❤️ Wishlist
                </button>
            </article>
        `;
    });
}

// ADD PRODUCT TO CART
function addToCart(productId) {
    const product = allProducts.find(
        (item) => String(item.id) === String(productId)
    );

    if (!product) {
        alert("Product not found!");
        return;
    }

    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert(product.name + " added to cart! 🛒");
}

// ADD PRODUCT TO WISHLIST
function addToWishlist(productId) {
    const product = allProducts.find(
        (item) => String(item.id) === String(productId)
    );

    if (!product) {
        alert("Product not found!");
        return;
    }

    const alreadyExists = wishlist.some(
        (item) => String(item.id) === String(productId)
    );

    if (!alreadyExists) {
        wishlist.push(product);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));

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

    const filteredProducts = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText) ||
        (product.description || "").toLowerCase().includes(searchText)
    );

    displayProducts(filteredProducts);
}

// FILTER BY CATEGORY
function filterCategory(category) {
    if (category === "All") {
        displayProducts(allProducts);
        return;
    }

    const filteredProducts = allProducts.filter(
        (product) =>
            product.category.toLowerCase() === category.toLowerCase()
    );

    displayProducts(filteredProducts);
}

// START HOMEPAGE
loadProducts();
