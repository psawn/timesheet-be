export const toDay = (date: Date) => {
  let day;
  switch (date.getDay()) {
    case 0:
      day = 'SUN';
      break;
    case 1:
      day = 'MON';
      break;
    case 2:
      day = 'TUES';
      break;
    case 3:
      day = 'WED';
      break;
    case 4:
      day = 'THU';
      break;
    case 5:
      day = 'FRI';
      break;
    case 6:
      day = 'SAT';
      break;
  }
  return day;
};
