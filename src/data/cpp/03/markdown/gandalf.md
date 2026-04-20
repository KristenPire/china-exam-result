# Project Report — gandalf

| | |
|---|---|
| **Members** | Jelly · Liesel · Stella · Melkiades |
| **Submission** | On time |
| **Final Score** | 86 / 100 |

---

## Overall

Solid War game with recursive war handling and correct edge-case logic for insufficient cards. Clean naming throughout. The main issues are operator== comparing rank only, a constructor that mixes initialization with display side effects, and duplicate insufficient-cards blocks in handleWar().

---

## Sections

**Subject Requirements — 30 / 30**
- All classes correct and complete — full marks
- README full marks — War rules, war mode, per-member class breakdown

**Clean Code — 36 / 40**
- run() (11 lines) fully delegating — exemplary
- Short focused helpers: dealCards(), checkGameEnd(), printGameState(), printWinner()

- **handleWar() (~61 lines) has two near-duplicate insufficient-cards blocks — shared helper needed** (−1)

  When the same logic appears twice (once for player, once for AI), any bug fix or rule change must be applied in both places — it is easy to update one and forget the other.

  ```cpp
  if (_playerHand.size() < 4) {  // Game.cpp:83 — block for player running out
      ...
  }
  if (_aiHand.size() < 4) {      // Game.cpp:96 — near-identical block for AI
  ```

- **Game constructor mixes title screen display, shuffle, deal, and waitForEnter()** (−1)

  Constructors should only initialize data — printing to the screen and waiting for user input are side effects that make the object hard to construct in tests or non-interactive contexts, and surprising to anyone who just writes `Game g;`.

  ```cpp
  Game::Game() : _round(0) {          // Game.cpp:6
      std::cout << "WAR CARD GAME";   // Game.cpp:7-9 — display in constructor
      _deck.shuffle(); dealCards();    // setup also here
      waitForEnter();                  // Game.cpp:17 — blocks for input in constructor
  }
  ```

- **printRoundResult() takes playerCard/aiCard parameters that are unused, silenced with (void) casts** (−0.5)

  Unused parameters in a function signature mean the interface is misleading — callers pass values that have no effect. The right fix is to remove the parameters from the signature, not to silence the warning with `(void)`.

  ```cpp
  void Game::printRoundResult(const Card& playerCard, const Card& aiCard, bool playerWins) const {
      (void)playerCard; (void)aiCard;  // Game.cpp:150-151 — parameters declared but never used
  ```

- **Fisher-Yates shuffle uses rand()/srand() instead of mt19937** (−0.5)

  `rand()` has poor statistical randomness and is not thread-safe — `std::mt19937` seeded with `std::random_device` is the modern C++ way to get a high-quality random sequence.

  ```cpp
  std::srand(std::time(nullptr));  // Deck.cpp:8 — C-style seed
  int j = std::rand() % (i + 1);  // Deck.cpp:21 — C-style random; use mt19937 + uniform_int_distribution
  ```

- **Copy constructor uses body assignment instead of initializer list** (−0.5)

  The initializer list form (`: _cards(other._cards)`) directly copy-constructs the member, while body assignment first default-constructs it and then assigns — the former is both more efficient and idiomatic C++.

  ```cpp
  Hand::Hand(const Hand& other) {  // Hand.cpp:7
      _cards = other._cards;       // assignment after default construction — use : _cards(other._cards)
  }
  ```

- **Chinese comments throughout** (−0.5)

  Code is expected to be understandable by any reviewer — comments in a language only some readers know reduce the value of the documentation. English is the standard for code comments in a shared or graded project.

  ```cpp
  // 构造函数：初始化游戏  // Game.cpp:5
  // 洗牌并发牌           // Game.cpp:11 — Chinese comments throughout all source files
  ```

**Operator Overloading — 7 / 10**
- operator< and operator> correct

- **operator== compares rank only — 5♥ == 5♦ returns true** (−1)

  Card identity requires both rank and suit — ignoring suit means two completely different cards appear equal, which can cause incorrect behavior when checking for duplicates or looking up a specific card.

  ```cpp
  bool Card::operator==(const Card& other) const {
      return _rank == other._rank;  // Card.cpp:22-24 — suit ignored; 5♥ == 5♦ returns true
  }
  ```

- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; Hand canonical form complete

**Inheritance — 0 / 10**
- Not used. A `Player` base class with a virtual `playCard()` method could have unified the player and AI logic — War is a symmetric game and a shared interface would eliminate the need to handle each side separately throughout `handleWar()` and `playRound()`.

**Game Value Bonus — +3**
- Simple and honest War game, clear
- No screen refresh
