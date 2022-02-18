/* eslint-disable react-hooks/exhaustive-deps */
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
    let setCode, setObj;

    if (id === "from-select") {
      setCode = setFromCode;
      setObj = setFromObj;
    }

    if (id === "to-select") {
      setCode = setToCode;
      setObj = setToObj;
    }

    setCode(value);

    if (value === "UAH") {
      calculateValue();
      return;
    }

    const obj = data.find((item) => item.ccy === value);

    !isEmpty(obj) && setObj(obj);

    calculateValue();

    return;
  };

  const calculateAmount = ({ id, value }) => {
    let amount, resultId;

    if (id === "from-input") {
      amount = fromValue;
      resultId = "to-input";
    }

    if (id === "to-input") {
      amount = toValue;
      resultId = "from-input";
    }

    const resultInput = document.getElementById(resultId);
    resultInput.value = (value * amount).toFixed(2);
    return;
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
  }, [calculateAmount, findObj]);

  const calculateValue = () => {
    if (fromCode === toCode) {
      setFromValue(1);
      setToValue(1);
      return;
    }

    if (fromCode !== toCode && toCode !== "UAH" && fromCode !== "UAH") {
      setFromValue((fromObj.buy / toObj.buy).toFixed(3));
      setToValue((toObj.buy / fromObj.buy).toFixed(3));
      return;
    }

    if (fromCode === "UAH" && toCode !== "UAH") {
      setFromValue((1 / toObj.buy).toFixed(3));
      setToValue(Number(toObj.buy).toFixed(3));
      return;
    }

    if (fromCode !== "UAH" && toCode === "UAH") {
      setFromValue(Number(fromObj.buy).toFixed(3));
      setToValue((1 / fromObj.buy).toFixed(3));
      return;
    }
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
    debugger;
    const fromSelect = document.getElementById("from-select");
    const toSelect = document.getElementById("to-select");
    const fromInput = document.getElementById("from-input");

    fromSelect.value = toCode;
    toSelect.value = fromCode;

    findObj(fromSelect);
    findObj(toSelect);
    calculateAmount(fromInput);
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
                1 {fromCode} = {fromValue} {toCode}
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
                1 {toCode} = {toValue} {fromCode}
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
