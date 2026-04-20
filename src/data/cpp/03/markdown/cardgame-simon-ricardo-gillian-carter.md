# Project Report — cardgame-simon-ricardo-gillian-carter

| | |
|---|---|
| **Members** | Simon · Ricardo · Gillian · Carter |
| **Submission** | On time |
| **Final Score** | 100 / 100 |

---

## Overall

Very well done. The code is clean, well-organized, and the implementation shows a real understanding of the concepts. I enjoyed playing it — the difficulty choice is a nice touch, and the visuals make it feel alive. Thank you and congratulations.

---

## Sections

**Subject Requirements — 27 / 30**
- All classes correct and complete
- README: full marks — bilingual, full rules, per-module breakdown
- ⚠️ Only one committer email for four members (−3). Git history is how a grader verifies that each member actually contributed code. When all commits come from one email address, there is no evidence that the other three members wrote anything — even if they did, it is invisible in the record.

**Clean Code — 38 / 40**
- Phase-array pattern in `playRound()` drives all four betting rounds without repetition
- Every helper is single-purpose; no function exceeds 60 lines
- Naming is precise throughout (`processAction`, `dealHoleCards`, `bettingRound`, `showdown`…)

- **Build artifacts and `.DS_Store` committed to repo** (−1)

  Compiled binaries and editor metadata have no place in version control — they bloat the repo, differ per platform, and create noise in every `git status`. Add `build/`, `*.DS_Store`, and the binary name to `.gitignore` before the first commit.

- **Magic numbers for blinds, starting chips, and pause duration** (−1)

  If you want to change the blind from 10/20 or the pause from 800 ms, you must search the source to find every occurrence. Named constants make the intent clear and the change trivially safe.

  ```cpp
  _player.placeBet(10);   // Game.cpp:159 — small blind
  _computer.placeBet(20); // Game.cpp:160 — big blind; use constexpr int kSmallBlind = 10, kBigBlind = 20
  Display::pause(800);    // Game.cpp:235 — magic pause duration
  ```

**Operator Overloading — 8 / 10**
- All required operators correct
- `operator>` elegantly implemented as `other < *this`
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only, const references throughout
- Hand canonical form complete and correct

**Inheritance — 10 / 10**
- `Player` abstract base with pure virtual `decideAction()`
- Hard AI uses pot odds and bluffing logic — genuine strategy
- Polymorphic dispatch through `Player&` in `processAction()`

**Game Value Bonus — +7**
- Easy / Hard difficulty choice is appreciated
- Looks very good — colors and screen refresh
- Played a few rounds, works well
