# Project Report — card-game

| | |
|---|---|
| **Members** | Lucy · Echo · Carry · Betty |
| **Submission** | On time (original had merge conflict; re-pushed and re-pulled 2026-04-19) |
| **Final Score** | 72 / 100 |

---

## Overall

Blackjack: Column Arena — a 1v3 terminal strategy game with 4 special columns (Vanguard, Trap, Double-Edge, Fate), AI difficulty selection (Easy/Normal/Hard), challenge mechanics, skip tokens, and a chip betting system. Good top-level structure: play() is exemplary. The main technical gaps: no operator overloading anywhere (all Card operators and both operator<< absent, 0/10 for §3), Hand canonical form missing, run()→play() rename with modified main.cpp, and getSuit/getRank removed from Card interface.

---

## Sections

**Subject Requirements — 24 / 30**
- **Card: getSuit/getRank absent (rewritten interface); operators scored in §3** (−1)

  The project skeleton specifies `getSuit()` and `getRank()` as the standard way for other classes to inspect a card — removing them means any code written against the spec won't compile with this Card.

  ```cpp
  class Card {  // Card.hh — getValue()/isAce() present but getSuit()/getRank() removed
      int getValue() const;
      bool isAce() const;  // getSuit() and getRank() are missing
  };
  ```

- **Deck: no reset(); draw()→deal(), size()→getSize() rename** (−1)

  Without `reset()` the deck cannot be restarted for a new round without reconstructing the object. Renaming `draw()` to `deal()` and `size()` to `getSize()` means any code expecting the standard interface breaks at compile time — method names are part of the public contract.

- **Hand: size() and isEmpty() absent; no canonical form; show() not operator<<** (−2)

  Callers check `hand.size()` and `hand.isEmpty()` throughout the codebase; without them they fall back to `getCards().size()` and `getCards().empty()`, bypassing encapsulation. `show()` prints directly to `cout` and can't be redirected to a file or string stream — `operator<<` gives that flexibility.

  ```cpp
  void Hand::show() const {  // Hand.cpp:45 — prints to cout; can't redirect; replaces operator<<
      for (const auto& card : cards) cout << card.toString() << " ";
  }
  ```

- **Game: run()→play(); main.cpp modified to call game.play()** (−2)

  The skeleton defines a fixed `main.cpp` that calls `game.run()` — renaming the method to `play()` without updating the skeleton means the provided `main.cpp` no longer compiles. All game logic should fit inside `run()` so `main.cpp` never needs to change.

  ```cpp
  game.play();  // src/main.cpp:5 — should be game.run() per the skeleton
  ```

- End condition: showResult() with YOU WIN / AI N WINS banners ✓
- README full marks; all 4 members have commits ✓

**Clean Code — 27.5 / 40**
- play() (~12 lines) exemplary delegation

- **initializeGame() (~65 lines) mixes initialization and AI difficulty menu** (−1.5)

  Initialization (setting chips, tokens) and user interaction (difficulty menu with input loop) are two different concerns — when both live in one 65-line function, changing the UI flow requires touching the same function that sets up game state. A separate `chooseDifficulty()` would isolate each concern.

  ```cpp
  void Game::initializeGame() {      // Game.cpp:72 — initializes players AND runs difficulty menu
      humanPlayer.chips = INITIAL_CHIPS;
      // ... then 30+ lines of cout/cin for AI difficulty selection
  ```

- **playerTurn() (~84 lines) handles play/skip/challenge inline** (−1.5)

  Mixing card-play logic, skip-token handling, and the full challenge flow in one 84-line function makes it hard to reason about any one path — the challenge block alone is ~20 lines that is then duplicated in `aiTurns()`. A `handleChallenge()` helper would eliminate both the duplication and the size problem.

  ```cpp
  void Game::playerTurn() {   // Game.cpp:248 — play + skip + challenge all inline, ~84 lines
  ```

- **calculateRoundRewards() (~120 lines) inline for all 4 columns** (−1)

  Processing all four columns (Vanguard, Trap, Double-Edge, Fate) in a single 120-line function means finding the logic for any one column requires reading through the entire function. Each column's reward calculation deserves its own helper.

  ```cpp
  void Game::calculateRoundRewards() {  // Game.cpp:495 — 120 lines, all 4 columns inline
  ```

- Challenge logic duplicated between playerTurn() and aiTurns() (−0)
- Hand canonical form absent (−6 in §2.2)

- **getPlayerSymbol() defined but never called; magic numbers 20/5 for chip penalties** (−1)

  Dead code adds noise and confusion — a reader seeing a defined function assumes it's used somewhere. Magic numbers like `20` and `5` embedded in expressions have no explanation at the point of use; named constants (`CHALLENGE_PENALTY = 20`, `TRAP_PENALTY = 5`) make the intent clear.

  ```cpp
  string getPlayerSymbol(int playerIndex) { ... }  // Game.cpp:28 — defined but never called
  // in playerTurn(): chips -= 20;  // Game.cpp — magic number, no named constant
  ```

- **checkBlackjackBonus() has empty if body — dead code; build/ committed** (−1)

  A function that loops through columns only to reach an empty `if` body does nothing — it was left unfinished before submission. Committing the `build/` directory adds compiled binaries to the repo that can't be used by anyone on a different platform.

  ```cpp
  if (isBlackjack && aceCount == 1 && tenCount == 1) {
  }  // Game.cpp:633 — empty body; function does nothing
  ```

**Operator Overloading — 0 / 10**
- **operator==, <, > all absent from Card — comparisons done inline**

  Without these operators, every comparison must reach into the Card's internals via `getValue()` or `isAce()` at every call site — this scatters comparison logic across the codebase and makes it easy for different sites to apply different rules.

  ```cpp
  // Card.hh — no operator==, <, or > declared
  // call site: if (card.getValue() == 21) ...  instead of: if (card == blackjack)
  ```

- **operator<< absent for Card (toString()) and Hand (show())**

  `toString()` and `show()` lock output to `cout`; `operator<<` lets you write to any stream (file, string buffer, test harness) with the same syntax.

  ```cpp
  std::string Card::toString() const { return std::to_string(getValue()) + suits[suit]; }  // Card.cpp:13
  // usage forced to: cout << card.toString();  instead of: cout << card;
  ```

- No bonus overloads

**Heap / Dynamic Memory — 10 / 10**
- STL-only; canonical form penalized in §2.2 only (no double-count)
- No unnecessary copies; std::array<vector<Card>,4> for columns is a nice design choice

**Inheritance — 0 / 10**
- Not used; SmartAIPlayer and UI are standalone classes. A `Player` base class with a virtual `takeTurn()` could unify the human player and each AI player — the game loop would call `player.takeTurn()` polymorphically instead of treating human and AI as completely separate code paths.

**Game Value — 10.5 / 10**
- Rules displayed on launch — very nice
- AI difficulty selection (random/balanced/optimal) — awesome feature
- Game plays well; horizontal column display readable
- Would have loved more ASCII art for the hand display
