# Project Report — cardgame-rafael-charles

| | |
|---|---|
| **Members** | Rafael · Charles · Eric |
| **Submission** | On time |
| **Final Score** | 97 / 100 |

---

## Overall

Clean implementation, good structure. I like the 1v1 design with two players sharing a common deck. Well structured and easily understandable even without screen refresh. Thank you for your work.

---

## Sections

**Subject Requirements — 30 / 30**
- All classes correct and complete
- README full marks — rules, architecture section, per-member breakdown

**Clean Code — 31 / 40**
- `run()` delegates cleanly; helper functions are short and focused

- **`handleTurn()` is ~100 lines handling draw, match, and discard phases inline — each phase should be its own function** (−4)

  A 100-line function with three nested while loops is hard to read and even harder to test in isolation. Each distinct phase (draw, match bonus, discard) is a complete logical unit — extract them as `drawPhase()`, `matchPhase()`, and `discardPhase()` so `handleTurn()` reads as a three-line sequence of steps.

  ```cpp
  void Game::handleTurn() {  // game.cpp:158 — 100 lines
      // draw phase (lines 162–187), match phase (lines 189–222), discard phase (lines 225–254)
  }
  ```

- **`Deck` has no copy constructor or copy-assignment — a copied Deck would double-free** (−2)

  `Deck` owns heap-allocated `Card*` pointers and deletes them in its destructor. If a `Deck` is ever copied (e.g. passed by value by accident), both the original and the copy will try to `delete` the same pointers — undefined behavior. Either implement a deep-copy pair or explicitly `= delete` them.

  ```cpp
  class Deck {  // deck.hh:9 — no copy constructor or operator= declared
      ~Deck();  // deck.cpp:8 — deletes all _cards; a shallow copy would double-free
  };
  ```

- **`Hand::isEmpty()` and `Hand::size()` override virtual functions but are not marked `override` (compiler warning)** (−1)

  Without `override`, the compiler cannot catch a mismatch if the base class signature ever changes — you silently get a new function instead of an override. Always write `override` on every virtual method you intend to override.

  ```cpp
  int size() const;     // hand.hh:20 — should be: int size() const override;
  bool isEmpty() const; // hand.hh:21 — should be: bool isEmpty() const override;
  ```

- **Magic numbers for hand size and difficulty levels, unseeded shuffle** (−2)

  `3` for max hand size and `2`/`3`/`4` for difficulty levels appear without names, making the logic opaque. The shuffle uses `rand()` without a prior `srand()` call in `Deck`, meaning the deck order is the same every run.

  ```cpp
  int drawLimit = 3 - handSizeBeforeDraw;  // game.cpp:162 — what is 3?
  if (difficulty == 2) { rows = 4; ... }  // game.cpp:40 — undocumented difficulty mapping
  int j = rand() % this->_cards.size();   // deck.cpp:54 — rand() unseeded, deterministic output
  ```

**Operator Overloading — 8 / 10**
- All required operators correct; `operator>` delegates to `other < *this`
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- `Hand` canonical form correct — deep-copies via `new`, destructor deletes all
- `Deck` missing copy constructor and copy-assignment — evaluated in Clean Code

**Inheritance — 10 / 10**
- `CardArea` abstract base with three pure virtual methods
- `Board` and `Hand` both inherit and implement all three
- Used polymorphically in `displayTurnState(const CardArea&)`

**Game Value Bonus — +8**
- Clean and simple, 1v1 by switching hands is a nice approach
- No screen refresh but well structured and easy to follow
