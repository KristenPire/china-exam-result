# Project Report — card-game-violet

| | |
|---|---|
| **Members** | Violet · Arrco |
| **Submission** | On time |
| **Final Score** | 78.5 / 100 |

---

## Overall

Interesting Golden Flower implementation with a clever `calcScore()` using bit-packing for hand comparison. Clean canonical form and good operator design. The main issue is that there is no `run()` and no game loop — the program just shows one random comparison and exits.

---

## Sections

**Subject Requirements — 24 / 30**
- **Deck missing empty check in `draw()`** (−1)

  Calling `_cards.back()` on an empty vector is undefined behavior — the program may crash or silently return garbage. A one-line guard (`if (_cards.empty()) throw std::out_of_range("deck empty");`) prevents this.

  ```cpp
  // deck.cpp:16-19 — no empty check before accessing back()
  Card Deck::draw() {
      Card c = _cards.back();  // undefined behavior if _cards is empty
      _cards.pop_back();
  ```

- README full marks — Golden Flower rules with full hand rankings, per-member breakdown

- **No `run()` method — main.cpp modified to call `deal()` and `showResult()` directly** (−3)

  The assignment contract is that `main.cpp` stays untouched and `game.run()` drives everything; exposing `deal()` and `showResult()` as public methods and calling them from main breaks encapsulation and misses the point of the `run()` interface.

  ```cpp
  // main.cpp — modified from the required template
  g.deal();
  g.showResult();  // required: game.run()
  ```

- **Single hand played — no game loop or replay** (−1)

  The program deals three cards each, prints the winner, and exits — there is no way for the player to play again without re-running the binary. A simple `do { deal(); showResult(); } while (askReplay());` loop would fix this.

- **Only one committer email** (−1)

  Git commit history is the evidence of each member's contribution; when only one email appears, there is no way to verify that the other member pushed any code.

**Clean Code — 36.5 / 40**
- `calcScore()` length (~35 lines) is justified by the Golden Flower ranking algorithm

- **`showResult()` mixes printing both hands, computing scores, and declaring winner — a `showHandComparison()` helper needed** (−0.5)

  Mixing display and computation in the same function makes it hard to reuse either part independently; if you wanted to add logging or change the output format, you'd have to untangle them.

  ```cpp
  // game.cpp:59-73 — printing, score computation, and winner decision all inline
  void Game::showResult() const {
      std::cout << _name1 << ": " << _h1 << "\n";
      uint64_t s1 = calcScore(_h1), s2 = calcScore(_h2);  // computation here
      if (s1 > s2) std::cout << "winner: " << _name1 << "\n";  // decision here
  ```

- **Single-letter variables in `calcScore()` (`r`, `s`, `p`, `k`) — opaque** (−0.5)

  Without reading the full algorithm, `r`, `s`, `p`, and `k` carry no meaning; names like `ranks`, `suits`, `pairValue`, `kicker` would make the Golden Flower scoring logic self-documenting.

  ```cpp
  // game.cpp:10-11
  std::vector<int> r, s;  // r = ranks, s = suits — not obvious at a glance
  ```

- **`_h1`/`_h2` member names unclear** (−0.5)

  `_h1` and `_h2` reveal nothing about what these members represent; `_playerAHand` and `_playerBHand`, or even `_hand1`/`_hand2`, communicate ownership and intent immediately.

- **Duplicate `friend class Game` in hand.hh with emoji annotation — AI copy-paste artifact** (−0.5)

  Two identical `friend class Game` declarations is a sign that an AI suggested adding the line and the student pasted it without noticing it was already there — it signals the code wasn't fully understood.

  ```cpp
  // hand.hh:17 and 24 — identical declaration appears twice
  friend class Game;
  friend class Game; // 🔑 必须加这1行！授权 Game 读取手牌打分
  ```

- **`// ... 你原有的代码 ...` left in hand.hh — unremoved AI conversation fragment** (−0.5)

  This comment is a placeholder that an AI chat tool inserts to mean "put your existing code here" — leaving it in the submitted file shows the AI interaction wasn't cleaned up before submission.

  ```cpp
  // hand.hh:21
  // ... 你原有的代码 ...  // AI placeholder left in submitted code
  ```

- **Chinese/emoji comments; `draw()` has no empty guard** (−1)

  Emoji and Chinese inline annotations (✅, 🐛, 🔑) make the code harder to read in a standard code review and are a sign of copy-pasting from AI responses without cleaning up. The missing empty guard in `draw()` is a correctness bug — calling it on an empty deck is undefined behavior.

  ```cpp
  // game.cpp:12, 20 — emoji comments
  // ✅ 因为 Hand.hh 声明了 friend class Game; 这里可以直接访问私有成员 _cards
  // 🐛 关键修复：A-2-3 ...
  // deck.cpp:16-17 — no guard
  Card Deck::draw() {
      Card c = _cards.back();  // crashes or UB if deck is empty
  ```

**Operator Overloading — 8 / 10**
- All required operators correct; `operator>` delegates to `other < *this` — idiomatic
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; Hand canonical form complete with initializer list

**Inheritance — 0 / 10**
- Not used. The HType enum already defines a hierarchy of hand strengths — a `Hand` base class with virtual `getType()` and concrete subclasses like `FlushHand` or `PairHand` would have been a natural extension, or a `GoldenFlowerGame` inheriting from a `CardGame` base.

**Game Value Bonus — +0**
- The game is not interactive — it outputs a single random comparison and exits
- No player choices, no loop, no replay
