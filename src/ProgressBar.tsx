import { useMemo } from "react";

interface ProgressBarProps {
  currentValue: number;
  maxValue: number;
}

export const ProgressBar = ({ currentValue, maxValue }: ProgressBarProps) => {
  const percentage = useMemo(() => {
    return (currentValue / maxValue) * 100;
  }, [currentValue, maxValue]);

  return (
    <div className="flex w-full bg-gray-200 rounded-full dark:bg-gray-700">
      <div
        className="bg-red-700 text-xs font-medium h-4 text-amber-100 text-center p-0.5 leading-none rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
