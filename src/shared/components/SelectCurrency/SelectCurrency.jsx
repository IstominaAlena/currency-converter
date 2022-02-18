import PropTypes from "prop-types";

import s from "./SelectCurrency.module.css";

const SelectCurrency = ({ id, onChange, arr }) => {
  const options = arr.map((item) => (
    <option key={item} value={item}>
      {item}
    </option>
  ));

  return (
    <>
      <select className={s.select} id={id} name="currency" onChange={onChange}>
        {options}
      </select>
    </>
  );
};

export default SelectCurrency;

SelectCurrency.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  arr: PropTypes.arrayOf(PropTypes.string).isRequired,
};
