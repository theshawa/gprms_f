export enum Meal {
  Brunch = "Brunch",
  Lunch = "Lunch",
  HighTea = "HighTea",
  Dinner = "Dinner",
}

export const getNameForMeal = (meal: Meal): string => {
  switch (meal) {
    case Meal.Lunch:
      return "Lunch";
    case Meal.Dinner:
      return "Dinner";
    case Meal.HighTea:
      return "High Tea";
    case Meal.Brunch:
      return "Brunch";
    default:
      return "Unknown Meal";
  }
};
