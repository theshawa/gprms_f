import React  const handleIncrease = (dishId: number) => {
    increaseItemQuantity(dishId);
  };

  const handleDecrease = (dishId: number) => {
    const item = cartItems.find(item => item.dish.id === dishId);
    if (item && item.quantity > 1) {
      decreaseItemQuantity(dishId);
    } else {
      removeItemFromCart(dishId);
    }
  };

  const clearCart = () => {
    cartItems.forEach(item => removeItemFromCart(item.dish.id));
  };;
import { useNavigate } from 'react-router-dom';
import { useCustomerCart } from '@/hooks/useCustomerCart';

export const Customer_CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, removeItemFromCart, increaseItemQuantity, decreaseItemQuantity } = useCustomerCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.dish.price * item.quantity), 0);
  };

  const handleQuantityChange = (dishId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItemFromCart(dishId);
    } else if (newQuantity > cartItems.find(item => item.dish.id === dishId)?.quantity || 0) {
      increaseItemQuantity(dishId);
    } else {
      decreaseItemQuantity(dishId);
    }
  };

  const clearCart = () => {
    cartItems.forEach(item => removeItemFromCart(item.dish.id));
  };

  const handleOrderNow = () => {
    // Navigate to checkout or place order
    console.log('Order placed:', cartItems);
    // For now, just show alert
    alert('Order functionality will be implemented soon!');
  };

  return (
    <div data-layer="Property 1=Default" className="Property1Default w-96 h-[1004px] relative bg-bg-primary overflow-hidden mx-auto">
      {/* Header */}
      <div data-layer="header" className="Header w-96 h-24 px-6 pt-14 pb-1 left-0 top-0 absolute bg-color-system-0 inline-flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)}
          data-layer="icon button" 
          data-property-1="back" 
          className="IconButton w-12 h-12 bg-color-system-100 rounded-[100px] flex justify-center items-center hover:bg-gray-200 transition-colors"
        >
          <div data-layer="angle-left-small" className="AngleLeftSmall w-6 h-6 relative">
            <div data-layer="angle-left-small" className="AngleLeftSmall w-1.5 h-2.5 left-[9px] top-[7px] absolute bg-text-primary" />
          </div>
        </button>
        <div data-layer="Your Cart" className="YourCart text-center justify-start text-color-system-900 text-xl font-semibold font-['Inter'] leading-normal">Your Cart</div>
        <button 
          onClick={clearCart}
          data-layer="Delete" 
          className="Delete text-center justify-start text-color-brand-600-(primary) text-xs font-semibold font-['Inter'] leading-none hover:text-red-600 transition-colors"
        >
          Delete
        </button>
      </div>

      {/* Cart Items */}
      <div className="mt-24 px-6 pb-60 overflow-y-auto">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="text-gray-500 text-lg font-semibold mb-4">Your cart is empty</div>
            <button
              onClick={() => navigate('/view-menu')}
              className="bg-green-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-800 transition-colors"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={item.id} data-layer="cart item" data-property-1="normal" className="CartItem w-full h-28 relative rounded-xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.10)] overflow-hidden">
                <div data-layer="cart item" data-property-1="Default" className="CartItem w-full p-4 left-0 top-0 absolute bg-color-system-0 rounded-xl inline-flex justify-start items-start gap-4 overflow-hidden">
                  <img 
                    data-layer="Rectangle 6492" 
                    className="Rectangle6492 w-16 h-16 rounded-xl object-cover" 
                    src={item.image || "https://placehold.co/64x64"} 
                    alt={item.name}
                  />
                  <div data-layer="title" className="Title flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                    <div data-layer="dish name" className="DishName w-60 justify-start text-text-primary text-base font-semibold font-['Inter'] leading-tight">
                      {item.name}
                    </div>
                    <div data-layer="quantity" className="Quantity self-stretch inline-flex justify-between items-center">
                      <div data-layer="number" className="Number flex justify-center items-start gap-1">
                        <div data-layer="Quantity" className="Quantity justify-start text-text-primary text-xs font-normal font-['Inter'] leading-none">Quantity</div>
                        <div data-layer="quantity-number" className="justify-start text-text-primary text-xs font-normal font-['Inter'] leading-none">{item.quantity}</div>
                      </div>
                      <div data-layer="btn" className="Btn px-2 bg-color-system-100 rounded-xl flex justify-start items-start gap-4">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          data-layer="Frame 15360" 
                          className="Frame15360 w-8 h-8 flex justify-center items-center gap-2.5 hover:bg-gray-200 rounded transition-colors"
                        >
                          <div data-layer="minus" className="Minus w-6 h-6 relative">
                            <div data-layer="minus" className="Minus w-4 h-0.5 left-[4px] top-[11px] absolute bg-text-primary" />
                          </div>
                        </button>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          data-layer="Frame 15361" 
                          className="Frame15361 w-8 h-8 flex justify-center items-center gap-2.5 hover:bg-gray-200 rounded transition-colors"
                        >
                          <div data-layer="plus" className="Plus w-6 h-6 relative">
                            <div data-layer="plus" className="Plus w-4 h-4 left-[4px] top-[4px] absolute bg-text-primary" />
                          </div>
                        </button>
                      </div>
                    </div>
                    <div data-layer="price" className="Price justify-start text-text-primary text-base font-semibold font-['Inter'] leading-tight">
                      LKR {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Order Note Section */}
            <div data-layer="cart item" data-property-1="Variant2" className="CartItem w-full p-4 bg-gray-400 rounded-xl inline-flex justify-start items-start gap-2.5 overflow-hidden">
              <div data-layer="title" className="Title flex-1 inline-flex flex-col justify-start items-start">
                <div data-layer="Add an order note" className="AddAnOrderNote w-60 justify-start text-bg-primary text-base font-semibold font-['Inter'] leading-tight">Add an order note</div>
                <div data-layer="quantity" className="Quantity self-stretch inline-flex justify-between items-center">
                  <div data-layer="number" className="Number flex justify-center items-center gap-1">
                    <div data-layer="Allergies, special instructions, etc." className="AllergiesSpecialInstructionsEtc justify-start text-bg-primary text-xs font-normal font-['Inter'] leading-none">Allergies, special instructions, etc.</div>
                  </div>
                  <div data-layer="btn" className="Btn px-2 bg-color-system-100 rounded-xl flex justify-start items-start gap-4">
                    <div data-layer="Frame 15361" className="Frame15361 w-8 h-8 flex justify-center items-center gap-2.5">
                      <div data-layer="add" className="Add w-6 h-6 relative">
                        <div data-layer="Bounding box" className="BoundingBox w-6 h-6 left-0 top-0 absolute bg-zinc-300" />
                        <div data-layer="add" className="Add w-3 h-3 left-[5.50px] top-[5.50px] absolute bg-text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section - Fixed */}
      {cartItems.length > 0 && (
        <div data-layer="bottom" className="Bottom left-0 bottom-0 absolute w-full bg-bg-primary border-t-[0.50px] border-border inline-flex flex-col justify-start items-start gap-1.5">
          <div data-layer="total" className="Total self-stretch px-6 py-4 border-b-[0.50px] border-border flex flex-col justify-start items-start gap-2">
            <div data-layer="items" className="Items self-stretch inline-flex justify-between items-start">
              <div data-layer="Subtotal" className="Subtotal text-center justify-start text-color-system-900 text-base font-semibold font-['Inter'] leading-tight">Subtotal</div>
              <div data-layer="total-amount" className="TotalAmount justify-start text-color-system-900 text-base font-normal font-['Inter'] leading-tight">
                LKR {calculateTotal().toFixed(2)}
              </div>
            </div>
          </div>
          <div data-layer="btn box" className="BtnBox w-full px-6 pt-2 pb-8 bg-color-system-0 flex flex-col justify-start items-start gap-2.5">
            <button 
              onClick={handleOrderNow}
              data-layer="button" 
              data-left-icom="false" 
              data-right-icon="false" 
              data-size="large" 
              data-state="default" 
              data-type="primary" 
              className="Button self-stretch h-14 px-6 py-4 bg-color-global-green rounded-[360px] inline-flex justify-center items-center gap-2.5 hover:bg-green-700 transition-colors"
            >
              <div data-layer="button name" className="ButtonName text-center justify-start text-text-tertiary text-base font-semibold font-['Inter'] leading-tight">Order Now</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
