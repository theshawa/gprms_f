import type { FC } from "react";
import { useParams } from "react-router-dom";

export const Customer_DineInConfirm: FC = () => {
  const { tableId } = useParams<{ tableId: string }>();

  return (
    <div style={{ padding: '20px', border: '1px solid #ff9800', borderRadius: '8px' }}>
      <h3>📋 Order Confirmation - Table {tableId}</h3>
      <p>✅ Confirm order route is working!</p>
      <p>This is where customers would review and confirm their order.</p>
      <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '4px', margin: '15px 0' }}>
        <strong>What should be here:</strong>
        <ul>
          <li>Cart items review</li>
          <li>Order total calculation</li>
          <li>Special instructions</li>
          <li>Confirm order button</li>
        </ul>
      </div>
      <p><strong>Current Route:</strong> <code>/dine-in/{tableId}/confirm-order</code></p>
    </div>
  );
};
