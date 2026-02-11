interface ConsentToggleProps {
  value: "allow" | "deny" | "discuss";
  onChange: (value: "allow" | "deny" | "discuss") => void;
  label: string;
  description?: string;
}

export default function ConsentToggle({
  value,
  onChange,
  label,
  description,
}: ConsentToggleProps) {
  const options = [
    {
      value: "allow" as const,
      label: "許可",
      color: "bg-green-100 text-green-800 border-green-300",
    },
    {
      value: "discuss" as const,
      label: "要相談",
      color: "bg-amber-100 text-amber-800 border-amber-300",
    },
    {
      value: "deny" as const,
      label: "拒否",
      color: "bg-red-100 text-red-800 border-red-300",
    },
  ];

  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
      </div>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex-1 cursor-pointer whitespace-nowrap rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all duration-200
              ${
                value === option.value
                  ? option.color
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
