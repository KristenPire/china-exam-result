# Project Report — baltro

| | |
|---|---|
| **Members** | Sisyphus · Johnny · Johnson · Cooper |
| **Submission** | On time (1 minute 9 seconds before deadline) |
| **Final Score** | 88 / 100 |

---

## Overall

The game is amazing. It's pretty, its functional And ITS FUN, If i could I would play it again and again. It's fluid, colorful, with nice feature. You deserve the best

---

## Sections

**Subject Requirements — 30 / 30**
- All classes correct and complete — full marks
- README full marks — Balatro rules, 9 hand types, Joker mechanics, per-member breakdown

**Clean Code — 30 / 40**
- `run()` and `playRound()` delegate well to focused helpers

- **`scoreSelection()` is ~120 lines handling all 9 hand types inline — `isFlush()`, `isStraight()`, `getHandType()` helpers needed** (−5)

  When all the logic is in one place, it's hard to test or change one hand type without risking the others. Extracting `isFlush()`, `isStraight()`, and `getHandType()` would make each piece independently readable and testable.

  ```cpp
  bool flush = suitCounts.size() == 1 && playedCards.size() == 5;  // Game.cpp:369 — inline flush check
  // straight detection spans Game.cpp:371-401 — inline within scoreSelection()
  if (straight && flush) { result.handName = "Straight Flush"; result.chips += 100; ... }  // Game.cpp:408
  ```

- Canonical form on `Hand` is correct — initializer list, self-assignment guard, `= default` destructor

- **`_shopCards` used for the active hand — name implies a shop context, misleading** (−1)

  When a reader sees `_shopCards.push_back(_deck.draw())`, they expect a shop inventory, not the 8 cards the player holds. A name like `_hand` or `_playCards` would make the intent clear without reading surrounding code.

  ```cpp
  _shopCards.push_back(_deck.draw());  // Game.cpp:215 — filling the player's playing hand, not a shop
  UI::showCards(_shopCards);  // Game.cpp:261 — displaying the play hand using a shop-named variable
  ```

- **Chinese inline comments remain throughout `Game.cpp`** (−1)

  Comments in a language different from the rest of the codebase make maintenance harder for anyone who doesn't read Chinese, and they indicate the code wasn't cleaned up for submission. English comments are expected in a shared project.

  ```cpp
  while (true)  // 只有主菜单选择"退出系统"才结束  // Game.cpp:43 — Chinese comment in shipped code
  if (_credits > 0) --_credits;  // 对局中返回主页，扣 1 credit  // Game.cpp:69
  ```

- **Magic numbers: `8` for hand size, `2` for initial jokers, hand scoring bonuses (100, 90, 75…) all as literals** (−2)

  A bare number like `8` or `100` in the middle of logic forces a reader to guess what it means; if the value ever needs to change, you must hunt down every occurrence. Named constants make the intent obvious and changes safe.

  ```cpp
  for (int i = 0; i < 8; ++i) _shopCards.push_back(_deck.draw());  // Game.cpp:214 — what is 8?
  result.chips += 100; result.multiplier = 8;  // Game.cpp:411-412 — Straight Flush bonuses as raw literals
  ```

**Operator Overloading — 8 / 10**
- All required operators correct
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; Hand canonical form complete and correct

**Inheritance — 0 / 10**
- Not used. A Joker hierarchy (`Joker` base with `GreedyJoker`, `ScholarJoker`, `MimeJoker` etc. as subclasses, each overriding an `applyBonus()` method) would have replaced the long name-matching chain in `applyJokerBonuses()` and made it trivial to add new Joker types.

**Game Value Bonus — +20**
- The game is amazing. It's pretty, its functional And ITS FUN, If i could I would play it again and again. It's fluid, colorful, with nice feature. You deserve the best
