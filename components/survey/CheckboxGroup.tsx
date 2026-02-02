interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  name: string;
  options: CheckboxOption[];
  values: string[];
  onChange: (values: string[]) => void;
  hasOther?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
  otherLabel?: string;
}

export default function CheckboxGroup({
  name,
  options,
  values,
  onChange,
  hasOther = false,
  otherValue = "",
  onOtherChange,
  otherLabel = "Lainnya:"
}: CheckboxGroupProps) {
  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...values, value]);
    } else {
      onChange(values.filter((v) => v !== value));
    }
  };

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200 group"
        >
          <input
            type="checkbox"
            name={name}
            value={option.value}
            checked={values.includes(option.value)}
            onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
          <span className="ml-3 text-gray-700 group-hover:text-blue-700 font-medium">
            {option.label}
          </span>
        </label>
      ))}
      {hasOther && (
        <label className="flex items-start p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200 group">
          <input
            type="checkbox"
            name={name}
            value="other"
            checked={values.includes("other")}
            onChange={(e) => handleCheckboxChange("other", e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer mt-1"
          />
          <div className="ml-3 flex-1">{otherLabel}
            <span className="text-gray-700 group-hover:text-blue-700 font-medium">Lainnya:</span>
            <input
              type="text"
              value={otherValue}
              onChange={(e) => onOtherChange?.(e.target.value)}
              onClick={() => {
                if (!values.includes("other")) {
                  handleCheckboxChange("other", true);
                }
              }}
              placeholder="Sebutkan..."
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </label>
      )}
    </div>
  );
}
