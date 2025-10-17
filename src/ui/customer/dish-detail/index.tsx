import type { FC } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomerCart } from "@/hooks/useCustomerCart";


// Mock data for Sri Lankan dish details - replace with actual API calls
const dishDetails = {
  1: {
    id: 1,
    name: "Rice & Curry Special",
    description: "Traditional Sri Lankan rice and curry with aromatic basmati rice, fish curry, chicken curry, dhal curry, and fresh vegetables. Served with papadum and pickles.",
    price: 1850.00,
    image: "/sample-dish.png",
    typeOptions: [
      { id: 1, name: "Regular Plate", price: 0 },
      { id: 2, name: "Extra Portions", price: 500.00 }
    ],
    recommendedSides: [
      { id: 1, name: "Coconut Sambol", price: 250.00, checked: false },
      { id: 2, name: "Papadum (2pcs)", price: 150.00, checked: false },
      { id: 3, name: "Gotukola Mallung", price: 350.00, checked: false },
      { id: 4, name: "Mango Pickle", price: 200.00, checked: false }
    ],
    similarDishes: [
      { id: 2, name: "Kottu Roti", price: 1200.00, image: "/sample-dish.png" },
      { id: 3, name: "Fish Ambul Thiyal", price: 2200.00, image: "/sample-dish.png" },
      { id: 5, name: "Hoppers with Curry", price: 950.00, image: "/sample-dish.png" }
    ]
  },
  2: {
    id: 2,
    name: "Kottu Roti",
    description: "Sri Lanka's famous street food - chopped roti bread stir-fried with vegetables, egg, and your choice of chicken or beef. A true local favorite with authentic spices.",
    price: 1200.00,
    image: "/sample-dish.png",
    typeOptions: [
      { id: 1, name: "Vegetable Kottu", price: 0 },
      { id: 2, name: "Chicken Kottu", price: 300.00 },
      { id: 3, name: "Beef Kottu", price: 450.00 }
    ],
    recommendedSides: [
      { id: 1, name: "Raita", price: 200.00, checked: false },
      { id: 2, name: "Gravy Curry", price: 350.00, checked: false },
      { id: 3, name: "Fried Egg", price: 180.00, checked: false },
      { id: 4, name: "Chili Paste", price: 100.00, checked: false }
    ],
    similarDishes: [
      { id: 1, name: "Rice & Curry Special", price: 1850.00, image: "/sample-dish.png" },
      { id: 3, name: "Fish Ambul Thiyal", price: 2200.00, image: "/sample-dish.png" },
      { id: 6, name: "String Hoppers", price: 850.00, image: "/sample-dish.png" }
    ]
  },
  3: {
    id: 3,
    name: "Fish Ambul Thiyal",
    description: "Traditional dry fish curry with chunks of fresh tuna, cooked in a rich blend of spices including black pepper, cinnamon, and curry leaves. A signature dish from Southern Sri Lanka.",
    price: 2200.00,
    image: "/sample-dish.png",
    typeOptions: [
      { id: 1, name: "Regular Portion", price: 0 },
      { id: 2, name: "Large Portion", price: 600.00 }
    ],
    recommendedSides: [
      { id: 1, name: "Coconut Rice", price: 450.00, checked: false },
      { id: 2, name: "Kiri Hodi", price: 300.00, checked: false },
      { id: 3, name: "Papadum", price: 150.00, checked: false },
      { id: 4, name: "Pol Sambol", price: 250.00, checked: false }
    ],
    similarDishes: [
      { id: 1, name: "Rice & Curry Special", price: 1850.00, image: "/sample-dish.png" },
      { id: 2, name: "Kottu Roti", price: 1200.00, image: "/sample-dish.png" },
      { id: 5, name: "Hoppers with Curry", price: 950.00, image: "/sample-dish.png" }
    ]
  },
  5: {
    id: 5,
    name: "Hoppers with Curry",
    description: "Traditional Sri Lankan hoppers (appa) - bowl-shaped pancakes made from fermented rice flour, served with spicy chicken curry and coconut sambol.",
    price: 950.00,
    image: "/sample-dish.png",
    typeOptions: [
      { id: 1, name: "Plain Hoppers (3pcs)", price: 0 },
      { id: 2, name: "Egg Hoppers (3pcs)", price: 300.00 }
    ],
    recommendedSides: [
      { id: 1, name: "Coconut Sambol", price: 250.00, checked: false },
      { id: 2, name: "Lunu Miris", price: 150.00, checked: false },
      { id: 3, name: "Kiri Hodi", price: 300.00, checked: false }
    ],
    similarDishes: [
      { id: 6, name: "String Hoppers", price: 850.00, image: "/sample-dish.png" },
      { id: 7, name: "Milk Rice", price: 750.00, image: "/sample-dish.png" },
      { id: 1, name: "Rice & Curry Special", price: 1850.00, image: "/sample-dish.png" }
    ]
  },
  6: {
    id: 6,
    name: "String Hoppers",
    description: "Delicate steamed rice noodle nests (idiyappa) served with aromatic chicken curry and fresh coconut sambol. A popular breakfast dish in Sri Lankan households.",
    price: 850.00,
    image: "/sample-dish.png",
    typeOptions: [
      { id: 1, name: "Regular (6pcs)", price: 0 },
      { id: 2, name: "Extra (10pcs)", price: 400.00 }
    ],
    recommendedSides: [
      { id: 1, name: "Coconut Sambol", price: 250.00, checked: false },
      { id: 2, name: "Chicken Curry", price: 500.00, checked: false },
      { id: 3, name: "Dhal Curry", price: 300.00, checked: false }
    ],
    similarDishes: [
      { id: 5, name: "Hoppers with Curry", price: 950.00, image: "/sample-dish.png" },
      { id: 7, name: "Milk Rice", price: 750.00, image: "/sample-dish.png" },
      { id: 1, name: "Rice & Curry Special", price: 1850.00, image: "/sample-dish.png" }
    ]
  },
  7: {
    id: 7,
    name: "Milk Rice (Kiribath)",
    description: "Traditional Sri Lankan milk rice cooked with coconut milk, served with lunu miris (spicy onion relish) and jaggery. Often enjoyed during special occasions and celebrations.",
    price: 750.00,
    image: "/sample-dish.png",
    typeOptions: [
      { id: 1, name: "Sweet Style", price: 0 },
      { id: 2, name: "Savory Style", price: 0 }
    ],
    recommendedSides: [
      { id: 1, name: "Lunu Miris", price: 150.00, checked: false },
      { id: 2, name: "Jaggery", price: 100.00, checked: false },
      { id: 3, name: "Banana", price: 120.00, checked: false }
    ],
    similarDishes: [
      { id: 5, name: "Hoppers with Curry", price: 950.00, image: "/sample-dish.png" },
      { id: 6, name: "String Hoppers", price: 850.00, image: "/sample-dish.png" },
      { id: 1, name: "Rice & Curry Special", price: 1850.00, image: "/sample-dish.png" }
    ]
  }
};

