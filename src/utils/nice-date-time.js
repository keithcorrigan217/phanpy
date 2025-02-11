import { i18n } from '@lingui/core';

import localeMatch from './locale-match';
import mem from './mem';

const defaultLocale = new Intl.DateTimeFormat().resolvedOptions().locale;

const _DateTimeFormat = (opts) => {
  const { locale, dateYear, hideTime, formatOpts } = opts || {};
  const regionlessLocale = locale.replace(/-[a-z]+$/i, '');
  const loc = localeMatch([regionlessLocale], [defaultLocale], locale);
  const currentYear = new Date().getFullYear();
  const options = {
    // Show year if not current year
    year: dateYear === currentYear ? undefined : 'numeric',
    month: 'short',
    day: 'numeric',
    // Hide time if requested
    hour: hideTime ? undefined : 'numeric',
    minute: hideTime ? undefined : 'numeric',
    ...formatOpts,
  };
  try {
    return Intl.DateTimeFormat(loc, options);
  } catch (e) {}
  try {
    return Intl.DateTimeFormat(locale, options);
  } catch (e) {}
  return Intl.DateTimeFormat(undefined, options);
};
const DateTimeFormat = mem(_DateTimeFormat);

function niceDateTime(date, dtfOpts) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const DTF = DateTimeFormat({
    dateYear: date.getFullYear(),
    locale: i18n.locale,
    ...dtfOpts,
  });
  const dateText = DTF.format(date);
  return dateText;
}

export default niceDateTime;
