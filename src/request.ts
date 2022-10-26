import axios, { AxiosResponse } from "axios";

export const getNutritionInformation = async (foodItem: string) => {
  const response = await axios.post(
    `https://trackapi.nutritionix.com/v2/natural/nutrients?x-app-id=${process.env.REACT_APP_X_APP_ID}&x-app-key=${process.env.REACT_APP_X_APP_KEY}`,
    {
      query: foodItem,
    }
  );
  return parseGetNutritionInformationResponse(response);
};

interface GetNutritionInformationProps {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrate: number;
  weight: number;
}

const parseGetNutritionInformationResponse = (
  response: AxiosResponse
): GetNutritionInformationProps => {
  const {
    food_name: name,
    nf_calories: calories,
    nf_protein: protein,
    nf_total_fat: fat,
    nf_total_carbohydrate: carbohydrate,
    serving_weight_grams: weight,
  } = response.data.foods[0];

  return {
    name,
    calories,
    protein,
    fat,
    carbohydrate,
    weight,
  };
};
