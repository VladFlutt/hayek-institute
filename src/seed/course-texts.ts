/**
 * Course descriptions and learning outcomes written for the school from each course's title and reading list.
 * Applied only to courses whose description is still empty, so edits in the admin panel win.
 */
type L = { ru: string; en: string }

export const COURSE_TEXTS: Record<string, { description: L; outcomes: L[] }> = {
  'aristotle-logic': {
    description: {
      ru: `Вводная ступень школы. Прежде чем спорить о ценах, деньгах и государстве, нужно договориться, как мы рассуждаем. Курс даёт инструменты классической логики Аристотеля: понятие и определение, три закона мышления, суждение и силлогизм, типичные ошибки рассуждения.

Пять коротких текстовых уроков с вопросами для самопроверки. Курс полностью бесплатный.`,
      en: `The entry level of the school. Before arguing about prices, money and the state, we agree on how we reason. The course covers the tools of classical Aristotelian logic: concepts and definitions, the three laws of thought, propositions and the syllogism, and common fallacies.

Five short text lessons with self-check questions. The course is free.`,
    },
    outcomes: [
      { ru: 'Давать определение через род и видовое отличие и замечать круг в определении', en: 'Define a term by genus and difference and spot circular definitions' },
      { ru: 'Раскладывать аргумент на посылки и вывод и проверять форму силлогизма', en: 'Break an argument into premises and conclusion and check the syllogism' },
      { ru: 'Узнавать типичные логические ошибки в экономических спорах', en: 'Recognise common fallacies in economic debates' },
    ],
  },
  'twelve-rules': {
    description: {
      ru: `Лучший вход в экономическую теорию для новичка. Курс Павла Усанова (февраль – май 2024) разбирает базовые закономерности экономики с позиций австрийской школы: откуда берётся ценность, как работают цены и издержки, что такое деньги и почему вмешательство в рынок даёт не тот результат, на который рассчитывали.

К курсу прилагается чтение: Менгер, Бастиа, Ротбард, Уэрта де Сото, Блок, Мизес и фильм «Командные высоты». По каждой книге в разделе «Уроки» есть методический конспект с вопросами.`,
      en: `The best entry point into economic theory. Pavel Usanov's course (February – May 2024) walks through the basic regularities of economics from the Austrian perspective: where value comes from, how prices and costs work, what money is and why intervention in the market misses its target.

The course comes with readings: Menger, Bastiat, Rothbard, Huerta de Soto, Block, Mises and the film Commanding Heights. Each reading has a study guide with questions under "Lessons".`,
    },
    outcomes: [
      { ru: 'Объяснять субъективную теорию ценности и решать «парадокс ценности»', en: 'Explain the subjective theory of value and resolve the paradox of value' },
      { ru: 'Видеть альтернативные издержки там, где другие видят только видимое', en: 'See opportunity costs where others see only the visible' },
      { ru: 'Понимать происхождение денег и последствия их выпуска государством', en: 'Understand the origin of money and the effects of state money creation' },
      { ru: 'Разбирать последствия контроля цен, субсидий и лицензий', en: 'Trace the effects of price controls, subsidies and licensing' },
    ],
  },
  'economic-common-sense': {
    description: {
      ru: `Экономические явления, которые мы видим каждый день, глазами здравого смысла и австрийской теории. Курс учит доводить рассуждение до конца: спрашивать не только «что видно», но и «чего не видно».

Чтение курса: «Наука о богатстве» Павла Усанова, «Man, Economy, and State» Ротбарда, «Индивидуализм и экономический порядок» Хайека, «Частные дороги» Блока и «Человеческая деятельность» Мизеса.`,
      en: `Everyday economic phenomena seen through common sense and Austrian theory. The course trains you to follow an argument to its end and ask not only "what is seen" but also "what is not seen".

Readings: Pavel Usanov's The Science of Wealth, Rothbard's Man, Economy, and State, Hayek's Individualism and Economic Order, Block's The Privatization of Roads and Highways, and Mises' Human Action.`,
    },
    outcomes: [
      { ru: 'Применять экономическое рассуждение к бытовым и политическим вопросам', en: 'Apply economic reasoning to everyday and political questions' },
      { ru: 'Понимать идею Хайека о рассеянном знании и роли цен', en: "Understand Hayek's idea of dispersed knowledge and the role of prices" },
      { ru: 'Обсуждать частное предоставление «общественных» благ на примере дорог', en: 'Discuss private provision of "public" goods, using roads as the case' },
    ],
  },
  'laws-of-the-market': {
    description: {
      ru: `Как рынок согласует действия миллионов людей, у которых нет общего плана. Курс разбирает механизм цен, спрос и предложение, конкуренцию и предпринимательство как процесс открытия.`,
      en: `How the market coordinates the actions of millions of people without a common plan. The course covers the price mechanism, supply and demand, competition and entrepreneurship as a discovery process.`,
    },
    outcomes: [
      { ru: 'Объяснять, как цены передают знание и координируют планы', en: 'Explain how prices carry knowledge and coordinate plans' },
      { ru: 'Понимать конкуренцию как процесс, а не как состояние', en: 'Understand competition as a process rather than a state' },
      { ru: 'Описывать роль предпринимателя в рыночной экономике', en: 'Describe the role of the entrepreneur in a market economy' },
    ],
  },
  'human-action': {
    description: {
      ru: `Медленное чтение главного трактата австрийской школы, «Человеческой деятельности» Людвига фон Мизеса (курс 2024 года). От аксиомы «человек действует» к теории обмена, денег, процента, экономического расчёта и вмешательства.

В помощь чтению: Уэрта де Сото, Хюльсманн, Салерно, Кантильон, Бастиа.`,
      en: `A close reading of the central treatise of the Austrian school, Ludwig von Mises' Human Action (2024 course). From the axiom "man acts" to the theory of exchange, money, interest, economic calculation and intervention.

Companion readings: Huerta de Soto, Hülsmann, Salerno, Cantillon, Bastiat.`,
    },
    outcomes: [
      { ru: 'Выводить базовые категории праксеологии из аксиомы действия', en: 'Derive the basic categories of praxeology from the action axiom' },
      { ru: 'Объяснять временное предпочтение и природу процента', en: 'Explain time preference and the nature of interest' },
      { ru: 'Формулировать аргумент о невозможности экономического расчёта при социализме', en: 'State the argument on the impossibility of economic calculation under socialism' },
    ],
  },
  'money-flow': {
    description: {
      ru: `Природа денег, банков и кризисов. Курс сравнивает две традиции: деньги как рыночный товар (Менгер, Мизес) и деньги как творение государства (Кнапп). Он разбирает золотой стандарт, частичное резервирование и австрийскую теорию делового цикла.

Чтение курса: Кнапп, Мизес, работы о золотом стандарте, Павел Усанов, Лоуренс Уайт «Борьба экономических идей».`,
      en: `The nature of money, banking and crises. The course contrasts two traditions: money as a market commodity (Menger, Mises) and money as a creation of the state (Knapp). It covers the gold standard, fractional reserve banking and the Austrian business cycle theory.

Readings: Knapp, Mises, works on the gold standard, Pavel Usanov, Lawrence White's The Clash of Economic Ideas.`,
    },
    outcomes: [
      { ru: 'Сравнивать товарную и государственную теории денег', en: 'Compare the commodity and state theories of money' },
      { ru: 'Объяснять механизм частичного резервирования и роль центрального банка', en: 'Explain fractional reserve banking and the role of the central bank' },
      { ru: 'Излагать австрийскую теорию делового цикла', en: 'Present the Austrian theory of the business cycle' },
    ],
  },
  'economics-and-law': {
    description: {
      ru: `Право как спонтанный порядок (курс сентябрь – декабрь 2024). Собственность, договор и разрешение споров рассматриваются не как изобретение законодателя, а как результат развития общества.

Чтение курса: Бруно Леони «Свобода и закон», Хайек, Гарольд Берман «Западная традиция права», Владимир Четвернин, Ротбард, Дэвид Фридман и Питер Лисон. В курс входят и лекции Четвернина и Йозефа Шима.`,
      en: `Law as a spontaneous order (September – December 2024). Property, contract and dispute resolution are treated not as the legislator's invention but as the outcome of social evolution.

Readings: Bruno Leoni's Freedom and the Law, Hayek, Harold Berman's Law and Revolution, Vladimir Chetvernin, Rothbard, David Friedman and Peter Leeson, plus lectures by Chetvernin and Josef Šíma.`,
    },
    outcomes: [
      { ru: 'Различать право как спонтанный порядок и законодательство', en: 'Distinguish law as spontaneous order from legislation' },
      { ru: 'Объяснять экономический смысл собственности и договора', en: 'Explain the economic role of property and contract' },
      { ru: 'Обсуждать частные механизмы разрешения споров на исторических примерах', en: 'Discuss private dispute resolution using historical cases' },
    ],
  },
  'myths-about-the-state': {
    description: {
      ru: `Распространённые представления о государстве проходят проверку логикой и экономической теорией. В каждом утверждении мы отделяем априорное, эмпирическое и оценочное и смотрим, что из него действительно следует.`,
      en: `Common beliefs about the state are tested against logic and economic theory. In each claim we separate the a priori, the empirical and the evaluative, and check what actually follows from it.`,
    },
    outcomes: [
      { ru: 'Разбирать типовые аргументы в пользу государственного вмешательства', en: 'Analyse standard arguments for state intervention' },
      { ru: 'Отделять экономический анализ от ценностных суждений', en: 'Separate economic analysis from value judgements' },
      { ru: 'Применять принцип ненападения к вопросам политики', en: 'Apply the non-aggression principle to policy questions' },
    ],
  },
  'intellectual-history': {
    description: {
      ru: `Как менялись идеи, которые двигали цивилизации (курс февраль – май 2025). Религия, философия, экономическая мысль и искусство рассматриваются как одна история человеческого самопонимания.

Чтение курса: Хантингтон, Фукуяма, Мизес «Теория и история», Шумпетер «История экономического анализа», Вебер, Тауни, Гомбрих, Скрутон, Рассел, Блум и другие.`,
      en: `How the ideas that moved civilisations have changed (February – May 2025). Religion, philosophy, economic thought and art are treated as one history of human self-understanding.

Readings: Huntington, Fukuyama, Mises' Theory and History, Schumpeter's History of Economic Analysis, Weber, Tawney, Gombrich, Scruton, Russell, Bloom and others.`,
    },
    outcomes: [
      { ru: 'Связывать развитие экономической мысли с общей историей идей', en: 'Connect the development of economic thought with the wider history of ideas' },
      { ru: 'Обсуждать тезисы Вебера и Тауни о религии и капитализме', en: 'Discuss the Weber and Tawney theses on religion and capitalism' },
      { ru: 'Критически сравнивать концепции «конца истории» и «столкновения цивилизаций»', en: 'Critically compare the "end of history" and "clash of civilisations" theses' },
    ],
  },
  'western-civilization': {
    description: {
      ru: `От античности до Нового времени: истоки свободы и процветания Запада. Курс прослеживает, как греческая философия, римское право, христианство и средневековые институты подготовили личную свободу и рыночную экономику.

Чтение курса: Крейн Бринтон, Квентин Скиннер, Мюррей Ротбард, Кеннет Кларк «Цивилизация», Кавтарадзе, Родни Старк «Как победил Запад».`,
      en: `From antiquity to modern times: the sources of Western freedom and prosperity. The course traces how Greek philosophy, Roman law, Christianity and medieval institutions prepared the ground for personal liberty and the market economy.

Readings: Crane Brinton, Quentin Skinner, Murray Rothbard, Kenneth Clark's Civilisation, Kavtaradze, Rodney Stark's How the West Won.`,
    },
    outcomes: [
      { ru: 'Называть ключевые источники западной традиции свободы', en: 'Name the key sources of the Western tradition of liberty' },
      { ru: 'Объяснять роль права и церкви в ограничении власти', en: 'Explain the role of law and the church in limiting power' },
      { ru: 'Обсуждать причины «европейского чуда» с разных позиций', en: 'Discuss the causes of the "European miracle" from several positions' },
    ],
  },
  'history-of-philosophy': {
    description: {
      ru: `От греков до Нового времени: как философия учила человека мыслить (курс сентябрь – ноябрь 2026). Особое место занимают Аристотель и его наследие: метафизика, логика и комментарии Фомы Аквинского.

Чтение курса: Аристотель «Метафизика», Фома Аквинский, Коплстон, Жильсон, Виндельбанд, Рассел, Дюрант, Пейкофф и Айн Рэнд.`,
      en: `From the Greeks to modern times: how philosophy taught people to think (September – November 2026). Aristotle and his legacy hold a special place: metaphysics, logic and the commentaries of Thomas Aquinas.

Readings: Aristotle's Metaphysics, Thomas Aquinas, Copleston, Gilson, Windelband, Russell, Durant, Peikoff and Ayn Rand.`,
    },
    outcomes: [
      { ru: 'Излагать основные понятия метафизики Аристотеля', en: "Present the main concepts of Aristotle's metaphysics" },
      { ru: 'Прослеживать судьбу аристотелизма в Средние века', en: 'Trace the fate of Aristotelianism in the Middle Ages' },
      { ru: 'Сравнивать подходы к истории философии у разных авторов', en: 'Compare how different authors approach the history of philosophy' },
    ],
  },
}
