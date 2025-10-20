import type { FC } from "react";
import { useParams } from "react-router-dom";

export const Customer_DineInMenuPage: FC = () => {
  const { tableId } = useParams<{ tableId: string }>();

  return (
    <div style={{ padding: '20px', border: '1px solid #4caf50', borderRadius: '8px' }}>
      <h3>🍽️ Menu Page - Table {tableId}</h3>
      <p>✅ Menu route is working!</p>
      <p>This is where the table-specific menu would be displayed.</p>
      <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '4px', margin: '15px 0' }}>
        <strong>What should be here:</strong>
        <ul>
          <li>Table-specific menu items</li>
          <li>Dish categories and filters</li>
          <li>Add to cart functionality</li>
          <li>Real-time menu updates</li>
        </ul>
      </div>
      <p><strong>Current Route:</strong> <code>/dine-in/{tableId}/menu</code></p>
    </div>
  );
};
