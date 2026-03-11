import { createContext, useContext, useState } from "react";

const PageLoadingContext = createContext();

export const PageLoadingProvider = ({ children }) => {

  const [loading, setLoading] = useState(true);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return (
    <PageLoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
    </PageLoadingContext.Provider>
  );
};

export const usePageLoading = () => useContext(PageLoadingContext);