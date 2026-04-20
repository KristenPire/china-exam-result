# Project Report — deepsleep

| | |
|---|---|
| **Members** | Aleksib · Winham · Clare · Tohsaka |
| **Submission** | On time |
| **Final Score** | 83 / 100 |

---

## Overall

Blackjack with betting, round selection, horizontal ASCII card art, and bankruptcy detection. Very readable and well-structured visually. Main technical gaps: Hand has no canonical form at all (no copy ctor/copy-assign/destructor), `using namespace std` in three header files, both operator<< for Card and Hand commented out (printcard() used instead), and run() at ~90 lines handles everything inline. Good game value — clean ASCII art, betting loop, result panel.

---

## Sections

**Subject Requirements — 26 / 30**
- Hand: no canonical form (−1); `using namespace std` in Hand.hh (−0, counted in §2). Without an explicit copy constructor, copy-assignment, and destructor, the compiler generates defaults — which happen to work for `vector`, but you've given no signal that you understand what happens when Hand is copied, assigned, or destroyed.

- **Game: main.cpp modified — calls game.init() + game.circle() instead of game.run()** (−1)

  The assignment requires `main.cpp` to be left untouched with a single `game.run()` call; splitting startup into `init()` and `circle()` changes the contract the grader checks.

  ```cpp
  // main.cpp — modified from the required template
  game.init();
  game.circle();  // required: game.run()
  ```

- **Git: only one committer email for 4 members** (−2)

  With four members and only one email in the log, there is no evidence that the other three pushed any code at all. Each member must commit and push under their own account so their contribution is visible.

- README full marks — bilingual structure, per-member breakdown

**Clean Code — 27.5 / 40**

- **run() (~90 lines) handles all of betting, dealing, player turn, dealer turn, result, display inline** (−4)

  A 90-line function that mixes input, state mutation, and output is very hard to test, debug, or modify — any change to the betting logic risks breaking the display code right next to it. Each concern should be a separate helper: `takeBet()`, `dealInitialCards()`, `playerTurn()`, `dealerTurn()`, `showResult()`.

  ```cpp
  // Game.cpp:68-157 — betting, dealing, hit/stand loop, dealer loop, result all in one block
  void Game::run() {
      int now = this->p1.get_money();   // bet handling...
      for (int i = 0; i < 2; i++) p1.addCard(this->draw()); // dealing...
      while (!p1.isStanding() && !p1.isBust()) { ... }      // player turn...
      while (p2.getScore() < 17) { ... }                    // dealer turn...
      // result output...  (~90 lines total)
  ```

- **Hand canonical form entirely absent** (−3 in §2.2)

  The canonical form (copy constructor, copy-assignment, destructor) is a core C++ concept this project is designed to practice. Leaving it out entirely means you haven't demonstrated you can manage object lifecycle.

  ```cpp
  // Hand.hh — none of these are declared or implemented:
  // Hand(const Hand& other);
  // Hand& operator=(const Hand& other);
  // ~Hand();
  ```

- **`using namespace std` in 3 headers (Hand.hh, Player.hh, Game.hh)** (−2)

  A `using namespace std` in a header forces every file that includes it to silently import the entire `std` namespace — this can cause name collisions in files you never intended to affect, and it's considered one of the most common C++ anti-patterns.

  ```cpp
  // Hand.hh:3, Player.hh:8, Game.hh:8
  using namespace std;  // pollutes every .cpp that includes this header
  ```

- **`this->` prefix style throughout, C-style casts, committed binaries, magic numbers** (−1.5)

  `this->` is only needed to disambiguate between a member and a local with the same name — using it everywhere is a Java habit that adds noise in C++. C-style casts like `(Card::Suit)s` bypass the type system's safety checks; prefer `static_cast<Card::Suit>(s)`. Magic numbers like `17` and `21` should be named constants so the Blackjack rules are self-documenting.

  ```cpp
  // Deck.cpp:8 — C-style cast
  this->_cards.push_back(Card((Card::Suit)s, (Card::Rank)r));  // use static_cast
  // Game.cpp:117 — magic number: dealer hits below 17
  while (p2.getScore() < 17) { ... }  // 17 should be a named constant
  ```

**Operator Overloading — 5 / 10**
- operator< and operator> correct

- **operator== compares rank only** (−1)

  A 5♥ and a 5♦ are two different physical cards; comparing only rank means the operator can't distinguish them, which is incorrect for any logic that needs to check card identity.

  ```cpp
  // Card.cpp:39-42
  bool Card::operator==(const Card& other) const {
      return getRank() == other.getRank();  // missing: && getSuit() == other.getSuit()
  }
  ```

- **operator<< for Card and Hand both commented out** (−2)

  The stream insertion operator is the standard C++ way to make objects printable with `cout`; using a custom `printcard()` method instead means the objects can't be used with streams, string formatting, or logging libraries. The commented-out attempts show they were tried but abandoned.

  ```cpp
  // Card.hh:21 — declaration commented out
  // friend std::ostream& operator<<(std::ostream& os, const Card& card);
  // Hand.hh:12 — same
  // friend std::ostream& operator<<(std::ostream& os, const Hand& hand);
  ```

**Heap / Dynamic Memory — 10 / 10**
- STL-only; canonical form penalized in §2.2 only (no double-count)

**Inheritance — 0 / 10**
- Not used. The Display namespace already has `start()` and `end()` functions — a `DisplayBase` with virtual `render()` and concrete `ConsoleDisplay` subclass would have been a natural design, or a `BlackjackGame` inheriting from a generic `CardGame` base.

**Game Value — 14.5 / 20**
- Clean ASCII art, horizontal hand display, betting system, round selection
- Very readable result panel
- Would have been perfect with a screen refresh
