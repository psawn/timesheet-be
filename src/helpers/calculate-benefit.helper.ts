export const calculateBenefit = (standardLeave: number) => {
  const month = new Date().getMonth() + 1;
  const remainLeave = Math.round((standardLeave / 12) * month);
  return remainLeave;
};
