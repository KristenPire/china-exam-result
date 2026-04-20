# Project Report — flush-gamblers

| | |
|---|---|
| **Members** | Eason · Akali · Jesko · Nancy |
| **Submission** | On time |
| **Final Score** | 90 / 100 |

---

## Overall

Full Zha Jin Hua with 5 players, ANSI colors, a hidden/visible hand mechanic, bankruptcy detection, and a beautiful ASCII title screen. Very ambitious and fun to play. The main technical issue is `#define private public` in handhelper.hh — an ingenious but undefined-behavior hack. bettingRound() at ~157 lines is the structural weak point.

---

## Sections

**Subject Requirements — 29 / 30**
- All classes correct and complete
- README full marks — bilingual, full Zha Jin Hua hand rankings, per-member breakdown

- **One committer email for 4 members** (−1)

  Git history is how I verify that each member actively contributed code; when only one email appears, three members' work is invisible and cannot be credited individually.

**Clean Code — 31 / 40**
- run() and playSession() delegate reasonably

- **bettingRound() (~157 lines) handles all four player actions inline with deeply nested branches — fold/call/raise/challenge each need their own helper** (−4)

  Deeply nested if/else chains in a 157-line function are extremely hard to read and debug; extracting `handleFold()`, `handleCall()`, `handleRaise()`, and `handleChallenge()` would make each action independently testable and the main loop a clear sequence of readable choices.

  ```cpp
  void Game::bettingRound(int& current_bet, int max_rounds) {  // Game.cpp:172 — 157 lines
      if (action == 1) { /* fold: 20 lines inline */ }
      else if (action == 2) { /* call: 15 lines inline */ }
      else if (action == 3) { /* raise: 40 lines inline, deeply nested */ }
  ```

- **`handhelper.hh` uses `#define private public` and reinterpret_cast to bypass Hand's private interface — undefined behavior** (−3)

  Redefining `private` as `public` with a macro changes the class layout for all subsequent translation units that include this header, which is undefined behavior in C++; `reinterpret_cast` on a class object is also undefined behavior. If you need to access `_cards`, the right fix is to add a `getCards()` accessor to Hand.

  ```cpp
  #define private public   // handhelper.hh:5 — redefines private keyword globally, UB
  #define protected public // handhelper.hh:6
  const std::vector<Card>* cards = reinterpret_cast<const std::vector<Card>*>(&hand);  // UB cast
  ```

- **File name case inconsistency (lowercase files, uppercase in CMakeLists) — would fail on Linux** (−1)

  macOS uses a case-insensitive filesystem so `#include "Card.hh"` finds `card.hh`, but Linux filesystems are case-sensitive and the build would fail; always match the `#include` string exactly to the filename on disk.

  ```cpp
  #include "Card.hh"  // Deck.hh — but file on disk is card.hh; fails on Linux
  ```

- **Copy constructor uses body assignment instead of initializer list** (−0.5)

  Initializer lists initialize members directly; body assignment first default-constructs them, then overwrites. The idiomatic form is `Hand::Hand(const Hand& other) : _cards(other._cards) {}`.

  ```cpp
  Hand::Hand(const Hand& other) {  // hand.cpp:6 — body assignment instead of initializer list
      _cards = other._cards;       // _cards default-constructed first, then overwritten
  ```

- **`now` for current-player pointer — should be `currentPlayer`** (−0.5)

  A variable named `now` reads like a time value or "current moment"; `currentPlayer` makes immediately clear that it points to the player whose turn it is.

  ```cpp
  for (Player* now : round_players) {  // Game.cpp:186 — now = current player in betting loop
  ```

**Operator Overloading — 7 / 10**
- operator< and operator> correct

- **operator== compares rank only — 5♥ == 5♦ returns true** (−1)

  Two cards with the same rank but different suits are distinct cards in a real deck; an equality operator that ignores suit cannot correctly check whether a specific card is present in a hand.

  ```cpp
  bool Card::operator==(const Card& other) const { return _rank == other._rank; }  // card.cpp:25 — suit ignored
  ```

- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 9 / 10**
- STL-only; Hand canonical form complete

- **handhelper.hh reinterpret_cast hack bypasses interface but no memory errors** (−1)

  Even though no memory errors result here, relying on undefined behavior means the code could break silently on a different compiler, optimization level, or platform; the correct fix is a public `getCards()` accessor in Hand.

**Inheritance — 0 / 10**
- Not used. With 5 players all sharing the same logic, a `Player` base class with a virtual `takeTurn()` method would have let you loop over `vector<Player*>` rather than hardcoding all actions in `bettingRound()`; a human subclass could override `takeTurn()` with UI input, and an AI subclass with automated logic.

**Game Value — 14 / 20**
- Very pretty ASCII title art, colors, shapes
- 5-player Zha Jin Hua with hidden/visible hand — very cool
- Hardcoded player names include team members — charming Easter egg
- Thank you for the options, graphics, and well-designed game
