import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FoodLookup } from "./FoodLookup";
import { convertTextToDecimal, roundDecimalPlaces } from "./helper";
import { getNutritionInformation } from "./request";
import { capitalCase } from "capital-case";

export const Accordion = () => {
  const methods = useFormContext();
  const { register, watch, control, setValue } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "humanFood",
  });

  const watching = {
    calorieReqs: watch("calorieReqs"),
    currentServingSize: watch("currentServingSize"),
    desiredServingSize: watch("desiredServingSize"),
    desiredServingSizeCalories: watch("desiredServingSizeCalories"),
    macros: watch("macros"),
    foodType: watch("foodType"),
    isHumanFood: watch("isHumanFood"),
    humanFood: watch("humanFood"),
  };

  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watching.humanFood[index],
    };
  });

  const calculateDesiredServingSizeCalories = useMemo(() => {
    if (
      watching.calorieReqs &&
      watching.currentServingSize &&
      watching.desiredServingSize
    ) {
      const result = roundDecimalPlaces(
        (watching.calorieReqs /
          convertTextToDecimal(watching.currentServingSize)) *
          convertTextToDecimal(watching.desiredServingSize),
        2
      );
      setValue("desiredServingSizeCalories", result);
      return result;
    }
    setValue("desiredServingSizeCalories", 0);
    return 0;
  }, [
    setValue,
    watching.calorieReqs,
    watching.currentServingSize,
    watching.desiredServingSize,
  ]);

  const calculateHumanFoodCalories = useMemo(() => {
    let humanFoodCalories = 0;
    // need to incorporate macro requirements
    const length = watching.humanFood.length;
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        humanFoodCalories += watching.humanFood[i].amountCalories;
      }
    }
    return roundDecimalPlaces(humanFoodCalories, 2);
  }, [watching.humanFood]);

  const calculateCaloriesRemaining = useMemo(() => {
    return roundDecimalPlaces(
      watching.calorieReqs -
        watching.desiredServingSizeCalories -
        calculateHumanFoodCalories,
      2
    );
  }, [
    calculateHumanFoodCalories,
    watching.calorieReqs,
    watching.desiredServingSizeCalories,
  ]);

  const handleSelectFood = async (e: any) => {
    if (e?.food_name) {
      const response = await getNutritionInformation(e.food_name);
      console.log(response);
      // figure out macros here
      // need to come up with equations, for 2 items it would be 6 unknowns, 6 equations
      // however these are just ratios just the values need to be satisfied
      const amountCalories = roundDecimalPlaces(
        watching.calorieReqs - watching.desiredServingSizeCalories,
        2
      );
      const amount = roundDecimalPlaces(
        amountCalories / (response.calories / response.weight),
        2
      );
      append({
        ...response,
        amount,
        amountCalories,
      });
    }
  };

  return (
    <div className="flex m-auto md:w-2/3 px-auto-4">
      <div className="md:mx-auto w-full rounded-2xl bg-white p-2 mx-3">
        <Disclosure as="div" defaultOpen>
          {({ open }) => (
            <>
              {/* add tip on how to or where to find calorie info as help button */}
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-brown-100 px-4 py-2 text-left text-sm font-medium text-brown-900 hover:bg-brown-200 focus:outline-none focus-visible:ring focus-visible:ring-brown-500 focus-visible:ring-opacity-75">
                <span>Recommended daily caloric intake</span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-brown-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 py-1 text-sm text-gray-500">
                <div className="mt-1">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex">
                        <label htmlFor="calorieReqs">
                          <span className="text-center">Calories</span>
                        </label>
                      </div>
                      <div className="w-24 relative">
                        <input
                          id="calorieReqs"
                          type="number"
                          className="my-1 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
                          {...register("calorieReqs")}
                        />
                        <span className="absolute text-xs top-3.5 right-2">
                          cal
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex">
                        <label htmlFor="currentServingSize">
                          <span>Serving size</span>
                        </label>
                      </div>
                      <div className="w-24 relative">
                        <input
                          id="currentServingSize"
                          type="text"
                          className="my-1 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
                          {...register("currentServingSize")}
                        />
                        <span className="absolute text-xs top-3.5 right-2">
                          cup(s)
                        </span>
                      </div>
                    </div>
                    {/* add support for custom macro nutrients */}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure defaultOpen as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-brown-100 px-4 py-2 text-left text-sm font-medium text-brown-900 hover:bg-brown-200 focus:outline-none focus-visible:ring focus-visible:ring-brown-500 focus-visible:ring-opacity-75">
                <span>
                  What is the desired split between dog food and human food
                </span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-brown-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-3 pb-2 text-sm text-gray-500">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <label>Dog food type</label>
                  </div>
                  <div className="flex">
                    <label className="mx-2" htmlFor="dry">
                      <input
                        className="text-amber-500 focus:ring-amber-500"
                        type="radio"
                        value="dry"
                        id="dry"
                        {...register("foodType")}
                      />
                      <span className="text-xs">Dry</span>
                    </label>
                    <label className="mx-3" htmlFor="wet">
                      <input
                        className="text-amber-500 focus:ring-amber-500"
                        type="radio"
                        value="wet"
                        id="wet"
                        {...register("foodType")}
                      />
                      <span className="text-xs">Wet</span>
                    </label>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex">
                      <label htmlFor="desiredServingSize">
                        <span>Serving size</span>
                      </label>
                    </div>
                    <div className="w-24 relative">
                      <input
                        id="desiredServingSize"
                        type="text"
                        className="my-1 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
                        {...register("desiredServingSize")}
                      />
                      <span className="absolute text-xs top-3.5 right-2">
                        cup(s)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex">
                      <label htmlFor="desiredServingSizeCalories">
                        <span>{`Calories in ${watching.foodType} food`}</span>
                      </label>
                    </div>
                    <div className="w-24 relative">
                      <input
                        readOnly
                        disabled
                        id="desiredServingSizeCalories"
                        type="number"
                        value={calculateDesiredServingSizeCalories}
                        className="my-1 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
                        {...register("desiredServingSizeCalories")}
                      />
                      <span className="absolute text-xs top-3.5 right-2">
                        cal
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex">
                    <label>Human food</label>
                  </div>
                  <div className="flex my-1">
                    <label className="mx-2" htmlFor="yes">
                      <input
                        className="text-amber-500 focus:ring-amber-500"
                        type="radio"
                        value="true"
                        id="yes"
                        {...register("isHumanFood")}
                      />
                      <span className="text-xs">Yes</span>
                    </label>
                    <label className="mx-3" htmlFor="no">
                      <input
                        className="text-amber-500 focus:ring-amber-500"
                        type="radio"
                        value="false"
                        id="no"
                        {...register("isHumanFood")}
                      />
                      <span className="text-xs">No</span>
                    </label>
                  </div>
                </div>

                {/* Implement calculation, need to use macros according to PPP */}
                {controlledFields.map((field, index) => {
                  return (
                    <div className="my-1 border-t-2" key={field}>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex">
                          <label>
                            <span>{capitalCase(field.name)}</span>
                          </label>
                        </div>
                        <div className="flex">
                          <button type="button" onClick={() => remove(index)}>
                            <XMarkIcon className="h-5 w-5 text-red-700" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex">
                          <label>
                            <span>Amount</span>
                          </label>
                        </div>
                        <div className="w-24 relative">
                          <input
                            id={`humanFood.${index}.amount`}
                            type="number"
                            readOnly
                            className="my-1 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
                            {...register(`humanFood.${index}.amount`)}
                          />
                          <span className="absolute text-xs top-3.5 right-2">
                            g
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex">
                          <label>
                            <span>Calories</span>
                          </label>
                        </div>
                        <div className="w-24 relative">
                          <label>
                            <input
                              id={`humanFood.${index}.amountCalories`}
                              type="number"
                              readOnly
                              className="my-1 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
                              {...register(`humanFood.${index}.amountCalories`)}
                            />
                            <span className="absolute text-xs top-3.5 right-2">
                              cal
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {watching.isHumanFood === "true" ? (
                  <div>
                    <div>
                      <FoodLookup onSelect={(e: any) => handleSelectFood(e)} />
                    </div>
                    <div className="border-t-4">
                      <div className="flex my-2 items-center justify-between">
                        <span>Calories remaining</span>
                        {/* need to iterate through human food */}
                        <span className="text-xs">
                          {calculateCaloriesRemaining} cal
                        </span>
                      </div>
                    </div>

                    <div className="flex my-2 justify-between">
                      <span>Calories from dog food</span>
                      <span className="text-xs">
                        {watching.desiredServingSizeCalories} cal
                      </span>
                    </div>
                    <div className="flex my-2 justify-between">
                      <span>Calories from human food</span>
                      {/* need to iterate through the human food */}
                      <span className="text-xs">
                        {calculateHumanFoodCalories} cal
                      </span>
                    </div>
                    <div className="flex my-2 justify-between">
                      <span>Total calories: </span>
                      <span className="text-xs">
                        {watching.calorieReqs} cal
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center border-t-4">
                    <div className="mt-2">
                      <span>Nothing to calculate</span>
                    </div>
                  </div>
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
};
