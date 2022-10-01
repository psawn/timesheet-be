export const calculateBenefit = (standardLeave: number) => {
  const month = new Date().getMonth() + 1;
  const remainLeave = standardLeave - Math.round((standardLeave / 12) * month);
  return remainLeave;
};
