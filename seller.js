
// Giftify Seller Dashboard
// Supabase database + product image upload

let sellerProducts = [];

// Check seller login
async function checkSellerLogin() {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
        alert("Please login as a seller first.");
        window.location.href = "seller-login.html";
        return;
    }

    loadSellerProducts(data.user.id);
}

// Load this seller's products
async function loadSellerProducts(sellerId) {
    const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        alert("Could not load your products: " + error.message);
        return;
    }

    sellerProducts = data || [];
    displaySellerProducts();
}

// Add product with photo
async function addProduct() {
    const name = document.getElementById("giftName").value.trim();
    const price = document.getElementById("giftPrice").value;
    const category = document.getElementById("giftCategory").value.trim();
    const description = document.getElementById("giftDescription").value.trim();
    const imageInput = document.getElementById("giftImage");
    const imageFile = imageInput ? imageInput.files[0] : null;

    if (!name || !price || !category || !description || !imageFile) {
        alert("Please fill all fields and select a photo!");
        return;
    }

    if (imageFile.size > 5 * 1024 * 1024) {
        alert("Please select an image smaller than 5 MB.");
        return;
    }

    const { data: userData, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !userData.user) {
        alert("Please login first.");
        window.location.href = "seller-login.html";
        return;
    }

    const user = userData.user;

    // Create a unique image filename
    const fileName =
        user.id + "/" + Date.now() + "-" + imageFile.name;

    // Upload image to Storage
    const { error: uploadError } = await supabaseClient
        .storage
        .from("product-images")
        .upload(fileName, imageFile);

    if (uploadError) {
        console.error(uploadError);
        alert("Photo upload failed: " + uploadError.message);
        return;
    }

    // Get public image URL
    const { data: imageData } =
        supabaseClient
            .storage
            .from("product-images")
            .getPublicUrl(fileName);

    const imageUrl = imageData.publicUrl;

    console.log("Uploaded image URL:", imageUrl);

    // Save product details and image URL
    const newProduct = {
        seller_id: user.id,
        name: name,
        price: Number(price),
        category: category,
        description: description,
        image_url: imageUrl
    };

    const { error: productError } =
        await supabaseClient
            .from("products")
            .insert(newProduct);

    if (productError) {
        console.error(productError);
        alert("Product saving failed: " + productError.message);
        return;
    }

    alert("Product and photo added successfully! 🎉");

    document.getElementById("giftName").value = "";
    document.getElementById("giftPrice").value = "";
    document.getElementById("giftCategory").value = "";
    document.getElementById("giftDescription").value = "";
    imageInput.value = "";

    loadSellerProducts(user.id);
}

// Display seller products
function displaySellerProducts() {
    const productList = document.getElementById("productList");

    if (!productList) return;

    if (sellerProducts.length === 0) {
        productList.innerHTML = "<p>No products added yet.</p>";
        return;
    }

    productList.innerHTML = "";

    sellerProducts.forEach((product) => {
        productList.innerHTML += `
            <article class="product-card">

                <div class="product-image">
                    ${
                        product.image_url
                        ? `<img src="${product.image_url}"
                                alt="${product.name}"
                                style="width:100%; max-height:220px; object-fit:cover;">`
                        : "🎁"
                    }
                </div>

                <h3>${product.name}</h3>

                <p>₹${product.price}</p>

                <p>
                    <strong>Category:</strong>
                    ${product.category}
                </p>

                <p>${product.description}</p>

                <button onclick="deleteProduct(${product.id})">
                    🗑️ Delete
                </button>

            </article>
        `;
    });
}

// Delete product
async function deleteProduct(productId) {
    const { error } = await supabaseClient
        .from("products")
        .delete()
        .eq("id", productId);

    if (error) {
        alert("Could not delete product: " + error.message);
        return;
    }

    alert("Product deleted.");

    const { data: userData } =
        await supabaseClient.auth.getUser();

    if (userData.user) {
        loadSellerProducts(userData.user.id);
    }
}

// Start dashboard
checkSellerLogin();
