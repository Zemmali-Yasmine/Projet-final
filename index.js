import { products } from './products.js';

// Slider functionality
let currentSlide = 0;
const slides = document.querySelector('.slides');
const totalSlides = document.querySelectorAll('.slide').length;

function updateSlider() {
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
}

document.querySelector('.next').addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
});

document.querySelector('.prev').addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
});

// Auto-slide
setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}, 5000);

// New Collection Products
function displayNewCollection() {
    const newProducts = products.filter(product => product.isNew).slice(0, 9);
    const productsGrid = document.querySelector('.products-grid');
    
    productsGrid.innerHTML = newProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price} DA</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `).join('');
}


// Gallery 
document.addEventListener("DOMContentLoaded", () => {
    const imageLayers = document.querySelectorAll(".image-layer");

    
    const imageSources = Array.from({ length: imageLayers.length }, (_, i) => 
        Array.from({ length: 4 }, (_, j) => `gallery/g${i * 4 + j + 1}.jpg`)
    );

    const currentIndexes = new Array(imageLayers.length).fill(0);

    function changeImages() {
        imageLayers.forEach((layer, i) => {
            currentIndexes[i] = (currentIndexes[i] + 1) % imageSources[i].length;
            layer.style.backgroundImage = `url(${imageSources[i][currentIndexes[i]]})`;
        });
    }

    setInterval(changeImages, 3000);
});


// Shopping Cart Management with localStorage
let cart = [];

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCart();
    }
}

// Add product to cart
function addToCart(productId) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex > -1) {
        cart[productIndex].quantity += 1; 
    } else {
        const product = products.find(p => p.id === productId);
        if (product) {
            cart.push({ ...product, quantity: 1 }); 
        }
    }
    updateCart();
    saveCartToLocalStorage();
}

// Decrease product quantity
function decreaseQuantity(productId) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex > -1) {
        if (cart[productIndex].quantity > 1) {
            cart[productIndex].quantity -= 1;
        } else {
            cart.splice(productIndex, 1); 
        }
        updateCart();
        saveCartToLocalStorage();
    }
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCartToLocalStorage();
}

// Update cart display
function updateCart() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0); 

    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.getElementById('cart-total-amount');
    
    if (cartItems) {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} DA</p>
                    <div class="quantity-control">
                        <button class="decrease-quantity" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">×</button>
            </div>
        `).join('');
    }

    if (cartTotal) {
        cartTotal.textContent = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    }
}










// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    displayNewCollection();
});

document.addEventListener('click', (e) => {
    const productId = e.target.dataset.id;

    if (e.target.classList.contains('add-to-cart')) {
        addToCart(productId);
    }

    if (e.target.classList.contains('remove-item')) {
        removeFromCart(productId);
    }

    if (e.target.classList.contains('increase-quantity')) {
        addToCart(productId); 
    }

    if (e.target.classList.contains('decrease-quantity')) {
        decreaseQuantity(productId); 
    }
});


// Modal Handling
// Modals
const modals = document.querySelectorAll('.modal');
const cartModal = document.getElementById('cart-modal');
const authModal = document.getElementById('auth-modal');
const menuModal = document.getElementById('menu-modal');
const cartBtn = document.querySelector('.cart-btn');
const userBtn = document.querySelector('.user-btn');
const menuIcon = document.getElementById('menu-icon');
const closeBtns = document.querySelectorAll('.close');

// Fonction pour afficher un modal
function showModal(modal) {
    modals.forEach(m => m.classList.remove('show')); // Ferme tous les autres modaux
    modal.classList.add('show'); // Affiche le modal sélectionné
}

// Fonction pour fermer un modal
function closeModal(modal) {
    modal.classList.remove('show');
}

// Ouvrir le cart modal
cartBtn.addEventListener('click', () => {
    showModal(cartModal);
    updateCart();
});

// Ouvrir le auth modal
userBtn.addEventListener('click', () => {
    showModal(authModal);
});

// Ouvrir/fermer le menu modal
menuIcon.addEventListener('click', () => {
    menuModal.classList.toggle('show');
});

