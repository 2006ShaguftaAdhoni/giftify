
// Giftify Seller Dashboard
// Connected to Supabase

let sellerProducts = [];

// Check if seller is logged in
async function checkSellerLogin() {

    const { data, error } =
        await supabaseClient.auth.getUser();

    if (error || !data.user) {
        alert("Please login as a seller first.");
        window.location.href = "seller-login.html";
        return;
    }

    loadSellerProducts(data.user.id);
}


// Load products belonging to this seller
async function loadSellerProducts(sellerId) {

    const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        alert("Could not load your products.");
        return;
    }

    sellerProducts = data || [];

    displaySellerProducts();
}


// Add product
async function addProduct() {

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

    const { data: userData } =
        await supabaseClient.auth.getUser();

    const user = userData.user;

    if (!user) {
        alert("Please login first.");
        window.location.href = "seller-login.html";
        return;
    }

    const newProduct = {

        seller_id: user.id,

        name: name,

        price: Number(price),

        category: category,

        description: description,

        image_url: null
    };


    const { error } =
        await supabaseClient
            .from("products")
            .insert(newProduct);

    if (error) {

        console.error(error);

        alert(
            "Could not add product: " +
            error.message
        );

        return;
    }


    alert("Product added successfully! 🎉");


    document.getElementById("giftName").value = "";

    document.getElementById("giftPrice").value = "";

    document.getElementById("giftCategory").value = "";

    document.getElementById("giftDescription").value = "";


    loadSellerProducts(user.id);
}


// Display seller products
function displaySellerProducts() {

    const productList =
        document.getElementById("productList");

    if (!productList) return;


    if (sellerProducts.length === 0) {

        productList.innerHTML =
            "<p>No products added yet.</p>";

        return;
    }


    productList.innerHTML = "";


    sellerProducts.forEach((product) => {

        productList.innerHTML += `

            <article class="product-card">

                <div class="product-image">
                    🎁
                </div>

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ₹${product.price}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${product.category}
                </p>

                <p>
                    ${product.description}
                </p>

                <button
                    onclick="deleteProduct(${product.id})">
                    🗑️ Delete
                </button>

            </article>

        `;

    });
}


// Delete product
async function deleteProduct(productId) {

    const { error } =
        await supabaseClient
            .from("products")
            .delete()
            .eq("id", productId);

    if (error) {

        console.error(error);

        alert(
            "Could not delete product: " +
            error.message
        );

        return;
    }


    alert("Product deleted.");


    const { data: userData } =
        await supabaseClient.auth.getUser();

    if (userData.user) {

        loadSellerProducts(
            userData.user.id
        );

    }
}


// Start seller dashboard
checkSellerLogin();
