# Project Report — cardgame-freya-ivan

| | |
|---|---|
| **Members** | Freya · Ivan |
| **Submission** | On time |
| **Final Score** | 88 / 100 |

---

## Overall

Very nice rounded game. The colors, the ASCII art, the screen refresh — it's easy to understand what is happening. Thank you very much!

---

## Sections

**Subject Requirements — 29 / 30**
- All classes correct and complete
- README full marks — full 9-hand ranking table, per-member breakdown
- **Only one committer email for two members** (−1)

  Git history is the proof of who contributed what; if only one email appears, the other member's work is invisible to the evaluator. Both members should commit from their own accounts.

**Clean Code — 33 / 40**
- Good decomposition: `dealInitial()`, `playerTurn()`, `dealerTurn()`, `showdown()` all focused
- `evaluateHand()` handles all 9 hand types including ace-low straight — complexity justified

- **`run()` at 42 lines mixes display and control flow — a `displayRound()` helper would help** (−2)

  A single function should do one thing; mixing `cout` calls and `renderHand()` alongside control-flow decisions makes both the display logic and the game logic harder to change independently. A `displayRound()` helper would contain all the output in one place.

  ```cpp
  cout << "\n[ DEALER'S HAND ]" << endl;  // Game.cpp:93 — display call inside the game-loop
  renderHand(_dealerHand, true);          // Game.cpp:94 — rendering inline with flow control
  playerTurn();                           // Game.cpp:100 — logic call immediately after display
  ```

- **Copy constructor uses body assignment instead of initializer list** (−1)

  Body assignment default-constructs the member first and then assigns it — two operations where one would do. An initializer list constructs directly into the member, which is both more efficient and the canonical C++ style.

  ```cpp
  Hand::Hand(const Hand& other) { _cards = other._cards; }  // Hand.cpp:6-8 — assigns after default-init
  // preferred: Hand::Hand(const Hand& other) : _cards(other._cards) {}
  ```

- **Free functions not in anonymous namespace** (−1)

  A free function in a `.cpp` file without `static` or an anonymous namespace has external linkage — it's visible to the linker from every other translation unit, which can cause name collisions and pollutes the global namespace unnecessarily.

  ```cpp
  int getSuitWeight(Card::Suit suit) { ... }  // Game.cpp:21 — external linkage, accessible from anywhere
  void renderHand(const Hand& hand, bool hideFirst) { ... }  // Game.cpp:40 — same issue
  ```

- **`break` after `return` in every switch case — unreachable code** (−0.5)

  Once `return` executes, the function exits immediately; any `break` after it can never run. This is harmless but clutters the code and suggests the author didn't fully understand the control flow.

  ```cpp
  case Card::Suit::Spades:  return 4;
  break;                    // Game.cpp:24 — unreachable; return already exits the function
  ```

- **Magic number `5` for hand size used throughout without a named constant** (−0.5)

  Scattering `5` through the code means changing the hand size (for a game variant) requires finding and updating every occurrence. A single `constexpr int kHandSize = 5;` makes the intent clear and the change trivial.

  ```cpp
  for (int i=0;i<5;i++){ _playerHand.addCard(...); }  // Game.cpp:125 — what is 5?
  vector<bool> keep(5,false);  // Game.cpp:136 — repeated literal, not obviously "hand size"
  ```

- **`operator<<` prints "11"/"12"/"13"/"14" for face cards while `renderHand()` shows "J"/"Q"/"K"/"A" — inconsistency** (−0.5)

  The same card prints differently depending on which display path is used, which confuses the player and makes the output look buggy. `operator<<` should use the same letter symbols as `renderHand()`.

  ```cpp
  case Card::Rank::Jack:  rankStr="11";break;  // Card.cpp:45 — operator<< prints "11"
  // but renderHand() at Game.cpp:56: else if (r == 11) rankStr = "J";  — prints "J"
  ```

**Operator Overloading — 8 / 10**
- All required operators correct
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; Hand canonical form complete

**Inheritance — 0 / 10**
- Not used. The game has a clear Player/Dealer distinction that's handled by flags and separate functions — a `Player` base class with `HumanPlayer` and `DealerPlayer` subclasses (each implementing a `takeTurn()` virtual method) would have made the distinction explicit and eliminated the branching.

**Game Value Bonus — +8**
- Colors, ASCII art, screen refresh — well presented
- Easy to follow, plays nicely
