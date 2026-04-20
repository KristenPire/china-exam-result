# Project Report — c--group-project-card-game

| | |
|---|---|
| **Members** | Deckard · Jasonbond |
| **Submission** | On time |
| **Final Score** | 90 / 100 |

---

## Overall

Straight Poker with a nice ASCII card table, betting mechanics, card exchange, and a chip system. The UI is clean and readable. The main structural issue is run() at ~126 lines — it handles everything inline. Two logic bugs in Compare (IsStraight always returns true; chained comparisons always false) are notable but the game still plays thanks to the ASCII reveal.

---

## Sections

**Subject Requirements — 30 / 30**
- All classes correct and complete — full marks
- README full marks — Straight Poker rules with betting, chip system, card exchange, per-member breakdown

**Clean Code — 31 / 40**
- **run() (~126 lines) handles title, intro, srand, round loop, betting, comparison, exchange, exit all inline — needs at minimum introScreen(), playRound(), handleRaise(), handleDraw()** (−4)

  A function that long forces readers to hold the entire game flow in their head at once; extracting helpers lets each piece be understood and tested in isolation.

  ```cpp
  void Game::run() {  // Game.cpp:125 — ASCII title art, intro text, srand, while-loop, betting, draw all in one body
      cout << " _____ _             ..." << endl;  // title art starts immediately
      srand(time(0));  // seeding happens 15 lines later, mixed with business logic
  ```

- **`using namespace std` in Card.hh, Compare.hh, Game.hh — pollutes all includers** (−1)

  When `using namespace std` appears in a header, every file that includes that header (directly or transitively) silently imports all of `std` — this can cause unexpected name collisions with your own functions like `count` or `swap`.

  ```cpp
  using namespace std;  // Card.hh:6 — any file including Card.hh now has all of std injected
  ```

- **Player and Ai are Hand objects — type-name mismatch confuses intent** (−0.5)

  Naming a `Hand` variable `Player` or `Ai` obscures that it's actually a hand of cards with a coin balance; a proper `Player` struct or class would hold the `Hand` as a member, making the model clear.

  ```cpp
  Hand Player;  // Game.hh — variable named Player but its type is Hand
  Hand Ai;
  ```

- **Coin member uses PascalCase; _Deck uses underscore prefix inconsistently** (−0.5)

  Mixing naming conventions (PascalCase `Coin`, underscore-prefix `_Deck`, no-prefix `Player`) forces readers to remember different rules for different members; pick one convention and apply it everywhere.

  ```cpp
  int Coin;   // Hand.hh — PascalCase for a data member
  Deck _Deck; // Game.hh — underscore prefix, but Player and Ai have no prefix
  ```

- **Hand type integers (1–9) without named constants/enum** (−1)

  Magic integers like `type==9` for Straight Flush mean nothing to a reader who hasn't memorized the mapping; an `enum class HandRank { HighCard=1, ..., StraightFlush=9 }` makes every comparison self-documenting.

  ```cpp
  else if(is_flush && is_straight){ return type=9; }  // Compare.cpp:84 — 9 = StraightFlush, reader must guess
  else if(type==other.type==9){ ... }                  // Compare.cpp:116 — and again in compareWin
  ```

- **6 debug cout lines left in Compare::getResult() production code** (−1)

  Debug output left in production code makes the game unplayable — every round comparison floods the screen with internal state, hiding the actual result from the player.

  ```cpp
  cout<<"--------------type"<<type<<"----------------"<<endl;     // Compare.cpp:190 — debug
  cout<<"--------------times"<<times[0]<<"----------------"<<endl; // Compare.cpp:191 — debug
  ```

- **Copy constructor uses body assignment instead of initializer list** (−0.5)

  Initializer lists initialize members directly; body assignment first default-constructs them, then overwrites — for non-trivial types this is a wasted construction. The idiomatic form is `Hand::Hand(const Hand& other) : _cards(other._cards), Coin(other.Coin) {}`.

  ```cpp
  Hand::Hand(const Hand& other) {  // Hand.cpp:9 — body assignment instead of initializer list
      _cards = other._cards;       // _cards is default-constructed first, then assigned
      Coin = other.Coin;
  ```

**Operator Overloading — 6 / 10**
- operator< and operator> correct (rank + suit tiebreaker)

- **operator== compares rank only — 5♥ == 5♦ returns true** (−1)

  Two cards with the same rank but different suits are distinct cards in a real deck; an equality operator that ignores suit cannot be used to check whether you're holding a specific card, only whether you're holding that rank.

  ```cpp
  bool Card::operator==(const Card& other) const { return _rank == other._rank; }  // Card.cpp:45 — suit ignored
  ```

- **Hand::operator<< is an empty stub — prints nothing** (−1)

  An operator defined but doing nothing is worse than not defining it at all — code that calls `cout << hand` silently succeeds but produces no output, making bugs very hard to spot.

  ```cpp
  ostream& operator<<(ostream& os, const Hand& hand) { return os; }  // Hand.cpp:62 — body is just return
  ```

- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; Hand canonical form complete

**Inheritance — 0 / 10**
- Not used. A `Comparable` base class with a virtual `getType()` would have let the `Compare` class be replaced with proper Card/Hand subclasses; alternatively, a shared `CardGame` base for `Game` could provide the `run()` template method, making it easy to swap game rules without duplicating the loop structure.

**Game Value — 13 / 20**
- Pretty game, ASCII art clean and very readable
- Can edit input before submitting — good UX
- Options and chip impact feel nice; game works well
- Round reveal output full of debug lines — very unreadable
- Saved by the next clean ASCII board display
- No screen refresh
