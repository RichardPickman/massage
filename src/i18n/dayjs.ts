import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/pl';

// Localized formats (`L`, `LL`) are a plugin in dayjs; without it `format('L')`
// prints the letter. Extended once here, next to the locale the app switches.
dayjs.extend(localizedFormat);

export default dayjs;
