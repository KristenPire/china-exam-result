# Project Report — cardgame_keith_smody

| | |
|---|---|
| **Members** | Keith · Smody |
| **Submission** | On time |
| **Final Score** | 95 / 100 |

---

## Overall

Beautiful Blackjack with ASCII art, colors, and a polished UI that makes you want to keep playing. Clean function decomposition and solid Ace adjustment logic. The main weaknesses are `using namespace std` in three headers and mixed naming conventions throughout.

---

## Sections

**Subject Requirements — 29 / 30**

- **All classes correct and complete except main.cpp modified with extra includes and Windows encoding setup** (−1)

  The subject requires `main.cpp` to remain unmodified so the grader can swap in their own entry point. Windows-specific setup (`SetConsoleOutputCP`, `SetConsoleCP`) should live in a platform guard inside the relevant source file, not in `main.cpp`.

- README full marks — Blackjack rules, per-member breakdown

**Clean Code — 35 / 40**
- deal(), ClearHands(), ShowHands(), CheckBlackjack(), SetResult() all focused and well-sized

- **run() (~49 lines) mixes ASCII header art and game loop** (−0.5)

  Embedding 20 lines of raw ASCII art strings inside `run()` buries the actual game loop logic. Extract a `printHeader()` or `showTitle()` function so `run()` reads as a clean loop.

  ```cpp
  void Game::run() {
      std::string game_header = R"( ... )";  // Game.cpp:290 — 10 lines of art inside run()
      while (true) { ... }                  // the real game loop starts at line 316
  ```

- **PlayerTurn() (~46 lines) mixes input validation and game logic inline** (−0.5)

  The input-validation loop (clear cin, re-prompt on bad input) and the hit/stand game logic are interleaved, making both harder to follow. Extract a `readHitOrStand()` helper that handles just the input and returns a clean enum or bool.

  ```cpp
  void Game::PlayerTurn() {  // Game.cpp:130 — input loop + bust check + break all in one while(true)
      while (true) { if (cin >> choice) { if (choice == 1) { ... } } else { cin.clear(); ... } }
  ```

- **DealerTurn() (~35 lines) repeats table display block — a showDealerHand() helper would eliminate duplication** (−0.5)

  The exact same three-line `printFTC`/`printFT` block that renders the dealer's hand appears twice: once before the loop and once inside it. Extract it so a bug fix or layout change only needs to happen in one place.

  ```cpp
  UI::printFTC("B L A C K J A C K");  // Game.cpp:184 — initial reveal
  // ... then again at Game.cpp:203   — in-loop reveal, identical block
  ```

- **`using namespace std` in Card.hh, Deck.hh, and Hand.hh — pollutes all includers** (−1)

  `using namespace std` in a header affects every file that includes it — even transitively. If any standard name (like `sort` or `remove`) gets added to `std` in a future C++ version, it silently shadows your own names. Use explicit `std::` in headers and reserve `using` for `.cpp` files only.

  ```cpp
  using namespace std;  // Card.hh:5 — also in Deck.hh:6 and Hand.hh:7
  ```

- **Non-scoped `enum Suit/Rank` allows implicit integer conversion** (−0.5)

  With a plain `enum`, the values leak into the enclosing scope and silently convert to `int`, enabling bugs like comparing a `Suit` to a `Rank` with no compiler warning. `enum class Suit` keeps the names scoped (`Card::Suit::Hearts`) and disables implicit conversion.

  ```cpp
  enum Suit { Hearts, Diamonds, Spades, Clubs };  // Card.hh:10 — plain enum, values leak to class scope
  ```

- **Mixed PascalCase/camelCase: PlayerTurn/DealerTurn/ShowHands vs deal()/run()** (−1)

  Inconsistent naming forces the reader to remember which convention each function uses. Pick one style (camelCase is standard for C++ methods) and apply it uniformly.

- **program binary and .DS_Store committed to repo** (−0.5)

  Compiled binaries are platform-specific and can be hundreds of kilobytes — they don't belong in version control. Add `program` and `.DS_Store` to `.gitignore` and remove them with `git rm --cached`.

- **Card::getValue() missing return in final branch (compiler warning)** (−0.5)

  If `rank` somehow falls outside the three `if` branches, the function exits without returning a value — undefined behavior at runtime. Add a `return 0` (or a default) after the last branch, or restructure as `if / else if / else`.

  ```cpp
  int Card::getValue() const {
      if (rank >= Two && rank <= Ten) { return static_cast<int>(rank); }
      if (rank == Jack || rank == Queen || rank == King) { return 10; }
      if (rank == Ace) { return 11; }
  }  // Card.cpp:25 — falls off end with no return: undefined behavior
  ```

**Operator Overloading — 8 / 10**
- All three required operators correct; operator== compares both suit and rank
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; Hand canonical form complete via `= default`

**Inheritance — 0 / 10**
- Not used. A `Player` abstract base with a virtual `takeTurn()` or `playHand()` method would have let `HumanPlayer` and `DealerPlayer` each encapsulate their own decision logic, removing the separate `PlayerTurn()`/`DealerTurn()` functions from `Game`.

**Game Value Bonus — +13**
- The game is beautiful — ASCII art, well-boxed title, colors on launch
- No screen refresh but feels very nice regardless
- Visual UI so polished you want to play again and again
