/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
import { BaseSyntheticEvent, SyntheticEvent, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Accordion } from "./Accordion";
import { SERVING_SIZES, FORM_DEFAULT_VALUES } from "./constants";
import { convertTextToDecimal } from "./helper";
import { getNutritionInformation } from "./request";

export const Form = () => {
  const methods = useForm({
    defaultValues: FORM_DEFAULT_VALUES,
  });

  const onSubmit = async (data: any) => {
    const currentServingSize = convertTextToDecimal(data.currentServingSize);
    console.log(currentServingSize);

    const desiredServingSize = convertTextToDecimal(data.desiredServingSize);
    console.log(desiredServingSize);

    // calculate the desired calories
    // get the ratio of the current calories/currents serving size = desired calories/ desired serving size
    // CC / CSS * DSS = DC
    // const response = await getNutritionInformation(data.[0].name);
    // // calculate the next lowest increment of food
    // // add support for multiple foods later
    // // go one increment lower, fill with real food, lowest they should be able to input is 1 tbsp
    // const currentServingSizeIndex = SERVING_SIZES.findIndex((size, index) => {
    //   if (servingSize === size.name) {
    //     return index;
    //   }
    // }); // since only 1 item
    // let suggestedServingSize = currentServingSizeIndex - 1;
    // // calculate the calories of the suggested serving size, find the difference
    // const differenceInCalories =
    //   meal * SERVING_SIZES[suggestedServingSize].value;
    // if (differenceInCalories === 0) {
    //   alert(JSON.stringify("Input error"));
    // }
    // const humanFoodInWeight =
    //   (differenceInCalories / response.calories) * response.weight;
    // const tablespoonServings = humanFoodInWeight / 15; // 1tbsp = 15g
    // alert(
    //   JSON.stringify(
    //     `Feed: ${tablespoonServings} tbsps of ${response.name} per meal`
    //   )
    // );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Accordion />
      </form>
    </FormProvider>
  );
};
