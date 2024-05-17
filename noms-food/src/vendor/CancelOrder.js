import React, { useState } from 'react';

const CancelOrder = () => {
    const [orderId, setOrderId] = useState('');

    const handleCancelOrder = () => {
        // Logic to cancel the order
        // You can make an API call to the backend to update the order status

        // Example API call using fetch:
        fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'cancelled' }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the API
                console.log('Order cancelled successfully');
            })
            .catch(error => {
                // Handle any errors that occurred during the API call
                console.error('Error cancelling order:', error);
            });
    };

    return (
        <div>
            <h1>Cancel Order</h1>
            <input
                type="text"
                placeholder="Order ID"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
            />
            <button onClick={handleCancelOrder}>Cancel Order</button>
        </div>
    );
};

export default CancelOrder;