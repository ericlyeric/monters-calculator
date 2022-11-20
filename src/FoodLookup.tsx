import Downshift from "downshift";
import { useState } from "react";
import { searchFood } from "./request";

export const FoodLookup = ({ onSelect }: any) => {
  const [state, setState] = useState([]);

  const fetchFoods = async (food: string) => {
    try {
      const response = await searchFood(food);
      setState(response);
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

  // const handleOnChange = (selected: any) => {
  //   alert(`selected ${selected.food_name}`);
  // };

  return (
    <Downshift
      onChange={(e) => onSelect(e)}
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
      }) => {
        return (
          <div>
            <div className="flex items-center justify-between my-1 border-t-2">
              <div className="flex">
                <label {...getLabelProps()}>Search</label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  className="my-1 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
                  {...getInputProps({
                    placeholder: "Enter food item here",
                    onChange: inputOnChange,
                  })}
                />
                {isOpen ? (
                  <div className="absolute">
                    <ul className="z-99 rounded-md w-full top-100 shadow-lg ring-1 ring-black ring-opacity-5">
                      {state
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
                            className="px-3 py-1 text-xs w-full"
                            {...getItemProps({ key: index, index, item })}
                            style={{
                              backgroundColor:
                                highlightedIndex === index
                                  ? "lightgray"
                                  : "white",
                              fontWeight:
                                selectedItem === item ? "bold" : "normal",
                            }}
                          >
                            {item.food_name}
                          </li>
                        ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
      }}
    </Downshift>
  );
};
