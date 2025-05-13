var baseUrl = 'http://192.168.7.54:5000';

function placeOrder() {
    console.log('placeOrder called');

    var body = {
        name: document.getElementById("full-name").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
    };

    console.log('Order data:', body);

    fetch(`${baseUrl}/place-order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(resBody => {
        if (resBody.status) {
            console.log(resBody.msg);
            alert('Order placed successfully!');
        } else {
            console.warn('Order failed:', resBody.msg);
            alert('Failed to place order.');
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('An error occurred while placing the order.');
    });
}
