# Project Report — chinese-dou-di-zhu

| | |
|---|---|
| **Members** | Sakuya (solo) |
| **Submission** | On time |
| **Final Score** | 72 / 100 |

---

## Overall

Full Dou Di Zhu implementation with AI opponent, Pattern class covering all hand types (SINGLE/PAIR/TRIPLE/SEQUENCE/PLANE_WINGS/BOMB), landlord determination, and correct win conditions. Ambitious game choice for a solo project. Main weaknesses: Hand is missing size(), isEmpty(), and any canonical form; operator> and operator<< both absent; Deck constructor has three responsibilities; non-scoped enums pollute the namespace. Bi-lingual mixed output makes the game hard to read.

---

## Sections

**Subject Requirements — 23 / 30**
- **Card: plain enum Suit/Rank (non-scoped)** (−1)

  A plain `enum` dumps all its values into the surrounding namespace — `SPADES`, `HEARTS`, etc. become global names that can clash with anything else. `enum class Suit` keeps them scoped as `Suit::SPADES`.

  ```cpp
  enum Suit { SPADES, HEARTS, DIAMONDS, CLUBS };  // Card.h:6 — SPADES leaks into global scope
  // enum class Suit { SPADES, HEARTS, DIAMONDS, CLUBS }; // fixed: use Suit::SPADES
  ```

- **operator> missing** (−1)

  When you define `operator<` and `operator==`, callers will still try to write `if (a > b)` and get a compile error; the three comparison operators form a natural set.

- **operator<< missing** (−1)

  Without `operator<<` you can't write `cout << card` — you must call `card.toString()` manually everywhere, and it won't compose with standard library algorithms that print ranges.

- **Deck: no reset()** (−1)

  Without `reset()` the deck cannot be reused for a second game — the only option is to destroy and recreate the entire object.

- **remaining() instead of size()** (−1)

  The required interface specifies `size()`; callers who follow the spec will look for `size()` and fail to compile.

- **Deck constructor has 3 responsibilities** (−1)

  A constructor should bring the object to a valid initial state and nothing more — building the deck, shuffling it, and randomly removing a card while printing a message are three separate actions that belong in separate methods so callers can control when each happens.

  ```cpp
  Deck::Deck() { /* builds 52 cards */ shuffle(); /* removes card + prints */ }  // Deck.cpp:7 — 3 jobs in 1 ctor
  ```

- **Hand: size() and isEmpty() missing; no canonical form** (−3 total)

  Callers who follow the required interface expect to call `hand.size()` and `hand.isEmpty()` — without them, code that works against the spec simply won't compile. Canonical form (copy constructor, copy-assignment, destructor) is required to demonstrate that you understand how objects are copied and destroyed; omitting them means any copy of a Hand is done by the compiler's default, which may not reflect the intended semantics.

  ```cpp
  class Hand {  // Hand.h — no size(), no isEmpty(), no copy ctor/operator=/destructor
      void addCard(const Card& c);
      // missing: size(), isEmpty(), Hand(const Hand&), operator=, ~Hand()
  };
  ```

- **Game: main.cpp modified (Windows UTF-8 guard + play-again loop)** (−1)

  The project skeleton provides a fixed `main.cpp` that simply calls `game.run()`; all game logic — including play-again loops — should live inside `run()`. Modifying `main.cpp` also adds a non-portable `system("pause")` call that prints an error on macOS/Linux.

  ```cpp
  system("pause");  // main.cpp:29 — Windows-only; hangs or errors on macOS/Linux
  ```

- **README: contributions "Do all the job" too vague** (−1)

  The contribution field exists to show that each member had a defined role; a single sentence like "Do all the job" gives no insight into what was designed, implemented, or tested by whom.

**Clean Code — 29.5 / 40**
- run() exemplary — delegates cleanly to 3 methods

- **playRound() (~39 lines) mixes game loop, pass counting, round reset** (−1)

  A function that manages the player loop, counts passes, and resets the round when ≥2 passes occur is doing three things at once — it becomes hard to test or change one behaviour without affecting the others. Extracting a `handlePassReset()` helper would isolate the state machine.

  ```cpp
  if (passCount >= 2) { current = lastPlayerIndex; lastPattern = Pattern(); passCount = 0; }  // Game.cpp:114 — reset logic embedded in loop
  ```

- **Deck constructor: build + shuffle + remove + print message** (−1)

  Printing output from a constructor is unexpected — callers don't get to choose when or whether that message appears, and it makes automated testing impossible. Each action (build, shuffle, remove) should be a separate callable method.

  ```cpp
  std::cout << "\n========== 本局移除的牌是：" << removed.toString() << " ==========\n";  // Deck.cpp:29 — side-effect output in constructor
  ```

- Hand has no canonical form (−6 in §2.2)

- **Non-scoped enums, remaining() name, pattern.h case inconsistency** (−1.5)

  Non-scoped enums pollute the global namespace (see §1 above); `remaining()` is a non-standard name that doesn't match the `size()` convention used by every STL container; including `"Pattern.h"` when the file on disk is `pattern.h` works only on case-insensitive macOS and silently breaks on Linux.

  ```cpp
  int remaining() const;          // Deck.h — should be size() to match STL convention
  #include "Pattern.h"            // Player.h — file is pattern.h; fails on Linux
  ```

- **Windows binary committed, non-portable includes, system("pause"), README.en.md template left in repo** (−2)

  Committing compiled binaries bloats the repo and exposes platform-specific files that won't run on other machines; non-portable includes cause build failures on Linux; `system("pause")` is a Windows-only call; leaving the unedited Gitee template README in the repo looks unprofessional and suggests the project was not fully reviewed before submission.

  ```cpp
  system("pause");   // main.cpp:29 — Windows only, errors on macOS/Linux
  // Doudizhu.exe also committed to repo root
  ```

**Operator Overloading — 4 / 10**
- operator== and operator< correct

- **operator> missing** (−2)

  With `operator<` defined you can compare `a < b`, but `a > b` won't compile — and Dou Di Zhu logic depends on comparing card values in both directions.

- **operator<< missing for Card and Hand; only toString() used** (−2)

  `operator<<` lets you write `cout << card` directly and use cards with any output stream; `toString()` forces callers to always write `cout << card.toString()`, which doesn't compose with range-printing utilities.

  ```cpp
  std::string toString() const;  // Card.h:22 — toString() exists but operator<< does not; use: cout << card.toString()
  ```

**Heap / Dynamic Memory — 10 / 10**
- STL-only; canonical form penalized in §2.2 only (no double-count)

**Inheritance — 0 / 10**
- Not used. A `Player` base class with a virtual `takeTurn()` method could have unified the human and AI players — `humanTurn()` and `aiTurn()` in Game.cpp could become a single polymorphic call instead of an if/else branch.

**Game Value — 5.5 / 10**
- Game works and is playable
- Bi-lingual output is confusing and hard to read. Mixing Chinese and English in the same output line (e.g. "玩家1 / Player1") makes neither audience comfortable; pick one language for the entire output.
- Non-portable include path (pattern.h vs Pattern.h) noted. The file is named `pattern.h` on disk but included as `"Pattern.h"` — this silently works on macOS (case-insensitive filesystem) but fails on Linux with a "file not found" error.
