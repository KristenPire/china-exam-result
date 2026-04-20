# Project Report — cardgame-serein-yori

| | |
|---|---|
| **Members** | Yori · Serein |
| **Submission** | On time |
| **Final Score** | 87 / 100 |

---

## Overall

Good game logic with clean decomposition — `run()` reads like a game description and `core_logic.cpp` is a nice structural choice. Naming consistency is the main weakness.

---

## Sections

**Subject Requirements — 30 / 30**
- All classes correct and complete — full marks
- README full marks — matching rules, win/draw conditions, per-member breakdown
- ⚠️ CMakeLists.txt has path errors — compiled via `g++ src/*.cpp` directly

**Clean Code — 36 / 40**
- `run()` (15 lines) delegates to focused methods — exemplary
- `findMatchingCard()`, `removeCard()`, `checkWinCondition()` cleanly extracted in `core_logic.cpp`

- **`playerturn()` (~40 lines) mixes input validation and game state update inline — a `getPlayerChoice()` helper would separate them** (−1)

  Reading and validating user input is a separate concern from acting on it — combining them in one 40-line block makes each part harder to change or debug on its own.

  ```cpp
  while (true){                           // Game.cpp:118 — input loop
      cout<<"Choose a card (1-"<<playerhand.size()<<"): ";
      cin>>choice;                        // validation + game-state update all in playerturn()
  ```

- **Private methods use `lowercase_runtogether` style while other code uses camelCase — inconsistent within the same project** (−1)

  Mixing two naming styles in the same file forces the reader to mentally switch modes; it signals that different parts were written without a shared convention, which hurts readability.

  ```cpp
  void Game::startgame();   // lowercase-run-together — Game.hh private methods
  void Game::playerturn();  // vs. findMatchingCard(), removeCard() in core_logic — camelCase
  ```

- **`NthCard` uses PascalCase for a local variable; `val`/`idx`/`playeridx` too abbreviated** (−0.5)

  PascalCase is the convention for class names, not variables — `NthCard` looks like a class type at a glance. Short names like `val` and `idx` require the reader to remember context instead of letting the name explain itself.

  ```cpp
  Card Game::NthCard(Hand& hand, int index) {  // Game.cpp:52 — PascalCase for a method/variable
      int val = selected.getValue();           // Game.cpp:136 — val, idx, playeridx: abbreviated
  ```

- **Magic number `5` for initial hand size without named constant** (−0.5)

  Bare numbers in code carry no meaning — when you read `i < 5`, you have to guess what 5 represents. A `const int INITIAL_HAND_SIZE = 5` makes the intent clear and means you only change it in one place if the rules change.

  ```cpp
  for(int i=0; i<5; ++i){  // Game.cpp:45 — why 5? a named constant would say "initial hand size"
  ```

- **`enum Winner` re-declared in core_logic.cpp despite being in core_logic.hh** (−0.5)

  Declaring the same type in both the header and the `.cpp` technically violates the One Definition Rule — any translation unit that includes the header and then links with the `.cpp` sees two definitions. The `.cpp` file should include the header and rely on its declaration.

  ```cpp
  // core_logic.hh:5  — enum Winner { PLAYER, COMPUTER, DRAW };
  enum Winner { PLAYER, COMPUTER, DRAW };  // core_logic.cpp:17 — redeclared here; include the header instead
  ```

- **Minor spacing inconsistencies** (−0.5)

  Inconsistent spacing (`cout<<"MATCH"` vs `cout << "..."`) makes code look unpolished and is distracting — consistent style signals that the author cares about readability.

  ```cpp
  cout<<"MATCH SUCCESSFUL!;) Both remove one card."<<endl;  // Game.cpp:142 — no spaces around <<
  cout << "Computer selected value:"<<val<<endl;            // Game.cpp:164 — mixed spacing
  ```

**Operator Overloading — 7 / 10**
- `operator<` and `operator>` correct

- **`operator==` compares value only — 2♥ == 2♣ returns true** (−1)

  Two cards are only the same card if both their rank and suit match — comparing only value means two distinct cards from different suits appear identical, which breaks any logic that needs to track individual cards (e.g., removing a specific card from a hand).

  ```cpp
  bool Card::operator==(const Card& other) const {
      return this->getValue() == other.getValue();  // Card.cpp:42-43 — suit ignored; 2♥ == 2♣
  }
  ```

- Both `operator<<` correctly implemented
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; Hand canonical form complete

**Inheritance — 0 / 10**
- Not used. A `Player` base class with a virtual `takeTurn()` method could have unified the human and computer turn logic — the game loop in `run()` would just call `player.takeTurn()` on each participant without knowing which type they are.

**Game Value Bonus — +4**
- Original game rules, interesting matching mechanic
- No screen refresh; ASCII display is a bit broken with many cards
- Functional and playable
