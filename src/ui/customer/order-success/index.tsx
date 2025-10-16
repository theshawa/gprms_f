import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCustomerCart } from '@/hooks/useCustomerCart';

// Order History Item Component
const OrderHistoryItem: React.FC<{ order: any }> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 text-xs">Order #{order.id}</span>
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-xs font-medium">Completed</span>
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 12 12" 
              fill="none" 
              className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            >
              <path d="M3 4.5L6 7.5L9 4.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className="text-xs text-gray-500 mb-1">
          {order.items.length} item(s) • LKR {order.total.toFixed(2)}
        </div>
        <div className="text-xs text-gray-400">
          {new Date(order.timestamp).toLocaleTimeString()}
        </div>
      </button>
      
      {/* Expanded Items List */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-gray-100">
          <div className="mt-3 space-y-2">
            <div className="text-xs font-medium text-gray-700 mb-2">Items ordered:</div>
            {order.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center py-1">
                <div className="flex-1">
                  <div className="text-xs text-gray-800">{item.dish.name}</div>
                  <div className="text-xs text-gray-500">LKR {item.dish.price.toFixed(2)} each</div>
                </div>
                <div className="text-xs text-gray-600">×{item.quantity}</div>
                <div className="text-xs font-medium text-gray-800 ml-3">
                  LKR {(item.dish.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700">Total</span>
                <span className="text-xs font-semibold text-gray-900">LKR {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Customer_OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart } = useCustomerCart();
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);
  
  // Get order details from navigation state
  const orderDetails = location.state?.orderDetails;

  const handleFinishDining = () => {
    setShowFinishConfirmation(true);
  };

  const confirmFinishDining = () => {
    // Here you would typically make an API call to alert the waiter
    console.log('Waiter has been notified to bring the bill');
    setShowFinishConfirmation(false);
    clearCart(); // Clear the cart after successful order
    navigate('/'); // Navigate to home page
  };

  const cancelFinishDining = () => {
    setShowFinishConfirmation(false);
  };



  return (
    <div className="w-full max-w-sm mx-auto h-screen bg-white overflow-hidden">
      {/* Header */}
      <div className="w-full h-24 px-6 pt-14 pb-1 bg-white relative flex items-center">
        <button 
          onClick={() => navigate('/')}
          className="absolute left-6 w-8 h-8 flex justify-center items-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="flex-1 text-center text-black text-xl font-semibold">Order Confirmed</div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-6 pb-32 overflow-y-auto">
        <div className="flex flex-col items-center min-h-full justify-center">
        {/* Chef Preparing Image */}
        <div className="w-32 h-32 mb-8">
          <img 
            src="/chef-preparing.jpg" 
            alt="Chef preparing your dishes" 
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        
        {/* Success Message */}
        <h2 className="text-gray-800 text-2xl font-bold mb-4 text-center leading-relaxed">
          All set!
        </h2>
        
        {/* Supporting Message */}
        <p className="text-gray-600 text-base mb-8 max-w-xs text-center leading-relaxed">
          Your dishes are being prepared and will be ready soon. Want to add more to your experience?
        </p>
        
        {/* Current Order Summary */}
        <div className="w-full bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 text-sm">Order #</span>
            <span className="text-gray-900 font-semibold text-sm">{orderDetails?.id || Math.floor(Math.random() * 10000)}</span>
          </div>
          
          {/* Items List */}
          <div className="mb-3">
            <span className="text-gray-600 text-sm block mb-2">Items:</span>
            <div className="space-y-1">
              {(orderDetails?.items || cartItems).map((item: any) => (
                <div key={item.dish.id} className="flex justify-between items-center">
                  <span className="text-gray-800 text-sm">{item.dish.name}</span>
                  <span className="text-gray-600 text-sm">×{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Status</span>
            <span className="text-green-600 font-semibold text-sm">Preparing</span>
          </div>
        </div>

        {/* Order History Toggle */}
        <button
          onClick={() => setShowOrderHistory(!showOrderHistory)}
          className="w-full mb-4 text-center text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
        >
          {showOrderHistory ? 'Hide Previous Orders' : 'View Previous Orders'}
        </button>

        {/* Order History */}
        {showOrderHistory && (
          <div className="w-full mb-4 space-y-2">
            {(() => {
              const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
              const previousOrders = orderHistory.slice(0, -1); // Exclude current order
              
              if (previousOrders.length === 0) {
                return (
                  <div className="w-full bg-gray-50 rounded-xl p-4 text-center">
                    <span className="text-gray-500 text-sm">No previous orders</span>
                  </div>
                );
              }
              
              return previousOrders.slice(-3).reverse().map((order: any) => (
                <OrderHistoryItem key={order.id} order={order} />
              ));
            })()}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <button 
            onClick={() => {
              // Don't clear cart - allow user to add more items
              navigate('/view-menu');
            }}
            className="w-full h-12 bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-full flex justify-center items-center transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            <span className="text-white text-base font-semibold">Order More</span>
          </button>
          
          <button 
            onClick={() => navigate('/feedback')}
            className="w-full h-12 bg-white border border-green-500 hover:bg-green-50 active:bg-green-100 rounded-full flex justify-center items-center transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="text-green-500 text-base font-semibold">Share Feedback</span>
          </button>
          
          <button 
            onClick={handleFinishDining}
            className="w-full h-12 bg-white border border-gray-300 hover:bg-gray-50 rounded-full flex justify-center items-center transition-colors"
          >
            <span className="text-gray-700 text-base font-semibold">Finish Dining</span>
          </button>
        </div>
        </div>
      </div>

      {/* Finish Dining Confirmation Popup */}
      {showFinishConfirmation && (
        <>
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="PopUp w-64 px-6 py-8 bg-white rounded-2xl inline-flex flex-col justify-start items-center gap-4">
              <div className="Title self-stretch flex flex-col justify-start items-center gap-2">
                <div className="ReadyToFinishDining self-stretch text-center text-gray-900 text-xl font-semibold leading-normal">Ready to finish dining?</div>
                <div className="ThisWillAlertYourWaiter self-stretch text-center text-gray-900 text-sm font-normal leading-snug">This will alert your waiter to bring the bill for payment. Are you ready to complete your dining experience?</div>
              </div>
              <div className="Button flex flex-col justify-start items-center gap-3">
                <button
                  onClick={confirmFinishDining}
                  className="Button w-48 h-10 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                >
                  Yes, I'm Ready
                </button>
                <button
                  onClick={cancelFinishDining}
                  className="Button w-48 h-10 px-6 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  Not Yet
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};