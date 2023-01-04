import { XMarkIcon } from "@heroicons/react/20/solid";
import Downshift from "downshift";
import { useState } from "react";
import { searchFood } from "./request";

export const FoodLookup = ({ onSelect }: any) => {
  const [lookupState, setLookupState] = useState([]);

  const fetchFoods = async (food: string) => {
    try {
      const response = await searchFood(food);
      setLookupState(response);
    } catch (e) {
      console.log(e);
    }
  };

  const inputOnChange = (e: any) => {
    // implement debouncing
    if (!e.target.value) {
      return;
    }
    fetchFoods(e.target.value);
  };

  return (
    <Downshift
      onChange={(e) => {
        onSelect(e);
      }}
      itemToString={(item) => (item ? item.food_name : "")}
    >
      {({
        selectedItem,
        getInputProps,
        getItemProps,
        highlightedIndex,
        isOpen,
        inputValue,
        getLabelProps,
        clearSelection,
      }) => {
        return (
          <div>
            <div className="flex items-center justify-between my-1 border-t-2">
              <div className="flex">
                <label {...getLabelProps()}>Search</label>
              </div>
              <div className="mt-1 relative">
                <input
                  type="text"
                  className="my-1 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
                  {...getInputProps({
                    placeholder: "Enter food item here",
                    onChange: inputOnChange,
                  })}
                />
                {inputValue ? (
                  <span
                    className="absolute right-2 top-2.5"
                    onClick={() => clearSelection()}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </span>
                ) : null}

                {isOpen ? (
                  <ul className="absolute z-50 top-100 left-0 right-0 border rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    {lookupState
                      .filter(
                        (item: any) =>
                          !inputValue ||
                          item.food_name
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                      )
                      .slice(0, 10)
                      .map((item: any, index) => (
                        <li
                          className={`px-3 py-1 text-xs w-full first:rounded-t-lg last:rounded-b-lg bg-white ${
                            highlightedIndex === index
                              ? "hover:bg-amber-300"
                              : null
                          } ${
                            selectedItem === item ? "font-bold" : "font-normal"
                          }`}
                          {...getItemProps({ key: index, index, item })}
                        >
                          {item.food_name}
                        </li>
                      ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        );
      }}
    </Downshift>
  );
};
