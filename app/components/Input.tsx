interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "number" | "date";
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  className = "",
}: InputProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm text-gray-600">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
