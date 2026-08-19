export interface CountryInfo {
  alpha2: string;
  name: string;
  flag: string;
  cc: number;
  len: number;
  mob?: string[];
  carrier?: { [prefix: string]: string };
}

export const COUNTRIES: CountryInfo[] = [
  { alpha2: 'us', name: 'United States', flag: '🇺🇸', cc: 1, len: 10, mob: ['2', '3', '4', '5', '6', '7', '8', '9'] },
  { alpha2: 'ca', name: 'Canada', flag: '🇨🇦', cc: 1, len: 10, mob: ['2', '3', '4', '5', '6', '7', '8', '9'] },
  { alpha2: 'jm', name: 'Jamaica', flag: '🇯🇲', cc: 1, len: 10 },
  { alpha2: 'bs', name: 'Bahamas', flag: '🇧🇸', cc: 1, len: 10 },
  { alpha2: 'bb', name: 'Barbados', flag: '🇧🇧', cc: 1, len: 10 },
  { alpha2: 'ag', name: 'Antigua & Barbuda', flag: '🇦🇬', cc: 1, len: 10 },
  { alpha2: 'ru', name: 'Russia', flag: '🇷🇺', cc: 7, len: 10, mob: ['9'] },
  { alpha2: 'kz', name: 'Kazakhstan', flag: '🇰🇿', cc: 7, len: 10, mob: ['7'] },
  { alpha2: 'eg', name: 'Egypt', flag: '🇪🇬', cc: 20, len: 10, mob: ['1'] },
  { alpha2: 'za', name: 'South Africa', flag: '🇿🇦', cc: 27, len: 9, mob: ['6', '7', '8'] },
  { alpha2: 'ss', name: 'South Sudan', flag: '🇸🇸', cc: 211, len: 9 },
  { alpha2: 'ma', name: 'Morocco', flag: '🇲🇦', cc: 212, len: 9, mob: ['6'] },
  { alpha2: 'dz', name: 'Algeria', flag: '🇩🇿', cc: 213, len: 9, mob: ['5', '6', '7'] },
  { alpha2: 'tn', name: 'Tunisia', flag: '🇹🇳', cc: 216, len: 8, mob: ['2', '5', '9'] },
  { alpha2: 'ly', name: 'Libya', flag: '🇱🇾', cc: 218, len: 9 },
  { alpha2: 'gm', name: 'Gambia', flag: '🇬🇲', cc: 220, len: 7 },
  { alpha2: 'sn', name: 'Senegal', flag: '🇸🇳', cc: 221, len: 9 },
  { alpha2: 'mr', name: 'Mauritania', flag: '🇲🇷', cc: 222, len: 8 },
  { alpha2: 'ml', name: 'Mali', flag: '🇲🇱', cc: 223, len: 8 },
  { alpha2: 'gn', name: 'Guinea', flag: '🇬🇳', cc: 224, len: 8 },
  { alpha2: 'ci', name: 'Côte d\'Ivoire', flag: '🇨🇮', cc: 225, len: 8 },
  { alpha2: 'bf', name: 'Burkina Faso', flag: '🇧🇫', cc: 226, len: 8 },
  { alpha2: 'ne', name: 'Niger', flag: '🇳🇪', cc: 227, len: 8 },
  { alpha2: 'tg', name: 'Togo', flag: '🇹🇬', cc: 228, len: 8 },
  { alpha2: 'bj', name: 'Benin', flag: '🇧🇯', cc: 229, len: 8 },
  { alpha2: 'mu', name: 'Mauritius', flag: '🇲🇺', cc: 230, len: 8 },
  { alpha2: 'lr', name: 'Liberia', flag: '🇱🇷', cc: 231, len: 7 },
  { alpha2: 'sl', name: 'Sierra Leone', flag: '🇸🇱', cc: 232, len: 8 },
  { alpha2: 'gh', name: 'Ghana', flag: '🇬🇭', cc: 233, len: 9, mob: ['2', '5'] },
  { alpha2: 'ng', name: 'Nigeria', flag: '🇳🇬', cc: 234, len: 10, mob: ['7', '8', '9'] },
  { alpha2: 'td', name: 'Chad', flag: '🇹🇩', cc: 235, len: 8 },
  { alpha2: 'cf', name: 'Central African Republic', flag: '🇨🇫', cc: 236, len: 8 },
  { alpha2: 'cm', name: 'Cameroon', flag: '🇨🇲', cc: 237, len: 9, mob: ['6'] },
  { alpha2: 'cv', name: 'Cape Verde', flag: '🇨🇻', cc: 238, len: 7 },
  { alpha2: 'st', name: 'São Tomé & Príncipe', flag: '🇸🇹', cc: 239, len: 7 },
  { alpha2: 'gq', name: 'Equatorial Guinea', flag: '🇬🇶', cc: 240, len: 9 },
  { alpha2: 'ga', name: 'Gabon', flag: '🇬🇦', cc: 241, len: 7 },
  { alpha2: 'cg', name: 'Republic of Congo', flag: '🇨🇬', cc: 242, len: 9 },
  { alpha2: 'cd', name: 'DR Congo', flag: '🇨🇩', cc: 243, len: 9 },
  { alpha2: 'ao', name: 'Angola', flag: '🇦🇴', cc: 244, len: 9 },
  { alpha2: 'gw', name: 'Guinea-Bissau', flag: '🇬🇼', cc: 245, len: 7 },
  { alpha2: 'sc', name: 'Seychelles', flag: '🇸🇨', cc: 248, len: 7 },
  { alpha2: 'sd', name: 'Sudan', flag: '🇸🇩', cc: 249, len: 9 },
  { alpha2: 'rw', name: 'Rwanda', flag: '🇷🇼', cc: 250, len: 9, mob: ['7'] },
  { alpha2: 'et', name: 'Ethiopia', flag: '🇪🇹', cc: 251, len: 9, mob: ['9'] },
  { alpha2: 'so', name: 'Somalia', flag: '🇸🇴', cc: 252, len: 8 },
  { alpha2: 'dj', name: 'Djibouti', flag: '🇩🇯', cc: 253, len: 8 },
  { alpha2: 'ke', name: 'Kenya', flag: '🇰🇪', cc: 254, len: 9, mob: ['7', '1'] },
  { alpha2: 'tz', name: 'Tanzania', flag: '🇹🇿', cc: 255, len: 9, mob: ['6', '7'] },
  { alpha2: 'ug', name: 'Uganda', flag: '🇺🇬', cc: 256, len: 9, mob: ['7'] },
  { alpha2: 'bi', name: 'Burundi', flag: '🇧🇮', cc: 257, len: 8 },
  { alpha2: 'mz', name: 'Mozambique', flag: '🇲🇿', cc: 258, len: 9, mob: ['8'] },
  { alpha2: 'zm', name: 'Zambia', flag: '🇿🇲', cc: 260, len: 9, mob: ['9', '7'] },
  { alpha2: 'mg', name: 'Madagascar', flag: '🇲🇬', cc: 261, len: 9 },
  { alpha2: 're', name: 'Réunion', flag: '🇷🇪', cc: 262, len: 9 },
  { alpha2: 'zw', name: 'Zimbabwe', flag: '🇿🇼', cc: 263, len: 9, mob: ['7'] },
  { alpha2: 'na', name: 'Namibia', flag: '🇳🇦', cc: 264, len: 9, mob: ['8'] },
  { alpha2: 'mw', name: 'Malawi', flag: '🇲🇼', cc: 265, len: 9 },
  { alpha2: 'ls', name: 'Lesotho', flag: '🇱🇸', cc: 266, len: 8 },
  { alpha2: 'bw', name: 'Botswana', flag: '🇧🇼', cc: 267, len: 8, mob: ['7'] },
  { alpha2: 'sz', name: 'Eswatini', flag: '🇸🇿', cc: 268, len: 8 },
  { alpha2: 'km', name: 'Comoros', flag: '🇰🇲', cc: 269, len: 7 },
  { alpha2: 'er', name: 'Eritrea', flag: '🇪🇷', cc: 291, len: 7 },
  { alpha2: 'gl', name: 'Greenland', flag: '🇬🇱', cc: 299, len: 6 },
  { alpha2: 'gr', name: 'Greece', flag: '🇬🇷', cc: 30, len: 10, mob: ['69'] },
  { alpha2: 'nl', name: 'Netherlands', flag: '🇳🇱', cc: 31, len: 9, mob: ['6'] },
  { alpha2: 'be', name: 'Belgium', flag: '🇧🇪', cc: 32, len: 9, mob: ['4'] },
  { alpha2: 'fr', name: 'France', flag: '🇫🇷', cc: 33, len: 9, mob: ['6', '7'] },
  { alpha2: 'es', name: 'Spain', flag: '🇪🇸', cc: 34, len: 9, mob: ['6', '7'] },
  { alpha2: 'gi', name: 'Gibraltar', flag: '🇬🇮', cc: 350, len: 8 },
  { alpha2: 'pt', name: 'Portugal', flag: '🇵🇹', cc: 351, len: 9, mob: ['9'] },
  { alpha2: 'lu', name: 'Luxembourg', flag: '🇱🇺', cc: 352, len: 9 },
  { alpha2: 'ie', name: 'Ireland', flag: '🇮🇪', cc: 353, len: 9, mob: ['8'] },
  { alpha2: 'is', name: 'Iceland', flag: '🇮🇸', cc: 354, len: 7, mob: ['6', '7', '8'] },
  { alpha2: 'al', name: 'Albania', flag: '🇦🇱', cc: 355, len: 9, mob: ['6', '7'] },
  { alpha2: 'mt', name: 'Malta', flag: '🇲🇹', cc: 356, len: 8, mob: ['7', '9'] },
  { alpha2: 'cy', name: 'Cyprus', flag: '🇨🇾', cc: 357, len: 8, mob: ['9'] },
  { alpha2: 'fi', name: 'Finland', flag: '🇫🇮', cc: 358, len: 9, mob: ['4', '5', '7', '8'] },
  { alpha2: 'bg', name: 'Bulgaria', flag: '🇧🇬', cc: 359, len: 9, mob: ['8', '9'] },
  { alpha2: 'hu', name: 'Hungary', flag: '🇭🇺', cc: 36, len: 9, mob: ['7', '2', '3'] },
  { alpha2: 'lt', name: 'Lithuania', flag: '🇱🇹', cc: 370, len: 8, mob: ['6'] },
  { alpha2: 'lv', name: 'Latvia', flag: '🇱🇻', cc: 371, len: 8, mob: ['2'] },
  { alpha2: 'ee', name: 'Estonia', flag: '🇪🇪', cc: 372, len: 8, mob: ['5'] },
  { alpha2: 'md', name: 'Moldova', flag: '🇲🇩', cc: 373, len: 8, mob: ['6', '7'] },
  { alpha2: 'am', name: 'Armenia', flag: '🇦🇲', cc: 374, len: 8, mob: ['7', '9'] },
  { alpha2: 'by', name: 'Belarus', flag: '🇧🇾', cc: 375, len: 9, mob: ['2', '3', '4', '5', '6', '7', '8'] },
  { alpha2: 'ad', name: 'Andorra', flag: '🇦🇩', cc: 376, len: 6, mob: ['3', '6'] },
  { alpha2: 'mc', name: 'Monaco', flag: '🇲🇨', cc: 377, len: 9, mob: ['4', '6'] },
  { alpha2: 'sm', name: 'San Marino', flag: '🇸🇲', cc: 378, len: 9, mob: ['3', '6'] },
  { alpha2: 'ua', name: 'Ukraine', flag: '🇺🇦', cc: 380, len: 9, mob: ['3', '5', '6', '7', '9'] },
  { alpha2: 'rs', name: 'Serbia', flag: '🇷🇸', cc: 381, len: 9, mob: ['6'] },
  { alpha2: 'me', name: 'Montenegro', flag: '🇲🇪', cc: 382, len: 8, mob: ['6', '7'] },
  { alpha2: 'xk', name: 'Kosovo', flag: '🇽🇰', cc: 383, len: 8, mob: ['4', '6'] },
  { alpha2: 'hr', name: 'Croatia', flag: '🇭🇷', cc: 385, len: 9, mob: ['9'] },
  { alpha2: 'si', name: 'Slovenia', flag: '🇸🇮', cc: 386, len: 8, mob: ['3', '4', '5', '6', '7'] },
  { alpha2: 'ba', name: 'Bosnia & Herzegovina', flag: '🇧🇦', cc: 387, len: 8, mob: ['6'] },
  { alpha2: 'mk', name: 'North Macedonia', flag: '🇲🇰', cc: 389, len: 8, mob: ['7'] },
  { alpha2: 'it', name: 'Italy', flag: '🇮🇹', cc: 39, len: 10, mob: ['3'] },
  { alpha2: 'ro', name: 'Romania', flag: '🇷🇴', cc: 40, len: 9, mob: ['7'] },
  { alpha2: 'ch', name: 'Switzerland', flag: '🇨🇭', cc: 41, len: 9, mob: ['7'] },
  { alpha2: 'cz', name: 'Czech Republic', flag: '🇨🇿', cc: 420, len: 9, mob: ['6', '7'] },
  { alpha2: 'sk', name: 'Slovakia', flag: '🇸🇰', cc: 421, len: 9, mob: ['9'] },
  { alpha2: 'li', name: 'Liechtenstein', flag: '🇱🇮', cc: 423, len: 7, mob: ['7'] },
  { alpha2: 'at', name: 'Austria', flag: '🇦🇹', cc: 43, len: 10, mob: ['6'] },
  { alpha2: 'gb', name: 'United Kingdom', flag: '🇬🇧', cc: 44, len: 10, mob: ['7'] },
  { alpha2: 'dk', name: 'Denmark', flag: '🇩🇰', cc: 45, len: 8, mob: ['2', '3', '4', '5', '6', '7', '8', '9'] },
  { alpha2: 'se', name: 'Sweden', flag: '🇸🇪', cc: 46, len: 9, mob: ['7'] },
  { alpha2: 'no', name: 'Norway', flag: '🇳🇴', cc: 47, len: 8, mob: ['4', '9'] },
  { alpha2: 'pl', name: 'Poland', flag: '🇵🇱', cc: 48, len: 9, mob: ['4', '5', '6', '7', '8'] },
  { alpha2: 'de', name: 'Germany', flag: '🇩🇪', cc: 49, len: 11, mob: ['15', '16', '17'] },
  { alpha2: 'bz', name: 'Belize', flag: '🇧🇿', cc: 501, len: 7 },
  { alpha2: 'gt', name: 'Guatemala', flag: '🇬🇹', cc: 502, len: 8, mob: ['3', '4', '5', '6'] },
  { alpha2: 'sv', name: 'El Salvador', flag: '🇸🇻', cc: 503, len: 8, mob: ['6', '7'] },
  { alpha2: 'hn', name: 'Honduras', flag: '🇭🇳', cc: 504, len: 8, mob: ['3', '8', '9'] },
  { alpha2: 'ni', name: 'Nicaragua', flag: '🇳🇮', cc: 505, len: 8, mob: ['8'] },
  { alpha2: 'cr', name: 'Costa Rica', flag: '🇨🇷', cc: 506, len: 8, mob: ['6', '7', '8'] },
  { alpha2: 'pa', name: 'Panama', flag: '🇵🇦', cc: 507, len: 8, mob: ['6'] },
  { alpha2: 'ht', name: 'Haiti', flag: '🇭🇹', cc: 509, len: 8 },
  { alpha2: 'pe', name: 'Peru', flag: '🇵🇪', cc: 51, len: 9, mob: ['9'] },
  { alpha2: 'mx', name: 'Mexico', flag: '🇲🇽', cc: 52, len: 10, mob: ['1'] },
  { alpha2: 'cu', name: 'Cuba', flag: '🇨🇺', cc: 53, len: 8, mob: ['5'] },
  { alpha2: 'ar', name: 'Argentina', flag: '🇦🇷', cc: 54, len: 10, mob: ['9', '11', '15'] },
  { alpha2: 'br', name: 'Brazil', flag: '🇧🇷', cc: 55, len: 11, mob: ['9'] },
  { alpha2: 'cl', name: 'Chile', flag: '🇨🇱', cc: 56, len: 9, mob: ['9'] },
  { alpha2: 'co', name: 'Colombia', flag: '🇨🇴', cc: 57, len: 10, mob: ['3'] },
  { alpha2: 've', name: 'Venezuela', flag: '🇻🇪', cc: 58, len: 10, mob: ['4'] },
  { alpha2: 'gp', name: 'Guadeloupe', flag: '🇬🇵', cc: 590, len: 9 },
  { alpha2: 'bo', name: 'Bolivia', flag: '🇧🇴', cc: 591, len: 8, mob: ['6', '7'] },
  { alpha2: 'gy', name: 'Guyana', flag: '🇬🇾', cc: 592, len: 7 },
  { alpha2: 'ec', name: 'Ecuador', flag: '🇪🇨', cc: 593, len: 9, mob: ['9'] },
  { alpha2: 'py', name: 'Paraguay', flag: '🇵🇾', cc: 595, len: 9, mob: ['9'] },
  { alpha2: 'mq', name: 'Martinique', flag: '🇲🇶', cc: 596, len: 9 },
  { alpha2: 'sr', name: 'Suriname', flag: '🇸🇷', cc: 597, len: 7, mob: ['7', '8'] },
  { alpha2: 'uy', name: 'Uruguay', flag: '🇺🇾', cc: 598, len: 8, mob: ['9'] },
  { alpha2: 'my', name: 'Malaysia', flag: '🇲🇾', cc: 60, len: 10, mob: ['1'] },
  { alpha2: 'au', name: 'Australia', flag: '🇦🇺', cc: 61, len: 9, mob: ['4'] },
  { alpha2: 'id', name: 'Indonesia', flag: '🇮🇩', cc: 62, len: 10, mob: ['8'] },
  { alpha2: 'ph', name: 'Philippines', flag: '🇵🇭', cc: 63, len: 10, mob: ['9'] },
  { alpha2: 'nz', name: 'New Zealand', flag: '🇳🇿', cc: 64, len: 9, mob: ['2'] },
  { alpha2: 'sg', name: 'Singapore', flag: '🇸🇬', cc: 65, len: 8, mob: ['8', '9'] },
  { alpha2: 'th', name: 'Thailand', flag: '🇹🇭', cc: 66, len: 9, mob: ['6', '8', '9'] },
  { alpha2: 'tl', name: 'East Timor', flag: '🇹🇱', cc: 670, len: 8 },
  { alpha2: 'bn', name: 'Brunei', flag: '🇧🇳', cc: 673, len: 7 },
  { alpha2: 'nr', name: 'Nauru', flag: '🇳🇷', cc: 674, len: 7 },
  { alpha2: 'pg', name: 'Papua New Guinea', flag: '🇵🇬', cc: 675, len: 8, mob: ['7'] },
  { alpha2: 'to', name: 'Tonga', flag: '🇹🇴', cc: 676, len: 5 },
  { alpha2: 'sb', name: 'Solomon Islands', flag: '🇸🇧', cc: 677, len: 7 },
  { alpha2: 'vu', name: 'Vanuatu', flag: '🇻🇺', cc: 678, len: 7 },
  { alpha2: 'fj', name: 'Fiji', flag: '🇫🇯', cc: 679, len: 7 },
  { alpha2: 'pw', name: 'Palau', flag: '🇵🇼', cc: 680, len: 7 },
  { alpha2: 'ws', name: 'Samoa', flag: '🇼🇸', cc: 685, len: 7 },
  { alpha2: 'ki', name: 'Kiribati', flag: '🇰🇮', cc: 686, len: 8 },
  { alpha2: 'nc', name: 'New Caledonia', flag: '🇳🇨', cc: 687, len: 6 },
  { alpha2: 'tv', name: 'Tuvalu', flag: '🇹🇻', cc: 688, len: 5 },
  { alpha2: 'pf', name: 'French Polynesia', flag: '🇵🇫', cc: 689, len: 6 },
  { alpha2: 'fm', name: 'Micronesia', flag: '🇫🇲', cc: 691, len: 7 },
  { alpha2: 'mh', name: 'Marshall Islands', flag: '🇲🇭', cc: 692, len: 7 },
  { alpha2: 'jp', name: 'Japan', flag: '🇯🇵', cc: 81, len: 10, mob: ['7', '8', '9'] },
  { alpha2: 'kr', name: 'South Korea', flag: '🇰🇷', cc: 82, len: 10, mob: ['1'] },
  { alpha2: 'vn', name: 'Vietnam', flag: '🇻🇳', cc: 84, len: 9, mob: ['3', '5', '7', '8', '9'] },
  { alpha2: 'kp', name: 'North Korea', flag: '🇰🇵', cc: 850, len: 9 },
  { alpha2: 'hk', name: 'Hong Kong', flag: '🇭🇰', cc: 852, len: 8, mob: ['5', '6', '9'] },
  { alpha2: 'mo', name: 'Macau', flag: '🇲🇴', cc: 853, len: 8, mob: ['6'] },
  { alpha2: 'kh', name: 'Cambodia', flag: '🇰🇭', cc: 855, len: 9, mob: ['1', '2', '8', '9'] },
  { alpha2: 'la', name: 'Laos', flag: '🇱🇦', cc: 856, len: 10, mob: ['2'] },
  { alpha2: 'cn', name: 'China', flag: '🇨🇳', cc: 86, len: 11, mob: ['1'] },
  { alpha2: 'bd', name: 'Bangladesh', flag: '🇧🇩', cc: 880, len: 10, mob: ['1'] },
  { alpha2: 'tw', name: 'Taiwan', flag: '🇹🇼', cc: 886, len: 9, mob: ['9'] },
  { alpha2: 'tr', name: 'Turkey', flag: '🇹🇷', cc: 90, len: 10, mob: ['5'] },
  { alpha2: 'in', name: 'India', flag: '🇮🇳', cc: 91, len: 10, mob: ['6', '7', '8', '9'] },
  { alpha2: 'pk', name: 'Pakistan', flag: '🇵🇰', cc: 92, len: 10, mob: ['3'] },
  { alpha2: 'af', name: 'Afghanistan', flag: '🇦🇫', cc: 93, len: 9, mob: ['7'] },
  { alpha2: 'lk', name: 'Sri Lanka', flag: '🇱🇰', cc: 94, len: 9, mob: ['7'] },
  { alpha2: 'mm', name: 'Myanmar', flag: '🇲🇲', cc: 95, len: 10, mob: ['9'] },
  { alpha2: 'mv', name: 'Maldives', flag: '🇲🇻', cc: 960, len: 7, mob: ['7', '9'] },
  { alpha2: 'lb', name: 'Lebanon', flag: '🇱🇧', cc: 961, len: 8, mob: ['7'] },
  { alpha2: 'jo', name: 'Jordan', flag: '🇯🇴', cc: 962, len: 9, mob: ['7'] },
  { alpha2: 'sy', name: 'Syria', flag: '🇸🇾', cc: 963, len: 9, mob: ['9'] },
  { alpha2: 'iq', name: 'Iraq', flag: '🇮🇶', cc: 964, len: 10, mob: ['7'] },
  { alpha2: 'kw', name: 'Kuwait', flag: '🇰🇼', cc: 965, len: 8, mob: ['5', '6', '9'] },
  { alpha2: 'sa', name: 'Saudi Arabia', flag: '🇸🇦', cc: 966, len: 9, mob: ['5'] },
  { alpha2: 'ye', name: 'Yemen', flag: '🇾🇪', cc: 967, len: 9, mob: ['7'] },
  { alpha2: 'om', name: 'Oman', flag: '🇴🇲', cc: 968, len: 8, mob: ['9'] },
  { alpha2: 'ps', name: 'Palestine', flag: '🇵🇸', cc: 970, len: 9, mob: ['5'] },
  { alpha2: 'ae', name: 'United Arab Emirates', flag: '🇦🇪', cc: 971, len: 9, mob: ['5'] },
  { alpha2: 'il', name: 'Israel', flag: '🇮🇱', cc: 972, len: 9, mob: ['5'] },
  { alpha2: 'bh', name: 'Bahrain', flag: '🇧🇭', cc: 973, len: 8, mob: ['3'] },
  { alpha2: 'qa', name: 'Qatar', flag: '🇶🇦', cc: 974, len: 8, mob: ['3', '5', '6', '7'] },
  { alpha2: 'bt', name: 'Bhutan', flag: '🇧🇹', cc: 975, len: 8, mob: ['7'] },
  { alpha2: 'mn', name: 'Mongolia', flag: '🇲🇳', cc: 976, len: 8, mob: ['8', '9'] },
  { alpha2: 'np', name: 'Nepal', flag: '🇳🇵', cc: 977, len: 10, mob: ['96', '97', '98'], carrier: { '96': 'Smart Telecom', '97': 'Ncell', '98': 'Nepal Telecom (NTC)' } },
  { alpha2: 'ir', name: 'Iran', flag: '🇮🇷', cc: 98, len: 10, mob: ['9'] },
  { alpha2: 'tj', name: 'Tajikistan', flag: '🇹🇯', cc: 992, len: 9, mob: ['9'] },
  { alpha2: 'tm', name: 'Turkmenistan', flag: '🇹🇲', cc: 993, len: 8, mob: ['6'] },
  { alpha2: 'az', name: 'Azerbaijan', flag: '🇦🇿', cc: 994, len: 9, mob: ['5', '6', '7'] },
  { alpha2: 'ge', name: 'Georgia', flag: '🇬🇪', cc: 995, len: 9, mob: ['5'] },
  { alpha2: 'kg', name: 'Kyrgyzstan', flag: '🇰🇬', cc: 996, len: 9, mob: ['5', '7'] },
  { alpha2: 'uz', name: 'Uzbekistan', flag: '🇺🇿', cc: 998, len: 9, mob: ['9'] }
];

