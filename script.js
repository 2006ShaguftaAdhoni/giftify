let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const productContainer = document.getElementById("productContainer");

// GET SELLER PRODUCTS
const sellerProducts =
JSON.parse(localStorage.getItem("sellerProducts")) || [];

// COMBINE ORIGINAL + SELLER PRODUCTS
const allProducts = [
...products,
...sellerProducts
];

// DISPLAY PRODUCTS
function displayProducts(productList) {

if (!productContainer) return;

productContainer.innerHTML = "";

if (productList.length === 0) {

    productContainer.innerHTML =
        "<p>No gifts found 😔</p>";

    return;
}


productList.forEach((product) => {

    productContainer.innerHTML += `

        <article class="product-card">

            <div class="product-image">
                ${product.emoji}
            </div>

            <h3>
    <a href="product.html?id=${product.id}">
        ${product.name}
    </a>
</h3>

            <p class="price">
                ₹${product.price}
            </p>

            <p>
                ${product.description}
            </p>

            <p>
                <strong>Category:</strong>
                ${product.category}
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

// SHOW PRODUCTS
displayProducts(allProducts);

// ADD TO CART
function addToCart(productName) {

const product =
    allProducts.find(
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


alert(
    product.name +
    " added to cart! 🛒"
);

}

// ADD TO WISHLIST
function addToWishlist(productName) {

const product =
    allProducts.find(
        (item) => item.name === productName
    );


if (!product) {

    alert("Product not found!");

    return;
}


const alreadyExists =
    wishlist.some(
        (item) =>
            item.name === productName
    );


if (!alreadyExists) {

    wishlist.push(product);


    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );


    alert(
        product.name +
        " added to wishlist! ❤️"
    );

} else {

    alert(
        product.name +
        " is already in your wishlist ❤️"
    );
}

}

// SEARCH
function searchProducts() {

const searchInput =
    document.getElementById("searchInput");


if (!searchInput) return;


const searchText =
    searchInput.value
    .toLowerCase()
    .trim();


const filteredProducts =
    allProducts.filter((product) =>

        product.name
            .toLowerCase()
            .includes(searchText)

        ||

        product.category
            .toLowerCase()
            .includes(searchText)

        ||

        product.description
            .toLowerCase()
            .includes(searchText)
    );


displayProducts(filteredProducts);

}

// CATEGORY FILTER
function filterCategory(category) {

if (category === "All") {

    displayProducts(allProducts);

    return;
}


const filteredProducts =
    allProducts.filter(
        (product) =>
            product.category
                .toLowerCase() ===
            category.toLowerCase()
    );


displayProducts(filteredProducts);

}
