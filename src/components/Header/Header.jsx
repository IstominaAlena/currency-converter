import PropTypes from "prop-types";

import c from "../../shared/styles/container.module.css";
import s from "./Header.module.css";

const Header = ({ children }) => {
  const currentDate = new Date().toLocaleString("ru", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className={s.section}>
      <div className={c.container}>
        <h1 className={s.title}>
          Курс валют на <span className={s.date}>{currentDate}</span>
        </h1>
        {children}
      </div>
    </header>
  );
};

export default Header;

Header.propTypes = {
  children: PropTypes.node,
};
