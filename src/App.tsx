import React, { BaseSyntheticEvent, SyntheticEvent, useState } from "react";

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

const App = () => {
  // MVP 1
  // input for calories needed per day
  // input for food calories
  // serving size recommendation
  // send results to email

  const [meal, setMeal] = useState(0);
  const [servingSize, setServingSize] = useState(0); // only work in 1/4 = 0.25, 1/3 = 0.333, 2/4 = 0.5, 2/3 = 0.666, 3/4 = 0.75, 1 = 1
  const [form, setForm] = useState([{ name: "" }]);

  const handleChange = (i: number, e: BaseSyntheticEvent) => {
    const newForm = [...form];
    // @ts-ignore
    newForm[i][e.target.name] = e.target.value;
    setForm(newForm);
  };

  const addFormFields = () => {
    setForm([...form, { name: "" }]);
  };

  const removeFormFields = (i: number) => {
    let newForm = [...form];
    newForm.splice(i, 1); // maybe use filter
    setForm(newForm);
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    alert(JSON.stringify(form));
  };

  return (
    <div className="m-5 px-3">
      <h1 className="text-2xl font-medium text-center">Monters Calculator</h1>
      <hr />
      <div className="flex">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Calories per meal</label>
            <input type="text" name="mealcalories" value={meal} />
          </div>
          <div>
            <label>Serving size</label>
            <select name="servingSize">
              {servingSizes.map((size) => {
                return <option>{size.name}</option>;
              })}
            </select>
          </div>
          <hr />
          <div>
            {form.map((element, index) => {
              return (
                <div key={index}>
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={element.name || ""}
                    onChange={(e) => handleChange(index, e)}
                  />
                  {index ? (
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
            })}
            <div>
              <button
                className="rounded-full"
                type="button"
                onClick={() => addFormFields()}
              >
                Add
              </button>
              <button type="submit">Calculate</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
