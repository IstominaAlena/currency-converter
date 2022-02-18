import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.privatbank.ua/p24api",
  params: {
    json: true,
    exchange: true,
    coursid: 5,
  },
});

const path = "/pubinfo";

export const getExchangeRates = async () => {
  const { data } = await instance.get(path);
  return data;
};
