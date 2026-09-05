let cart = [];

const cartButtons = document.querySelectorAll("article button");

cartButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const product = button.parentElement.querySelector("h3").textContent;

        cart.push(product);

        alert(product + " added to cart! 🛒");
    });
});
function showCart() {
    const cartDisplay = document.getElementById("cartDisplay");

    if (cart.length === 0) {
        cartDisplay.innerHTML = "<h2>Your cart is empty 🛒</h2>";
        return;
    }

    cartDisplay.innerHTML = "<h2>Your Cart 🛒</h2>";

    cart.forEach((product) => {
        cartDisplay.innerHTML += "<p>🎁 " + product + "</p>";
    });
}
