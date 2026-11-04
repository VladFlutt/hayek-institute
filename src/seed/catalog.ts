export type L = { ru: string; en: string }

export const LEVELS: { slug: string; order: number; title: L; description: L }[] = [
  {
    slug: 'method',
    order: 0,
    title: { ru: 'Ступень 0. Метод', en: 'Level 0. Method' },
    description: {
      ru: 'Инструмент мышления: логика Аристотеля, на которой держатся все остальные курсы.',
      en: 'The tool of thought: Aristotelian logic that underpins every other course.',
    },
  },
  {
    slug: 'basics',
    order: 1,
    title: { ru: 'Ступень 1. Основы', en: 'Level 1. Foundations' },
    description: {
      ru: 'Экономика здравого смысла: как устроены цены, обмен и рынок.',
      en: 'Economics of common sense: prices, exchange and the market.',
    },
  },
  {
    slug: 'theory',
    order: 2,
    title: { ru: 'Ступень 2. Теория', en: 'Level 2. Theory' },
    description: {
      ru: 'Праксеология Мизеса и австрийская теория денег.',
      en: "Mises's praxeology and the Austrian theory of money.",
    },
  },
  {
    slug: 'law-and-state',
    order: 3,
    title: { ru: 'Ступень 3. Право и государство', en: 'Level 3. Law and the State' },
    description: {
      ru: 'Собственность, право и природа государства.',
      en: 'Property, law and the nature of the state.',
    },
  },
  {
    slug: 'ideas',
    order: 4,
    title: { ru: 'Ступень 4. История идей', en: 'Level 4. History of Ideas' },
    description: {
      ru: 'Как идеи свободы рождались в истории философии и западной цивилизации.',
      en: 'How the ideas of liberty emerged in philosophy and Western civilization.',
    },
  },
]

export type CourseMeta = {
  section: number | null
  slug: string
  level: string
  order: number
  title: L
  year?: L
  tagline: L
  coverPrompt: string
}

export const COURSES: CourseMeta[] = [
  {
    section: null,
    slug: 'aristotle-logic',
    level: 'method',
    order: 0,
    title: { ru: 'Логика Аристотеля и метод', en: 'Aristotelian Logic and Method' },
    tagline: {
      ru: 'Термины, суждения, силлогизм и логические ошибки: как проверять любое утверждение.',
      en: 'Terms, propositions, syllogism and fallacies: how to test any claim.',
    },
    coverPrompt: 'three columns of a Greek portico representing the three laws of thought',
  },
  {
    section: 10,
    slug: 'twelve-rules',
    level: 'basics',
    order: 1,
    title: { ru: '12 правил экономики', en: '12 Rules of Economics' },
    year: { ru: 'февраль – май 2024', en: 'February – May 2024' },
    tagline: {
      ru: 'Двенадцать базовых закономерностей экономики: лучший вход для новичка.',
      en: 'Twelve basic regularities of economics: the best entry point.',
    },
    coverPrompt: 'twelve brass weights on the scales of an old shop counter',
  },
  {
    section: 9,
    slug: 'economic-common-sense',
    level: 'basics',
    order: 2,
    title: { ru: 'Здравый смысл экономики', en: 'Economic Common Sense' },
    tagline: {
      ru: 'Экономические явления глазами здравого смысла: видимое и невидимое.',
      en: 'Economic phenomena through common sense: the seen and the unseen.',
    },
    coverPrompt: "a broken shop window, Bastiat's parable of the seen and the unseen",
  },
  {
    section: 7,
    slug: 'laws-of-the-market',
    level: 'basics',
    order: 3,
    title: { ru: 'Законы рынка', en: 'Laws of the Market' },
    tagline: {
      ru: 'Как рынок координирует действия миллионов людей без единого плана.',
      en: 'How the market coordinates millions of people without a central plan.',
    },
    coverPrompt: 'a city fair seen from above, threads of exchange running between the stalls',
  },
  {
    section: 4,
    slug: 'human-action',
    level: 'theory',
    order: 1,
    title: { ru: 'Человеческая деятельность', en: 'Human Action' },
    year: { ru: '2024', en: '2024' },
    tagline: {
      ru: 'Разбор главного трактата Людвига фон Мизеса.',
      en: "A close reading of Ludwig von Mises's main treatise.",
    },
    coverPrompt: 'a hand choosing one of two paths at a fork in the road',
  },
  {
    section: 5,
    slug: 'money-flow',
    level: 'theory',
    order: 2,
    title: { ru: 'Денежный поток', en: 'The Flow of Money' },
    tagline: {
      ru: 'Природа денег, банки, инфляция и деловые циклы.',
      en: 'The nature of money, banking, inflation and business cycles.',
    },
    coverPrompt: 'gold coins flowing like a river between houses of a town',
  },
  {
    section: 3,
    slug: 'economics-and-law',
    level: 'law-and-state',
    order: 1,
    title: { ru: 'Экономика и право', en: 'Economics and Law' },
    year: { ru: 'сентябрь – декабрь 2024', en: 'September – December 2024' },
    tagline: {
      ru: 'Собственность, договор и право как спонтанный порядок.',
      en: 'Property, contract and law as a spontaneous order.',
    },
    coverPrompt: 'a boundary stone and a rolled contract scroll with a wax seal',
  },
  {
    section: 8,
    slug: 'myths-about-the-state',
    level: 'law-and-state',
    order: 2,
    title: { ru: 'Мифы о государстве', en: 'Myths about the State' },
    tagline: {
      ru: 'Распространённые представления о государстве под проверкой логикой и теорией.',
      en: 'Common beliefs about the state tested by logic and theory.',
    },
    coverPrompt: 'the Leviathan figure dissolving into a crowd of free individuals',
  },
  {
    section: 2,
    slug: 'intellectual-history',
    level: 'ideas',
    order: 1,
    title: { ru: 'Интеллектуальная история человечества', en: 'Intellectual History of Mankind' },
    year: { ru: 'февраль – май 2025', en: 'February – May 2025' },
    tagline: {
      ru: 'Как менялись идеи, которые двигали цивилизации.',
      en: 'How the ideas that moved civilizations changed over time.',
    },
    coverPrompt: 'a candle passed from hand to hand through the ages',
  },
  {
    section: 6,
    slug: 'western-civilization',
    level: 'ideas',
    order: 2,
    title: { ru: 'История западной цивилизации', en: 'History of Western Civilization' },
    tagline: {
      ru: 'От античности до Нового времени: истоки свободы и процветания Запада.',
      en: 'From antiquity to modernity: the roots of Western liberty and prosperity.',
    },
    coverPrompt: 'an arch framing an ancient temple and the sailing ships of explorers',
  },
  {
    section: 1,
    slug: 'history-of-philosophy',
    level: 'ideas',
    order: 3,
    title: { ru: 'История философии', en: 'History of Philosophy' },
    year: { ru: 'сентябрь – ноябрь 2026', en: 'September – November 2026' },
    tagline: {
      ru: 'От греков до Нового времени: как философия учила человека мыслить.',
      en: 'From the Greeks to modern times: how philosophy taught us to think.',
    },
    coverPrompt: 'the Athenian agora with scrolls and an owl',
  },
]
