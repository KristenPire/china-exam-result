# Project Report — babel-2nd-project

| | |
|---|---|
| **Members** | Othersen · Andy · Tiara |
| **Submission** | ⏰ ~1h13m late |
| **Final Score** | 90.5 / 100 |

---

## Overall

Zha Jin Hua with a cheat menu (peek/swap/redraw/bribe), AI with spoken lines, full poker options (fold, bet), finger tracking, and a chip system. Very fun and ambitious. I had to comment out the unconditional `#include <windows.h>` to get it to compile. All three Card comparison operators are missing, which is the main technical gap.

---

## Sections

**Subject Requirements — 28 / 30**
- Card class has constructor, getters, and enum classes — full marks for class structure; missing operators scored in §3
- **Deck missing constructor — caller must call reset() manually** (−1)

  A constructor's job is to put the object into a valid, ready-to-use state. If you have to remember to call `reset()` separately after creating a Deck, it is easy to forget and the Deck starts in an empty, unusable state.

  ```cpp
  // Deck.hh:8 — no Deck() constructor declared
  // Game.cpp:14-15 — caller forced to initialize manually: _deck.reset(); _deck.shuffle();
  ```

- **main.cpp modified with hardcoded relative include path** (−1)

  The grading requirement is that the provided `main.cpp` be left unchanged. A hardcoded path like `"../include/Game.hh"` is also fragile — it breaks if the file is moved or built from a different directory.

  ```cpp
  // source/main.cpp — modified to use explicit relative path
  #include "../include/Game.hh"
  ```

- README full marks — elaborate Zha Jin Hua rules with cheat mechanics, per-member breakdown

**Clean Code — 35.5 / 40**
- init(), computerTurn(), settleRound(), isGameOver() all well-sized and focused

- **playerTurn() (~100 lines) handles betting AND full 4-option cheat menu inline — needs handleCheatMenu()** (−3)

  Mixing the betting logic and the entire cheat sub-menu in one function means a reader must scroll through 100 lines to understand either feature. A `handleCheatMenu()` helper would make both paths independently readable.

  ```cpp
  // Game.cpp:108-207 — betting choices and all 4 cheat sub-options in a single do-while block
  } else if (choice == 4) {
      // cheat menu: 50+ lines of switch inline here  // Game.cpp:153-200
  ```

- **getHandTypePriority() duplicated as free function in Hand.cpp and member in Game.cpp** (−1)

  Duplicate logic means any change to hand ranking (e.g. adding a new hand type) must be made in two places — and they can silently diverge. One canonical version should live in one place.

  ```cpp
  int getHandTypePriority(HandType type)  // Hand.cpp:150 — free function
  int Game::getHandTypePriority(HandType type) const  // Game.cpp:273 — identical switch
  ```

- **Inconsistent naming: rank_to_string()/suit_to_string() snake_case vs camelCase elsewhere** (−1)

  Mixing naming conventions in the same codebase forces readers to remember which style each function uses rather than focusing on what it does. Pick one convention — camelCase everywhere, or snake_case everywhere — and apply it consistently.

  ```cpp
  std::string Card::rank_to_string() const  // Card.cpp:42 — snake_case
  // vs. getSuit(), getRank(), getValue() camelCase elsewhere in the same Card class
  ```

- **Developer note committed to Player.hh** (−0.5)

  A mid-development question left in source code (`// 怎么用的vector，不是有hand吗，我给改了`) is not a code comment — it's a chat message that should be removed before submission. Committed code should only contain comments that help future readers understand the code.

  ```cpp
  // Player.hh:27 — developer note left in the header
  // 怎么用的vector，不是有hand吗，我给改了
  ```

- **Debug/ directory with compiled artifacts committed** (−1)

  Compiled artifacts (`.pdb`, `.exe`, `.tlog` files) are generated outputs that should never be committed — they are large, platform-specific, and change on every build. Add a `.gitignore` that excludes your build directory.

**Operator Overloading — 2 / 10**
- **operator==, operator<, operator> all absent from Card** (−6)

  Without these operators, card comparisons must go through hand-type priority lookup functions rather than direct card comparison — this is a workaround for a missing feature. With proper operators, `card1 < card2` would work naturally and the priority logic becomes simpler.

  ```cpp
  // Card.hh — no comparison operators declared; Card.cpp has no operator==/</>
  // Game.cpp:273 — workaround: getHandTypePriority() used instead of card operators
  ```

- Both operator<< correct — ASCII card art with box-drawing chars

**Heap / Dynamic Memory — 10 / 10**
- STL-only; Hand canonical form complete with initializer list

**Inheritance — 0 / 10**
- Not used. This game has two "players" with different behaviors (human vs. AI) — a classic use case for an abstract `Player` base with virtual methods `takeTurn()` and `makeDecision()`, so the game loop can call the same interface regardless of who is playing.

**Game Value — 15 / 20**

The game starts off with a very cool menu, with a CHEAT MENU — I really like this idea a lot.

The AI has some spoken lines, very good addition for game feeling.

Full poker options, folding, betting, etc. It's very nice.

Thank you guys.

You have used initially windows.h which was illegal in this project. It was ILLEGAL because it's not in the standard library of C++.

I have decided NOT TO REMOVE ANY POINT, thank you for the project.
