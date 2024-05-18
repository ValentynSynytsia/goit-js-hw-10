import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector('[data-start]');
const daysTime = document.querySelector('[data-days]');
const hoursTime = document.querySelector('[data-hours]');
const minutesTime = document.querySelector('[data-minutes]');
const secondsTime = document.querySelector('[data-seconds]');
const input = document.querySelector('#datetime-picker');

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  input.disabled = true;
  startTimer();
});

startBtn.disabled = true;

let timeDifference;
let intervalId;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const userDate = new Date(selectedDates[0]).getTime();
    const startDate = Date.now();

    if (userDate >= startDate) {
      startBtn.disabled = false;
      timeDifference = userDate - startDate;
      updateClockface(convertMs(timeDifference));
    } else {
      iziToast.error({
        fontSize: 'large',
        close: false,
        position: 'topRight',
        messageColor: 'white',
        timeout: 2000,
        backgroundColor: 'red',
        message: ("Please choose a date in the future")
      });
    }
  }
};

flatpickr('#datetime-picker', options)

function updateClockface({ days, hours, minutes, seconds }) {
  daysTime.textContent = `${days}`;
  hoursTime.textContent = `${hours}`;
  minutesTime.textContent = `${minutes}`;
  secondsTime.textContent = `${seconds}`;
}

function startTimer() {
  clearInterval(intervalId);
  intervalId = setInterval(timer, 1000);
}

function timer() {
  if (timeDifference > 1000) {
    timeDifference -= 1000;
    updateClockface(convertMs(timeDifference)); 
  } else {
    clearInterval(intervalId);
    input.disabled = false;
  }
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}
function convertMs(ms) {

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = addLeadingZero(Math.floor(ms / day));
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

