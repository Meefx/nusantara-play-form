interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  hasOther?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
}

export default function RadioGroup({
  name,
  options,
  value,
  onChange,
  hasOther = false,
  otherValue = "",
  onOtherChange
}: RadioGroupProps) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200 group"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
          <span className="ml-3 text-gray-700 group-hover:text-blue-700 font-medium">
            {option.label}
          </span>
        </label>
      ))}
      {hasOther && (
        <label className="flex items-start p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200 group">
          <input
            type="radio"
            name={name}
            value="other"
            checked={value === "other"}
            onChange={(e) => onChange(e.target.value)}
            className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer mt-1"
          />
          <div className="ml-3 flex-1">
            <span className="text-gray-700 group-hover:text-blue-700 font-medium">Lebih dari 5:</span>
            <input
              type="text"
              value={otherValue}
              onChange={(e) => onOtherChange?.(e.target.value)}
              onClick={() => onChange("other")}
              placeholder="Tulis jumlahnya..."
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </label>
      )}
    </div>
  );
}
