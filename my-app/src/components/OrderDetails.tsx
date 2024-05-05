import React, { useEffect, useState } from 'react';
import { sendGetRequest, sendPutRequest } from '../lib/http';

interface OrderDetailsProps {
  orderId: string;
  onClose: () => void;
}

interface OrderArticle {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  dateCreated: string;
  articles: OrderArticle[];
  totalWithoutShipping: number;
  shippingCost: number;
  totalWithShipping: number;
  submitted: boolean;
}

function isOrder(data: any): data is Order {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.dateCreated === 'string' &&
    Array.isArray(data.articles) &&
    data.articles.every(
      (article: { name: any; price: any; quantity: any }) =>
        typeof article.name === 'string' &&
        typeof article.price === 'number' &&
        typeof article.quantity === 'number'
    ) &&
    typeof data.totalWithoutShipping === 'number' &&
    typeof data.shippingCost === 'number' &&
    typeof data.totalWithShipping === 'number' &&
    typeof data.submitted === 'boolean'
  );
}

function OrderDetails({ orderId, onClose }: OrderDetailsProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const data = await sendGetRequest(`/orders/${orderId}`);
        if (isOrder(data)) {
          // Use the type guard to validate the data
          setOrder(data);
        } else {
          console.error('Invalid data format received:', data);
          setOrder(null); // Handle unexpected data format appropriately
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const submitOrder = async () => {
    if (order && !order.submitted) {
      const updatedOrder = await sendPutRequest(`orders/${orderId}`, {
        submitted: true,
      });
      if (isOrder(updatedOrder)) {
        setOrder(updatedOrder);
      } else {
        console.error('Invalid data format received:', updatedOrder);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div>
      <h1>Order Details</h1>
      <p>Date Created: {new Date(order.dateCreated).toLocaleString()}</p>
      <ul>
        {order.articles.map((article, index) => (
          <li key={index}>
            {article.name} - {article.price}€ x {article.quantity}
          </li>
        ))}
      </ul>
      <p>Total Without Shipping: {order.totalWithoutShipping}€</p>
      <p>Shipping Cost: {order.shippingCost}€</p>
      <p>Total With Shipping: {order.totalWithShipping}€</p>
      <p>Status: {order.submitted ? 'Submitted' : 'Not Submitted'}</p>
      <button onClick={submitOrder}>Submit Order</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default OrderDetails;
