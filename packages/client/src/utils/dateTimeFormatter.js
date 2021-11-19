import dayjs from 'dayjs';

const relativeTime = require('dayjs/plugin/relativeTime');

export const dateFormat = 'MM-DD-YYYY';
export const dateTimeFormat = 'MM-DD-YYYY hh:mm:ss A';

dayjs.extend(relativeTime);

export function dateTimeFormatter(date = dayjs(), format = 'DD MMM YYYY') {
  return dayjs(date).format(format);
}

export function getRemainingSecond(date) {
  return dayjs(date).diff(dayjs(), 'second');
}

export function addMinutes(minute) {
  return dayjs().add(minute, 'minute');
}

export function checkIsAfter(date) { // formate YYYY-MM-DD
  return dayjs().format('YYYY-MM-DD') > date;
}

export function getDayDiff(date) { // formate YYYY-MM-DD
  return dayjs(date).diff(dayjs().format('YYYY-MM-DD'), 'day');
}

export function getUnixTimestamp(date) {
  return dayjs(date).unix(); // 1548381600
}

export function getDateByTimestamp(unixTime, time) {
  if (time) return dayjs(unixTime * 1000).format(dateTimeFormat);
  return dayjs(unixTime * 1000).format(dateFormat);
}

export const setDateToISO = (date) => dayjs(date).toISOString();
