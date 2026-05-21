export type Category =
  | 'text'
  | 'image'
  | 'calc'
  | 'niche'
  | 'generator'
  | 'dev'
  | 'design'
  | 'kr'
  | 'productivity'

export interface Tool {
  slug: string
  category: Category
  icon: string
  implemented: boolean
}

export const CATEGORY_STYLE: Record<Category, { bg: string; text: string; border: string; badge: string }> = {
  text:         { bg: 'bg-blue-50 dark:bg-blue-900/20',     text: 'text-blue-600 dark:text-blue-400',     border: 'border-blue-100 dark:border-blue-800',     badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  image:        { bg: 'bg-green-50 dark:bg-green-900/20',   text: 'text-green-600 dark:text-green-400',   border: 'border-green-100 dark:border-green-800',   badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  calc:         { bg: 'bg-amber-50 dark:bg-amber-900/20',   text: 'text-amber-600 dark:text-amber-400',   border: 'border-amber-100 dark:border-amber-800',   badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  niche:        { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-800', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  generator:    { bg: 'bg-rose-50 dark:bg-rose-900/20',     text: 'text-rose-600 dark:text-rose-400',     border: 'border-rose-100 dark:border-rose-800',     badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' },
  dev:          { bg: 'bg-cyan-50 dark:bg-cyan-900/20',     text: 'text-cyan-600 dark:text-cyan-400',     border: 'border-cyan-100 dark:border-cyan-800',     badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300' },
  design:       { bg: 'bg-pink-50 dark:bg-pink-900/20',     text: 'text-pink-600 dark:text-pink-400',     border: 'border-pink-100 dark:border-pink-800',     badge: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300' },
  kr:           { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-800', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' },
  productivity: { bg: 'bg-teal-50 dark:bg-teal-900/20',    text: 'text-teal-600 dark:text-teal-400',     border: 'border-teal-100 dark:border-teal-800',    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300' },
}

export const tools: Tool[] = [
  // Text (17)
  { slug: 'char-count',         category: 'text',      icon: 'TXT', implemented: true },
  { slug: 'json-format',        category: 'text',      icon: '{}',  implemented: true },
  { slug: 'password-gen',       category: 'text',      icon: 'PW',  implemented: true },
  { slug: 'mobile-line-break',  category: 'text',      icon: 'BR',  implemented: true },
  { slug: 'whitespace-remove',  category: 'text',      icon: 'SP',  implemented: true },
  { slug: 'newline-remove',     category: 'text',      icon: 'NL',  implemented: true },
  { slug: 'case-converter',     category: 'text',      icon: 'Aa',  implemented: true },
  { slug: 'slug-generator',     category: 'text',      icon: 'URL', implemented: true },
  { slug: 'url-encoder',        category: 'text',      icon: '%',   implemented: true },
  { slug: 'base64-converter',   category: 'text',      icon: '64',  implemented: true },
  { slug: 'json-validator',     category: 'text',      icon: 'OK',  implemented: true },
  { slug: 'markdown-preview',   category: 'text',      icon: 'MD',  implemented: true },
  { slug: 'html-escape',        category: 'text',      icon: '<>',  implemented: true },
  { slug: 'csv-to-json',        category: 'text',      icon: 'CSV', implemented: true },
  { slug: 'diff-checker',       category: 'text',      icon: '+-',  implemented: true },
  { slug: 'random-nickname',    category: 'text',      icon: 'NIK', implemented: true },
  { slug: 'morse-code',         category: 'text',      icon: '•−',  implemented: true },

  // Image (10)
  { slug: 'jpg-to-png',       category: 'image', icon: 'JPG',  implemented: true },
  { slug: 'png-to-webp',      category: 'image', icon: 'WEBP', implemented: true },
  { slug: 'img-compress',     category: 'image', icon: 'ZIP',  implemented: true },
  { slug: 'img-resize',       category: 'image', icon: 'PX',   implemented: true },
  { slug: 'img-crop',         category: 'image', icon: 'CUT',  implemented: true },
  { slug: 'favicon-gen',      category: 'image', icon: 'ICO',  implemented: true },
  { slug: 'img-blur',         category: 'image', icon: 'BLUR', implemented: true },
  { slug: 'img-rotate',       category: 'image', icon: 'ROT',  implemented: true },
  { slug: 'img-size-reduce',  category: 'image', icon: 'KB',   implemented: true },
  { slug: 'grayscale-image',  category: 'image', icon: 'BW',   implemented: true },

  // Calculator (19)
  { slug: 'percent-calc',             category: 'calc', icon: '%',    implemented: true },
  { slug: 'date-calc',                category: 'calc', icon: 'DAY',  implemented: true },
  { slug: 'time-diff-calc',           category: 'calc', icon: 'TIME', implemented: true },
  { slug: 'bmi-calc',                 category: 'calc', icon: 'BMI',  implemented: true },
  { slug: 'average-calc',             category: 'calc', icon: 'AVG',  implemented: true },
  { slug: 'gpa-calc',                 category: 'calc', icon: 'GPA',  implemented: true },
  { slug: 'salary-calc',              category: 'calc', icon: 'PAY',  implemented: true },
  { slug: 'hourly-calc',              category: 'calc', icon: 'HR',   implemented: true },
  { slug: 'vat-calc',                 category: 'calc', icon: 'VAT',  implemented: true },
  { slug: 'currency-calc',            category: 'calc', icon: 'FX',   implemented: true },
  { slug: 'compound-calc',            category: 'calc', icon: 'APR',  implemented: true },
  { slug: 'loan-calc',                category: 'calc', icon: 'LOAN', implemented: true },
  { slug: 'lived-days-calc',          category: 'calc', icon: 'LIFE', implemented: true },
  { slug: 'year-days-left',           category: 'calc', icon: 'YEAR', implemented: true },
  { slug: 'anniversary-calc',         category: 'calc', icon: 'ANN',  implemented: true },
  { slug: 'shoe-size-converter',      category: 'calc', icon: 'SHOE', implemented: true },
  { slug: 'clothing-size-converter',  category: 'calc', icon: 'SIZE', implemented: true },
  { slug: 'unit-converter',           category: 'calc', icon: 'UNIT', implemented: true },
  { slug: 'celsius-fahrenheit',       category: 'calc', icon: 'C/F',  implemented: true },

  // Niche Calculator (10)
  { slug: 'baseball-stats',       category: 'niche', icon: 'ERA', implemented: true },
  { slug: 'youtube-earnings',     category: 'niche', icon: 'YT',  implemented: true },
  { slug: 'instagram-engagement', category: 'niche', icon: 'ER',  implemented: true },
  { slug: 'ad-cpm-calc',          category: 'niche', icon: 'CPM', implemented: true },
  { slug: 'ai-token-calc',        category: 'niche', icon: 'TOK', implemented: true },
  { slug: 'video-bitrate-calc',   category: 'niche', icon: 'MB',  implemented: true },
  { slug: 'subtitle-timestamp',   category: 'niche', icon: 'SRT', implemented: true },
  { slug: 'filename-organizer',   category: 'niche', icon: 'REN', implemented: true },
  { slug: 'dog-human-age',        category: 'niche', icon: 'DOG', implemented: true },
  { slug: 'cat-human-age',        category: 'niche', icon: 'CAT', implemented: true },

  // Generator/Game (11)
  { slug: 'name-gen',           category: 'generator', icon: 'NAME', implemented: true },
  { slug: 'company-name-gen',   category: 'generator', icon: 'CO',   implemented: true },
  { slug: 'nickname-gen',       category: 'generator', icon: 'NICK', implemented: true },
  { slug: 'mbti-compatibility', category: 'generator', icon: 'MBTI', implemented: true },
  { slug: 'random-lottery',     category: 'generator', icon: 'DRAW', implemented: true },
  { slug: 'roulette',           category: 'generator', icon: 'SPIN', implemented: true },
  { slug: 'ladder-game',        category: 'generator', icon: 'LAD',  implemented: true },
  { slug: 'team-divider',       category: 'generator', icon: 'TEAM', implemented: true },
  { slug: 'random-number-gen',  category: 'generator', icon: '123',  implemented: true },
  { slug: 'coin-flip',          category: 'generator', icon: 'COIN', implemented: true },
  { slug: 'anagram-gen',        category: 'generator', icon: 'ANA',  implemented: true },

  // Developer (11)
  { slug: 'regex-tester',        category: 'dev', icon: '.*',  implemented: true },
  { slug: 'hash-gen',            category: 'dev', icon: '#',   implemented: true },
  { slug: 'uuid-gen',            category: 'dev', icon: 'ID',  implemented: true },
  { slug: 'base-converter',      category: 'dev', icon: '01',  implemented: true },
  { slug: 'unix-timestamp',      category: 'dev', icon: 'TS',  implemented: true },
  { slug: 'yaml-json-converter', category: 'dev', icon: 'YJ',  implemented: true },
  { slug: 'json-to-csv',         category: 'dev', icon: 'CSV', implemented: true },
  { slug: 'image-to-base64',     category: 'dev', icon: 'B64', implemented: true },
  { slug: 'robots-txt-gen',      category: 'dev', icon: 'BOT', implemented: true },
  { slug: 'lorem-ipsum-gen',     category: 'dev', icon: 'TXT', implemented: true },
  { slug: 'current-ip-checker',  category: 'dev', icon: 'IP',  implemented: true },

  // Design (11)
  { slug: 'color-converter',    category: 'design', icon: 'HEX', implemented: true },
  { slug: 'qr-code',            category: 'design', icon: 'QR',  implemented: true },
  { slug: 'css-shadow-gen',     category: 'design', icon: 'SHD', implemented: true },
  { slug: 'css-gradient-gen',   category: 'design', icon: 'GRD', implemented: true },
  { slug: 'font-preview',       category: 'design', icon: 'Tf',  implemented: true },
  { slug: 'color-palette-gen',  category: 'design', icon: 'PAL', implemented: true },
  { slug: 'aspect-ratio-calc',  category: 'design', icon: '16:9',implemented: true },
  { slug: 'random-color-combo', category: 'design', icon: 'RGB', implemented: true },
  { slug: 'barcode-gen',        category: 'design', icon: '|||', implemented: true },
  { slug: 'emoji-search',       category: 'design', icon: ':)',   implemented: true },
  { slug: 'special-chars',      category: 'design', icon: 'SYM',  implemented: true },

  // Korean special (9)
  { slug: 'number-to-korean',              category: 'kr', icon: '123',  implemented: true },
  { slug: 'consonant-extractor',           category: 'kr', icon: 'KR',   implemented: true },
  { slug: 'manuscript-calc',               category: 'kr', icon: 'MS',   implemented: true },
  { slug: 'korean-age-calc',               category: 'kr', icon: 'AGE',  implemented: true },
  { slug: 'real-estate-fee-calc',          category: 'kr', icon: 'HOME', implemented: true },
  { slug: 'severance-pay-calc',            category: 'kr', icon: 'RET',  implemented: true },
  { slug: 'unemployment-benefit-calc',     category: 'kr', icon: 'WORK', implemented: true },
  { slug: 'korean-address-converter',      category: 'kr', icon: 'ADDR', implemented: true },
  { slug: 'memorial-49-calc',              category: 'kr', icon: '49',   implemented: true },

  // Productivity (8)
  { slug: 'pomodoro-timer',             category: 'productivity', icon: 'POM',   implemented: true },
  { slug: 'stopwatch',                  category: 'productivity', icon: 'SW',    implemented: true },
  { slug: 'timezone-converter',         category: 'productivity', icon: 'TZ',    implemented: true },
  { slug: 'checklist-gen',              category: 'productivity', icon: 'TODO',  implemented: true },
  { slug: 'workday-countdown',          category: 'productivity', icon: 'OFF',   implemented: true },
  { slug: 'fullscreen-clock',           category: 'productivity', icon: 'NOW',   implemented: true },
  { slug: 'online-scoreboard',          category: 'productivity', icon: 'SCORE', implemented: true },
  { slug: 'latitude-longitude-finder',  category: 'productivity', icon: 'GEO',   implemented: true },

]
