# cardgame-demo

> **This is a demo grading report** created to show students how the grading process works.
> Every citation below (`File.cpp:line`) refers to a realistic example of what the grader looks for.
> The code described here is fictional but representative of real submissions.

---

## Group Info

| Field | Value |
|---|---|
| Repository | https://gitee.com/example/cardgame-demo |
| Members | 1234 — Placeholder Student, 5678 — Bob |
| Deadline status | ON TIME (last commit: 2026-04-13 21:04 +0800) |
| Compilation | PASS (cmake) |

---

## Section 1 — Subject Requirements: 21 / 30

### 1.1 Compilation
PASS

> Built cleanly with cmake. Build artifacts (CMakeFiles/, CMakeCache.txt) were committed alongside source — not a deduction, but not good practice.

### 1.2 Required Classes: 12 / 15

| Class | Score | Notes |
|---|---|---|
| Card | 3 / 3 | Card.cpp fully implemented — constructor, getSuit/getRank/getValue, all three comparison operators and operator<< present and correct |
| Deck | 2 / 3 | Deck.cpp has shuffle() and draw(), but **isEmpty() and size() are missing** — Deck interface is incomplete (-1) |
| Hand | 3 / 3 | Hand.cpp — addCard() (Hand.cpp:14), size()/isEmpty() correct, explicit canonical form (Hand.cpp:3–22), operator<< (Hand.cpp:40–52) |
| Game + run() | 3 / 3 | Game.hh + Game.cpp present; public run() at Game.cpp:8; main.cpp is unmodified |
| End condition | 1 / 3 | The game loop runs but **never exits cleanly** — `while(true)` at Game.cpp:24 with no break condition; program must be killed with Ctrl+C (-2) |

### 1.3 Repository & README: 4 / 10

| Item | Score | Notes |
|---|---|---|
| Repo is public on Gitee | 2 / 2 | Accessible |
| README.md exists | 2 / 2 | Present at root |
| Student IDs listed | 0 / 2 | README says "Group members: Alice and Bob" — IDs not listed |
| Game description | 0 / 2 | README contains only build instructions, no description of the game rules |
| Contributions per member | 0 / 2 | No per-member section — "We worked together on everything" does not count |

### 1.4 Git Participation: 5 / 5

| Member | Has commits |
|---|---|
| Alice (1234@user.noreply.gitee.com) | YES |
| Bob (5678@user.noreply.gitee.com) | YES |

Score: 5 / 5 — both members have commits spread across the development period.

---

## Section 2 — Clean Code: 27 / 40

### 2.1 Function Size & Focus: 8 / 12

Several functions are well-scoped: `Deck::shuffle()` (6 lines), `Hand::addCard()` (3 lines), `Card::getValue()` (1 line). However, `Game::run()` (Game.cpp:8–95, **88 lines**) is a monolith — it handles user input, drawing cards, evaluating the winner, updating scores, and printing results with no helper extraction. A red flag per the rubric: a single function that does input + logic + output. Compare `run()` to what it should look like:

```
// What run() should read like:
void Game::run() {
    setup();
    while (!isOver()) {
        playRound();
        printRoundResult();
    }
    printFinalResult();
}
```
Score at the 8-pt band: most other functions are fine, but `run()` is a clear violation.

### 2.2 Canonical Form: 7 / 10

`Hand` has a copy constructor (Hand.cpp:5–10) and a destructor (Hand.cpp:19), but the **copy-assignment operator is missing entirely** — the Rule of Three is violated (-3). Without it, `hand1 = hand2` silently performs a shallow memberwise copy via the compiler default, which for `std::vector` is actually safe here, but the absence shows the student did not consider it. `Card` and `Deck` use only primitive types / STL containers and need no explicit canonical form — correctly left to the compiler.

### 2.3 Naming: 8 / 10

