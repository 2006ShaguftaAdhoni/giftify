function addProduct() {
    const name = document.getElementById("giftName").value;
    const price = document.getElementById("giftPrice").value;
    const category = document.getElementById("giftCategory").value;
    const description = document.getElementById("giftDescription").value;

    if (!name || !price || !category || !description) {
        alert("Please fill all fields!");
        return;
    }

    const productList = document.getElementById("productList");

    productList.innerHTML += `
        <article>
            <div>🎁</div>
            <h3>${name}</h3>
            <p>₹${price}</p>
            <p>${category}</p>
            <p>${description}</p>
        </article>
    `;

    document.getElementById("giftName").value = "";
    document.getElementById("giftPrice").value = "";
    document.getElementById("giftCategory").value = "";
    document.getElementById("giftDescription").value = "";

    alert("Product added successfully! 🎉");
}
