export const formatDateRange = (dates: [Date, Date | null] | null, locale: string): string => {
  if (!dates || !dates[0]) {
    return '';
  }

  const [startDate, endDate] = dates;

  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
  };

  const startDateFormatted = startDate.toLocaleDateString(locale, options);

  if (endDate) {
    const endDateFormatted = endDate.toLocaleDateString(locale, options);
    const startMonth = startDateFormatted.split(' ')[0];
    const endMonth = endDateFormatted.split(' ')[0];
    const startDay = startDateFormatted.split(' ')[1];
    const endDay = endDateFormatted.split(' ')[1];

    if (startDate.getTime() === endDate.getTime()) {
      return startDateFormatted;
    }

    if (startMonth === endMonth && startDate.getFullYear() === endDate.getFullYear()) {
      return `${startMonth} ${startDay} - ${endDay}`;
    } else {
      return `${startDateFormatted} - ${endDateFormatted}`;
    }
  } else {
    return startDateFormatted;
  }
};

export const formatYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const formatMinutesToTimeString = (t: any, minutes: number): string => {
  if (minutes <= 0) return '';

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes === 0) {
    return t('common.time.hoursOnly', { hours });
  } else if (hours > 0) {
    return t('common.time.hoursAndMinutes', { hours, minutes: remainingMinutes });
  } else {
    return t('common.time.minutesOnly', { minutes: remainingMinutes });
  }
};

export const formatMMYYY = (date: Date, locale: string): string => {
  const options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
  return date.toLocaleDateString(locale, options);
};

export const formatDateToLongFormat = (
  locale: string,
  date: Date,
  format?: {
    weekday?: 'long' | 'short';
    month?: 'long' | 'short';
    day?: '2-digit' | 'numeric' | undefined;
    year?: '2-digit' | 'numeric';
  },
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  };

  const options: Intl.DateTimeFormatOptions = { ...defaultOptions, ...format };

  return date.toLocaleDateString(locale, options);
};

export const formatTimeToString = (timeInput: string | Date, locale: string) => {
  let date;

  if (typeof timeInput === 'string') {
    const timeParts = timeInput.split(':');
    date = new Date();
    date.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0);
  } else {
    date = timeInput;
  }

  return date.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};
