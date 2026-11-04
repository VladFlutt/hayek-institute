/** English versions of the «12 правил экономики» reading guides, keyed by lesson slug. */
export const READING_NOTE_EN =
  "_A Hayek Institute study guide to a book from the course reading list. It is not a summary of Pavel Usanov's lecture: lecture notes will follow once transcripts are ready._"

export const TWELVE_RULES_GUIDES_EN: Record<string, { title: string; body: string; questions: { q: string; a: string }[] }> = {
  'reading-1': {
    title: 'Reading 1. Carl Menger: value is born in the person',
    body: `**Book:** Carl Menger, *Principles of Economics* (1871), the founding work of the Austrian school.

**Main idea.** Value is not a property of a thing, like weight or colour. It arises in the judgement of a person who sees that the satisfaction of a need depends on that thing. Hence the *subjective theory of value*.

**Key concepts**

- **Good.** A thing becomes a good under four conditions: there is a need; the thing can satisfy it; the person knows this; and they can dispose of the thing.
- **Goods of lower and higher order.** Bread is a first-order good, flour second-order, the mill and the grain third-order. The value of higher-order goods is *derived* from the value of the consumer goods they will produce, not the other way round.
- **Economic and free goods.** A good is economic when there is less of it than needed. Air is usually not an economic good; water in a desert is.
- **Diminishing importance.** Each further unit of a stock goes to a less important need, so the value of a unit is set by the least important use it serves. This was later called *marginal utility*.
- **Origin of money.** No decree invented money. People spontaneously picked the most saleable commodity as a medium of exchange.

**Link to the course.** Almost every later "rule" follows from this: prices, costs, money and the damage done by debasing it are all explained through the valuations of acting people.`,
    questions: [
      { q: 'Why is a diamond usually dearer than water, though water is more needed?', a: 'We value a specific unit of the stock, not "water in general". Water is plentiful, so its next unit serves a minor need. Diamonds are scarce, so each unit matters. This resolves the paradox of value through diminishing (marginal) importance.' },
      { q: 'Where does the value of a machine come from, if nobody wants it for itself?', a: 'From the value of the consumer goods it will help produce. The value of higher-order goods is derived from the expected value of first-order goods.' },
      { q: "How does Menger's account of money differ from the view that the state creates money?", a: 'For Menger money emerges spontaneously: people trade their goods for the most saleable ones, and gradually one commodity becomes the generally accepted medium of exchange. The state can only confirm or distort that outcome.' },
    ],
  },
  'reading-2': {
    title: 'Reading 2. Frédéric Bastiat: what is seen and what is not seen',
    body: `**Book:** Frédéric Bastiat, *That Which Is Seen and That Which Is Not Seen* (1850).

**Main idea.** Every act, and every government measure above all, has visible effects and invisible ones. A bad economist looks only at the seen; a good one also accounts for the unseen.

**The broken window.** A boy breaks a window, the glazier gets an order, and "trade is stimulated". That is what is seen. What is not seen: the owner would have spent the same money on shoes or a book. Society is not richer; it has one window instead of a window *and* shoes. Destruction does not create wealth, it only diverts spending.

**Where the same mistake appears**

- **Public works.** The jobs on the building site are seen. The jobs that never appeared, because taxpayers lost the money, are not.
- **Protectionism.** The rescued domestic industry is seen. The consumers' overpayment and the industries the money would have gone to are not.
- **Subsidies.** The recipient is seen. Those it was taken from are not.

**Logical tool.** Always ask: *"What would have happened to these resources without this measure?"* This is **opportunity cost**: the cost of any choice is the value of the best alternative given up.`,
    questions: [
      { q: 'What is wrong with "war and destruction are good for the economy because they create demand"?', a: 'Only the seen is counted: the reconstruction orders. The unseen is ignored: the same resources would have produced new goods instead of restoring old ones. Society is poorer by what was destroyed.' },
      { q: 'State the broken window as a syllogism and find the false premise.', a: 'Whatever increases spending increases wealth; a broken window increases spending; so it increases wealth. The major premise is false: spending diverted from one good to restoring another adds no wealth.' },
      { q: 'What is opportunity cost?', a: 'The value of the best alternative given up when a choice is made.' },
    ],
  },
  'reading-3': {
    title: 'Reading 3. Murray Rothbard: the state, money and the central bank',
    body: `**Book:** Murray Rothbard's work on the state, money and central banking.

**Main idea.** Money is a market commodity, and the market can supply it like any other good. The trouble in the monetary system begins when the state takes a monopoly on issuing money.

**The argument**

1. **Money arises on the market** as the most saleable commodity (following Menger), historically gold and silver.
2. **Any quantity of money is enough.** More money is not more wealth. New money only changes prices and distribution; society as a whole is not richer.
3. **Those who get new money first gain.** They spend it at old prices. The last recipients (pensioners, wage earners) buy at prices that have already risen. This is the *Cantillon effect*: inflation works as a hidden tax and a redistribution.
4. **Fractional reserves.** A bank lends out money that depositors hold "on demand", creating claims beyond the actual stock of money.
5. **The central bank** props this system up: it acts as lender of last resort and lets banks expand credit in step.

**The author's conclusion.** Sound money is commodity money with 100% reserves and no state monopoly on issue.`,
    questions: [
      { q: 'Why, for Rothbard, does a growing economy not need "more money"?', a: 'Money is a medium of exchange, not a consumer good. Any quantity does the job; prices adjust. Extra money redistributes wealth but does not create it.' },
      { q: 'Who gains and who loses when new money is issued?', a: 'The first recipients gain: the state, banks and their borrowers, who spend before prices rise. The last recipients and savers lose, facing prices that have already risen.' },
      { q: 'What is fractional reserve banking?', a: 'A practice in which a bank keeps only part of demand deposits in reserve and lends out the rest, so more claims to money circulate than money itself.' },
    ],
  },
  'reading-4': {
    title: 'Reading 4. Jesús Huerta de Soto: what the Austrian school is',
    body: `**Book:** Jesús Huerta de Soto, *The Austrian School: Market Order and Entrepreneurial Creativity*.

**Main idea.** The Austrian school is set apart not by particular conclusions but by its method and its view of the market. The market is a *process* driven by entrepreneurship, not a state of equilibrium.

**How the Austrians differ from the mainstream**

| Austrian school | Neoclassical approach |
|---|---|
| Theory of human action | Theory of choice with given data |
| Subjectivism: knowledge is in people | "Objective" functions and data |
| Market as a dynamic process | Equilibrium models |
| The entrepreneur discovers opportunities | The agent optimises the known |
| Knowledge is dispersed and tacit | Knowledge is assumed available |
| Deduction, verbal logic | Mathematical models and econometrics |

**Entrepreneurship.** The ability to notice profit opportunities others have missed. The entrepreneur creates new knowledge and, by acting, coordinates people's mismatched plans.

**The impossibility of socialism.** If knowledge is dispersed and created by market participants themselves, no central body can gather it. It cannot allocate resources rationally even with the best intentions (the Mises and Hayek argument).

**Names to know:** Menger, Böhm-Bawerk, Mises, Hayek, Rothbard, Kirzner.`,
    questions: [
      { q: 'How does "the market as a process" differ from "the market as equilibrium"?', a: 'Equilibrium describes an imaginary state where plans already fit. The process describes how entrepreneurs, noticing errors and opportunities, gradually bring together plans that in reality never fit.' },
      { q: 'Why is knowledge the key to the socialism debate for the Austrians?', a: 'Knowledge of resources, preferences and opportunities is dispersed among people and often tacit. Without market prices it cannot be gathered at the centre, so central planning cannot allocate resources rationally.' },
      { q: 'Name three Austrian economists and the contribution of each.', a: 'For example: Menger, subjective value; Mises, praxeology, monetary theory and the critique of socialism; Hayek, dispersed knowledge and spontaneous order.' },
    ],
  },
  'reading-5': {
    title: 'Reading 5. Commanding Heights: the battle for the world economy',
    body: `**Film:** the documentary series *Commanding Heights* (2002), based on the book by Daniel Yergin and Joseph Stanislaw.

**What it is about.** The 20th century told as a contest of two ideas: should the state hold the "commanding heights" of the economy (Lenin's phrase), or should the market? The running thread is the debate between Keynes and Hayek.

**Main episodes**

- After the First World War and the Great Depression, the belief that the economy must be managed wins.
- The post-war decades: nationalisation, planning in the USSR, Keynesian management in the West.
- The 1970s: stagflation. Rising prices and unemployment at the same time undermine the Keynesian model.
- Thatcher, Reagan, reforms in Chile, China and India. The return to the market.
- The collapse of the Soviet system and the transition to markets in Eastern Europe.

**How to watch critically.** The film takes the market's side but does not always separate economic theory from political decisions. While watching, note where a claim rests on *theory* (a priori), where on *history* (empirical) and where on *values* (evaluative). The school's AI tutor uses the same labels.`,
    questions: [
      { q: 'What does "the commanding heights" of the economy mean?', a: 'The key industries and levers of control: heavy industry, banking, transport, energy. The question is who controls them, the state or the market.' },
      { q: 'Why was 1970s stagflation a problem for Keynesian theory?', a: 'The Keynesian model (through the Phillips curve) assumed a trade-off between inflation and unemployment. Both rising together contradicted it and undermined faith in demand management.' },
      { q: 'Give one a priori, one empirical and one evaluative claim from the film.', a: 'A priori: "prices fixed below the market level create shortages". Empirical: "Britain had high inflation in the 1970s". Evaluative: "Thatcher\'s reforms were good for the country".' },
    ],
  },
  'reading-6': {
    title: 'Reading 6. Murray Rothbard: power and market',
    body: `**Book:** Murray Rothbard, *Power and Market: Government and the Economy*.

**Main idea.** A systematic analysis of every kind of government intervention in the market. Rothbard shows that intervention misses its stated goals and creates new problems.

**Types of intervention**

1. **Autistic.** Coercing a person with no exchange involved: banning some action concerning oneself.
2. **Binary.** A forced "exchange" between the state and a subject: taxes, subsidies, conscription.
3. **Triangular.** The state steps into an exchange between two people: price controls, licences, tariffs, bans.

**Examples**

- A **price ceiling** below the market price creates shortages, queues and a black market.
- A **price floor** above the market price, such as a minimum wage, creates surpluses: in the labour market, unemployment among the least skilled.
- **Licensing** restricts entry to an industry and raises prices for those already in it.
- **Taxes** cannot be "neutral". Every tax distorts decisions and moves resources from producers to the state.

**Logic.** Rothbard keeps asking *what the parties to the exchange would have chosen themselves* and how intervention changes their actions. It extends Bastiat's "unseen".`,
    questions: [
      { q: 'How does triangular intervention differ from binary?', a: 'Binary is a coercive relation between the state and one person (a tax, a subsidy). Triangular is the state interfering in a voluntary exchange between two other people (price control, ban, licence).' },
      { q: 'Why does a price ceiling below the market price lead to shortages?', a: 'At the low price buyers want more and sellers offer less. The gap between quantity demanded and supplied is the shortage.' },
      { q: 'Who gains from occupational licensing?', a: 'Those already in the profession: competitors are kept out, so prices stay higher. Consumers and those kept out of the market lose.' },
    ],
  },
  'reading-7': {
    title: 'Reading 7. Walter Block: defending the undefendable',
    body: `**Book:** Walter Block, *Defending the Undefendable* (1976).

**Main idea.** Many occupations and acts that society condemns violate nobody's rights and are often useful. The real "wolves" are those who use force, the state included.

**The test.** Block applies the *non-aggression principle*: it is wrong to use force or the threat of force against the person or property of someone who has not aggressed. If an act is voluntary and coerces nobody, it may be unpleasant or immoral, but it may not be banned.

**Cases the book examines**

- The **speculator** buys cheap in plenty and sells in scarcity, smoothing fluctuations and moving goods to where they are needed most.
- The **moneylender** lends to those banks will not serve; the high rate reflects high risk.
- The **strikebreaker** exercises the right to work on terms acceptable to them.
- The **employer who pays little** offers the best option available to the worker, who otherwise would not agree.

**How to read it.** The book is deliberately provocative. Keep two questions apart: *is it good* (morals) and *may it be banned by force* (law). Training that distinction is the point of the book.`,
    questions: [
      { q: 'State the non-aggression principle.', a: 'It is impermissible to initiate force or the threat of force against another person or their justly acquired property.' },
      { q: 'What good does a speculator do, in terms of economic theory?', a: 'They move goods across time and place from plenty to scarcity. Buying at low prices and selling at high ones, they smooth price swings and ease shortages.' },
      { q: 'Why is "is it moral?" a different question from "may it be banned?"', a: 'The first is about judging an act, the second about whether force is allowed. An act can be unpleasant or immoral without violating anyone\'s rights, while a ban always means the use of force.' },
    ],
  },
  'reading-8': {
    title: 'Reading 8. Ludwig von Mises: human action',
    body: `**Book:** Ludwig von Mises, *Human Action: A Treatise on Economics* (1949), the central work of the Austrian school and the summit of the course.

**The axiom.** *Man acts*: he uses means purposefully to attain ends. This cannot be denied without contradiction, since the denial is itself an action. All economic theory, *praxeology*, is deduced from it.

**What follows from the axiom**

- **Ends and means.** Action implies dissatisfaction, an image of a better state and a belief that behaviour can bring it about.
- **Ranking.** Choosing one thing means placing it above another. Valuations are ordinal: they cannot be added or measured.
- **Time.** Action takes time, and other things equal, satisfaction now is preferred to later. This is *time preference*, the basis of interest.
- **Uncertainty.** The future is unknown, so every action is speculation, and the entrepreneur's role cannot be removed.
- **Costs.** Cost is the value of the alternative given up; profit is the excess of what is attained over what is given up.

**Economic calculation.** Without private ownership of the means of production there are no market prices for them; without prices there is no calculation of profit and loss. So socialism is not an inefficient system but the impossibility of a rational economy.

**Link to the course.** Menger gave subjective value, Bastiat the unseen costs, Rothbard money and intervention. Mises brings it all together into one deductive system.`,
    questions: [
      { q: 'Why can the axiom "man acts" not be refuted?', a: 'Any attempt to refute it is a purposeful action aimed at an end (proving oneself right). The denial contradicts itself: a performative contradiction.' },
      { q: 'What is time preference and how is it linked to interest?', a: 'Other things equal, people prefer satisfaction sooner rather than later, so present goods are valued above future ones. Interest expresses this difference in valuation.' },
      { q: 'Why, for Mises, is economic calculation impossible under socialism?', a: 'Without private ownership of the means of production there is no exchange of them, hence no market prices. Without prices, costs and results cannot be compared in common units, so profit and loss cannot be calculated.' },
    ],
  },
}
