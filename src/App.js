import { useState, useEffect } from "react";

import { getExchangeRates } from "./services/currensyAPI";
import Header from "./components/Header";
import CurrencyList from "./components/CurrencyList";
import ConverterForm from "./components/ConverterForm";

import "./styles/App.css";

const App = () => {
  const [currencyData, setCurrencyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getExchangeRates();

      setCurrencyData(data);
    };

    fetchData();
  }, []);

  return (
    <div className="app">
      <Header>
        <CurrencyList data={currencyData} />
      </Header>
      <ConverterForm data={currencyData} />
    </div>
  );
};

export default App;
