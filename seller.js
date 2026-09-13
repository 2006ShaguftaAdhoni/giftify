// Giftify Seller Dashboard
// Product Management + Business Name + Location + Orders + Status


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
            .order("created_at", {
                ascending: false
            });


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
// ADD PRODUCT
// ===============================

async function addProduct() {

    // Business name
    const businessName =
        document.getElementById("businessName")
        .value
        .trim();


    // Gift name
    const name =
        document.getElementById("giftName")
        .value
        .trim();


    // Price
    const price =
        document.getElementById("giftPrice")
        .value;


    // Category
    const category =
        document.getElementById("giftCategory")
        .value
        .trim();


    // Seller location
    const sellerLocation =
        document.getElementById("sellerLocation")
        .value
        .trim();


    // Description
    const description =
        document.getElementById("giftDescription")
        .value
        .trim();


    // Image
    const imageInput =
        document.getElementById("giftImage");


    const imageFile =
        imageInput
            ? imageInput.files[0]
            : null;


    // ===============================
    // VALIDATION
    // ===============================

    if (
        !businessName ||
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


    // Image size limit
    if (
        imageFile.size >
        5 * 1024 * 1024
    ) {

        alert(
            "Please select an image smaller than 5 MB."
        );

        return;
    }


    // ===============================
    // CHECK LOGIN
    // ===============================

    const {
        data: userData,
        error: userError
    } =
        await supabaseClient.auth.getUser();


    if (
        userError ||
        !userData.user
    ) {

        alert("Please login first.");

        window.location.href =
            "seller-login.html";

        return;
    }


    const user =
        userData.user;


    // ===============================
    // IMAGE FILE NAME
    // ===============================

    const fileName =
        user.id +
        "/" +
        Date.now() +
        "-" +
        imageFile.name;


    // ===============================
    // UPLOAD IMAGE
    // ===============================

    const {
        error: uploadError
    } =
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


    // ===============================
    // GET IMAGE URL
    // ===============================

    const {
        data: imageData
    } =
        supabaseClient
            .storage
            .from("product-images")
            .getPublicUrl(
                fileName
            );


    const imageUrl =
        imageData.publicUrl;


    // ===============================
    // CREATE PRODUCT
    // ===============================

    const newProduct = {

        seller_id: user.id,

        business_name: businessName,

        name: name,

        price: Number(price),

        category: category,

        seller_location: sellerLocation,

        description: description,

        image_url: imageUrl
    };


    // ===============================
    // SAVE PRODUCT
    // ===============================

    const {
        error: productError
    } =
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


    // ===============================
    // SUCCESS
    // ===============================

    alert(
        "Product and business details added successfully! 🎉"
    );


    // ===============================
    // CLEAR FORM
    // ===============================

    document.getElementById(
        "businessName"
    ).value = "";


    document.getElementById(
       
