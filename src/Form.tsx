/* eslint-disable array-callback-return */
import { BaseSyntheticEvent, SyntheticEvent, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Accordion } from "./Accordion";
import { SERVING_SIZES, FORM_DEFAULT_VALUES } from "./constants";
import { getNutritionInformation } from "./request";

export const Form = () => {
  const methods = useForm({
    defaultValues: FORM_DEFAULT_VALUES,
  });

  const [meal, setMeal] = useState(0);
  const [servingSize, setServingSize] = useState(""); // only work in 1/4 = 0.25, 1/3 = 0.333, 2/4 = 0.5, 2/3 = 0.666, 3/4 = 0.75, 1 = 1
  const [form, setForm] = useState([{ name: "" }]);
  const [showHumanFood, setShowHumanFood] = useState(false);

  const handleChange = (i: number, e: BaseSyntheticEvent) => {
    const newForm = [...form];
    // @ts-ignore
    newForm[i][e.target.name] = e.target.value;
    setForm(newForm);
  };

  const handleSizeChange = (e: BaseSyntheticEvent) => {
    const value = e.target.value;
    setServingSize(value);
  };

  const addFormFields = () => {
    if (showHumanFood === false) {
      setShowHumanFood(true);
    } else {
      setForm([...form, { name: "" }]);
    }
  };

  const removeFormFields = (i: number) => {
    let newForm = [...form];
    newForm.splice(i, 1); // maybe use filter
    setForm(newForm);
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const response = await getNutritionInformation(form[0].name);
    // calculate the next lowest increment of food
    // add support for multiple foods later
    // go one increment lower, fill with real food, lowest they should be able to input is 1 tbsp
    const currentServingSizeIndex = SERVING_SIZES.findIndex((size, index) => {
      if (servingSize === size.name) {
        return index;
      }
    }); // since only 1 item
    let suggestedServingSize = currentServingSizeIndex - 1;
    // calculate the calories of the suggested serving size, find the difference
    const differenceInCalories =
      meal * SERVING_SIZES[suggestedServingSize].value;
    if (differenceInCalories === 0) {
      alert(JSON.stringify("Input error"));
    }
    const humanFoodInWeight =
      (differenceInCalories / response.calories) * response.weight;
    const tablespoonServings = humanFoodInWeight / 15; // 1tbsp = 15g
    alert(
      JSON.stringify(
        `Feed: ${tablespoonServings} tbsps of ${response.name} per meal`
      )
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        {/* <Accordion register={register} watching={watching} /> */}
        <Accordion />
        <div>
          <label>Calories per meal (dry kibble)</label>
          <input
            type="number"
            name="mealcalories"
            value={meal}
            onChange={(e) => setMeal(parseInt(e.target.value, 10))}
          />
        </div>
        <div>
          <label>Current serving size (dry kibble)</label>
          <select name="servingSize" onChange={(e) => handleSizeChange(e)}>
            {SERVING_SIZES.map((size) => {
              return (
                <option key={size.name} value={size.name}>
                  {size.name}
                </option>
              );
            })}
          </select>
        </div>
        <hr />
        <div>
          {form.map((element, index) => {
            if (showHumanFood) {
              return (
                <div key={index}>
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={element.name || ""}
                    onChange={(e) => handleChange(index, e)}
                  />
                  {index > -1 ? (
                    <button
                      type="button"
                      className="button remove"
                      onClick={() => removeFormFields(index)}
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              );
            }
          })}
          {form.length < 1 || showHumanFood === false ? (
            <div>
              <button
                className="rounded-full"
                type="button"
                onClick={() => addFormFields()}
              >
                Add Human Food
              </button>
            </div>
          ) : null}
          <p>will add support for multiple foods later</p>
        </div>
        {/* disable button until calories per meal is filled in */}
        <button type="submit" disabled={meal <= 0}>
          Calculate
        </button>
      </form>
    </FormProvider>
  );
};
