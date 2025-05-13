var baseUrl = 'http://172.16.2.6:5000';

// Place Order Function
function placeOrder() {
    console.log('placeOrder called');

    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
        alert('Session expired. Please login again.');
        sessionStorage.clear();
        window.location.href = 'index.html';
        return;
    }

    const address = document.getElementById("address")?.value.trim();
    if (!address) {
        alert("Please enter a delivery address.");
        return;
    }

    let cart = localStorage.getItem("cart");
    try {
        cart = JSON.parse(cart);
    } catch (e) {
        cart = null;
    }

    if (!cart || cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const body = {
        address: address,
        items: cart
    };

    console.log('Placing order with data:', body);

    fetch(`${baseUrl}/place-order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(body)
    })
    .then(res => {
        if (res.status === 401 || res.status === 403) {
            alert('Session expired or unauthorized. Redirecting to login...');
            sessionStorage.clear();
            window.location.href = 'index.html';
            return;
        }
        return res.json();
    })
    .then(resBody => {
        if (resBody?.status) {
            alert('Order placed successfully!');
            localStorage.removeItem("cart");
            window.location.href = "home.html";
        } else {
            console.warn('Order failed:', resBody?.msg || resBody);
            alert('Failed to place order.');
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('An error occurred while placing the order.');
    });
}


// Signup Function
function signup() {
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("signup-confirm-password").value;

    if (!name || !email || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    fetch(`${baseUrl}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    })
    .then(res => res.json())
    .then(resBody => {
        if (resBody.status && resBody.accessToken) {
            sessionStorage.setItem('accessToken', resBody.token);
            location.href = 'home.html';
        } else {
            alert(resBody.msg || "Signup failed.");
        }
    })
    .catch(err => {
        alert(err);
        console.error("Signup error:", err);
    });
}

// Login Function
function login() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    

    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(resBody => {
        if (resBody.status && resBody.accessToken) {
            sessionStorage.setItem('accessToken', resBody.accessToken);
            location.href = 'home.html';
        } else {
            alert(resBody.msg || "Login failed.");
        }
    })
    .catch(err => {
        alert(err);
        console.error("Login error:", err);
    });
}