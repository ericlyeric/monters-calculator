import { Form } from "./Form";
import cavachon from "./assets/cavachon01.png";

// use https://www.nutritionix.com/

// according to AAFCO (Association of American Feed Control Officials)
// https://www.aafco.org/Portals/0/SiteContent/Regulatory/Committees/Pet-Food/Reports/Pet_Food_Report_2013_Midyear-Proposed_Revisions_to_AAFCO_Nutrient_Profiles.pdf
// the adult maintenance minimum is 18% crude protein, and 5.5% crude fat
// there is no minimum for carbohydrates

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

const App = () => {
  return (
    <div
      className="h-screen bg-repeat"
      style={{
        backgroundImage: `url(${cavachon}`,
        backgroundSize: "100px",
        opacity: "90%",
      }}
    >
      <div className="flex flex-col">
        <h1 className="my-3 text-2xl font-medium text-center">
          <span className="bg-white rounded-md p-2 opacity-95">
            Monters' Calculator
          </span>
        </h1>
      </div>
      <div className="flex flex-col py-3 opacity-95">
        <Form />
      </div>
    </div>
  );
};

export default App;
