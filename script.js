let cart = [];

const cartButtons = document.querySelectorAll("article button");

cartButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const product = button.parentElement.querySelector("h3").textContent;

        cart.push(product);

        alert(product + " added to cart! 🛒");
    });
});
