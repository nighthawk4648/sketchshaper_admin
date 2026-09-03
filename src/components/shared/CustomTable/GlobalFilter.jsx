import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
const GlobalFilter = ({ search, setSearch, setPaginationPage }) => {
  // const [value, setValue] = useState(filter);
  const onChange = (e) => {
    // setValue(e.target.value);
    setPaginationPage(1);
    setSearch(e.target.value || "");
  };
  return (
    <div>
      <Textinput
        value={search || ""}
        onChange={onChange}
        placeholder="search..."
      />
    </div>
  );
};

export default GlobalFilter;
