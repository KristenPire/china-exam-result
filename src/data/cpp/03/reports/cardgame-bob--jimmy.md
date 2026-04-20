# Project Report — cardgame-bob--jimmy

| | |
|---|---|
| **Members** | Bob · Jimmy |
| **Submission** | On time |
| **Final Score** | 84.5 / 100 |

---

## Overall

Honest work, clean structure. The code is well-organized and the private method convention is consistent throughout.

---

## Sections

**Subject Requirements — 28 / 30**
- All classes correct and complete
- README full marks — rules, per-member breakdown
- ⚠️ Only one committer email for two members (−1). Git commit history is how we verify each member contributed code; if only one email appears, there's no evidence the other member pushed anything. Both members should commit under their own Gitee account.

**Clean Code — 37.5 / 40**
- `run()` is 14 lines, delegates cleanly to focused private helpers
- Underscore-prefix private methods (`_dealCards`, `_playRound`, `_isGameOver`…) — consistent convention

- **`_playRound()` mixes state update and display inline — a `showRoundResult()` helper would clean it up** (−0.5)

  A function should do one thing: updating card ownership and printing the result are two separate concerns, so a bug in one area makes the whole function harder to reason about.

  ```cpp
  // game.cpp:42-57 — draw, compare, redistribute, and print all in one block
  std::cout << "You play   : " << playerCard << "\n";
  if (playerCard > computerCard) { std::cout << ">>> You win this round!\n"; _playerHand.addCard(playerCard); ... }
  ```

- **Welcome banner inline in `run()` rather than a helper** (−0.5)

  `run()` should orchestrate the game loop, not also own the welcome text; extracting a `showWelcome()` helper makes it trivial to later change the banner without touching loop logic.

  ```cpp
  // game.cpp:21-22
  std::cout << "\n WELCOME TO WAR (SIMPLIFIED) \n";
  std::cout << "You vs Computer. Press Enter to play each round.\n\n";
  ```

- **`program.exe` committed to repo** (−0.5)

  Compiled binaries are platform-specific, large, and change on every build — committing them clutters the repo history and makes diffs unreadable. Add `*.exe` and the output binary to `.gitignore`.

- **Chinese comments throughout source files** (−0.5)

  I need to be able to read your comments during review — keep them in one language so anyone reading the code can follow along.

  ```cpp
  // card.cpp:16 — 用于比较大小，Ace 最大
  // game.cpp:47 — 赢家获得两张牌（放入手牌底部，这里直接添加到手牌末尾）
  ```

- **CMakeLists says "C++25" but sets C++14** (−0.5)

  A comment that contradicts the actual setting is worse than no comment — it causes confusion about which standard the project really targets. Match the comment to the code, or remove it.

  ```cmake
  # CMakeLists.txt:4-5
  # Set C++25 standard
  set(CMAKE_CXX_STANDARD 14)  // comment says 25, code says 14
  ```

**Operator Overloading — 7 / 10**
- `operator<` and `operator>` correct

- **`operator==` compares only rank — `5♥ == 5♦` returns true** (−1)

  Two cards with the same rank but different suits are distinct cards in a real deck; ignoring suit means you can't correctly check whether you have the exact same card, which breaks duplicate detection.

  ```cpp
  // card.cpp:20-21
  bool Card::operator==(const Card& other) const {
      return _rank == other._rank;  // missing: && _suit == other._suit
  ```

- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; Hand canonical form complete with initializer list

**Inheritance — 0 / 10**
- Not used. A `SpecialCard` or `WildCard` subclass (or a base `CardGame` that `WarGame` extends) would have demonstrated polymorphism and code reuse across game variants.

**Game Value Bonus — +2**
- Honest war game, no additional flavor
