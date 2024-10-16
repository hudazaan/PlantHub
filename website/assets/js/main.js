//cart slider
let ctIcon = document.querySelector('#c-icon');
let ct = document.querySelector('.ct');
let closeIcon = document.querySelector('#close-ct');

ctIcon.addEventListener('click', function() {
    ct.classList.add('active');
});
closeIcon.addEventListener('click', function() {

    ct.classList.remove('active');
});


//toggle cart 
function toggleCt() {
    ct.classList.toggle('actve'); 
}
ctIcon.addEventListener('click', toggleCt);
closeIcon.addEventListener('click', toggleCt); 


//Cart Actions: 
document.addEventListener("DOMContentLoaded", function() {
    console.log("Document is ready");

loadCartItems();

document.querySelectorAll(".add-to-cart").forEach(function(button) {
    button.addEventListener("click", addToCart);
});

document.querySelectorAll(".ct-remove").forEach(function(button) {
    button.addEventListener("click", removeFromCart);
});

document.querySelectorAll(".ct-quantity").forEach(function(input) {
    input.addEventListener("change", updateQuantity);
}); 
});

//add item to cart when "cart icon"is clicked
function addToCart(event) {
    event.preventDefault();
    var product = event.target.closest(".prod");
    var title = product.querySelector(".des h5").innerText;
    var price = product.querySelector(".des h4").innerText;
    var productImg = product.querySelector(".pro-img").src;

    // Check if the item is already in the cart
    if (isItemInCart(title)) {
        alert("You have already added this item to the cart");
        return;
    }

    addProductToCart(title, price, productImg);
    updateTotalPrice();
    saveCartItems(); 
    updateCartIcon();
}

//remove item from cart when the trash icon is clicked
function removeFromCart(event) {
    event.target.parentElement.remove();
    updateTotalPrice();
    saveCartItems();
    updateCartIcon(); 
}

//update quantity when the quantity input is changed
function updateQuantity(event) {
    quantityChanged(event.target);
    updateTotalPrice();
    saveCartItems();
    updateCartIcon();
}

//handle invalid quantity input
function quantityChanged(input) {
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
}

//add a product to the cart
function addProductToCart(title, price, productImg) {
    var cartContent = document.querySelector(".ct-content");

    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("ct-box");
    var cartBoxContent = `
        <img src="${productImg}" alt="" class="ct-img">
        <div class="detail-box">
          <div class="ct-product-title">${title}</div>
          <div class="ct-price">${price}</div> 
          <input type="number" value="1" class="ct-quantity">
        </div>
        <i class="ri-delete-bin-fill ct-remove"></i>`;
    cartShopBox.innerHTML = cartBoxContent;

    cartContent.appendChild(cartShopBox);

    cartShopBox.querySelector(".ct-remove").addEventListener("click", removeFromCart);
    cartShopBox.querySelector(".ct-quantity").addEventListener("change", updateQuantity);

    document.getElementById("bag").classList.add("show"); 
}

//check if an item is already in the cart
function isItemInCart(title) {
    var cartItems = document.querySelectorAll(".ct-product-title");
    for (var i = 0; i < cartItems.length; i++) {
        if (cartItems[i].innerText === title) {
            return true;
        }
    }
    return false;
}

//update the total price of items in the cart
function updateTotalPrice() {
    var cartBoxes = document.querySelectorAll(".ct-box");
    var total = 0;
    cartBoxes.forEach(function(cartBox) {
        var priceElement = cartBox.querySelector(".ct-price");
        var quantityElement = cartBox.querySelector(".ct-quantity");
        var price = parseFloat(priceElement.innerText.replace("₹", ""));
        var quantity = quantityElement.value;
        total += price * quantity;
    });
    total = Math.round(total * 100) / 100;
    document.querySelector(".total-price").innerText = "₹" + total.toFixed(2);
    localStorage.setItem("cartTotal", total);
}

//save cart items to local storage
function saveCartItems() {
    var cartBoxes = document.querySelectorAll(".ct-box");
    var cartItems = [];

    cartBoxes.forEach(function(cartBox) {
        var titleElement = cartBox.querySelector(".ct-product-title");
        var priceElement = cartBox.querySelector(".ct-price");
        var quantityElement = cartBox.querySelector(".ct-quantity");
        var productImg = cartBox.querySelector(".ct-img").src;

        var item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value,
            productImg: productImg,
        };
        cartItems.push(item);
    });

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

//load cart items from local storage
function loadCartItems() {
    var cartItems = localStorage.getItem("cartItems");
    if (cartItems) {
        cartItems = JSON.parse(cartItems);

        cartItems.forEach(function(item) {
            addProductToCart(item.title, item.price, item.productImg);

            var cartBoxes = document.querySelectorAll(".ct-box");  
            var cartBox = cartBoxes[cartBoxes.length - 1];
            var quantityElement = cartBox.querySelector(".ct-quantity");
            quantityElement.value = item.quantity; 
        });
    }

    var cartTotal = localStorage.getItem("cartTotal"); 
    if (cartTotal) {
        document.querySelector(".total-price").innerText = "₹" + cartTotal;
    } 

//retrieve cart quantity from local storage
   var cartQuantity = localStorage.getItem("cartQuantity");
   if (cartQuantity) {
     var cartIcon = document.querySelector("#c-icon");
     cartIcon.setAttribute("data-quantity", cartQuantity);
   }
}

//update the cart icon quantity
function updateCartIcon() {
    var cartBoxes = document.getElementsByClassName("ct-box");
    var quantity = 0;

    for(var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var quantityElement = cartBox.getElementsByClassName("ct-quantity")[0];
        quantity += parseInt(quantityElement.value);
    }

    var cartIcon = document.querySelector("#c-icon");
    cartIcon.setAttribute("data-quantity", quantity); 

     localStorage.setItem("cartQuantity", quantity);
}

//clear cart if successful payment 
function clearCart() { 
    var cartContent = document.getElementsByClassName("ct-content")[0];
    cartContent.innerHTML = "";
    
    //update the quantity number to 0
    updateTotalPrice(); 
    localStorage.removeItem("cartItems"); 
    var cartIcon = document.querySelector("#c-icon");
    cartIcon.setAttribute("data-quantity", 0);

    //store the cart quantity to local storage
    localStorage.setItem("cartQuantity", 0);
}