export const Customer_DishDetailPage: FC = () => {
  const navigate = useNavigate();
  const { dishId } = useParams<{ dishId: string }>();
  const { addItemToCart } = useCustomerCart();
  
  const [quantity, setQuantity] = useState(0);
  const [showRemovePopup, setShowRemovePopup] = useState(false);

  const dish = dishDetails[Number(dishId) as keyof typeof dishDetails];

  // Handler functions
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else if (quantity === 1) {
      // Show popup when trying to reduce from 1 to 0
      setShowRemovePopup(true);
    }
    // If quantity is 0, do nothing (can't go below 0)
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  // Calculate total price
  const totalPrice = dish ? dish.price * quantity : 0;

  if (!dish) {
    return <div>Dish not found</div>;
  }

  const handleClose = () => {
    navigate('/view-menu'); // Go back to menu page
  };

  const handleRemoveConfirm = () => {
    // User confirmed to remove dish, navigate back to menu
    navigate('/view-menu');
  };

  const handleRemoveCancel = () => {
    // User cancelled, just close the popup
    setShowRemovePopup(false);
  };

  const handleAddToCart = () => {
    if (quantity > 0) {
      const dishToAdd = {
        id: dish.id,
        name: dish.name,
        description: dish.description,
        price: dish.price, // Price per item
        ingredients: [],
        image: dish.image
      };
      
      addItemToCart(dishToAdd, quantity);
      
      // Navigate back to menu after adding to cart
      navigate('/view-menu');
    }
    // If quantity is 0, do nothing
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start">
      <div data-layer="View item" className="ViewItem w-full max-w-sm mx-auto min-h-screen relative">
        <div data-layer="detail selected options" className="DetailSelectedOptions w-full min-h-screen bg-white overflow-y-auto pb-24">
          <img 
            data-layer="hero img" 
            className="HeroImg w-96 h-96 left-0 top-0 absolute object-cover" 
            src={dish.image}
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/393x358";
            }}
          />
          {/* Close button overlay on image */}
          <button 
            onClick={handleClose}
            data-layer="image close button" 
            className="ImageCloseButton w-10 h-10 left-4 top-4 absolute bg-black bg-opacity-50 rounded-full flex justify-center items-center hover:bg-opacity-70 transition-all duration-200 backdrop-blur-sm z-10"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div data-layer="content" className="Content w-full mt-[392px] pb-8 inline-flex flex-col justify-start items-center">
            {/* Description Section */}
            <div data-layer="description" className="Description w-full px-6 pb-8 inline-flex flex-col justify-start items-center gap-4">
              <div data-layer="dish header" className="DishHeader inline-flex flex-col justify-start items-center gap-2">
                <div data-layer="dish name" className="DishName text-center text-gray-900 text-xl font-bold leading-7">{dish.name}</div>
                <div data-layer="dish price" className="DishPrice inline-flex items-center gap-1">
                  <div data-layer="price amount" className="PriceAmount text-green-600 text-lg font-bold leading-tight">LKR {dish.price.toFixed(2)}</div>
                </div>
              </div>
              <div data-layer="dish description" className="DishDescription w-full px-4 text-center text-gray-600 text-sm font-normal leading-relaxed">{dish.description}</div>
            </div>

            {/* Quantity Section - Moved right after description with proper gap */}
            <div data-layer="quantity" className="Quantity w-full px-6 py-4 inline-flex flex-col justify-start items-start gap-2.5">
            <div data-layer="quantity bar" className="QuantityBar self-stretch p-4 bg-gray-100 rounded-2xl inline-flex justify-between items-center">
              <div data-layer="number" className="Number w-16 h-4 relative">
                <div data-layer="Quantity" className="Quantity left-0 top-[1px] absolute justify-start text-gray-900 text-xs font-normal leading-none">Quantity</div>
                <div data-layer="quantity value" className="left-[54px] top-0 absolute justify-start text-gray-900 text-xs font-normal leading-none">{quantity}</div>
              </div>
              <div data-layer="button" className="Button px-2 bg-white rounded-xl flex justify-start items-start gap-4">
                <button 
                  onClick={handleDecrement}
                  data-layer="Frame 15360" 
                  className="Frame15360 w-10 h-10 flex justify-center items-center gap-2.5"
                >
                  <div data-layer="minus" className="Minus w-6 h-6 relative flex justify-center items-center">
                    <div data-layer="minus icon" className="MinusIcon w-4 h-0.5 bg-gray-900"></div>
                  </div>
                </button>
                <button 
                  onClick={handleIncrement}
                  data-layer="Frame 15361" 
                  className="Frame15361 w-10 h-10 flex justify-center items-center gap-2.5"
                >
                  <div data-layer="plus" className="Plus w-6 h-6 relative flex justify-center items-center">
                    <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M7 0H5v5H0v2h5v5h2V7h5V5H7V0z"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
          </div>
          <div data-layer="bottom" className="Bottom fixed bottom-0 left-0 right-0 w-full max-w-sm mx-auto px-6 pt-3 pb-8 bg-white border-t-[0.50px] border-gray-300 inline-flex flex-col justify-start items-start gap-2.5 z-40">
            <div data-layer="bottom bar" className="BottomBar self-stretch px-4 pt-4 pb-5 bg-gray-100 rounded-xl backdrop-blur-[50px] inline-flex justify-between items-center">
              <div data-layer="total" className="Total inline-flex flex-col justify-center items-start gap-2">
                <div data-layer="Frame 15401" className="Frame15401 flex flex-col justify-center items-start gap-1">
                  <div data-layer="Total" className="Total justify-start text-gray-900 text-xs font-normal leading-none">Total</div>
                  <div data-layer="total price" className="TotalPrice justify-start text-gray-900 text-base font-semibold leading-tight">LKR {totalPrice.toFixed(2)}</div>
                </div>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={quantity === 0}
                data-layer="button" 
                data-left-icom="true" 
                data-right-icon="true" 
                data-size="small" 
                data-state="default" 
                data-type="primary" 
                className={`Button w-36 h-10 px-6 py-2 rounded-full flex justify-center items-center gap-2.5 transition-colors ${
                  quantity === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600 active:bg-green-700'
                }`}
              >
                <div data-layer="button name" className="ButtonName text-center justify-start text-white text-base font-semibold leading-tight">
                  Add to cart
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Overlay - exactly like your example */}
        {showRemovePopup && (
          <div data-layer="Overlay" className="Overlay w-96 h-[1013px] left-0 top-0 absolute opacity-50 bg-gray-900" />
        )}

        {/* Popup - positioned absolutely within container like your example */}
        {showRemovePopup && (
          <div data-layer="pop up" className="PopUp w-64 px-6 py-8 left-[63px] top-[400px] absolute bg-white rounded-2xl inline-flex flex-col justify-start items-center gap-6">
            <div data-layer="title" className="Title self-stretch flex flex-col justify-start items-center gap-3">
              <div data-layer="Remove dish" className="RemoveDish self-stretch text-center justify-start text-gray-900 text-xl font-semibold leading-normal">Remove dish</div>
              <div data-layer="confirmation text" className="ConfirmationText self-stretch text-center justify-start text-gray-900 text-xs font-normal leading-none">Are you sure you want to remove this dish and go back to the menu?</div>
            </div>
            <div data-layer="button" className="Button flex flex-col justify-start items-center gap-3">
              <button 
                onClick={handleRemoveConfirm}
                data-layer="button" 
                data-left-icom="true" 
                data-right-icon="true" 
                data-size="small" 
                data-state="default" 
                data-type="primary" 
                className="Button w-48 h-10 px-6 py-2 bg-green-500 rounded-[360px] inline-flex justify-center items-center gap-2.5 hover:bg-green-600 transition-colors"
              >
                <div data-layer="button name" className="ButtonName text-center justify-start text-white text-base font-semibold leading-tight">Yes</div>
              </button>
              <button 
                onClick={handleRemoveCancel}
                data-layer="button" 
                data-left-icom="true" 
                data-right-icon="true" 
                data-size="small" 
                data-state="default" 
                data-type="secondary" 
                className="Button w-48 h-10 px-6 py-2 rounded-[360px] border border-gray-300 bg-white inline-flex justify-center items-center gap-2.5 hover:bg-gray-50 transition-colors"
              >
                <div data-layer="button name" className="ButtonName text-center justify-start text-gray-700 text-base font-semibold leading-tight">No</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
