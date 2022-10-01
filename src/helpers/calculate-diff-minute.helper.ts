import * as moment from 'moment';

export const calculateDiffMin = (
  firstTimeValue: string,
  secondTimeValue: string,
): number => {
  const diff = moment.duration(
    moment(firstTimeValue, 'HH:mm:ss').diff(
      moment(secondTimeValue, 'HH:mm:ss'),
    ),
  );
  const diffChecktimeInMin = Math.floor(diff.asMinutes());
  return diffChecktimeInMin;
};
