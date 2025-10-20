import React from 'react';

export const SimpleTestPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🚀 Simple Test Page</h1>
      <p>If you can see this, the routing is working!</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
      <div style={{ margin: '20px 0' }}>
        <a href="/" style={{ margin: '10px', padding: '10px', background: '#1976d2', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Go to Home
        </a>
        <a href="/dine-in-test" style={{ margin: '10px', padding: '10px', background: '#2e7d32', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Dine-in Test
        </a>
        <a href="/dine-in/1" style={{ margin: '10px', padding: '10px', background: '#ed6c02', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Dine-in Table 1
        </a>
      </div>
    </div>
  );
};
