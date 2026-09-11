
// Giftify Seller Dashboard
// Product management + Incoming Orders + Order Status + Seller Location

let sellerProducts = [];
let sellerId = null;


// ===============================
// CHECK SELLER LOGIN
// ===============================

async function checkSellerLogin() {

    const { data, error } =
        await supabaseClient.auth.getUser();

    if (error || !data.user) {

        alert("Please login as a seller first.");

        window.location.href = "seller-login.html";

        return;
    }

    sellerId = data.user.id;

    await loadSellerProducts(sellerId);

    await loadIncomingOrders(sellerId);
}


// ===============================
// LOAD SELLER PRODUCTS
// ===============================

async function loadSellerProducts(sellerId) {

    const { data, error } =
        await supabaseClient
            .from("products")
            .select("*")
            .eq("seller_id", sellerId)
            .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        alert(
            "Could not load your products: " +
            error.message
        );

        return;
    }

    sellerProducts = data || [];

    displaySellerProducts();
}


// ===============================
// ADD PRODUCT WITH PHOTO + LOCATION
// ===============================

async function addProduct() {

    const name =
        document.getElementById("giftName").value.trim();

    const price =
        document.getElementById("giftPrice").value;

    const category =
        document.getElementById("giftCategory").value.trim();

    const sellerLocation =
        document.getElementById("sellerLocation").value.trim();

    const description =
        document.getElementById("giftDescription").value.trim();

    const imageInput =
        document.getElementById("giftImage");

    const imageFile =
        imageInput ? imageInput.files[0] : null;


    // Check fields
    if (
        !name ||
        !price ||
        !category ||
        !sellerLocation ||
        !description ||
        !imageFile
    ) {

        alert(
            "Please fill all fields and select a photo!"
        );

        return;
    }


    // Check image size
    if (imageFile.size > 5 * 1024 * 1024) {

        alert(
            "Please select an image smaller than 5 MB."
        );

        return;
    }


    // Check login
    const { data: userData, error: userError } =
        await supabaseClient.auth.getUser();


    if (userError || !userData.user) {

        alert("Please login first.");

        window.location.href = "seller-login.html";

        return;
    }


    const user = userData.user;


    // Unique image filename
    const fileName =
        user.id +
        "/" +
        Date.now() +
        "-" +
        imageFile.name;


    // Upload image
    const { error: uploadError } =
        await supabaseClient
            .storage
            .from("product-images")
            .upload(
                fileName,
                imageFile
            );


    if (uploadError) {

        console.error(uploadError);

        alert(
            "Photo upload failed: " +
            uploadError.message
        );

        return;
    }


    // Get public image URL
    const { data: imageData } =
        supabaseClient
            .storage
            .from("product-images")
            .getPublicUrl(fileName);


    const imageUrl =
        imageData.publicUrl;


    // Product data
    const newProduct = {

        seller_id: user.id,

        name: name,

        price: Number(price),

        category: category,

        seller_location: sellerLocation,

        description: description,

        image_url: imageUrl
    };


    // Save product
    const { error: productError } =
        await supabaseClient
            .from("products")
            .insert(newProduct);


    if (productError) {

        console.error(productError);

        alert(
            "Product saving failed: " +
            productError.message
        );

        return;
    }


    alert(
        "Product and photo added successfully! 🎉"
    );


    // Clear form
    document.getElementById("giftName").value = "";

    document.getElementById("giftPrice").value = "";

    document.getElementById("giftCategory").value = "";

    document.getElementById("sellerLocation").value = "";

    document.getElementById("giftDescription").value = "";

    imageInput.value = "";


    // Reload products
    await loadSellerProducts(user.id);
}


// ===============================
// DISPLAY SELLER PRODUCTS
// ===============================

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

                    ${
                        product.image_url

                        ?

                        `<img
                            src="${product.image_url}"
                            alt="${product.name}"
                            style="
                                width:100%;
                                max-height:220px;
                                object-fit:cover;
                            "
                        >`

                        :

                        "🎁"
                    }

                </div>

                <h3>${product.name}</h3>

                <p>₹${product.price}</p>

                <p>
                    <strong>Category:</strong>
                    ${product.category}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${product.seller_location || "Not provided"}
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


// ===============================
// DELETE PRODUCT
// ===============================

async function deleteProduct(productId) {

    const { error } =
        await supabaseClient
            .from("products")
            .delete()
            .eq("id", productId);


    if (error) {

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

        await loadSellerProducts(
            userData.user.id
        );

        await loadIncomingOrders(
            userData.user.id
        );
    }
}


// ==================================================
// LOAD INCOMING ORDERS
// ==================================================

