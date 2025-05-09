// Імпорт стилів iziToast
import 'izitoast/dist/css/iziToast.min.css';

// Імпорт JavaScript iziToast
import iziToast from 'izitoast';


//Початкове повідомлення для користувача.Додано як випробовування.
iziToast.info({
  title: 'Вітаємо!',
  message: 'Система готова до роботи.',
  position: 'topRight', // Позиція повідомлення
  timeout: 5000, // Час автозакриття (в мс)
  color: 'green', // Колір повідомлення
});



// Отримую доступ до елементів форми
const form = document.querySelector(".form");

//Додаю обробник подій на відправку форми
form.addEventListener("submit", (event) => {
  // Скасовую стандартеу поведінку браузера привідправці форми
  event.preventDefault();

  //Отримую данні з форми:затримку(змінна delayInput ) де час в мілісекундах, змінну (state) стану (fulfilled/rejected)
  const delayInput = event.target.elements.delay.value;
  const state = event.target.elements.state.value;

  //Створюю змінну яка перетворює затримку з рядка на число, використовую метод parseInt
  const delay = parseInt(delayInput, 10);

  // Перевіряємо коректність затримки.Якщо затримка введена некоректно(не число або негативне число)буде виводитися помилка.Зроблено так що помилка виводиться в консолі і на екрані (використовуючи можливості бібліотеки)
  if (isNaN(delay) || delay < 0) {
    console.error(
      '❌ Помилка: Введіть коректне значення затримки (позитивне число).'
    );
    iziToast.error({
      title: '❌ Помилка',
      message: 'Введіть коректне значення затримки (позитивне число).',
      position: 'topRight',
      timeout: 5000,
    });
    return;//зупиняємо подальше виконання 
  }

  // Створюю проміс, який виконається через вказану затримку і результат залежить від обраного стану(fulfilled/rejected)
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  // Обробляю результат промісу.Результат виводиться в консолі і на екрані(використовуючи можливості бібліотеки)
  promise
    .then(delay => {
      console.log(`✅ Fulfilled promise in ${delay}ms`);
      iziToast.success({
        title: '✅ Успіх',
        message: `Fulfilled promise in ${delay}ms`,
        position: 'topRight',
        timeout: 5000,
      });
    })
    .catch(delay => {
      console.log(`❌ Rejected promise in ${delay}ms`);
      iziToast.error({
        title: '❌ Помилка',
        message: `Rejected promise in ${delay}ms`,
        position: 'topRight',
        timeout: 5000,
      });
    });
  // Очищення форми після натискання кнопки
  form.reset();
});