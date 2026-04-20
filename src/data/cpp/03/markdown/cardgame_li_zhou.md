# Project Report — cardgame_li_zhou

| | |
|---|---|
| **Members** | Livia · Melody |
| **Submission** | On time |
| **Final Score** | 86.5 / 100 |

---

## Overall

Well-made Cat Fishing game with a clean Display namespace, good function decomposition, and a creative progress-bar status display. Solid work overall.

---

## Sections

**Subject Requirements — 30 / 30**
- All classes correct and complete — full marks
- README full marks — Cat Fishing rules, per-member breakdown

**Clean Code — 34.5 / 40**
- `setupGame()`, `checkFishing()`, `playTurn()` are well-sized and focused

- **`run()` (~54 lines) handles welcome, setup, loop, and winner logic all inline — a `determineWinner()` helper would clean it up** (−2)

  A function this long is doing too many things at once: initializing the game, running the loop, and computing the winner all in one block makes each step harder to read, test, or change separately.

  ```cpp
  if (_player.isEmpty()) {          // Game.cpp:128 — winner logic inline in run()
      winner = "Computer";
  } else if (_computer.isEmpty()) { // 10+ lines of winner determination inside run()
  ```

- **Copy constructor uses body assignment instead of initializer list** (−1)

  Body assignment default-constructs `_cards` first, then assigns it — the initializer list (`: _cards(other._cards)`) is both more efficient and the idiomatic C++ way to initialize members in a constructor.

  ```cpp
  Hand::Hand(const Hand& other) {  // Hand.cpp:6
      _cards = other._cards;       // assignment after default construction — use : _cards(other._cards)
  }
  ```

- **`dummy` variable name in `waitForEnter()` is vague** (−0.5)

  The name `dummy` signals "I don't care about this value" but tells the reader nothing about what it holds — `discardedInput` or just an anonymous discard pattern would be clearer, or a comment explaining why it's intentionally unused.

  ```cpp
  std::string dummy;
  std::getline(std::cin, dummy);  // Display.cpp:19-20 — "dummy" reveals nothing about purpose
  ```

- **Binary `cardgame` committed to repo** (−0.5)

  Compiled binaries are platform-specific and bloat the repo history — they can't be code-reviewed and become stale every time the source changes. Add the binary name to `.gitignore` instead.

- **Duplicate `#pragma once` in Card.hh** (−0.5)

  `#pragma once` already prevents the file from being included more than once — having it twice is a sign of a copy-paste mistake and looks sloppy, even though it causes no runtime harm.

  ```cpp
  #pragma once  // Card.hh:1
  #pragma once  // Card.hh:2 — redundant; was accidentally duplicated
  ```

- **Inconsistent indentation in Display.cpp — functions defined at column 0 inside the namespace block** (−0.5)

  When some functions are indented inside `namespace Display {}` and others start at column 0, it looks like they are outside the namespace — readers have to check braces carefully to understand the scope.

  ```cpp
  namespace Display {
      void waitForEnter() { ... }  // Display.cpp:17 — indented correctly
  std::string rankToString(...) {  // Display.cpp:23 — at column 0 inside the same namespace block
  ```

**Operator Overloading — 7 / 10**
- `operator<` and `operator>` correct

- **`operator==` compares rank only — 5♥ == 5♦ returns true** (−1)

  Card identity requires both rank and suit — comparing rank alone means the 5 of Hearts and the 5 of Diamonds are considered the same card, which would break any logic that needs to distinguish between them (e.g., checking for exact duplicates or tracking a specific card).

  ```cpp
  bool Card::operator==(const Card& other) const {
      return _rank == other._rank;  // Card.cpp:25-27 — suit ignored; 5♥ == 5♦ returns true
  }
  ```

- Both `operator<<` correctly implemented
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; Hand canonical form complete

**Inheritance — 0 / 10**
- Not used. A `Player` base class with a virtual `playTurn()` could have unified the human and computer player turns — `run()` would just call the same method on each participant, making it easy to add more player types later.

**Game Value Bonus — +5**
- Cat Fishing well implemented and faithful to the rules
- Screen refresh and clear ASCII card art — polished feel
- Interaction is just pressing enter; would benefit from more player choices