async function loadIncomingOrders(sellerId) {

    const ordersContainer =
        document.getElementById("sellerOrders");


    if (!ordersContainer) return;


    ordersContainer.innerHTML =
        "<p>Loading orders...</p>";


    // Get seller products
    const {
        data: productsData,
        error: productsError
    } =
        await supabaseClient
            .from("products")
            .select("id, name")
            .eq("seller_id", sellerId);


    if (productsError) {

        console.error(productsError);

        ordersContainer.innerHTML =
            "<p>Could not load your products.</p>";

        return;
    }


    if (
        !productsData ||
        productsData.length === 0
    ) {

        ordersContainer.innerHTML =
            "<p>No products yet, so there are no incoming orders.</p>";

        return;
    }


    const productIds =
        productsData.map(
            product => product.id
        );


    // Get orders containing seller products
    const {
        data: orderItems,
        error: itemsError
    } =
        await supabaseClient
            .from("order_items")
            .select("*")
            .in("product_id", productIds)
            .order("id", {
                ascending: false
            });


    if (itemsError) {

        console.error(itemsError);

        ordersContainer.innerHTML =
            "<p>Could not load incoming orders: " +
            itemsError.message +
            "</p>";

        return;
    }


    if (
        !orderItems ||
        orderItems.length === 0
    ) {

        ordersContainer.innerHTML =
            "<p>No incoming orders yet 📦</p>";

        return;
    }


    // Get unique order IDs
    const orderIds =
        [
            ...new Set(
                orderItems.map(
                    item => item.order_id
                )
            )
        ];


    // Get customer/order information
    const {
        data: orders,
        error: ordersError
    } =
        await supabaseClient
            .from("orders")
            .select("*")
            .in("id", orderIds)
            .order("created_at", {
                ascending: false
            });


    if (ordersError) {

        console.error(ordersError);

        ordersContainer.innerHTML =
            "<p>Could not load customer orders: " +
            ordersError.message +
            "</p>";

        return;
    }


    ordersContainer.innerHTML = "";


    orders.forEach(order => {

        const itemsForOrder =
            orderItems.filter(
                item =>
                    item.order_id === order.id
            );


        let itemsHTML = "";


        itemsForOrder.forEach(item => {

            itemsHTML += `

                <div style="
                    border-top:1px solid #ddd;
                    padding:10px 0;
                ">

                    <strong>
                        🎁 ${item.product_name}
                    </strong>

                    <p>
                        Quantity:
                        ${item.quantity || 1}
                    </p>

                    <p>
                        Price:
                        ₹${item.price}
                    </p>

                </div>

            `;
        });


        ordersContainer.innerHTML += `

            <article class="product-card">

                <h3>
                    📦 Order #${order.id}
                </h3>

                <p>
                    <strong>Customer:</strong>
                    ${order.customer_name}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${order.phone}
                </p>

                <p>
                    <strong>Delivery Address:</strong>
                    ${order.address}
                </p>

                ${itemsHTML}

                <p>
                    <strong>Order Total:</strong>
                    ₹${order.total}
                </p>

                <p>
                    <strong>Current Status:</strong>
                    ${order.status || "Pending"}
                </p>


                <label>
                    <strong>
                        Update Order Status:
                    </strong>
                </label>


                <select id="status-${order.id}">

                    <option value="Pending"
                        ${order.status === "Pending" ? "selected" : ""}>
                        Pending
                    </option>

                    <option value="Confirmed"
                        ${order.status === "Confirmed" ? "selected" : ""}>
                        Confirmed
                    </option>

                    <option value="Preparing"
                        ${order.status === "Preparing" ? "selected" : ""}>
                        Preparing
                    </option>

                    <option value="Out for Delivery"
                        ${order.status === "Out for Delivery" ? "selected" : ""}>
                        Out for Delivery
                    </option>

                    <option value="Delivered"
                        ${order.status === "Delivered" ? "selected" : ""}>
                        Delivered
                    </option>

                </select>


                <button
                    onclick="updateOrderStatus(${order.id})">

                    ✅ Update Status

                </button>

            </article>

        `;
    });
}


// ==================================================
// UPDATE ORDER STATUS
// ==================================================

async function updateOrderStatus(orderId) {

    const select =
        document.getElementById(
            "status-" + orderId
        );


    if (!select) {

        alert("Status selector not found.");

        return;
    }


    const newStatus =
        select.value;


    const { error } =
        await supabaseClient
            .from("orders")
            .update({
                status: newStatus
            })
            .eq("id", orderId);


    if (error) {

        console.error(error);

        alert(
            "Could not update order status: " +
            error.message
        );

        return;
    }


    alert(
        "Order #" +
        orderId +
        " status updated to " +
        newStatus +
        " ✅"
    );


    await loadIncomingOrders(sellerId);
}


// ===============================
// START DASHBOARD
// ===============================

checkSellerLogin();
