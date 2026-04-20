# Project Report — cardgame-henry-latain-upster-mika

| | |
|---|---|
| **Members** | Henry · Latain · Upster · Mika |
| **Submission** | On time |
| **Final Score** | 98 / 100 |

---

## Overall

Very ambitious custom card game with an HP system, a full EffectResolver for clash outcomes, Joker support, and a polished TerminalUI. The module decomposition is excellent. The main weakness is EffectResolver::resolveTurn() which is ~210 lines — a shared resolveClash() helper would split the 8-way clash matrix.

---

## Sections

**Subject Requirements — 30 / 30**
- All classes correct and complete — full marks
- README full marks — Mermaid flowcharts for run() and resolveTurn(), per-member breakdown
- All four members have distinct module ownership clearly documented

**Clean Code — 35 / 40**
- run() cleanly delegates to setup(), playerPhase(), aiPhase(), consumeActionCards() — exemplary
- Player.cpp and Hand.cpp exemplary — every method single-responsibility, under 20 lines

- **EffectResolver::resolveTurn() (~210 lines) with 8-way clash matrix needs extracting** (−2)

  A function this long is hard to read, test, or change safely — each of the eight clash combinations (attack vs attack, guard vs attack, etc.) is essentially its own mini-function and should be extracted as such. Pull the matrix into a `resolveClash(pa, ea, ...)` helper to cut the main function to under 50 lines.

  ```cpp
  if (pa.isAttack() && ea.isAttack()) { ... }       // EffectResolver.cpp:91
  else if (pa.isGuard() && ea.isAttack()) { ... }   // EffectResolver.cpp:106 — 8 branches, ~110 lines
  ```

- **Parameter names p, e, pa, ea, d in EffectResolver add cognitive load** (−0.5)

  Single-letter names save no typing and force the reader to mentally look up what each stands for every time they appear. Spell out `player`, `enemy`, `playerAction`, `enemyAction`, `deck`.

  ```cpp
  TurnOutcome EffectResolver::resolveTurn(Player& p, Player& e, Deck& d, Action& pa, Action& ea, ...)  // EffectResolver.cpp:30
  ```

- **Magic numbers throughout EffectResolver (14 for Ace, 5 for SP damage, 15 for delayed break, etc.)** (−1)

  A bare number like `15` tells you nothing about why it is 15 — if the game balance changes, you must hunt for every occurrence. Declare named constants (`static constexpr int kAceValue = 14`) once at the top of the file.

  ```cpp
  act.delayedSpBreakValue = 15;  // EffectResolver.cpp:311 — what is 15?
  totalSp = totalSp + 5;         // EffectResolver.cpp:355 — what is 5?
  ```

- **Verbose `if (x) return true; return false;` across a dozen Card methods instead of `return expr`** (−0.5)

  The longer form adds four extra lines per method with no benefit — `return (_suit == Suit::JokerRed || _suit == Suit::JokerBlack)` is clearer and less error-prone.

  ```cpp
  if (_suit == Suit::JokerRed) { return true; }   // Card.cpp:159
  if (_suit == Suit::JokerBlack) { return true; } // Card.cpp:163
  return false;                                    // Card.cpp:167 — just: return expr
  ```

- **Minor: reliance on compiler-generated canonical form across 10+ classes undocumented** (−1)

  When you skip the copy constructor and destructor, a future maintainer doesn't know whether it was a deliberate choice or an oversight. A short comment (`// compiler-generated canonical form is correct — no raw pointers`) makes the intent clear.

**Operator Overloading — 8 / 10**
- All three required operators correct including operator== comparing both suit and rank
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; Hand canonical form complete; std::optional used correctly

**Inheritance — 0 / 10**
- Not used. With EffectResolver, AiController, and Player all existing as separate classes, an abstract `Actor` or `Combatant` base class with virtual `chooseAction()` would have unified the player/AI dispatch and been a natural fit here.

**Game Value — 15 / 20**
- Very fun and ambitious mechanics — HP system, effect resolver, Joker cards
- Clear and readable; liked very much
