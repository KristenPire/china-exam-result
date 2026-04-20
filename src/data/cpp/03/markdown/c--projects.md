# Project Report — c--projects

| | |
|---|---|
| **Members** | Vernon |
| **Submission** | On time |
| **Final Score** | 0 / 100 |

---

## Overall

High Card Duel is a clean, well-structured game — the rules are simple and the code that *was* written is genuinely good. Unfortunately `Card.cpp` was submitted as an empty file, which means every Card method is missing at link time and the project cannot compile. Per the project rules, a project that does not compile scores 0.

The loss here is significant because `Deck`, `Hand`, and `Game` are all solid work — this would have been a respectable score.

---

## Sections

**Subject Requirements — 0 / 30**
- **Card.cpp is empty** (−30, compilation blocker)

  All methods declared in `Card.hh` — constructor, `operator<`, `operator>`, `operator<<` — have no implementation. The linker cannot build the binary.

- README student IDs and contributions left as template placeholder (would have been −4 if compiled)

**Clean Code — (unscored, observations)**

`Deck.cpp` and `Hand.cpp` are the strongest parts of the submission:

- `Deck::shuffle()` uses a properly seeded `std::mt19937` — correct and robust
- `Deck::draw()` guards against drawing from an empty deck with a clear exception
- `Hand` implements the full canonical form: copy constructor, copy-assignment with self-assignment guard, destructor

`Game::run()` at 73 lines handles input, drawing, scoring, and output all in one block. Extracting a `_playRound()` helper would have improved this.

**Operator Overloading — (unscored)**

`operator<<` for `Hand` is correctly implemented. The three required Card operators (`==`, `<`, `>`) are declared but have no implementation.

**Inheritance — not used**

---

## What to do next time

The fix would have taken 20 lines: implement `Card::Card()`, `getValue()`, `operator<`, `operator>`, and `operator<<` in `Card.cpp`. Always verify the project compiles from a clean build before submitting.
