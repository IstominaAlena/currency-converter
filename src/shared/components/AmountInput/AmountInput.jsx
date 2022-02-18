import PropTypes from "prop-types";

import s from "./AmountInput.module.css";

const AmountInput = ({ id, onChange, text }) => (
  <>
    <label htmlFor={id} className={s.label}>
      {text}
    </label>
    <input
      className={s.input}
      type="tel"
      name="amount"
      id={id}
      onChange={onChange}
    />
  </>
);
export default AmountInput;

AmountInput.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  text: PropTypes.string.isRequired,
};
