import PropTypes from "prop-types";

import s from "./CurrencyList.module.css";

const CurrencyList = ({ data }) => {
  const rounded = (number) => {
    return Math.round(parseFloat(number) * 1000) / 1000;
  };

  const items = data.map(({ ccy, base_ccy, buy, sale }) => {
    return (
      <li key={ccy} className={s.item}>
        <h2 className={s.title}>
          {ccy}/{base_ccy}
        </h2>
        <p className={s.text}>
          Покупка: <span className={s.amount}>{rounded(buy)}</span>
        </p>
        <p className={s.text}>
          Продажа: <span className={s.amount}>{rounded(sale)}</span>
        </p>
      </li>
    );
  });

  return <ul className={s.list}>{items}</ul>;
};

export default CurrencyList;

CurrencyList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      base_ccy: PropTypes.string.isRequired,
      buy: PropTypes.string.isRequired,
      sale: PropTypes.string.isRequired,
      ccy: PropTypes.string.isRequired,
    })
  ),
};
