export const FORM_DEFAULT_VALUES = {
  calorieReqs: 0,
  macros: "false",
  proteinReqs: 28, // according to PPP
  fatReqs: 18, // according to PPP
  carbReqs: 0, // none
  dogFoodAmount: 0,
  dogFoodCalories: 0,
  humanFoodCalories: 0,
  humanFood: [] as humanFoodProps[],
};

interface humanFoodProps {
  name: string;
  amount: number;
  calories: number;
  ratio: number;
}
