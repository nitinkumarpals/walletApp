export const Select = ({ options, onSelect }: { onSelect: (value: string) => void, 
  options: {
    key: string;
    value: string;
  } [] }) => {
  return (
    <select
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
