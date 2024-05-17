import React, { useState } from 'react';

const CloseShop = () => {
    const [isShopClosed, setIsShopClosed] = useState(false);

    const handleCloseShop = () => {
        // Logic to close the shop and update the state
        setIsShopClosed(true);
        // Additional logic to perform any necessary cleanup or API calls
        // when the shop is closed
    };

    return (
        <div>
            <h1>Close Shop</h1>
            {isShopClosed ? (
                <p>Your shop is closed.</p>
            ) : (
                <button onClick={handleCloseShop}>Close Shop</button>
            )}
        </div>
    );
};

export default CloseShop;