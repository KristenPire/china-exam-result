# Project Report — cardgame-verena

| | |
|---|---|
| **Members** | Verena (solo) |
| **Submission** | On time |
| **Final Score** | 92.5 / 100 |

---

## Sections

**Subject Requirements — 30 / 30**
- All classes correct and complete — full marks
- README full marks — rules, project structure, solo contribution
- Solo project — full Git credit

**Clean Code — 34.5 / 40**
- `Display::show*()` and `Input::ask*()` helpers are all short and focused — excellent separation of concerns
- Naming is precise throughout — no issues

- **`run()` (~62 lines) handles welcome, initialization, and the full round loop inline — a `playOneRound()` helper would clean this up** (−2)

  A function should do one thing; when `run()` handles setup AND drives every round, adding a new round feature means editing the same large block instead of a focused helper. Extract the per-round deal/input/judge logic so `run()` becomes a short orchestrator.

  ```cpp
  // game.cpp:50 — the full round loop with deal, input, judge, and score update all inline
  for (int roundNumber = 1; roundNumber <= totalRounds; ++roundNumber) { ... }
  ```

- **`RoundJudge` anonymous class wraps what is just `card1 > card2` — unnecessary indirection** (−1)

  Wrapping a single comparison in its own class adds layers of indirection that make the code harder to read, not easier. Card already has `operator>`, so `playerCard > computerCard` is the direct, readable expression.

  ```cpp
  // game.cpp:13-24 — entire class exists to do: left.getRank() > right.getRank()
  class RoundJudge { public: static int compare(const Card& left, const Card& right) { ... } };
  ```

- **All canonical form members declared as `= default` — correct, but shows no explicit understanding of what copying does** (−2)

  Writing `= default` tells the compiler to generate the copy constructor, but it doesn't show you understand what that means for your data members. An explicit initializer list like `Hand(const Hand& other) : _cards(other._cards) {}` makes the intent visible and proves you know that the vector is being deep-copied.

  ```cpp
  // hand.hh — all three declared but with no body showing what is being copied
  Hand(const Hand &other) = default;
  ```

- **Unedited Gitee README template committed alongside the actual README** (−0.5)

  The default Gitee README template (开头 "以下是 Gitee 平台说明...") adds noise to the repo and signals the file was never cleaned up before submission. Keep only the actual project README.

**Operator Overloading — 8 / 10**
- All required operators correct; `operator>` delegates to `other < *this`
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; `_cards.reserve(52)` used correctly
- Hand canonical form complete

**Inheritance — 0 / 10**
- Not used. A `DisplayBase` or `Judge` abstract class would have been a natural fit here — for example, `RoundJudge` is already halfway to a strategy pattern that could be swapped for different rule variants via a virtual interface.

**Game Value Bonus — +10**

You did this group project alone with only you to do everything, with way more class to manage than the other groups of this class. For this I want to send my congratulations.

This year you have continued to please me with interest, good work, and very good result.

Your game opens up with some nice explanation. It's a war game but with your little twist of drawing two cards and choosing one — it's a nice addition. You did not add any fancy UI but it's still clear and works well.

I'll add bonus point because you are alone.

You deserve all of it Verena. Good luck for the rest.
