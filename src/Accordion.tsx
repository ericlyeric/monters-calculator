import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { UseFormRegister } from "react-hook-form";

interface AccordionProps {
  register: UseFormRegister<any>;
  watching: {
    caloricIntake: any;
    calorieReqs: any;
    macros: any;
  };
}

export const Accordion = ({ register, watching }: AccordionProps) => {
  return (
    <div className="flex m-auto md:w-2/3 px-auto-4">
      <div className="md:mx-auto w-full rounded-2xl bg-white p-2 mx-3">
        <Disclosure as="div" defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <span>Caloric Requirements</span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 py-2 text-sm text-gray-500">
                <div className="mb-2">
                  <label>Caloric intake</label>
                  <div className="my-1">
                    <label className="mx-2" htmlFor="perDay">
                      <input
                        type="radio"
                        value="per day"
                        id="perDay"
                        {...register("caloricIntake")}
                      />
                      <span className="mx-1">Per day</span>
                    </label>
                    <label className="mx-3" htmlFor="perMeal">
                      <input
                        type="radio"
                        value="per meal"
                        id="perMeal"
                        {...register("caloricIntake")}
                      />
                      <span className="mx-1">Per meal</span>
                    </label>
                  </div>
                </div>
                <div className="mt-2">
                  {watching.caloricIntake ? (
                    <div>
                      <label htmlFor="calorieReqs">
                        <span>
                          Dog's current caloric intake{" "}
                          {watching.caloricIntake === "per meal"
                            ? "per meal"
                            : "per day"}
                        </span>
                        <input
                          id="calorieReqs"
                          type="number"
                          className="my-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          {...register("calorieReqs")}
                        />
                      </label>
                      <label htmlFor="currentServingSize">
                        <span>
                          {`Dog's current serving size
                          ${
                            watching.caloricIntake === "per meal"
                              ? "per meal"
                              : "per day"
                          } (in cups)`}
                        </span>
                        <input
                          id="currentServingSize"
                          type="number"
                          className="my-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          {...register("currentServingSize")}
                        />
                      </label>
                      <label>
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
                                className="my-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                className="my-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                className="my-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                {...register("carbReqs")}
                              />
                            </label>
                          </div>
                        </div>
                      ) : null}
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
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <span>Meal Plan</span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                <div className="mb-2">
                  <label>Dog Food Type</label>
                  <div className="flex my-1">
                    <label className="mx-2" htmlFor="dry">
                      <input
                        type="radio"
                        value="dry"
                        id="dry"
                        {...register("foodType")}
                      />
                      <span className="mx-1">Dry</span>
                    </label>
                    <label className="mx-3" htmlFor="wet">
                      <input
                        type="radio"
                        value="wet"
                        id="wet"
                        {...register("foodType")}
                      />
                      <span className="mx-1">Wet</span>
                    </label>
                    <label className="mx-3" htmlFor="none">
                      <input
                        type="radio"
                        value="none"
                        id="none"
                        {...register("foodType")}
                      />
                      <span className="mx-1">None</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label>
                    <span>{`Dog's desired serving size ${
                      watching.caloricIntake === "per meal"
                        ? "per meal"
                        : "per day"
                    } (in cups)`}</span>
                    <input
                      id="desiredServingSize"
                      type="number"
                      className="my-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      {...register("desiredServingSize")}
                    />
                  </label>
                </div>
                <div>
                  <button
                    className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-small rounded-lg text-xs px-3 py-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                    type="button"
                  >
                    Add Human Food
                  </button>
                </div>
                <div>
                  <span>Calories remaining: {watching.calorieReqs}</span>
                </div>
                <div>
                  <span>Total calories: </span>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
};