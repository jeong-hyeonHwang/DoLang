function convertToUserInfo(nationality: string, nativeLanguage: string, interestLanguage: string) {
  const convNationality: Record<string, { label: string; flag: string }> = {
    kr: { label: 'South Korea', flag: 'kr' },
    us: { label: 'United States', flag: 'en' },
  };
  const convNativeLanguage: Record<string, string> = {
    kr: 'Korean',
    en: 'English',
  };
  const convInterestLanguage: Record<string, string> = {
    ko: 'Korean',
    en: 'English',
  };

  const convNation = convNationality[nationality] || { label: 'Unknown', flag: 'unknown' };
  const convNativeLang = convNativeLanguage[nativeLanguage] || 'Unknown';
  const convInterestLang = convInterestLanguage[interestLanguage] || 'Unknown';

  return {
    nationality_flag: `${convNation.flag}`,
    nationality: `${convNation.label}`,
    nativeLanguage: `${convNativeLang}`,
    interestLanguage: `${convInterestLang}`,
  };
}
export default convertToUserInfo;
