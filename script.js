
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

let allProducts = [];

const productContainer = document.getElementById("productContainer");

const defaultImage =
    "https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=600&q=80";

// LOAD PRODUCTS
async function loadProducts() {
    const { data: sellerProducts, error } = await supabaseClient
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        allProducts = products.map((product) => ({
            ...product,
            uniqueId: "default-" + product.id
        }));
    } else {
        const defaultProducts = products.map((product) => ({
            ...product,
            uniqueId: "default-" + product.id
        }));

        const uploadedProducts = (sellerProducts || []).map((product) => ({
            ...product,
            uniqueId: "seller-" + product.id
        }));

        allProducts = [...defaultProducts, ...uploadedProducts];
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
            defaultImage;

        productContainer.innerHTML += `
            <article>
                <img
                    src="${imageUrl}"
                    alt="${product.name}"
                    class="product-image"
                >

                <h3>
                    <a href="product.html?id=${product.uniqueId}">
                        ${product.emoji || "🎁"} ${product.name}
                    </a>
                </h3>

                <p class="price">₹${product.price}</p>

                <p>${product.description || ""}</p>

                <p>
                    <strong>Category:</strong>
                    ${product.category}
                <button onclick="addToCartByName('${product.name.replace(/'/g, "\\'")}')">
                    🛒 Add to Cart
                </button>

                <button onclick="addToWishlist('${product.uniqueId}')">
                    ❤️ Wishlist
                </button>
            </article>
        `;
    });
}

// FIND PRODUCT USING UNIQUE ID
function findProduct(uniqueId) {
    return allProducts.find(
        (product) => product.uniqueId === uniqueId
    );
}

// ADD TO CART
function addToCartByName(productName) {
    const product = allProducts.find(
        (item) => item.name === productName
    );

    if (!product) {
        alert("Product not found!");
        return;
    }

    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert(product.name + " added to cart! 🛒");
}
// ADD TO WISHLIST
function addToWishlist(uniqueId) {
    const product = findProduct(uniqueId);

    if (!product) {
        alert("Product not found!");
        return;
    }

    const alreadyExists = wishlist.some(
        (item) => item.uniqueId === uniqueId
    );

    if (!alreadyExists) {
        wishlist.push(product);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));

        alert(product.name + " added to wishlist! ❤️");
    } else {
        alert(product.name + " is already in your wishlist ❤️");
    }
}

// SEARCH
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

// CATEGORY FILTER
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

// START
loadProducts();
