import { toZonedTime, format } from 'date-fns-tz';

function convertToCountryTime(startedAt: string, endedAt: string, countryId: string) {
  //   console.log('ttt', startedAt, endedAt, countryId);

  const countryTimeZone: Record<string, { timeZone: string; label: string }> = {
    kr: { timeZone: 'Asia/Seoul', label: 'KST (UTC+9)' },
    us: { timeZone: 'America/New_York', label: 'ET' },
    gb: { timeZone: 'Europe/London', label: 'GMT (UTC+0)' },
  };

  const { timeZone, label } = countryTimeZone[countryId] || { timeZone: 'UTC', label: 'UTC' };
  const convertedStarted = format(toZonedTime(startedAt, timeZone), 'yyyy-MM-dd HH:mm (eee) ', { timeZone });
  const convertedEnded = format(toZonedTime(endedAt, timeZone), 'yyyy-MM-dd HH:mm (eee)', { timeZone });

  return { startedAt: `${convertedStarted}`, endedAt: `${convertedEnded}`, label: `${label}` };
}
export default convertToCountryTime;
