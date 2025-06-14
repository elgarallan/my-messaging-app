import React, { createContext, useContext, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [headers, setHeaders] = useState(() => {
    const token = localStorage.getItem("jwt");
    return token ? { Authorization: `Bearer ${token}` } : {};
  });

  const handleHeaders = (newHeaders) => {
    setHeaders(newHeaders);
  };

  return (
    <DataContext.Provider value={{ headers, handleHeaders }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
