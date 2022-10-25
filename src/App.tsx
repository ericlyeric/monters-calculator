import React, { BaseSyntheticEvent, SyntheticEvent, useState } from "react";

// use https://www.nutritionix.com/

// take average dog food kibble breakdown
// canadian naturals turkey and salmon
// protein 25% min, fat 15% min

// purina pro plan
// protein 28% min, fat 18% min

// ancient grans grass-fed beef dry dog food
// protein 28%, fat 37%, carbs 36%

// {
//   name: "1 tablespoon",
//   value: 1 / 16,
//   index: 0,
// },

const servingSizes = [
  {
    name: "1/4 cup",
    value: 1 / 4,
  },
  {
    name: "1/3 cup",
    value: 1 / 3,
  },
  {
    name: "1/2 cup",
    value: 1 / 2,
  },
  {
    name: "2/3 cup",
    value: 2 / 3,
  },
  {
    name: "3/4 cup",
    value: 3 / 4,
  },
  {
    name: "1 cup",
    value: 1,
  },
];

const humanFood = [
  {
    name: "lean ground beef",
    calories: 196,
    protein: 24.2,
    fat: 10.2,
    carbohydrate: 0,
    weight: 85,
  },
  {
    name: "carrots",
    calories: 16.1,
    protein: 0.4,
    fat: 0.1,
    carbohydrate: 3.8,
    weight: 46,
  },
];

const App = () => {
  // MVP 1
  // input for calories needed per day
  // input for food calories
  // serving size recommendation
  // send results to email
  // maybe work in tablespoons as the unit

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

  const handleSizeChange = (e: BaseSyntheticEvent) => {
    const value = e.target.value;
    setServingSize(value);
  };
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // calculate the next lowest increment of food
    // add support for multiple foods later
    // go one increment lower, fill with real food, lowest they should be able to input is 1 tbsp
    const currentServingSizeIndex = servingSizes.findIndex((size, index) => {
      if (servingSize === size.name) {
        return index;
      }
    }); // since only 1 item
    let suggestedServingSize = currentServingSizeIndex - 1;
    // calculate the calories of the suggested serving size, find the difference
    const differenceInCalories =
      meal * servingSizes[suggestedServingSize].value;
    if (differenceInCalories === 0) {
      alert(JSON.stringify("Input error"));
    }
    const currentHumanFood = humanFood.find(
      (food) => food.name === form[0].name
    ); // only 1 entry
    // calculate the serving size
    console.log(differenceInCalories);
    if (currentHumanFood) {
      const humanFoodInWeight =
        (differenceInCalories / currentHumanFood.calories) *
        currentHumanFood.weight;
      const tablespoonServings = humanFoodInWeight / 15; // 1tbsp = 15g
      alert(
        JSON.stringify(
          `Feed: ${tablespoonServings} tbsps of ${currentHumanFood.name} per meal`
        )
      );
    }
  };

  return (
    <div className="m-5 px-3">
      <h1 className="text-2xl font-medium text-center">Monters Calculator</h1>
      <hr />
      <div className="flex">
        <form onSubmit={handleSubmit}>
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
              {servingSizes.map((size) => {
                return <option value={size.name}>{size.name}</option>;
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
              return;
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
      </div>
    </div>
  );
};

export default App;
