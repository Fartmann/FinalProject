const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');
const logoutButton = document.getElementById('logoutButton');
const ordersButton = document.getElementById('ordersButton');
const authForms = document.getElementById('authForms');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const productList = document.getElementById('productList');
const orderDetails = document.getElementById('orderDetails');
const orderList = document.getElementById('orderList');

let token = localStorage.getItem('token');

function updateUI() {
    if (token) {
        loginButton.style.display = 'none';
        registerButton.style.display = 'none';
        logoutButton.style.display = 'block';
        ordersButton.style.display = 'block';
        authForms.style.display = 'none';
    } else {
        loginButton.style.display = 'block';
        registerButton.style.display = 'block';
        logoutButton.style.display = 'none';
        ordersButton.style.display = 'none';
    }
}

updateUI();

loginButton.addEventListener('click', () => {
    authForms.style.display = 'block';
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
});

registerButton.addEventListener('click', () => {
    authForms.style.display = 'block';
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    token = null;
    updateUI();
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        token = data.token;
        updateUI();
        loadProducts();
        displayUsername();
    } else {
        alert(data.message);
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });
    if (response.ok) {
        alert('Registration successful!');
        loginButton.click();
    } else {
        alert('Registration error.');
    }
});

async function loadProducts() {
    productList.innerHTML = '';
    const response = await fetch('/products');
    const products = await response.json();
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: ${product.price}</p>
            <button class="buyButton" data-id="${product._id}">Buy</button>
            <button class="editButton" data-product='${JSON.stringify(product)}'>Edit</button>
            <button onclick="deleteProduct('${product._id}')">Delete</button>
        `;
        productList.appendChild(productCard);
    });
    // Add create button for admin user.
    if (token) {
        try {
            const responseMe = await fetch('/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if(responseMe.ok){
                const userData = await responseMe.json();
                if(userData.isAdmin){
                    const createButton = document.createElement("button");
                    createButton.textContent = "Create Product";
                    createButton.addEventListener("click", () => openProductModal());
                    productList.appendChild(createButton);
                }
            }
        } catch(e){
            console.log(e)
        }
    }

    // Add event listeners for edit buttons
    document.querySelectorAll('.editButton').forEach(button => {
        button.addEventListener('click', () => {
            const product = JSON.parse(button.dataset.product);
            openProductModal(product);
        });
    });

    // Add event listeners for buy buttons
    document.querySelectorAll('.buyButton').forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.dataset.id;
            const requestBody = JSON.stringify({
                items: [{ product: productId, quantity: 1 }],
                total: products.find(p => p._id === productId).price
            });

            console.log("Token:", token);
            console.log("Request Body:", requestBody);

            const response = await fetch('/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: requestBody
            });

            console.log("Response:", response);

            if (response.ok) {
                alert("Order created");
            } else {
                try {
                    const errorData = await response.json();
                    console.error("Error Data:", errorData);
                    alert("Error creating order: " + JSON.stringify(errorData));
                } catch (parseError) {
                    console.error("Error parsing response:", parseError);
                    alert("Error creating order (parsing error)");
                }
            }
        });
    });
}


ordersButton.addEventListener('click', async () => {
    orderDetails.style.display = 'block';
    productList.style.display = 'none';
    orderList.innerHTML = '';
    const response = await fetch('/orders', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const orders = await response.json();
    orders.forEach(order => {
        const orderItem = document.createElement('li');
        orderItem.innerHTML = `
            <h3>Order ${order._id}</h3>
            <p class="order-total">Total: $${order.total}</p>
            <div class="order-items">
                ${order.items.map(item => `<p>Product: ${item.product.name}, Quantity: ${item.quantity}</p>`).join('')}
            </div>
        `;
        orderList.appendChild(orderItem);
    });
});

const shopButton = document.getElementById('shopButton');
shopButton.addEventListener('click', () => {
    orderDetails.style.display = 'none';
    productList.style.display = 'grid';
});

const storeTitle = document.getElementById('storeTitle');
storeTitle.addEventListener('click', () => {
    orderDetails.style.display = 'none';
    productList.style.display = 'grid';
});

async function displayUsername() {
    if (token) {
        try {
            const response = await fetch('/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                const usernameDisplay = document.createElement('span');
                usernameDisplay.textContent = `Welcome, ${userData.username}!`;
                document.querySelector('header nav').prepend(usernameDisplay);
            } else {
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
}

const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const productForm = document.getElementById('productForm');
const productId = document.getElementById('productId');
const productName = document.getElementById('productName');
const productDescription = document.getElementById('productDescription');
const productPrice = document.getElementById('productPrice');
const productCategory = document.getElementById('productCategory');
const productImageUrl = document.getElementById('productImageUrl');
const productStock = document.getElementById('productStock');

closeModal.addEventListener('click', () => {
    productModal.style.display = 'none';
});

function openProductModal(product = null) {
    productModal.style.display = 'block';
    if (product) {
        productId.value = product._id;
        productName.value = product.name;
        productDescription.value = product.description;
        productPrice.value = product.price;
        productCategory.value = product.category;
        productImageUrl.value = product.imageUrl;
        productStock.value = product.stock;
    } else {
        productId.value = '';
        productName.value = '';
        productDescription.value = '';
        productPrice.value = '';
        productCategory.value = '';
        productImageUrl.value = '';
        productStock.value = '';
    }
}

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const productData = {
        name: productName.value,
        description: productDescription.value,
        price: productPrice.value,
        category: productCategory.value,
        imageUrl: productImageUrl.value,
        stock: productStock.value,
    };
    const method = productId.value ? 'PUT' : 'POST';
    const url = productId.value ? `/products/${productId.value}` : '/products';
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
    });
    if (response.ok) {productModal.style.display = 'none';
        loadProducts();
    } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to save product');
    }
});

async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        const response = await fetch(`/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            loadProducts();
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Failed to delete product');
        }
    }
}

if (token) {
    loadProducts();
    displayUsername();
}