import { Form } from "./Form";

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

// MVP 1
// input for calories needed per day
// input for food calories
// serving size recommendation
// send results to email
// maybe work in tablespoons as the unit
const App = () => {
  return (
    <>
      <div className="flex flex-col">
        <h1 className="my-3 text-2xl font-medium text-center">
          Monters' Calculator
        </h1>
      </div>
      <div className="flex flex-col">
        <Form />
      </div>
    </>
  );
};

export default App;
