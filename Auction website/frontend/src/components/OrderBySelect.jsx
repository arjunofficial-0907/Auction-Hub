import React from 'react';
import { ChevronDown } from 'lucide-react';

const OrderBySelect = ({ value, onChange, options }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="appearance-none bg-background border border-input rounded-md pl-3 pr-10 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
};

export default OrderBySelect;
