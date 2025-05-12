// SearchBar.jsx
import React from "react";

const SearchBar = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <input
        type="text"
        placeholder="Search"
        className="border rounded px-3 py-2 w-1/2"
      />
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-gray-600">
          Sort:
        </label>
        <select id="sort" className="border rounded px-2 py-1 text-sm">
          <option value="popular">Popular</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
