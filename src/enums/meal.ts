export enum Meal {
  Breakfast = "Breakfast",
  Lunch = "Lunch",
  Dinner = "Dinner",
  HighTea = "HighTea",
  Snack = "Snack",
  Brunch = "Brunch",
  Supper = "Supper",
  LateNight = "LateNight",
}

export const getNameForMeal = (meal: Meal): string => {
  switch (meal) {
    case Meal.Breakfast:
      return "Breakfast";
    case Meal.Lunch:
      return "Lunch";
    case Meal.Dinner:
      return "Dinner";
    case Meal.HighTea:
      return "High Tea";
    case Meal.Snack:
      return "Snack";
    case Meal.Brunch:
      return "Brunch";
    case Meal.Supper:
      return "Supper";
    case Meal.LateNight:
      return "Late Night";
    default:
      return "Unknown Meal";
  }
};