Class and function names are clear throughout: `drawCard()`, `shuffleDeck()`, `printHand()`, `isGameOver()`. Member variables use consistent underscore prefix (`_deck`, `_playerHand`, `_score`). Deduction: local variables inside `Game::run()` use single-letter names — `c` for card (Game.cpp:31), `w` for winner (Game.cpp:58), `i` in a loop that is not a simple index (Game.cpp:44) — making the 88-line function even harder to follow (-2).

### 2.4 Style & Readability: 4 / 8

Indentation is consistent (4-space). However:
- Magic numbers appear repeatedly: `52` (Deck.cpp:18), `4` (Deck.cpp:22), `13` (Deck.cpp:23) scattered without named constants
- A large commented-out block remains in Game.cpp:60–72 ("old scoring logic") — dead code in a final submission
- `if (win == true)` pattern at Game.cpp:58 instead of `if (win)`

---

## Section 3 — Operator Overloading: 6 / 10

### 3.1 Required Operators (Card): 4 / 6

| Operator | Score | Notes |
|---|---|---|
| operator== | 2 / 2 | Card.cpp:34 — correctly compares both rank and suit |
| operator< | 2 / 2 | Card.cpp:40 — compares by rank value via getValue(); correct |
| operator> | 0 / 2 | **Not implemented** — Card.hh declares it but Card.cpp has no definition; linker error was masked because operator> is never called in Game.cpp |

### 3.2 operator<<: 2 / 2

| | Score | Notes |
|---|---|---|
| Card | 1 / 1 | Card.cpp:50 — prints suit symbol + rank (e.g. `♥K`, `♠A`) |
| Hand | 1 / 1 | Hand.cpp:40 — iterates cards and prints them space-separated in brackets |

### 3.3 Bonus Overloads: 0 / 2

No additional overloads.

---

## Section 4 — Heap / Dynamic Memory: 10 / 10

> Mode: STL ONLY

All collections use `std::vector`. `Hand` canonical form is partially correct (§2.2 — copy ctor and destructor present; copy-assign missing, but vector handles the copy safely). No raw `new`/`delete` anywhere. Objects are passed by reference where appropriate: `void printHand(const Hand& h)` (Game.cpp:101). No fixed-size arrays for variable-size data. Full marks per §4.2 rubric since the STL handles memory correctly even without the explicit copy-assign.

---

## Section 5 — Inheritance: 0 / 10

> Inheritance used: NO

No inheritance used. Score: 0/10.

---

## Scoring Summary

| Section | Score | Max |
|---|---|---|
| 1. Subject Requirements | 21 | 30 |
| 2. Clean Code | 27 | 40 |
| 3. Operator Overloading | 6 | 10 |
| 4. Heap / Dynamic Memory | 10 | 10 |
| 5. Inheritance | 0 | 10 |
| **Total** | **64** | **100** |

---

## What would have pushed this to 85+?

| Fix | Points recovered |
|---|---|
| Add `isEmpty()` and `size()` to Deck | +1 |
| Fix the infinite loop — add a real end condition | +2 |
| Fill in the README (IDs, rules, contributions) | +6 |
| Extract helpers from `run()` | +4 |
| Add the missing copy-assignment operator to Hand | +3 |
| Implement `operator>` in Card.cpp | +2 |
| Replace magic numbers with named constants | +2 |
| Remove dead code (commented-out block) | +1 |

---

## AI Usage

**AI_USAGE: 1 / 5** — The missing `operator>`, the infinite loop, the incomplete README, and the 88-line monolithic `run()` are organic student mistakes inconsistent with AI-generated output; the clean `Card.cpp` and `Hand.cpp` operator implementations are slightly polished but within reach for this level.

- `Game.cpp:8–95` — 88-line monolith with magic numbers and dead code — clearly hand-written (lower↓)
- `Game.cpp:60–72` — commented-out "old scoring logic" left in final submission — human development artifact (lower↓)
- `Card.cpp:34–50` — comparison operators and operator<< are clean and correct (raise↑ slightly)
- `Hand.cpp:3–22` — canonical form attempted but incomplete (Rule of Three violation) — organic student oversight (lower↓)
