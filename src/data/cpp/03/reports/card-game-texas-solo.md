# Project Report — card-game-texas-solo

| | |
|---|---|
| **Members** | Brimstone · Simon Nian |
| **Submission** | On time |
| **Final Score** | 89 / 100 |

---

## Overall

Well implemented and runs well. The UI is plain but readable, and I was able to play multiple games without issue. Good work — good luck for the individual project.

---

## Sections

**Subject Requirements — 29 / 30**
- All classes correct and complete
- README full marks — full rules, Mermaid flowcharts, per-member breakdown
- ⚠️ Only one committer email for two members (−1). Git history is the proof of who contributed what; if only one email appears, the other member's work is invisible to the evaluator. Both members should commit from their own accounts.

**Clean Code — 35 / 40**
- `run()` is 18 lines and delegates cleanly; most functions are short and single-purpose
- Named constants throughout (`kStartingChips`, `kMinOpenBet`, `kHeadsUpPlayerCount`)

- **`GameBet::runBettingRound` (~80 lines) has two nearly identical loops that could be extracted** (−1)

  Duplicating a loop means any bug fix or rule change must be applied in two places and it's easy to miss one. A small `countCanAct()` helper would remove the duplication entirely.

  ```cpp
  // GameBet.cpp:16-20 — first occurrence
  for(int i = 0;i < (int)game._players.size();++i){
      if(!game._players[i].folded && !game._players[i].isAllIn && game._players[i].chips > 0) canAct++;
  }
  // identical block repeated at GameBet.cpp:51-55 inside the while-loop
  ```

- **Two distinct coding styles coexist — `GameBet.cpp`/`GameEval.cpp` use condensed no-spaces formatting while `Game.cpp` is spacious — inconsistent** (−2)

  When a file looks like it was written by a different person, it makes the codebase harder to read as a whole and signals that style guidelines weren't shared. A shared `.clang-format` config keeps everything consistent automatically.

  ```cpp
  for(const Card& c:cards){  // GameBet.cpp — no spaces around colon or after keyword
  for (const GamePlayer& player : _players) {  // Game.cpp — spacious style
  ```

- **`= default` canonical form applied to `Hand` but not consistently to other structs** (−1)

  If you explicitly write `= default` on one class to signal that the compiler-generated version is intentional, doing it everywhere makes the pattern self-documenting. `GamePlayer` in `GameTypes.hh` holds a `vector<Card>` but has no explicit canonical form.

  ```cpp
  Hand::Hand(const Hand& other) = default;   // Hand.cpp:5 — explicit = default
  struct GamePlayer { std::string name; /* ... */ std::vector<Card> holeCards; };  // GameTypes.hh — no canonical form
  ```

- **`canAct` used as an integer count — slightly ambiguous name** (−1)

  A boolean name like `canAct` implies true/false; when it stores a count, a reader has to look at the type and usage to understand it. `activeCount` communicates the intent immediately.

  ```cpp
  int canAct = 0;  // GameBet.cpp:14 — counts active players, but name reads as a bool flag
  if(canAct <= 1){ return; }  // GameBet.cpp:21 — confirms it's a count, not obvious from name alone
  ```

**Operator Overloading — 8 / 10**
- All required operators correct; `operator>` delegates to `other < *this`
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; `_cards.reserve(52)` used correctly
- Hand canonical form complete

**Inheritance — 0 / 10**
- Not used. The project has a `GamePlayer` struct with an `isHuman` flag that drives branching — a classic sign that an inheritance hierarchy (`HumanPlayer`/`AIPlayer` extending a `Player` base) would have replaced the flag and cleaned up the conditional logic.

**Game Value Bonus — +7**
- Runs well, multiple games work
- UI not styled but readable