/**
 * Converts non-Latin Unicode digits (Arabic-Indic, Persian, Devanagari, Bengali, etc.)
 * to standard ASCII 0-9 digits and strips non-numeric characters.
 */
export function normalizePhoneDigits(raw: string): string {
  if (!raw) return '';
  return raw
    // Convert Arabic-Indic digits
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1632 + 48))
    // Convert Extended Arabic-Indic / Persian digits
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1776 + 48))
    // Convert Devanagari (Hindi/Nepali) digits
    .replace(/[०-९]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 2406 + 48))
    // Convert Bengali digits
    .replace(/[০-৯]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 2534 + 48));
}

// NANP Area codes mapping to specific regions
const NANP_TERRITORIES: Record<string, string> = {
  // Canada Area Codes
  '403': 'ca', '587': 'ca', '780': 'ca', '825': 'ca', '604': 'ca', '250': 'ca', '778': 'ca', '236': 'ca',
  '204': 'ca', '431': 'ca', '506': 'ca', '709': 'ca', '902': 'ca', '782': 'ca', '416': 'ca', '647': 'ca',
  '437': 'ca', '905': 'ca', '289': 'ca', '365': 'ca', '519': 'ca', '226': 'ca', '548': 'ca', '613': 'ca',
  '343': 'ca', '705': 'ca', '249': 'ca', '807': 'ca', '514': 'ca', '438': 'ca', '450': 'ca', '579': 'ca',
  '418': 'ca', '581': 'ca', '819': 'ca', '873': 'ca', '306': 'ca', '639': 'ca', '867': 'ca',
  // Caribbean / Atlantic Islands
  '242': 'bs', '246': 'bb', '268': 'ag', '876': 'jm', '658': 'jm'
};

