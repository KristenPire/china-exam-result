# Project Report — cardgame-pojock-stephen-valentine

| | |
|---|---|
| **Members** | Pojock · Stephen · Valentine |
| **Submission** | On time |
| **Final Score** | 90 / 100 |

---

## Overall

Nice War variant with ASCII card art and dual card-selection modes (by number or by text code like "H7"). The game is pretty and the card display is well-formed. run() at ~112 lines is the main structural weakness. I had to comment out the unconditional `#include <windows.h>` to get it to compile.

---

## Sections

**Subject Requirements — 27 / 30**
- **Deck missing empty check in draw()** (−1)

  Calling `_cards.back()` on an empty vector is undefined behavior in C++ — on most systems it silently returns garbage or crashes; a guard like `if (_cards.empty()) throw std::out_of_range("deck empty");` makes the failure visible.

  ```cpp
  Card Deck::draw() {                   // Deck.cpp:32 — no isEmpty() check before pop_back
      Card draw_card = _cards.back();   // undefined behavior if _cards is empty
      _cards.pop_back(); return draw_card;
  ```

- **One committer email for 3 members** (−2)

  Git history is how I verify that each member actively contributed code; when only one email appears, the other two members' work is invisible and cannot be credited individually.

- README full marks — War rules, per-member breakdown

**Clean Code — 35 / 40**
- dealCards(), showPlayerHand(), showGameStatus() all focused and well-sized

- **run() (~112 lines) handles welcome, rules, shuffle, deal, full game loop, card selection, scoring, results all inline — needs _showWelcome(), _playOneRound() helpers** (−4)

  When one function handles setup, UI, game loop, and teardown, any change to one responsibility risks breaking others; extracting helpers makes each responsibility independently readable and testable.

  ```cpp
  void Game::run() {  // sources/Game.cpp:8 — welcome banner, rules, deck shuffle, game loop, all inline
      cout << "========================================\n";
      cout << "       SIMPLE WAR - CARD GAME\n";  // welcome UI mixed with game logic below
  ```

- **displayWithUI() (~90 lines) duplicates rank-to-string switch at lines 146–154 and 176–184 — a rankStr() helper would eliminate both copies** (−1)

  When the same logic is copied twice, any fix (e.g., adding a Joker rank) must be applied in both places — missing one creates inconsistent behavior.

  ```cpp
  switch (_cards[i].getRank()) { case Card::Rank::Jack: rank_str = "J"; break; ... }  // Hand.cpp:147
  // ...then again at:
  switch (_cards[i].getRank()) { case Card::Rank::Jack: rank_str = "J"; break; ... }  // Hand.cpp:177
  ```

- **C-style casts throughout Card/Deck: (Card::Suit)s, (int)_rank — should be static_cast<>** (−1)

  C-style casts silently perform any conversion including dangerous ones (like pointer reinterpretation); `static_cast<>` tells the compiler to only allow safe, intentional conversions and catches errors at compile time.

  ```cpp
  Card::Suit suit = (Card::Suit)s;   // Deck.cpp:16 — C-style cast, should be static_cast<Card::Suit>(s)
  int val = (int)_rank;              // Card.cpp:21 — same issue
  ```

- **Developer note `// by-val!!!!` committed to Hand.hh public interface** (−0.5)

  Comments like `// by-val!!!!` are personal developer reminders that belong in a scratch file or private notes, not in a public header — the public interface should only contain information relevant to users of the class.

  ```cpp
  // 显示带UI的手牌（此为新加内容by-val!!!!)  // Hand.hh:23 — draft note in public interface
  ```

- **Copy constructor uses body assignment instead of initializer list** (−0.5)

  Initializer lists initialize members directly; body assignment first default-constructs them, then overwrites. The idiomatic form is `Hand::Hand(const Hand& other) : _cards(other._cards) {}`.

  ```cpp
  Hand::Hand(const Hand& other) {  // hand.cpp:8 — body assignment instead of initializer list
      _cards = other._cards;       // _cards is default-constructed first, then overwritten
  ```

- **program binary and teacher.md committed to repo** (−1.5)

  Committing compiled binaries is wasteful (they're large, machine-specific, and rebuild trivially); committing what appears to be course teaching notes (teacher.md, 9.1 KB) suggests accidental inclusion of files that were not meant to be submitted.

**Operator Overloading — 8 / 10**
- All three required operators correct; operator== compares both suit and rank
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; Hand canonical form complete

**Inheritance — 0 / 10**
- Not used. A base `CardGame` class defining `run()`, `dealCards()`, and `checkWin()` as a virtual interface would make it straightforward to add a second game mode without rewriting the game loop; the `Hand`/computer distinction could also be a `Player` hierarchy with overridden `selectCard()` behavior.

**Game Value — 10 / 20**

This nice War game variant, I like the idea of giving more choice in the war game.

It's pretty and the ASCII art and card list is very well formed. I like it very much.

I would have been perfect with a screen refresh.

You have used windows.h, which was NOT authorized by the project. Since it is NOT a function in the C++ Standard Library.

I have decided NOT TO REMOVE ANY POINT because of that.
