import { AvailabilityData } from '@/app/_components/InputDateSelect';

export const checkIsBooked = (date: Date, availabilityData?: AvailabilityData) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const oneYearFromNow = new Date().setFullYear(new Date().getFullYear() + 1);
  const isPast = +date < +today;
  const isBeyondOneYear = +date >= +oneYearFromNow;

  const isBooked = availabilityData?.unavailableDates
    ?.map((unavailableDate) => new Date(unavailableDate).toDateString())
    .includes(date.toDateString());

  const isOutOfRange = !availabilityData?.availabilityRanges?.some((range) => {
    const rangeFrom = new Date(range.from).setHours(0, 0, 0, 0);

    const rangeTo = range.to
      ? new Date(range.to).setHours(23, 59, 59, 999)
      : new Date().setDate(new Date().getDate() + 384);

    return +date >= rangeFrom && +date <= rangeTo;
  });

  if (!availabilityData) {
    return isPast || isBeyondOneYear;
  }

  return isPast || isBooked || isOutOfRange || isBeyondOneYear;
};
