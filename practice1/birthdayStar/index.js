const day = prompt("Введите день рождения (число):");
const month = prompt("Введите месяц рождения (число или название):");
const year = prompt("Введите год рождения:");

console.log(`Дата рождения: ${day} ${month} ${year}`);
document.write(`Дата рождения: ${day} ${month} ${year}`);

const getBirthdayStar = (d, m, y) => {
  const starDay = d.replace(/\d/g, '*');
  const starMonth = m.replace(/\d/g, '*');
  const starYear = y.replace(/\d/g, '*');

  console.log(`Дата рождения со звездочкой: ${starDay} ${starMonth} ${starYear}`);
  return document.write(` Дата рождения со звездочкой: ${starDay} ${starMonth} ${starYear}`);
};

getBirthdayStar(day, month, year);