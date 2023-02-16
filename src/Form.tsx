import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { capitalCase } from "capital-case";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { CalorieCount } from "./CalorieCount";
import { FORM_DEFAULT_VALUES } from "./constants";
import { FoodLookup } from "./FoodLookup";
import { convertTextToDecimal, roundDecimalPlaces } from "./helper";
import { ProgressBar } from "./ProgressBar";
import { getNutritionInformation } from "./request";

export const Form = () => {
  const { register, watch, control, handleSubmit, getValues } = useForm({
    defaultValues: FORM_DEFAULT_VALUES,
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "humanFood",
  });

  const watching = {
    calorieReqs: watch("calorieReqs"),
    dogFoodCalories: watch("dogFoodCalories"),
    humanFoodCalories: watch("humanFoodCalories"),
    dogFoodAmount: watch("dogFoodAmount"),
    // macros: watch("macros"), not implemented yet
    humanFood: watch("humanFood"),
  };

  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watching.humanFood[index],
    };
  });

  const calculateHumanFoodCalories = useMemo(() => {
    let humanFoodCalories = 0;
    // need to incorporate macro requirements
    const length = watching.humanFood.length;
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        humanFoodCalories += watching.humanFood[i].calories;
      }
    }
    return roundDecimalPlaces(humanFoodCalories, 2);
  }, [watching.humanFood]);

  const calculateDogFoodCalories = useMemo(() => {
    return watching.calorieReqs - watching.humanFoodCalories;
  }, [watching.calorieReqs, watching.humanFoodCalories]);

  const calculateTotalCalories = useMemo(() => {
    return calculateDogFoodCalories + calculateHumanFoodCalories;
  }, [calculateDogFoodCalories, calculateHumanFoodCalories]);

  const calculateCaloriesRemaining = useMemo(() => {
    return roundDecimalPlaces(watching.calorieReqs - calculateTotalCalories, 2);
  }, [calculateTotalCalories, watching.calorieReqs]);

  const calculateCupsOfDogFood = useMemo(() => {
    return roundDecimalPlaces(
      calculateDogFoodCalories / watching.dogFoodCalories,
      2
    );
  }, [calculateDogFoodCalories, watching.dogFoodCalories]);

  const calculateProgressBar = useMemo(() => {
    return roundDecimalPlaces(
      (calculateTotalCalories / watching.calorieReqs) * 100,
      0
    );
  }, [calculateTotalCalories, watching.calorieReqs]);

  // to be implemented later
  const onSubmit = async (data: any) => {
    const currentServingSize = convertTextToDecimal(data.currentServingSize);
    console.log(currentServingSize);

    const desiredServingSize = convertTextToDecimal(data.desiredServingSize);
    console.log(desiredServingSize);
  };

  const handleSelectFood = async (e: any) => {
    if (e?.food_name) {
      const response = await getNutritionInformation(e.food_name);
      console.log(response);
      append({
        ...response,
        amount: response.weight,
        calories: response.calories,
      });
    }
  };

  const handleChangeFoodValue = async (
    e: any,
    field: string,
    ratio: number,
    index: number
  ) => {
    const value = parseInt(e.target.value);
    const getValue = getValues(`humanFood.${index}`);
    if (field === "amount") {
      const newValue = roundDecimalPlaces(value * ratio, 2);
      update(index, { ...getValue, amount: value, calories: newValue });
    } else if (field === "calories") {
      const newValue = roundDecimalPlaces(value / ratio, 2);
      update(index, { ...getValue, amount: newValue, calories: value });
    }
  };

  return (
    <>
      <div className="flex justify-center my-2">
        <div className="flex flex-col rounded-2xl w-2/3 p-1.5 bg-amber-500 opacity-95">
          <span className="text-center font-semibold m-0.5 text-gray-800">
            Calories
          </span>
          <ProgressBar percentage={calculateProgressBar} />
          <CalorieCount
            target={watching.calorieReqs}
            total={calculateTotalCalories}
            remainder={calculateCaloriesRemaining}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex m-2 p-2">
          <div className="mx-auto w-full rounded-2xl bg-white p-2">
            <div className="px-4 text-sm text-gray-500">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <label htmlFor="calorieReqs">
                      <span className="text-center">
                        Total calories per day
                      </span>
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
                {/* add support for custom macro nutrients */}
                {/* this should be in a panel */}
                {/* add this feature later, add warning if min macro is not met */}
              </div>
            </div>
            <Disclosure defaultOpen as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-brown-100 px-4 py-2 text-left text-sm font-medium text-brown-900 hover:bg-brown-200 focus:outline-none focus-visible:ring focus-visible:ring-brown-500 focus-visible:ring-opacity-75">
                    <span>Food Items</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "rotate-180 transform" : ""
                      } h-5 w-5 text-brown-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-3 pb-2 text-sm text-gray-500">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex">
                          <label htmlFor="dogFoodCalories">
                            <span>1 cup of dog food</span>
                          </label>
                        </div>
                        <div className="w-24 relative">
                          <input
                            id="dogFoodCalories"
                            type="number"
                            className="my-1 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
                            {...register("dogFoodCalories")}
                          />
                          <span className="absolute text-xs top-3.5 right-2">
                            cal
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex">
                          <label htmlFor="humanFoodCalories">
                            <span>Human food target</span>
                          </label>
                        </div>
                        <div className="w-24 relative">
                          <input
                            id="humanFoodCalories"
                            type="number"
                            className="my-1 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
                            {...register("humanFoodCalories")}
                          />
                          <span className="absolute text-xs top-3.5 right-2">
                            cal
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Implement calculation, need to use macros according to PPP */}
                    <div>
                      <FoodLookup onSelect={(e: any) => handleSelectFood(e)} />
                    </div>
                    <div className="z-1 my-1 border-t-2" key="dogFood">
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex">
                          <label>
                            <span>Dog Food</span>
                          </label>
                        </div>
                        <div className="xs:flex-col flex">
                          <div className="flex items-center">
                            <div className="mx-2">
                              <label htmlFor="humanFoodCalories">
                                <span>Amount</span>
                              </label>
                            </div>
                            <div className="w-24 relative">
                              <input
                                id="dogFoodAmount"
                                type="number"
                                readOnly
                                className="my-1 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
                                value={calculateCupsOfDogFood}
                              />
                              <span className="absolute text-xs top-3.5 right-2">
                                cup(s)
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="mx-2">
                              <label>
                                <span>Calories</span>
                              </label>
                            </div>
                            <div className="w-24 relative">
                              <label>
                                <input
                                  id="dogFoodCalories"
                                  type="number"
                                  readOnly
                                  className="my-1 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
                                  value={calculateDogFoodCalories}
                                />
                                <span className="absolute text-xs top-3.5 right-2">
                                  cal
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {controlledFields.map((field, index) => {
                      return (
                        <div className="my-1 border-t-2" key={field.id}>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center">
                              <button
                                className="m-1"
                                type="button"
                                onClick={() => remove(index)}
                              >
                                <XMarkIcon className="h-5 w-5 text-red-700" />
                              </button>
                              <label>
                                <span>{capitalCase(field.name)}</span>
                              </label>
                            </div>
                            <div className="xs:flex-col flex">
                              <div className="flex items-center">
                                <div className="flex mx-2 ">
                                  <label>
                                    <span>Amount</span>
                                  </label>
                                </div>
                                <div className="w-24 relative">
                                  <input
                                    id={`humanFood.${index}.amount`}
                                    type="number"
                                    className="my-1 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
                                    {...register(`humanFood.${index}.amount`)}
                                    step="0.1"
                                    onBlur={(e) =>
                                      handleChangeFoodValue(
                                        e,
                                        "amount",
                                        field.ratio,
                                        index
                                      )
                                    }
                                  />
                                  <span className="absolute text-xs top-3.5 right-2">
                                    g
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="flex mx-2">
                                  <label>
                                    <span>Calories</span>
                                  </label>
                                </div>
                                <div className="w-24 relative">
                                  <label>
                                    <input
                                      id={`humanFood.${index}.calories`}
                                      type="number"
                                      className="my-1 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
                                      {...register(
                                        `humanFood.${index}.calories`
                                      )}
                                      step="0.1"
                                      onBlur={(e) =>
                                        handleChangeFoodValue(
                                          e,
                                          "calories",
                                          field.ratio,
                                          index
                                        )
                                      }
                                    />
                                    <span className="absolute text-xs top-3.5 right-2">
                                      cal
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      </form>
    </>
  );
};
