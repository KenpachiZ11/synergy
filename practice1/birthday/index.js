const day = prompt("Введите день рождения (число):");
const month = prompt("Введите месяц рождения (число или название):");
const year = prompt("Введите год рождения:");

console.log(`Дата рождения: ${day} ${month} ${year}`);
document.write(`Дата рождения: ${day} ${month} ${year}`);

const getCheckDate = (d, m, y) => {
  const date = new Date(y, m - 1, d);
  const checkedWeek = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
    'Воскресенье'
  ];
  const dayIndex = date.getDay();
  return checkedWeek[dayIndex];
};

if (day && month && year) {
  const dayOfWeek = getCheckDate(parseInt(day), parseInt(month), parseInt(year));
  document.write(` - ${dayOfWeek}`);
  alert(`Это: ${dayOfWeek}`);
} else {
  alert("Нет правильных данных");
}