import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomerCart } from '@/hooks/useCustomerCart';

export const Customer_CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, removeItemFromCart, increaseItemQuantity, decreaseItemQuantity, clearCart, placeOrder } = useCustomerCart();
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [showClearAllConfirmation, setShowClearAllConfirmation] = useState(false);
  const [dishToRemove, setDishToRemove] = useState<number | null>(null);
  const [orderNote, setOrderNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.dish.price * item.quantity), 0);
  };

  const handleIncrease = (dishId: number) => {
    increaseItemQuantity(dishId);
  };

  const handleDecrease = (dishId: number) => {
    const item = cartItems.find(item => item.dish.id === dishId);
    if (item && item.quantity > 1) {
      decreaseItemQuantity(dishId);
    } else {
      // Show confirmation popup when trying to remove item (quantity 1 -> 0)
      setDishToRemove(dishId);
      setShowRemoveConfirmation(true);
    }
  };

  const confirmRemove = () => {
    if (dishToRemove) {
      removeItemFromCart(dishToRemove);
      setShowRemoveConfirmation(false);
      setDishToRemove(null);
    }
  };

  const cancelRemove = () => {
    setShowRemoveConfirmation(false);
    setDishToRemove(null);
  };

  const handleClearCart = () => {
    setShowClearAllConfirmation(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setShowClearAllConfirmation(false);
  };

  const cancelClearCart = () => {
    setShowClearAllConfirmation(false);
  };

  const handleOrderNow = () => {
    // Place the order and get order details
    const orderDetails = placeOrder();
    // Navigate to order success page with order details
    navigate('/order-success', { state: { orderDetails } });
  };

  return (
    <>
      <div className="w-full max-w-sm mx-auto min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="w-full h-24 px-6 pt-14 pb-1 bg-white relative flex items-center flex-shrink-0">
          <button 
            onClick={() => navigate('/view-menu')}
            className="absolute left-6 w-8 h-8 flex justify-center items-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex-1 text-center text-black text-xl font-semibold">Your Cart</div>
          {cartItems.length > 0 && (
            <button 
              onClick={handleClearCart}
              className="absolute right-6 text-red-500 text-sm font-semibold hover:text-red-600 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

      {/* Cart Items */}
      <div className="flex-1 px-6 pt-6 pb-6 overflow-y-auto" style={{ paddingBottom: cartItems.length > 0 ? '140px' : '24px' }}>
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
            {/* Empty State Illustration */}
            <div className="mb-8">
              <img 
                src="/empty-cart.png" 
                alt="Empty cart illustration" 
                className="w-40 h-40 object-contain opacity-90"
              />
            </div>
            
            {/* Primary Message */}
            <h2 className="text-gray-800 text-xl font-semibold mb-3 leading-relaxed">
              Your cart is waiting for delicious choices
            </h2>
            
            {/* Supporting Message */}
            <p className="text-gray-500 text-base mb-8 max-w-xs leading-relaxed">
              Browse our menu and add your favorite dishes to get started
            </p>
            
            {/* Call to Action */}
            <button
              onClick={() => navigate('/view-menu')}
              className="bg-green-500 text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-green-600 active:bg-green-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.dish.id} className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="w-full p-4 flex gap-4">
                  <img 
                    className="w-16 h-16 rounded-xl object-cover bg-gray-200" 
                    src={item.dish.image || "https://placehold.co/64x64"} 
                    alt={item.dish.name}
                  />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="text-black text-base font-semibold">
                      {item.dish.name}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600 text-sm">Quantity</span>
                        <span className="text-black text-sm">{item.quantity}</span>
                      </div>
                      <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1 gap-3">
                        <button 
                          onClick={() => handleDecrease(item.dish.id)}
                          className="w-8 h-8 flex justify-center items-center hover:bg-gray-200 rounded-md transition-colors"
                        >
                          <span className="text-black text-lg font-medium">−</span>
                        </button>
                        <button 
                          onClick={() => handleIncrease(item.dish.id)}
                          className="w-8 h-8 flex justify-center items-center hover:bg-gray-200 rounded-md transition-colors"
                        >
                          <span className="text-black text-lg font-medium">+</span>
                        </button>
                      </div>
                    </div>
                    <div className="text-black text-base font-semibold">
                      LKR {(item.dish.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Order Note Section */}
            <div className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="text-black text-base font-semibold">Add an order note</div>
                  {!showNoteInput && (
                    <button 
                      onClick={() => setShowNoteInput(true)}
                      className="w-8 h-8 bg-white rounded-lg flex justify-center items-center hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                      <span className="text-black text-lg font-medium">+</span>
                    </button>
                  )}
                </div>
                
                {showNoteInput ? (
                  <div className="space-y-3">
                    <textarea
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Add allergies, special instructions, or any other notes for your order..."
                      className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                      rows={3}
                      maxLength={200}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        {orderNote.length}/200 characters
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowNoteInput(false);
                            setOrderNote('');
                          }}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setShowNoteInput(false)}
                          className="px-4 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600 text-sm">
                    {orderNote ? (
                      <div className="flex justify-between items-start">
                        <div className="bg-white p-2 rounded-md border border-gray-200 flex-1 mr-2">
                          <p className="text-gray-800 text-sm">{orderNote}</p>
                        </div>
                        <button
                          onClick={() => setShowNoteInput(true)}
                          className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    ) : (
                      "Allergies, special instructions, etc."
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section - Fixed */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 z-10">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-black text-base font-semibold">Subtotal</span>
              <span className="text-black text-base font-medium">
                LKR {calculateTotal().toFixed(2)}
              </span>
            </div>
            <button 
              onClick={handleOrderNow}
              className="w-full h-12 bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-full flex justify-center items-center transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              <span className="text-white text-base font-semibold">Order Now</span>
            </button>
          </div>
        </div>
      )}
      </div>

      {/* Remove Single Item Confirmation Popup */}
      {showRemoveConfirmation && (
        <div data-layer="pop up" className="PopUp w-72 px-6 py-6 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.4)] border border-gray-200 flex flex-col justify-start items-center gap-6 transform scale-105">
            <div data-layer="title" className="Title self-stretch flex flex-col justify-start items-center gap-3">
              <div data-layer="Remove dish" className="RemoveDish self-stretch text-center justify-start text-gray-900 text-xl font-semibold leading-normal">Remove dish</div>
              <div data-layer="confirmation text" className="ConfirmationText self-stretch text-center justify-start text-gray-900 text-xs font-normal leading-none">Are you sure you want to remove this dish from your cart?</div>
            </div>
            <div data-layer="button" className="Button flex flex-col justify-start items-center gap-3">
              <button
                onClick={confirmRemove}
                data-layer="button" 
                className="Button w-48 h-10 px-6 py-2 bg-green-500 rounded-[360px] inline-flex justify-center items-center gap-2.5 hover:bg-green-600 transition-colors"
              >
                <div data-layer="button name" className="ButtonName text-center justify-start text-white text-base font-semibold leading-tight">Yes</div>
              </button>
              <button
                onClick={cancelRemove}
                data-layer="button" 
                className="Button w-48 h-10 px-6 py-2 rounded-[360px] border border-gray-300 bg-white inline-flex justify-center items-center gap-2.5 hover:bg-gray-50 transition-colors"
              >
                <div data-layer="button name" className="ButtonName text-center justify-start text-gray-700 text-base font-semibold leading-tight">No</div>
              </button>
            </div>
          </div>
      )}

      {/* Clear All Items Confirmation Popup */}
      {showClearAllConfirmation && (
        <div data-layer="pop up" className="PopUp w-72 px-6 py-6 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.4)] border border-gray-200 flex flex-col justify-start items-center gap-6 transform scale-105">
            <div data-layer="title" className="Title self-stretch flex flex-col justify-start items-center gap-3">
              <div data-layer="Clear cart" className="ClearCart self-stretch text-center justify-start text-gray-900 text-xl font-semibold leading-normal">Clear all items</div>
              <div data-layer="confirmation text" className="ConfirmationText self-stretch text-center justify-start text-gray-900 text-xs font-normal leading-none">Are you sure you want to remove all items from your cart?</div>
            </div>
            <div data-layer="button" className="Button flex flex-col justify-start items-center gap-3">
              <button
                onClick={confirmClearCart}
                data-layer="button" 
                className="Button w-48 h-10 px-6 py-2 bg-red-600 rounded-[360px] inline-flex justify-center items-center gap-2.5 hover:bg-red-700 transition-colors"
              >
                <div data-layer="button name" className="ButtonName text-center justify-start text-white text-base font-semibold leading-tight">Yes, Clear All</div>
              </button>
              <button
                onClick={cancelClearCart}
                data-layer="button" 
                className="Button w-48 h-10 px-6 py-2 rounded-[360px] border border-gray-300 bg-white inline-flex justify-center items-center gap-2.5 hover:bg-gray-50 transition-colors"
              >
                <div data-layer="button name" className="ButtonName text-center justify-start text-gray-700 text-base font-semibold leading-tight">No</div>
              </button>
            </div>
          </div>
      )}
    </>
  );
};
