export const chooseSelected = (target, value) => {
  const options = target && target.options;
  if (options) {
    Array.from(options).map((item) => {
      if (item.value === value) {
        return item.setAttribute("selected", true);
      }
      return item;
    });
  }
};