// Fermer un modal avec le bouton de fermeture
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        closeModal(modal);
    });
});

// Fermer les modals en cliquant en dehors de leur contenu
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

// Auth Tabs
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');

authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Gérer les onglets
        authTabs.forEach(t => t.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(`${tab.dataset.tab}-form`).classList.add('active');
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // Gestion des formulaires
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const tabs = document.querySelectorAll(".auth-tab");

    // Fonction pour afficher une erreur
    const setError = (input, message) => {
        const inputControl = input.parentElement; // Accède au parent (input-control)
        const errorDisplay = inputControl.querySelector(".error"); // Sélectionne l'élément d'erreur

        errorDisplay.textContent = message;
        input.classList.add("error");
        input.classList.remove("success");
    };

    // Fonction pour valider un champ avec succès
    const setSuccess = (input) => {
        const inputControl = input.parentElement;
        const errorDisplay = inputControl.querySelector(".error");

        errorDisplay.textContent = "";
        input.classList.add("success");
        input.classList.remove("error");
    };

    // Fonction pour vérifier si un email est valide
    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Gestion des onglets pour basculer entre "Login" et "Register"
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const target = tab.getAttribute("data-tab");

            // Activer l'onglet sélectionné
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            // Activer le formulaire correspondant
            if (target === "login") {
                loginForm.classList.add("active");
                registerForm.classList.remove("active");
            } else {
                registerForm.classList.add("active");
                loginForm.classList.remove("active");
            }
        });
    });

    // Validation du formulaire de connexion
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = loginForm.querySelector("#email");
        const password = loginForm.querySelector("#password");

        let isFormValid = true;

        // Validation de l'email
        if (email.value.trim() === "") {
            setError(email, "Email is required");
            isFormValid = false;
        } else if (!isValidEmail(email.value.trim())) {
            setError(email, "Enter a valid email address");
            isFormValid = false;
        } else {
            setSuccess(email);
        }

        // Validation du mot de passe
        if (password.value.trim() === "") {
            setError(password, "Password is required");
            isFormValid = false;
        } else {
            setSuccess(password);
        }

        // Afficher un message si tout est valide
        if (isFormValid) {
            alert("Login successful!");
            loginForm.reset(); // Réinitialise les champs
            Array.from(loginForm.querySelectorAll("input")).forEach((input) =>
                input.classList.remove("success")
            );
        }
    });

    // Validation du formulaire d'inscription
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = registerForm.querySelector("#username");
        const email = registerForm.querySelector("#email");
        const password = registerForm.querySelector("#password");
        const password2 = registerForm.querySelector("#password2");

        let isFormValid = true;

        // Validation du nom d'utilisateur
        if (username.value.trim() === "") {
            setError(username, "Username is required");
            isFormValid = false;
        } else {
            setSuccess(username);
        }

        // Validation de l'email
        if (email.value.trim() === "") {
            setError(email, "Email is required");
            isFormValid = false;
        } else if (!isValidEmail(email.value.trim())) {
            setError(email, "Enter a valid email address");
            isFormValid = false;
        } else {
            setSuccess(email);
        }

        // Validation du mot de passe
        if (password.value.trim() === "") {
            setError(password, "Password is required");
            isFormValid = false;
        } else if (password.value.trim().length < 8) {
            setError(password, "Password must be at least 8 characters");
            isFormValid = false;
        } else {
            setSuccess(password);
        }

        // Validation de la confirmation du mot de passe
        if (password2.value.trim() === "") {
            setError(password2, "Please confirm your password");
            isFormValid = false;
        } else if (password2.value.trim() !== password.value.trim()) {
            setError(password2, "Passwords do not match");
            isFormValid = false;
        } else {
            setSuccess(password2);
        }

        // Afficher un message si tout est valide
        if (isFormValid) {
            alert("Registration successful!");
            registerForm.reset(); // Réinitialise les champs
            Array.from(registerForm.querySelectorAll("input")).forEach((input) =>
                input.classList.remove("success")
            );
        }
    });
});


