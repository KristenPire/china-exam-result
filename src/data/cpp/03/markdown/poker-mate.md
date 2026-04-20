# Project Report — poker-mate

| | |
|---|---|
| **Members** | Simple · Buck · Ike |
| **Submission** | On time |
| **Final Score** | 90.5 / 100 |

---

## Overall

Solid submission with a genuine effort on the UI side. The abstract class hierarchy for the UI is ambitious. Good game logic overall.

---

## Sections

**Subject Requirements — 28 / 30**
- All classes correct and complete
- README full marks — rules, per-member breakdown
- **⚠️ Only one committer email for three members** (−2)

  Git history is the evidence of each member's individual contribution. When only one email appears in all commits, there is no way to verify that the other two members actively participated in the coding work.

**Clean Code — 29.5 / 40**
- `calculateScore()`, `playerTurn()`, `dealerTurn()`, `judge()` are all focused and well-sized

- **`run()` (~70 lines) mixes deal, input loop, judge, display, and replay all inline — needs splitting** (−5)

  A function that deals cards, runs the player input loop, triggers the dealer, judges the result, and manages the replay prompt is doing six distinct jobs. Each of those deserves its own named function so `run()` becomes a short readable orchestrator.

  ```cpp
  // game.cpp:128-197 — srand, deck reset, deal, player loop, dealer, judge, display, replay all in run()
  void Game::run() { static bool seeded = false; ... do { deck.reset(); ... } while (replay); }
  ```

- **Inconsistent file naming — `Card.hh` vs `hand.hh` — causes 7 portability warnings** (−1)

  Linux and Windows filesystems are case-sensitive; `#include "Hand.hh"` compiles on macOS but fails on Linux when the actual file is `hand.hh`. Consistent casing on both the filename and the include string prevents this class of portability bug.

  ```cpp
  // hand.hh:6 — file is lowercase, but included as "Hand.hh" elsewhere — 7 warnings
  #include "Card.hh"  // Card.hh exists (uppercase); hand.hh does not
  ```

- **`operator<<` declared twice in `hand.hh` — duplicate declaration** (−1)

  Declaring the same function twice in the same header causes the linker to see two definitions and may produce errors or unexpected behavior depending on the compiler. The `friend` declaration inside the class body is sufficient — the free-function declaration after the closing brace is redundant.

  ```cpp
  // hand.hh:28 — friend declaration inside class
  friend std::ostream& operator<<(std::ostream& os, const Hand& hand);
  // hand.hh:31 — same function declared again outside the class
  std::ostream& operator<<(std::ostream& os, const Hand& hand);
  ```

- **Duplicate `static bool seeded` guard in two separate functions** (−1)

  Having the same `static bool seeded` / `srand()` pattern in both `run()` (game.cpp:130) and `dealerTurn()` (game.cpp:83) means the seeding logic is repeated and the two guards are logically redundant. Seed the random number generator once in the constructor or at program start.

  ```cpp
  static bool seeded = false;  // game.cpp:130 — in run()
  static bool seeded = false;  // game.cpp:83  — same pattern in dealerTurn()
  ```

- **`system("chcp 65001 > nul")` is Windows-only and does nothing on macOS** (−1)

  `chcp` is a Windows console command that sets the code page; on macOS/Linux it does not exist, so the `system()` call silently fails. Terminal encoding is handled differently per platform — this code should either be guarded with `#ifdef _WIN32` or removed entirely.

  ```cpp
  // UI.cpp:18 — runs only on Windows; silent no-op on macOS
  system("chcp 65001 > nul");
  ```

- **CMakeLists.txt says "C++25" but sets C++14** (−1)

  A comment that contradicts the actual setting (`set(CMAKE_CXX_STANDARD 14)`) misleads anyone reading the build file. Always keep comments and code in sync.

- **`Result` is a plain `enum`, not `enum class`** (−1)

  Unscoped `enum` values leak into the enclosing namespace — `PLAYER_WIN`, `DEALER_WIN`, etc. become global names that can silently conflict with other code. `enum class Result { PLAYER_WIN, ... }` requires writing `Result::PLAYER_WIN` everywhere, which is explicit and collision-safe.

  ```cpp
  // game.hh:10 — unscoped enum leaks all values into Game's namespace
  enum Result { PLAYER_WIN, DEALER_WIN, TIE, PLAYER_BUST, DEALER_BUST };
  ```

**Operator Overloading — 9 / 10**
- All required operators correct
- Bonus: `Hand::operator[]` with bounds checking

- **`operator>` reimplements the cast instead of delegating to `operator<`** (−1)

  The idiomatic pattern is `return other < *this`, which reuses the already-tested `operator<` logic. Re-implementing the cast in `operator>` means a future change to the comparison must be made in two places and can silently diverge.

  ```cpp
  // Card.cpp:36-39 — duplicates the cast instead of return other < *this
  bool Card::operator>(const Card& other) const {
      return static_cast<int>(_rank) > static_cast<int>(other._rank);
  }
  ```

**Heap / Dynamic Memory — 10 / 10**
- Hand/Deck STL-only; Game owns `UI*` correctly with `= delete` copy ops and destructor

**Inheritance — 7 / 10**
- `UIComponent → UIRenderer → UI` hierarchy with virtual inheritance is well-structured

- **Only one concrete class exists; `Game` stores `UI*` directly — polymorphism never exercised in practice** (−3)

  An inheritance hierarchy is only useful if the base pointer is actually used to call different concrete implementations. Since there is only one `UI` class and `Game` stores it as `UI*` rather than `UIRenderer*` or `UIComponent*`, the virtual dispatch never fires — the hierarchy adds complexity with no functional payoff. Adding even a minimal second implementation (e.g. a `TextUI` vs. `ColorUI`) would demonstrate the design working.

  ```cpp
  // game.hh:43 — stores the concrete type directly, bypassing the interface
  UI* ui;  // should be UIComponent* or UIRenderer* to use the hierarchy
  ```

**Game Value Bonus — +5**
- Runs well, simple and clear
- Background color was a nice idea, but not well realised — almost can't see anything because of it
