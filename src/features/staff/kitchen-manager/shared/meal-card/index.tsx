import type { FC } from "react";
import { Link } from "react-router";
import "./index.css";

type MealCardProps = {
  mealId: string;
  name: string;
  price: number;
  status: string;
  imageUrl: string;
  desc?: string;
};

export const MealCard: FC<MealCardProps> = ({
  mealId,
  name,
  price,
  status,
  imageUrl,
  desc = "",
}) => {
  return (
    <Link
      to={`/staff/kitchen-manager/meals/meal-item/${mealId}`}
      className="meal-card"
      style={{ cursor: "pointer" }}
    >
      <img src={imageUrl} />
      <h4>{name}</h4>
      <p className="desc">{desc}</p>
      <div className="meta">
        <span className="price">Rs. {price}</span>
        <span className={`status ${status.toLowerCase()}`}>{status}</span>
      </div>
    </Link>
  );
};
