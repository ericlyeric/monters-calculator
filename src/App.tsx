import React, { BaseSyntheticEvent, SyntheticEvent, useState } from "react";

const App = () => {
  // MVP 1
  // input for calories needed per day
  // input for food calories
  // serving size recommendation
  // send results to email
  return (
    <div>
      <Form />
    </div>
  );
};

export default App;

interface HumanFoodFieldProps {
  name: string;
  calories: number;
}

const Form = () => {
  const [form, setForm] = useState<HumanFoodFieldProps[]>([
    { name: "", calories: 0 },
  ]);

  const handleChange = (i: number, e: BaseSyntheticEvent) => {
    const newForm = [...form];
    // @ts-ignore
    newForm[i][e.target.name] = e.target.value;
    setForm(newForm);
  };

  const addFormFields = () => {
    setForm([...form, { name: "", calories: 0 }]);
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
    <form onSubmit={handleSubmit}>
      <div>
        <label>Calories per day</label>
        <input
          type="number"
          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity:50"
        />
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
              <label>Calories</label>
              <input
                type="text"
                name="calories"
                value={element.calories || ""}
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
          <button type="button" onClick={() => addFormFields()}>
            Add
          </button>
          <button type="submit">Submit</button>
        </div>
      </div>
    </form>
  );
};
