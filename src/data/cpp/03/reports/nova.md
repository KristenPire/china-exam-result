# Project Report — nova

| | |
|---|---|
| **Members** | Leeking · Peter · Ronaldo · Sky |
| **Submission** | On time |
| **Final Score** | 87.5 / 100 |

---

## Overall

Clean Blackjack with a fluid screen refresh and good Ace adjustment logic. Well-delegating `run()`. The main issues are some committed binaries and file naming inconsistency.

---

## Sections

**Subject Requirements — 28 / 30**
- All classes correct and complete
- README has per-member breakdown but no actual game rules described — names the game but gives no description (−1). A README should tell someone who has never played Blackjack what the objective is and how to play — "bust", "hit/stand", and the 21 target are never mentioned, so a new player can't start.
- ⚠️ Only one committer email for four members (−1). Git history is how you prove who did what — if three members never commit under their own identity, there is no evidence of their contribution and the project cannot be fairly graded for participation.

**Clean Code — 35.5 / 40**
- `run()` is 8 lines — pure delegation to `initGame()`, `playerTurn()`, `dealerTurn()`, `askPlayAgain()` — exemplary
- Ace adjustment in `getTotalValue()` correctly handles bust avoidance

- **`playerTurn()` and `dealerTurn()` (~25–28 lines) have input validation and game state mixed inline — a `getPlayerChoice()` helper would separate them** (−1)

  A function should do one thing: reading and validating input is a separate responsibility from deciding the game outcome. Mixing them makes each harder to test or change independently.

  ```cpp
  while (!(std::cin >> choice) || (choice != 1 && choice != 2)) {  // game.cpp:70
      std::cin.clear();
      std::cout << "Invalid choice! Enter 1 (Hit) or 2 (Stand): ";  // input + game logic in same loop
  ```

- **Copy constructor uses body assignment instead of initializer list** (−0.5)

  The initializer list (`Hand::Hand(const Hand& other) : _cards(other._cards) {}`) is more efficient and is idiomatic C++ — body assignment first default-constructs `_cards`, then assigns it again.

  ```cpp
  Hand::Hand(const Hand& other) {  // hand.cpp:8
      _cards = other._cards;       // assignment after default construction — use : _cards(other._cards) instead
  }
  ```

- **Inconsistent file naming (lowercase files, uppercase includes) — poor naming convention and causes 15 portability warnings** (−1)

  macOS file systems are case-insensitive so it works locally, but on Linux (where most servers run) `#include "Card.hh"` will fail to find `card.hh` — the code compiles on your machine but breaks on the grader's.

  ```cpp
  #include "Card.hh"  // included as uppercase — game.hh:2
  // but the actual file on disk is: card.hh (lowercase)
  ```

- **Two exe binaries and VSCode config files committed to repo** (−1)

  Compiled binaries are platform-specific, large, and change on every rebuild — they pollute the history and make the repo harder to clone and review. A `.gitignore` excluding `*.exe` and `.vscode/` is standard practice.

- **Chinese comments throughout** (−0.5)

  Code is expected to be readable by any collaborator or reviewer — comments in a language only some readers know defeat the purpose of commenting. English is the lingua franca of programming.

  ```cpp
  // 拷贝构造函数   // hand.cpp:7 — Chinese throughout all source files
  // 赋值运算符重载
  ```

- **`_gameOver` used as both bust flag and game-end flag — dual semantics** (−0.5)

  When one variable means two different things, the logic becomes fragile — `dealerTurn()` checks `_gameOver` to skip dealer play, but it also sets `_gameOver = true` when the dealer busts, conflating "player busted" with "game is over". Separate flags would make each condition explicit.

  ```cpp
  if (_gameOver) return;  // game.cpp:92 — means "player busted", but same flag also signals end-of-game
  _gameOver = true;       // game.cpp:112 — set here for dealer bust too — same flag, different meaning
  ```

**Operator Overloading — 8 / 10**
- All required operators correct including `operator==` comparing both suit and rank
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; Hand canonical form complete

**Inheritance — 0 / 10**
- Not used. A `Player` base class with a `takeTurn()` virtual method could have unified `playerTurn()` and `dealerTurn()` and made adding new player types (AI strategies) easy without touching existing code.

**Game Value Bonus — +6**
- Very nice Blackjack — clear and playable
- Fluid screen refresh is a good touch
- No ASCII art but clean and well-presented
