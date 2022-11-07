import Downshift from "downshift";
import { useState } from "react";
import { searchFood } from "./request";

export const FoodLookup = () => {
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
    if (!e.target.value) {
      return;
    }
    fetchFoods(e.target.value);
  };

  const handleOnChange = (selected: any) => {
    alert(`selected ${selected.food_name}`);
  };

  return (
    <Downshift
      onChange={(e) => handleOnChange(e)}
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
            <label {...getLabelProps()}>Choose your food</label>
            <br />
            <input
              type="text"
              className="my-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              {...getInputProps({
                placeholder: "search food",
                onChange: inputOnChange,
              })}
            />
            {isOpen ? (
              <div>
                {
                  // filter the movies in the state
                  state
                    .filter(
                      (item: any) =>
                        !inputValue ||
                        item.food_name
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                    )
                    .slice(0, 10) // return just the first ten. Helps improve performance
                    // map the filtered movies and display their title
                    .map((item: any, index) => (
                      <div
                        className="dropdown-item"
                        {...getItemProps({ key: index, index, item })}
                        style={{
                          backgroundColor:
                            highlightedIndex === index ? "lightgray" : "white",
                          fontWeight: selectedItem === item ? "bold" : "normal",
                        }}
                      >
                        {item.food_name}
                      </div>
                    ))
                }
              </div>
            ) : null}
          </div>
        );
      }}
    </Downshift>
  );
};
