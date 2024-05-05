import React, { useState } from 'react';

interface OrderDeleteProps {
  orderId: string;
}

const OrderDelete: React.FC<OrderDeleteProps> = ({ orderId }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const deleteOrder = async () => {
    await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
    setShowConfirm(false);
  };

  return (
    <div>
      <button onClick={() => setShowConfirm(true)}>
        Supprimer la commande
      </button>
      {showConfirm && (
        <div>
          <p>Êtes-vous sûr de vouloir supprimer cette commande ?</p>
          <button onClick={deleteOrder}>Oui</button>
          <button onClick={() => setShowConfirm(false)}>Non</button>
        </div>
      )}
    </div>
  );
};

export default OrderDelete;
