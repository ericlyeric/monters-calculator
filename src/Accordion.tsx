import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FoodLookup } from "./FoodLookup";
import { convertTextToDecimal } from "./helper";
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
    caloricIntake: watch("caloricIntake"),
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
      const result =
        (watching.calorieReqs /
          convertTextToDecimal(watching.currentServingSize)) *
        convertTextToDecimal(watching.desiredServingSize);
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

  const handleSelectFood = async (e: any) => {
    console.log(e);
    const response = await getNutritionInformation(e.food_name);
    append(response);
  };
  // create useMemo to calculate total calories in the human foods

  return (
    <div className="flex m-auto md:w-2/3 px-auto-4">
      <div className="md:mx-auto w-full rounded-2xl bg-white p-2 mx-3">
        <Disclosure as="div" defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-brown-100 px-4 py-2 text-left text-sm font-medium text-brown-900 hover:bg-brown-200 focus:outline-none focus-visible:ring focus-visible:ring-brown-500 focus-visible:ring-opacity-75">
                <span>Caloric Requirements</span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-brown-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 py-2 text-sm text-gray-500">
                <div className="flex justify-between mb-2">
                  <div className="flex grow">
                    <label className="mr-2">Intake</label>
                  </div>
                  <div className="flex">
                    <label className="mx-2" htmlFor="perDay">
                      <input
                        className="text-amber-500 focus:ring-amber-500"
                        type="radio"
                        value="per day"
                        id="perDay"
                        {...register("caloricIntake")}
                      />
                      <span className="text-xs">Per day</span>
                    </label>
                    <label className="mx-3" htmlFor="perMeal">
                      <input
                        className="text-amber-500 focus:ring-amber-500"
                        type="radio"
                        value="per meal"
                        id="perMeal"
                        {...register("caloricIntake")}
                      />
                      <span className="text-xs">Per meal</span>
                    </label>
                  </div>
                </div>
                <div className="mt-2">
                  {watching.caloricIntake ? (
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex">
                          <label htmlFor="calorieReqs">
                            <span className="text-center">
                              Calories{" "}
                              {watching.caloricIntake === "per meal"
                                ? "per meal"
                                : "per day"}
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
                      <div className="flex items-center justify-between">
                        <div className="flex">
                          <label htmlFor="currentServingSize">
                            <span>
                              {`Serving size
                          ${
                            watching.caloricIntake === "per meal"
                              ? "per meal"
                              : "per day"
                          }`}
                            </span>
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
                      {/* <label>
                        (OPTIONAL) Do you want to provide macronutrient
                        requirements
                      </label>
                      <div className="my-1">
                        <label className="mx-3" htmlFor="macroNo">
                          <input
                            type="radio"
                            value="false"
                            id="macroNo"
                            {...register("macros")}
                          />
                          <span className="mx-1">No</span>
                        </label>
                        <label className="mx-3" htmlFor="macroYes">
                          <input
                            type="radio"
                            value="true"
                            id="macroYes"
                            {...register("macros")}
                          />
                          <span className="mx-1">Yes</span>
                        </label>
                      </div>
                      {watching.macros === "true" ? (
                        <div>
                          <div className="mt-2">
                            <label htmlFor="proteinReqs">
                              <span>Protein intake</span>
                              <input
                                id="proteinReqs"
                                type="number"
                                className="my-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
                                {...register("proteinReqs")}
                              />
                            </label>
                          </div>
                          <div className="mt-2">
                            <label htmlFor="fatReqs">
                              <span>Fat intake</span>
                              <input
                                id="fatReqs"
                                type="number"
                                className="my-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
                                {...register("fatReqs")}
                              />
                            </label>
                          </div>
                          <div className="mt-2">
                            <label htmlFor="carbReqs">
                              <span>Carbohydrate intake</span>
                              <input
                                id="carbReqs"
                                type="number"
                                className="my-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
                                {...register("carbReqs")}
                              />
                            </label>
                          </div>
                        </div>
                      ) : null} */}
                    </div>
                  ) : null}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure defaultOpen as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-brown-100 px-4 py-2 text-left text-sm font-medium text-brown-900 hover:bg-brown-200 focus:outline-none focus-visible:ring focus-visible:ring-brown-500 focus-visible:ring-opacity-75">
                <span>Meal Plan</span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-brown-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-3 pb-2 text-sm text-gray-500">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <label>Food type</label>
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
                    <label className="mx-3" htmlFor="none">
                      <input
                        className="text-amber-500 focus:ring-amber-500"
                        type="radio"
                        value="none"
                        id="none"
                        {...register("foodType")}
                      />
                      <span className="text-xs">None</span>
                    </label>
                  </div>
                </div>
                {watching.foodType !== "none" ? (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex">
                        <label htmlFor="desiredServingSize">
                          <span>{`Serving size ${
                            watching.caloricIntake === "per meal"
                              ? "per meal"
                              : "per day"
                          }`}</span>
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
                ) : null}

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
                {controlledFields.map((field, index) => {
                  console.log(field);
                  return (
                    <div className="my-1 border-t-2" key={field}>
                      <div className="flex items-center justify-between">
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
                            className="my-1 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
                            {...register(`humanFood.${index}.amount`)}
                          />
                          <span className="absolute text-xs top-3.5 right-2">
                            Tbsp(s)
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
                              id={`humanFood.${index}.calories`}
                              type="number"
                              readOnly
                              className="my-1 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
                              {...register(`humanFood.${index}.calories`)}
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
                    <FoodLookup onSelect={(e: any) => handleSelectFood(e)} />
                  </div>
                ) : null}
                <div className="border-t-4">
                  <div className="flex my-2 items-center justify-between">
                    <span>Calories remaining: </span>
                    <span className="text-xs">
                      {watching.calorieReqs -
                        watching.desiredServingSizeCalories}{" "}
                      cal
                    </span>
                  </div>
                </div>

                <div className="flex my-2 justify-between">
                  <span>Total calories: </span>
                  <span className="text-xs">TODO cal</span>
                </div>
                <div className="my-2">
                  <button
                    className="focus:outline-none text-white bg-brown-700 hover:bg-brown-800 focus:ring-4 focus:ring-brown-300 font-small rounded-lg text-xs px-3 py-2 mb-2 dark:bg-brown-600 dark:hover:bg-brown-700 dark:focus:ring-brown-900"
                    type="submit"
                  >
                    Calculate
                  </button>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
};
