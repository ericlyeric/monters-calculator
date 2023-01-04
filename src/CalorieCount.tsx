interface CalorieCountProps {
  target: number;
  total: number;
  remainder: number;
}

export const CalorieCount = ({
  target,
  total,
  remainder,
}: CalorieCountProps) => {
  return (
    <div className="flex flex-row text-sm mx-2 justify-between text-gray-800 text-center italic">
      <div className="flex flex-col">
        <span>Target</span>
        <span>{target}</span>
      </div>
      <div className="flex flex-col">
        <span>Total</span>
        <span>{total}</span>
      </div>
      <div className="flex flex-col">
        <span>Remainder</span>
        <span>{remainder}</span>
      </div>
    </div>
  );
};
