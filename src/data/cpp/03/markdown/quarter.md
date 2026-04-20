# Project Report — quarter

| | |
|---|---|
| **Members** | Alysa · Nimo · Makayla · Alex |
| **Submission** | On time |
| **Final Score** | 88 / 100 |

---

## Overall

Solid Blackjack with some nice extra mechanics (heart save rule, spade special). Clean structure with well-separated Display and Input modules. The main weakness is a DRY violation and some redundant score logic.

---

## Sections

**Subject Requirements — 30 / 30**
- All classes correct and complete — full marks
- README full marks — Blackjack rules, heart/spade specials, per-member breakdown, Integration Notes

**Clean Code — 35 / 40**
- `run()` delegates cleanly; Display/Input namespace separation is excellent

- **`handCards` function duplicated verbatim across Game.cpp and Display.cpp — significant DRY violation** (−2)

  When 47 identical lines appear in two files, any bug fix or change must be made twice. Moving `handCards` to a shared header or utility file would make it a single source of truth.

  ```cpp
  // Game.cpp:12-59 and Display.cpp:12-58 — identical function in both files
  std::vector<std::string> handCards(const Hand& hand) { std::ostringstream stream; stream << hand; ... }
  ```

- **Score logic in anonymous namespace re-implements `Card::getValue()` instead of using the Card API** (−1)

  `cardValueFromText` parses the printed string representation of a card to recover the value that `Card::getValue()` already returns directly. Parsing your own output is fragile — if `operator<<` ever changes format, the score logic silently breaks.

  ```cpp
  int cardValueFromText(const std::string& cardText) { ... rankText == "A" return 11; ... }  // Game.cpp:80
  // Card::getValue() at Card.cpp already returns the Blackjack value correctly
  ```

- **Magic numbers `17` (dealer stand) and `21` (bust) inline without named constants** (−1)

  These numbers are core Blackjack rules; embedding them as literals means a reader must know the game to understand them, and changing them for a variant requires a search-and-replace. `constexpr int kDealerStand = 17;` and `kBustThreshold = 21` make the code self-documenting.

  ```cpp
  while (scoreAfterHeartRule(_dealerHand, _dealerHeartSaveUsed) < 17)  // Game.cpp:215 — magic 17
  if (playerScore > 21) { Display::showRoundResult("Player busts."); }  // Game.cpp:247 — magic 21
  ```

- `baseScore`/`cardValueFromText` naming signals design smell — parsing text output rather than using the Card API

**Operator Overloading — 8 / 10**
- All required operators correct including `operator==` comparing both suit and rank
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; Hand canonical form complete with initializer list

**Inheritance — 0 / 10**
- Not used. The game has two distinct roles — `Player` and `Dealer` — whose turn logic lives in separate `playerTurn()` and `dealerTurn()` functions. A `Participant` base class with a virtual `takeTurn()` would have unified the two roles and made it natural to add new participant types (e.g. a bot player) later.

**Game Value Bonus — +5**
- Simple and clear Blackjack
- ASCII card art is a nice touch, though it breaks visually when the hand grows large
- No screen refresh
