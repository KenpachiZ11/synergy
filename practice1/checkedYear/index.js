const year = prompt("Введите год рождения:");

const checkedYear = (y) => {
  const getYear = new Date().getFullYear();
  document.write(`Пользователю ${getYear - parseInt(y)} лет`);
};

checkedYear(year);