import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

type MealCardProps = {
  mealId: string;
  name: string;
  price: number;
  status: string;
  imageUrl: string;
  // desc?: string;
};

export const MealCard: FC<MealCardProps> = ({
  mealId,
  name,
  price,
  status,
  imageUrl,
  // desc = "",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/staff/kitchen-manager/meals/meal-item/${mealId}`);
  };

  return (
    <div
      className="meal-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <img src={imageUrl} />
      <h4>{name}</h4>
      <p className="desc">{}</p>
      <div className="meta">
        <span className="price">Rs. {price}</span>
        <span className={`status ${status.toLowerCase()}`}>{status}</span>
      </div>
    </div>
  );
};
