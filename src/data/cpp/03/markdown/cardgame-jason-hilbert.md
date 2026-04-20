# Project Report — cardgame-jason-hilbert

| | |
|---|---|
| **Members** | Jason · Hilbert · Shane |
| **Submission** | On time |
| **Final Score** | 89.5 / 100 |

---

## Overall

Full Doudizhu implementation with clean top-level delegation and excellent naming throughout. The main gap is that the DoudizhuAI class exists but all its methods are stubs — the AI logic sits entirely inline in aiTurn(), and humanTurn() is similarly not decomposed.

---

## Sections

**Subject Requirements — 30 / 30**
- All classes correct and complete — full marks
- README full marks — Doudizhu rules with card types, ranking, win condition, per-member breakdown

**Clean Code — 35.5 / 40**
- run() (8 lines) cleanly delegates to init(), callingLandlordPhase(), playingPhase() — exemplary
- Short focused helpers: displayStatus() (6 lines), nextPlayer() (7 lines), resetRound() (6 lines), checkWin() (2 lines)

- **humanTurn() (~60 lines) mixes input validation, card selection, rule checking, and state mutation inline** (−1)

  A turn function should orchestrate, not implement — reading input, validating card combinations, checking game rules, and updating state all in one function makes it very hard to modify any one step without risking the others.

  ```cpp
  void Game::humanTurn() {  // Game.cpp:174 — reads input, validates, checks rules, mutates state, recurses on error
      std::cin >> choice;
      if (!DoudizhuRule::canBeat(played, _lastPlayed)) { humanTurn(); return; }  // recursion for retry
      _lastPlayed = played; _lastPlayer = _currentPlayer; _passCount = 0;        // state mutation at end
  ```

- **aiTurn() (~62 lines) reimplements AI logic despite DoudizhuAI class existing with matching stubs** (−1)

  When a class (`DoudizhuAI`) is created specifically to hold AI behavior but its methods are all stubs, and the real logic lives inline in `Game::aiTurn()`, the class becomes dead weight — the whole point of the class was to isolate AI decisions so they could be changed without touching `Game`.

  ```cpp
  // AI.cpp:13 — DoudizhuAI::decidePlay() is a stub:
  std::vector<Card> DoudizhuAI::decidePlay(...) { return {}; }  // "AI logic moved to Game.cpp"
  // Instead all logic lives in Game::aiTurn(), Game.cpp:290-351
  ```

- **Three dead member variables (_humanHand, _ai1Hand, _ai2Hand) never referenced** (−0.5)

  Dead variables are confusing — a reader seeing `_humanHand` alongside `_humanCards` must wonder which one is actually used and whether they're supposed to be in sync; they should be removed before submission.

  ```cpp
  Hand _humanHand;  // Game.hh:46 — declared but never used; _humanCards (vector) is used instead
  Hand _ai1Hand;    // Game.hh:47 — same
  Hand _ai2Hand;    // Game.hh:48 — same
  ```

- **Development notes left in Game.hh:56–62, AI.hh:11–12, AI.cpp:8–11** (−0.5)

  Commented-out design alternatives ("方案1/方案2") and inline implementation debates are personal scratch notes — the final submission should only contain explanatory comments that help a reader understand the finished code, not the design process.

  ```cpp
  // 方案1: 使用指针       // Game.hh:57 — draft note left in public header
  // Card* _bottomCard;
  // 方案2: 在构造函数初始化列表中初始化（推荐）
  ```

- **Deck canonical form not explicit despite owning a vector** (−0.5)

  `Deck` holds a `std::vector<Card>` and relies on compiler-generated copy/assign/destructor, which is safe — but `Hand` explicitly defines all three, creating an inconsistency; it's good practice to be consistent and document the intent (e.g., with `= default`) so future readers know the omission was deliberate.

**Operator Overloading — 8 / 10**
- All three required operators correct; operator== compares both suit and rank
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; Hand canonical form complete

**Inheritance — 0 / 10**
- Not used. With a `DoudizhuAI` class already in place, a natural extension would be a `Player` base class with a virtual `takeTurn()` — the human player and each AI instance would override it, letting `playingPhase()` loop over `vector<Player*>` instead of branching on player index with separate `humanTurn()`/`aiTurn()` calls.

**Game Value Bonus — +6**
- Nice Doudizhu — menu adapts to available options, clear index selection
- Can edit input before submitting — good UX detail
- No screen refresh
