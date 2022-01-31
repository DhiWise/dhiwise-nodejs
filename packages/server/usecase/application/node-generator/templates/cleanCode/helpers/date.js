const getDifferenceOfTwoDatesInTime = (currentDate, toDate) => {
  const hours = toDate.diff(currentDate, 'hour');
  currentDate = currentDate.add(hours, 'hour');
  const minutes = toDate.diff(currentDate, 'minute');
  currentDate = currentDate.add(minutes, 'minute');
  const seconds = toDate.diff(currentDate, 'second');
  currentDate = currentDate.add(seconds, 'second');
  if (hours) {
    return `${hours} hour, ${minutes} minute and ${seconds} second`;
  }
  return `${minutes} minute and ${seconds} second`;
};

module.exports = { getDifferenceOfTwoDatesInTime };
