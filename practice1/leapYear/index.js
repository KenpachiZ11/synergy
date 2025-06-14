const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

const year = parseInt(prompt("Введите год:"));

if (isNaN(year)) {
  alert("Пожалуйста, введите правильное число года.");
} else {
  if (isLeapYear(year)) {
    alert(`${year} високосный год.`);
    document.write(`${year} високосный год.`);
  } else {
    alert(`${year} не високосный год.`);
    document.write(`${year} не високосный год.`);
  }
}