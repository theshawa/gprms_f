import type { FC } from "react";
import { Outlet, useParams, Link } from "react-router-dom";

export const Customer_DineInLayout: FC = () => {
  const tableId = useParams<{ tableId: string }>().tableId!;

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div style={{ padding: '20px', border: '2px solid #1976d2', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>🍽️ Dine-In Process - Table {tableId}</h2>
        <p>✅ New routing structure is working!</p>
        <p>This is the simplified dine-in layout component.</p>
        
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', margin: '15px 0' }}>
          <strong>Test Navigation:</strong>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
            <Link 
              to={`/dine-in/${tableId}`}
              style={{ padding: '8px 16px', background: '#1976d2', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '14px' }}
            >
              Main (Menu)
            </Link>
            <Link 
              to={`/dine-in/${tableId}/menu`}
              style={{ padding: '8px 16px', background: '#2e7d32', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '14px' }}
            >
              Explicit Menu
            </Link>
            <Link 
              to={`/dine-in/${tableId}/confirm-order`}
              style={{ padding: '8px 16px', background: '#ed6c02', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '14px' }}
            >
              Confirm Order
            </Link>
            <Link 
              to={`/dine-in/${tableId}/order-status`}
              style={{ padding: '8px 16px', background: '#9c27b0', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '14px' }}
            >
              Order Status
            </Link>
          </div>
        </div>

        <div style={{ background: '#e8f5e8', padding: '10px', borderRadius: '4px', margin: '10px 0' }}>
          <strong>Available Routes:</strong>
          <ul style={{ margin: '5px 0', fontSize: '14px' }}>
            <li><code>/dine-in/{tableId}</code> - Main menu (index route)</li>
            <li><code>/dine-in/{tableId}/menu</code> - Explicit menu access</li>
            <li><code>/dine-in/{tableId}/confirm-order</code> - Order confirmation</li>
            <li><code>/dine-in/{tableId}/order-status</code> - Order status</li>
            <li><code>/dine-in/{tableId}/orders/:orderCode/status</code> - Specific order tracking</li>
          </ul>
        </div>
      </div>
      <Outlet />
    </main>
  );
};
