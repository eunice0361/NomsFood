import { PayPalButtons } from "@paypal/react-paypal-js";
import { Navigate, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAuth } from 'firebase/auth';
import { collection, addDoc, getFirestore, where, query, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const PaypalPayment = () => {
    const { storeId } = useParams();
    const cartItemsKey = `cartItems_${storeId}`;
    const navigate = useNavigate();

    const serverUrl = "http://localhost:8888";

    const createOrder = (data) => {
        const storedCartItems = sessionStorage.getItem(cartItemsKey);
        const cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
        let totalPrice = 0;

        cartItems.forEach(item => {
            totalPrice += item.quantity * item.unitPrice;
        });
        
        const orderDetails = {
            cart: cartItems.map(item => ({
              itemId: item.id,
              title: item.title,
              description: item.description,
              price: item.unitPrice.toString(),
              quantity: item.quantity.toString(),
              totalPrice: (item.unitPrice * item.quantity).toString()
            })),
            totalPayment: totalPrice.toString()
          };

        // Order is created on the server and the order id is returned
        return fetch(`${serverUrl}/my-server/create-paypal-order`, {
          method: "POST",
           headers: {
            "Content-Type": "application/json",
          },
          // use the "body" param to optionally pass additional order information
          // like product skus and quantities
          body: JSON.stringify(orderDetails),
        })
        .then((response) => response.json())
        .then((order) => order.id);
      };

      const onApprove = (data) => {

         // Order is captured on the server and the response is returned to the browser
         return fetch(`${serverUrl}/my-server/capture-paypal-order`, {
          method: "POST",
           headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderID: data.orderID
          })
        })
        .then((response) => response.json())
        .then((order) => {
          if (order.status == "COMPLETED") {
            console.log(order);
            try {
              documentOrder(order);
            } catch (error) {
              console.log("Die");
            }
            navigate(`/orderConfirmed/${storeId}/${order.id}`);
          }
        });
      };

      const documentOrder = async (order) => {
        const storedCartItems = sessionStorage.getItem(cartItemsKey);
        console.log(storedCartItems);
        const orderDetails = JSON.parse(storedCartItems);
        const orderItems = orderDetails.map(item => ({
            listingId: item.id,
            price: item.unitPrice,
            quantity: item.quantity,
        }));

        console.log(order);

        const currentTime = new Date();

        const auth = getAuth(); // Get Current User State
        const currentUser = auth.currentUser;
        const userQuerySnapshot = await getDocs(query(collection(db, 'Users'), where("userId", "==", currentUser.uid)));
        const user = userQuerySnapshot.docs[0].data();

        const totalPrice = orderDetails.reduce((total, item) => total + item.price, 0);

        if (orderDetails && orderDetails.length > 0 ){
            const newOrderPayload = {
              customerId: currentUser.uid,
              customerName: user.name,
              date: currentTime,
              orderItems: orderItems,
              orderStatus: "Ongoing",
              orderPrice: totalPrice,
              storeId: storeId,
              orderId: order.id,
              orderReviewed: false
            }

            console.log(newOrderPayload);

            const db = getFirestore();
            try {
                addDoc(collection(db, 'Order'), newOrderPayload);
                console.log("Done")
                for (const item of orderItems) {
                  const listingDocRef = doc(db, 'Listing', item.listingId);
                  const listingDocSnapshot = await getDoc(listingDocRef);
                  if (listingDocSnapshot.exists()) {
                      const listingData = listingDocSnapshot.data();
                      const currentInventoryCount = parseInt(listingData.stock, 10);
                      console.log(currentInventoryCount);
                      const updatedInventoryCount = currentInventoryCount - item.quantity;
                      console.log(updatedInventoryCount);
                      await updateDoc(listingDocRef, { stock: updatedInventoryCount });
                      console.log(`Updated inventory count for listing ${item.listingId}`);
                  } else {
                      console.log(`Listing ${item.listingId} not found.`);
                  }
                }
            } catch (error) {
                console.error('Error adding order', error);
            }

            sessionStorage.setItem(cartItemsKey, JSON.stringify([]))
        }
      }

    return (
        <PayPalButtons
            createOrder={(data, actions) => createOrder(data, actions)}
            onApprove={(data, actions) => onApprove(data, actions)}
        />
    );

}

export default PaypalPayment;