# Project Report — c-oop-wizard

| | |
|---|---|
| **Members** | Riley · Search · Borios · Simon |
| **Submission** | On time |
| **Final Score** | 98 / 100 |

---

## Overall

Clean and focused — exactly what was asked. The code quality is high and the implementation shows good understanding. Even though the game is basic, I'm very happy with the work.

---

## Sections

**Subject Requirements — 30 / 30**
- All classes correct and complete
- README: full marks — bilingual, flowchart, per-member breakdown

**Clean Code — 36 / 40**
- Excellent decomposition: `run()` → `startMatch()` → `playRound()` → focused helpers
- `GameUi` namespace cleanly separates UI logic

- **`std::srand` seeding duplicated across 3 files instead of a single init point** (−1)

  Each file independently checks `static bool seeded` and calls `srand(time(nullptr))`. If they ever execute in a tight window, the seed is the same and all three "random" streams will be identical. Seed once in `main()` or `Game::run()` before anything else.

  ```cpp
  static bool seeded = false;  // Deck.cpp:15 — also duplicated in Game.cpp:140 and Player.cpp:71,81
  if (!seeded) { std::srand(static_cast<unsigned int>(std::time(nullptr))); seeded = true; }
  ```

- **`tryOptionalSwap()` and `askPlayAgain()` slightly overloaded with inline input validation** (−2)

  Both functions do two jobs at once: manage game flow and validate user input. Extracting `readYesNo(const std::string& prompt)` into the `GameUi` namespace would let each function focus on its single responsibility and make the input logic reusable.

  ```cpp
  void Game::tryOptionalSwap()  // Game.cpp:81 — 29 lines mixing swap logic + input loop
  bool Game::askPlayAgain()     // Game.cpp:210 — 23 lines mixing play-again logic + input loop
  ```

- **`OpponentIntel` struct name is unconventional** (−1)

  "Intel" is slang — `OpponentInfo` or `OpponentSnapshot` communicates the purpose more directly in a C++ codebase context.

**Operator Overloading — 10 / 10**
- All required operators correct
- Bonus: `Hand::operator+=` and `Hand::operator[]` with bounds checking

**Heap / Dynamic Memory — 10 / 10**
- Raw pointers used correctly for runtime polymorphism (`Player*`)
- Copy and assignment explicitly deleted — correct pattern, prevents double-free

**Inheritance — 10 / 10**
- `Player` abstract base with two pure virtual methods
- `HumanPlayer` / `ComputerPlayer` both override — dispatched through `Player*` in Game

**Game Value Bonus — +2**
- Clean and simple
- No screen clearing; just pick a card and see who wins
