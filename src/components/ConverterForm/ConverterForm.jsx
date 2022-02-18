import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";

import { isEmpty } from "../../shared/functions/isEmpty";
import { chooseSelected } from "../../shared/functions/chooseSelected";

import AmountInput from "../../shared/components/AmountInput";
import SelectCurrency from "../../shared/components/SelectCurrency";

import c from "../../shared/styles/container.module.css";
import s from "./ConverterForm.module.css";

const options = ["EUR", "USD", "RUR", "UAH"];

const ConverterForm = ({ data }) => {
  const [fromCode, setFromCode] = useState("");
  const [toCode, setToCode] = useState("");
  const [fromObj, setFromObj] = useState({});
  const [toObj, setToObj] = useState({});
  const [fromValue, setFromValue] = useState(null);
  const [toValue, setToValue] = useState(null);
  const isFirstRender = useRef(true);

  const findObj = ({ id, value }) => {
    if (id === "from-select") {
      setFromCode(value);
      if (value === "UAH") {
        setFromValue(calculateValue(id, value));
        return;
      }
      const obj = data.find((item) => item.ccy === value);
      !isEmpty(obj) && setFromObj(obj);
      setFromValue(calculateValue(id, value));
      return;
    }

    if (id === "to-select") {
      setToCode(value);

      if (value === "UAH") {
        setToValue(calculateValue(id, value));
        return;
      }
      try {
        const obj = data.find((item) => item.ccy === value);
        !isEmpty(obj) && setToObj(obj);

        setToValue(calculateValue(id, value));
      } catch (error) {
        console.log(error);
      }

      return;
    }
  };

  useEffect(() => {
    const fromInput = document.getElementById("from-input");
    const fromSelect = document.getElementById("from-select");
    const toSelect = document.getElementById("to-select");

    if (isFirstRender.current) {
      isFirstRender.current = false;
      chooseSelected(fromSelect, "USD");
      chooseSelected(toSelect, "UAH");
      fromInput.value = 1;
    }

    findObj(fromSelect);
    findObj(toSelect);
    calculateAmount(fromInput);
  }, [findObj]);

  const calculateValue = (id, value) => {
    if (id === "from-select") {
      if (value === "UAH") {
        const result = (1 / toObj.buy).toFixed(4);
        return result;
      }
      const result = !isEmpty(toObj)
        ? (fromObj.buy / toObj.buy).toFixed(4)
        : Number(fromObj.buy).toFixed(4);
      return result;
    }

    if (id === "to-select") {
      if (value === "UAH") {
        const result = (1 / fromObj.buy).toFixed(4);
        return result;
      }
      const result = !isEmpty(fromObj)
        ? (toObj.buy / fromObj.buy).toFixed(4)
        : Number(toObj.buy).toFixed(4);
      return result;
    }
  };

  const calculateAmount = ({ id, value }) => {
    if (id === "from-input") {
      const resultInput = document.getElementById("to-input");
      resultInput.value = (value * fromValue).toFixed(4);
      return;
    }

    const resultInput = document.getElementById("from-input");
    resultInput.value = (value * toValue).toFixed(4);
    return;
  };

  const onHandleChange = (e) => {
    const { id } = e.target;
    if (id === "from-input" || id === "to-input") {
      calculateAmount(e.target);
    }
    if (id === "from-select" || id === "to-select") {
      findObj(e.target);
    }
  };

  const onHandleClick = () => {
    const fromSelect = document.getElementById("from-select");
    const toSelect = document.getElementById("to-select");

    fromSelect.value = toCode;
    toSelect.value = fromCode;

    findObj(fromSelect);
    findObj(toSelect);
  };

  return (
    <div className={c.container}>
      <form className={s.form}>
        <p className={s.title}>Конвертер валют</p>
        <div className={s.converter}>
          <div className={s.side}>
            <AmountInput
              id="from-input"
              text="Отдаю"
              onChange={debounce(onHandleChange, 250)}
            />
            <SelectCurrency
              id="from-select"
              onChange={onHandleChange}
              arr={options}
            />

            {fromValue && (
              <span className={s.text}>
                1 {fromCode} = {fromValue}
                {toCode}
              </span>
            )}
          </div>

          <button className={s.btn} type="button" onClick={onHandleClick}>
            &#10227;
          </button>

          <div className={s.side}>
            <AmountInput
              id="to-input"
              text="Забираю"
              onChange={debounce(onHandleChange, 250)}
            />
            <SelectCurrency
              id="to-select"
              onChange={onHandleChange}
              arr={options}
            />

            {toValue && (
              <span className={s.text}>
                1 {toCode} = {toValue}
                {fromCode}
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ConverterForm;

ConverterForm.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      base_ccy: PropTypes.string.isRequired,
      buy: PropTypes.string.isRequired,
      sale: PropTypes.string.isRequired,
      ccy: PropTypes.string.isRequired,
    })
  ),
};
