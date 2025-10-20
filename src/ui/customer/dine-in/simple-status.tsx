import type { FC } from "react";
import { useParams } from "react-router-dom";

export const Customer_DineInStatusPage: FC = () => {
  const { tableId } = useParams<{ tableId: string }>();

  return (
    <div style={{ padding: '20px', border: '1px solid #2196f3', borderRadius: '8px' }}>
      <h3>📊 Order Status - Table {tableId}</h3>
      <p>✅ Order status route is working!</p>
      <p>This is where customers would see their order progress.</p>
      <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '4px', margin: '15px 0' }}>
        <strong>What should be here:</strong>
        <ul>
          <li>Current order status</li>
          <li>Estimated completion time</li>
          <li>Waiter information</li>
          <li>Call waiter button</li>
          <li>Real-time order updates</li>
        </ul>
      </div>
      <p><strong>Current Route:</strong> <code>/dine-in/{tableId}/order-status</code></p>
    </div>
  );
};
