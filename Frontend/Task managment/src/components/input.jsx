export default function Input({ label, type = "text", value, onChange, placeholder, error }) {
    return (
      <div className="mb-4">
        {label && <label className="block text-sm font-medium mb-1">{label}</label>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
            error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
          }`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
  