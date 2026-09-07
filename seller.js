let sellerProducts =
JSON.parse(localStorage.getItem("sellerProducts")) || [];

// ADD PRODUCT
function addProduct() {

const name =
    document.getElementById("giftName").value.trim();

const price =
    document.getElementById("giftPrice").value;

const category =
    document.getElementById("giftCategory").value.trim();

const description =
    document.getElementById("giftDescription").value.trim();


if (!name || !price || !category || !description) {

    alert("Please fill all fields!");

    return;
}


const newProduct = {

    id: Date.now(),

    name: name,

    price: Number(price),

    category: category,

    emoji: "🎁",

    description: description

};


sellerProducts.push(newProduct);


localStorage.setItem(
    "sellerProducts",
    JSON.stringify(sellerProducts)
);


displaySellerProducts();


document.getElementById("giftName").value = "";
document.getElementById("giftPrice").value = "";
document.getElementById("giftCategory").value = "";
document.getElementById("giftDescription").value = "";


alert("Product added successfully! 🎉");

}

// DISPLAY SELLER PRODUCTS
function displaySellerProducts() {

const productList =
    document.getElementById("productList");


if (sellerProducts.length === 0) {

    productList.innerHTML =
        "<p>No products added yet.</p>";

    return;
}


productList.innerHTML = "";


sellerProducts.forEach((product, index) => {

    productList.innerHTML += `

        <article class="product-card">

            <div class="product-image">
                ${product.emoji}
            </div>

            <h3>${product.name}</h3>

            <p>₹${product.price}</p>

            <p>
                <strong>Category:</strong>
                ${product.category}
            </p>

            <p>${product.description}</p>

            <button onclick="deleteProduct(${index})">
                🗑️ Delete
            </button>

        </article>

    `;
});

}

// DELETE PRODUCT
function deleteProduct(index) {

sellerProducts.splice(index, 1);

localStorage.setItem(
    "sellerProducts",
    JSON.stringify(sellerProducts)
);

displaySellerProducts();

}

// LOAD PRODUCTS
displaySellerProducts();
