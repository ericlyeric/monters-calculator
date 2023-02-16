interface ProgressBarProps {
  percentage: number;
}

export const ProgressBar = ({ percentage }: ProgressBarProps) => {
  return (
    <div className="flex w-full bg-gray-200 rounded-full dark:bg-gray-700">
      <div
        className={`${
          percentage > 0 ? "bg-red-700" : ""
        } text-xs font-medium h-4 text-amber-100 text-center p-0.5 leading-none rounded-full`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
