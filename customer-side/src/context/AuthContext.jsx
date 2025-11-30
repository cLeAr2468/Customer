import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [customerData, setCustomerData] = useState(null);
  const [token, setToken] = useState(null);
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    try {
      const storedCustomer = localStorage.getItem("customerData");
      const storedToken = localStorage.getItem("token");
      const storedApiKey = localStorage.getItem("apiKey");

      if (storedCustomer) setCustomerData(JSON.parse(storedCustomer));
      if (storedToken) setToken(storedToken);
      if (storedApiKey) setApiKey(storedApiKey);
    } catch (error) {
      console.error("Auth load error:", error);
      localStorage.clear();
    }
  }, []);

  const login = (customer, jwtToken, apiKeyValue) => {
    localStorage.setItem("customerData", JSON.stringify(customer));
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("apiKey", apiKeyValue);

    setCustomerData(customer);
    setToken(jwtToken);
    setApiKey(apiKeyValue);
  };

  const logout = () => {
    localStorage.removeItem("customerData");
    localStorage.removeItem("token");
    localStorage.removeItem("apiKey");

    setCustomerData(null);
    setToken(null);
    setApiKey(null);
  };

  return (
    <AuthContext.Provider value={{ customerData, token, apiKey, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
