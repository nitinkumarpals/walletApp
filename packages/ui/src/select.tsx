export const Select = ({ options, onSelect }: { onSelect: (value: string) => void, 
  options: {
    key: string;
    value: string;
  } [] }) => {
  return (
    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block  "
      onChange={(event) => {
        onSelect(event.target.value);
      }}
    >
      {options.map((option) => (
        <option key={option.key} value={option.key}>{option.value}</option>
      ))}
    </select>
  );
};
