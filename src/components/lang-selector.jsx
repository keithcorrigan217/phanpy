import { useLingui } from '@lingui/react';

import { activateLang, DEFAULT_LANG, LOCALES } from '../utils/lang';
import localeCode2Text from '../utils/localeCode2Text';

export default function LangSelector() {
  const { i18n } = useLingui();

  return (
    <label class="lang-selector">
      🌐{' '}
      <select
        value={i18n.locale || DEFAULT_LANG}
        onChange={(e) => {
          localStorage.setItem('lang', e.target.value);
          activateLang(e.target.value);
        }}
      >
        {LOCALES.map((lang) => {
          if (lang === 'pseudo-LOCALE') {
            return (
              <>
                <hr />
                <option value={lang} key={lang}>
                  Pseudolocalization (test)
                </option>
              </>
            );
          }
          const native = localeCode2Text({ code: lang, locale: lang });
          const common = localeCode2Text(lang);
          const showCommon = !!common && common !== native;
          return (
            <option value={lang} key={lang}>
              {showCommon ? `${native} (${common})` : native}
            </option>
          );
        })}
      </select>
    </label>
  );
}
