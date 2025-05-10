//імпортую бібліотеку 'flatpickr' для вибору дати і часу
  import flatpickr from 'flatpickr';

//імпортую CSS-стилі для 'flatpickr'
  import 'flatpickr/dist/flatpickr.min.css';

//імпортую бібліотеку 'iziToast' для показу повідомлень
  import iziToast from 'izitoast';

//імпротую стилі для 'iziToast'
import 'izitoast/dist/css/iziToast.min.css';
  

/*створюю об'єкт для збереження посилань на елементи DOM, пошук елемента ведеться за селектором атрибуту*/
  const refs = {
  startButton: document.querySelector('[data-start]'),
  datetimePicker: document.querySelector('#datetime-picker'),
  daysElement: document.querySelector('[data-days]'),
  hoursElement: document.querySelector('[data-hours]'),
  minutesElement: document.querySelector('[data-minutes]'),
  secondsElement: document.querySelector('[data-seconds]'),
};

/*створюю глобальну змінну для збереження вибраноі користувачем дати. Вона використовується в функціях handleDateSelection, startCountdown для перевірки та запуску таймера*/
  let userSelectedDate = null;

// налаштування для 'flatpickr'
  const options = {
    enableTime: true, //вмикається можливість вибору часу
    
    time_24hr: true, //використовую 24-годинний формат часу
  
    defaultDate: new Date(), //Дата за замовчуванням- поточна
  
    minuteIncrement: 1, //інкркмент хвилин при виборі
  
    onClose(selectedDates) {//виклик функціі для обробки вибраної дати
    
    handleDateSelection(selectedDates[0]);//передаю вибрану дату в функцію обробки
  },
};

//ініціалізую flatpickr з вказаними налаштуваннями(поле інпут з налаштуваннями options )
  flatpickr(refs.datetimePicker, options);

// Деактивую кнопку "Start" при завантаженні сторінки.Для того щоб користувач не міг натиснути кнопку 'Start'поки не вибере дату.Це початковий стан кнопки
  refs.startButton.disabled = true;

//функція для обробки вибору дати, вона спрацьовує коли користувач вибрав дату
  function handleDateSelection(selectedDate) {
  //створюю змінну визначення поточноі дати
  const now = new Date();

//прописую умови, якщо користувач вибрав дату в минулому, показую помилку
  if (selectedDate <= now) {

//повідомлення яке показується за допомогою бібліотеки iziToast.Тут повідомлення про помилку
  iziToast.error({
    title: 'Invalid Date',
    message: 'Please choose a date in the future',
    position: 'topRight',
  });
    
/*деактивовую кнопку "Start".Це коли користувач вибрав невалідну дату.Це запобігає запуску таймера с невалідною датою*/
    refs.startButton.disabled = true;

//очищаю збережені данні
    userSelectedDate = null;
  } else {

//Повідомлення-якщо дата валідна(майбутня),показую успішне повідомлення
    iziToast.success({
      title: 'Valid Date',
      message: 'You selected a valid date',
      position: 'topRight',
    });

//активую кнопку "Start"
    refs.startButton.disabled = false;

//зберігаю вибрану дату користувачем
    userSelectedDate = selectedDate;
  }
}

// Створюю обробника натискання кнопки "Start"
  refs.startButton.addEventListener('click', () => {
    if (userSelectedDate === null) {

//Повідомлення - якщо дата не вибрана, показую помилку
    iziToast.error({
      title: 'Error',
      message: 'Please select a valid date before starting the timer',
      position: 'topRight',
      });
      return;
    }

//Після запуску таймера деактивовую кнопку "Start".Це для того щоб користувач не міг повторно запустити таймер,поки він не завершиться
    refs.startButton.disabled = true;

//деактивую поле інпуту для вибору дати. Бо бібліотека автоматично не блокує інпут
    refs.datetimePicker.disabled = true;

//запускаю таймер як результат натискання користувачем "Start"
    startCountdown();
  });

//створюю функцію для запуску таймера
  function startCountdown() {
    const intervalId = setInterval(() => {
//змінна для збереження поточноі дати і часу
  const now = new Date();

//змінна для збереження різници між вибраною датою і поточним часом
  const timeLeft = userSelectedDate - now;

//прописую умови для таймера.
   if (timeLeft <= 0) {
    
//якщо час закінчився то зупиняється таймер.Тобто таймер зупиняється автоматично по завершенню часу
  clearInterval(intervalId);

//оновлюю відображення часу до нулів
     updateTimer(0);
     
//повідомлення про завершення таймера
    iziToast.info({
    title: 'Timer Ended',
    message: 'The countdown has finished!',
    position: 'topRight',
        });

//активую інпут для вибору дати
    refs.datetimePicker.disabled = false;

//залишаю кнопку неактивною
    refs.startButton.disabled = true;
    return;
      }
//оновлюю відображення залишкового часу
      updateTimer(timeLeft);
    }, 1000);
}

//створюю  функція обчислення часу.Конвертіровання мілісекунд у дні, години,хвилини,секунди
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000; // кількість мілісекунд у секунди
  const minute = second * 60; //кількість мілісекунд у хвилини
  const hour = minute * 60; //кількість мілісекунд у години
  const day = hour * 24; //кількість мілісекунд у дні

  // Remaining (залишок)
  const days = Math.floor(ms / day); //визначаю кількість днів
  const hours = Math.floor((ms % day) / hour); //визначаю кількіст годин
  const minutes = Math.floor(((ms % day) % hour) / minute); //визначаю кількість хвилин
  const seconds = Math.floor((((ms % day) % hour) % minute) / second); //визначаю кількість секунд

  return { days, hours, minutes, seconds };
}

// створюю функцію для додавання нуля перед числами, меншими за 10.Використовуюяі метод padStart
function addLeadingZero(value) {
  return String(value).padStart(2, '0');//перша цифра цільова довжина рядка 
}

//створюю функцію для оновлення інтерфейса
function updateTimer(ms) {

//конвертую мілісекунди в дні, години,хвилини,секунди
  const { days, hours, minutes, seconds } = convertMs(ms); 

//оновлюю текстовий контент відповідних елементів
  refs.daysElement.textContent = addLeadingZero(days);
  refs.hoursElement.textContent = addLeadingZero(hours);
  refs.minutesElement.textContent = addLeadingZero(minutes);
  refs.secondsElement.textContent = addLeadingZero(seconds);
}

  
// тестування  convertMs, для вияснення вірноі обробки різних введених даних
console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}