export function lookupCountry(cc: number): CountryInfo | undefined {
  return COUNTRIES.find((c) => c.cc === cc);
}

export function detectCountry(rawInput: string): { country?: CountryInfo; national: string } | null {
  if (!rawInput) return null;
  const unicodeNormalized = normalizePhoneDigits(rawInput.trim());

  // Remove common extension suffixes (e.g. ext. 123, x45)
  const withoutExt = unicodeNormalized.replace(/(?:ext|x|extension|#)\s*\d+.*$/i, '').trim();

  let digits = withoutExt.replace(/\D/g, '');
  if (!digits) return null;

  // Handle international exit codes: '00' (Europe/Asia/Africa) or '011' (US/Canada)
  if (digits.startsWith('00') && digits.length > 4) {
    digits = digits.slice(2);
  } else if (digits.startsWith('011') && digits.length > 5) {
    digits = digits.slice(3);
  }

  // Handle leading single '0' trunk prefix (e.g., UK 07xxx, India 070xxx, France 06xxx)
  // If the number doesn't match standard length or has explicit '+', strip single leading '0'
  let start = digits;
  if (!rawInput.trim().startsWith('+') && start.startsWith('0') && !start.startsWith('00')) {
    // Keep a version without leading 0
    start = digits.slice(1);
  }

  // Try matching country calling code from 4 digits down to 1 digit
  for (let len = 4; len >= 1; len--) {
    const ccCandidate = parseInt(digits.slice(0, len), 10);
    const country = lookupCountry(ccCandidate);

    if (country) {
      let national = digits.slice(len);

      // Handle special multi-country codes (+1 NANP and +7 Russia/Kazakhstan)
      if (country.cc === 1 && national.length >= 3) {
        const areaCode = national.slice(0, 3);
        const subAlpha2 = NANP_TERRITORIES[areaCode];
        if (subAlpha2) {
          const specific = COUNTRIES.find((c) => c.alpha2 === subAlpha2);
          if (specific) return { country: specific, national };
        }
      } else if (country.cc === 7 && national.length >= 1) {
        if (national.startsWith('7') || national.startsWith('6')) {
          const kz = COUNTRIES.find((c) => c.alpha2 === 'kz');
          if (kz) return { country: kz, national };
        }
      }

      if (national.length >= 4 && national.length <= 14) {
        return { country, national };
      }
    }
  }

  // Fallback: If stripped leading '0' yields a valid match
  if (start !== digits) {
    for (let len = 4; len >= 1; len--) {
      const ccCandidate = parseInt(start.slice(0, len), 10);
      const country = lookupCountry(ccCandidate);
      if (country) {
        const national = start.slice(len);
        if (national.length >= 4 && national.length <= 14) {
          return { country, national };
        }
      }
    }
  }

  return null;
}
