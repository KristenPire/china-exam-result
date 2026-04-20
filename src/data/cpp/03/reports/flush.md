# Project Report — flush

| | |
|---|---|
| **Members** | Han · Jett · Alice |
| **Submission** | On time |
| **Final Score** | 81 / 100 |

---

## Overall

Balatro-inspired card game with a Joker bonus mechanic and clean hand-detection logic. Nice concept and fun strategy. Game crashes on non-numeric input, which prevented a game value bonus.

---

## Sections

**Subject Requirements — 30 / 30**
- All classes correct and complete — full marks
- README full marks — Balatro-inspired rules, Joker mechanic, per-member breakdown

**Clean Code — 33 / 40**
- run() (~40 lines) delegates cleanly to playRound(), passRound(), printHand()
- judgeHand() (~30 lines) handles all 5-card hand detection — complexity is justified

- **Game constructor mixes joker default init with opening deal loop** (−0.5)

  A constructor should initialize object state, not run a deal loop — that logic belongs in `run()` or a dedicated `startGame()` method so construction and game startup are independent.

  ```cpp
  // Game.cpp:10-13 — deal loop sitting inside the constructor body
  _deck.reset();
  const int START_CARDS = 8;
  for (int i = 0; i < START_CARDS; ++i)
      _playerHand.addCard(_deck.draw());
  ```

- **Significant indentation inconsistencies throughout Game.cpp — constructor body, chooseJoker() chain, calculateScore() return lines at column 0** (−1.5)

  Inconsistent indentation makes it hard to see the block structure at a glance — a reader must parse braces manually rather than relying on visual alignment.

  ```cpp
  // Game.cpp:26-27 — if/else chain not indented inside chooseJoker()
  if (c == 1)
  _joker = Joker(Joker::BONUS_SCORE);  // should be indented one level
  // Game.cpp:170-171 — return lines at column 0 inside calculateScore()
  int score = (base + sum + j_bonus) * mult * j_mult;
  return score;
  ```

- **Abbreviated locals: c, op, n, sc, s, j_bonus, j_mult throughout** (−1)

  Single-letter or cryptic names force every reader to re-derive what the variable means from context; `choice`, `action`, `discardCount`, `roundScore`, `suit` take five seconds longer to type and save minutes of confusion.

  ```cpp
  // Game.cpp:24-25, 64, 97, 112
  int c;   std::cin >> c;        // what is c? joker choice
  int op;  std::cin >> op;       // play or pass action
  int sc = calculateScore(five); // round score
  int n;   std::cin >> n;        // discard count
  ```

- **`std::vector<int> card` shares a name with the Card type — misleading** (−0.5)

  When a local variable has the same name as a class, the reader constantly has to check whether `card` means an integer list or a `Card` object — a name like `values` or `cardValues` removes all ambiguity.

  ```cpp
  // Game.cpp:131-132
  std::vector<int> card;                          // name collides with Card type
  for (auto& c : hand) card.push_back(c.getValue());
  ```

- **Magic numbers 5 and 8 appear without reusing the defined START_CARDS constant** (−0.5)

  When you change the hand size, you have to hunt for every bare `5` and `8` in the file — a named constant updated in one place keeps all uses consistent.

  ```cpp
  // Game.cpp:11 — constant defined here but then not used below
  const int START_CARDS = 8;
  // Game.cpp:90, 105 — magic numbers repeat the same values
  for (int i = 0; i < 5; ++i) std::cin >> idx[i];  // should be a named constant
  while (_playerHand.size() < 8) _playerHand.addCard(_deck.draw()); // same
  ```

- **C-style `int idx[5]` where a vector would be idiomatic** (−0.5)

  C-style arrays have fixed size, no bounds checking, and don't communicate intent — a `std::vector<int>` or `std::array<int, 5>` is safer and consistent with the rest of the codebase.

  ```cpp
  // Game.cpp:89
  int idx[5];  // C-style fixed array; std::array<int,5> or vector<int>(5) preferred
  ```

**Operator Overloading — 8 / 10**
- All three required operators correct; operator== compares both suit and rank
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; Hand canonical form complete with initializer list

**Inheritance — 0 / 10**
- Not used. The Joker already has three distinct behaviors (bonus score, multiplier, heart bonus) — modeling each as a subclass of a `Joker` base with a virtual `apply(hand)` method would have been a natural fit here.

**Game Value Bonus — +0**
- Nice idea with Joker strategy choices
- Game crashes on non-numeric input (uncaught std::out_of_range). When `std::cin >> idx[i]` receives a non-number, the stream enters a fail state and the index is never set — then `_playerHand.at(i)` throws `std::out_of_range` which is unhandled and terminates the program. Checking `cin` after each read and clearing the error state prevents the crash.
