# Project Report — cardgame-Andrew-Ramos-Judge

| | |
|---|---|
| **Members** | Andrew · Ramos · Judge |
| **Submission** | On time |
| **Final Score** | 90 / 100 |

---

## Overall

Custom card game with J/Q/K skill mechanics and ASCII card art. Clean top-level structure and well-extracted skill helpers. The main weakness is heavy use of single/two-character variable names throughout the ~80 lines of skill resolution code.

---

## Sections

**Subject Requirements — 29 / 30**
- **Deck missing isEmpty()/size()** (−1)

  Without isEmpty(), callers cannot safely check before drawing; any code that draws from an exhausted deck will call `_cards.back()` on an empty vector, which is undefined behavior (crash or garbage value).

  ```cpp
  Card Deck::draw() {  // Deck.cpp:23 — no isEmpty() check; crashes silently on empty deck
      Card c = _cards.back(); _cards.pop_back(); return c;
  ```

- README full marks — custom game rules with skill mechanics, per-member breakdown

- **One committer email for three members** (−1)

  Git history is how I verify that each member actively contributed code; when only one email appears, the other two members' work is invisible and cannot be credited individually.

**Clean Code — 35 / 40**
- run() (10 lines) cleanly delegates — excellent top-level decomposition
- skillJ/Q/K helpers each handle one specific effect

- **playerSkill() (~30 lines) mixes input validation, dispatch, and state mutation** (−0.5)

  A function should do one thing — mixing input reading, skill routing, and score recalculation in the same body makes it harder to test or change any one part without risking the others.

  ```cpp
  // Game.cpp:83 — one function reads input, dispatches to skillJ/Q/K, AND recalculates scores
  std::cin >> s;
  if (s == 1) { skillJ(_player, _ai, y, a); } else if (s == 2) { skillQ(_ai, i); }
  _player.calculateScore(); _ai.calculateScore();  // state mutation buried at the end
  ```

- **Single/two-char names throughout skill code: f, t, fi, ti, fh, th, fr, tr, fc, tc — opaque across ~80 lines** (−2)

  Single-letter names force readers to mentally track what each letter means across dozens of lines; `firstPlayer`/`topPlayer` and `firstIndex`/`firstHand` cost nothing extra to type and make the code self-documenting.

  ```cpp
  void Game::skillJ(Player& f, Player& t, int fi, int ti) {  // Game.cpp:116 — f/t/fi/ti all unexplained
      Hand* fh = fi < 3 ? &f.visible : &f.hidden;            // fh, fr, th, tr follow same pattern
  ```

- **sideBySide() parameter names a/b are opaque** (−0.5)

  Even a small improvement to `lhs`/`rhs`, or better `playerArts`/`aiArts`, would clarify what each argument represents without changing any logic.

  ```cpp
  // Game.cpp:46 — parameter names a and b reveal nothing about their role
  static std::string sideBySide(const std::vector<std::string>& a, const std::vector<std::string>& b)
  ```

- **Magic numbers: 3 (rounds), 2 (skill count), 6 (total skills) without named constants** (−1)

  When a number appears bare in code, readers cannot tell if `3` means "best-of-three" or "three cards" or something else; a named constant like `const int MAX_ROUNDS = 3;` makes intent obvious and means you only need to change it in one place.

  ```cpp
  return _player.roundWins >= 2 || _ai.roundWins >= 2 || _round > 3;  // Game.cpp:167 — why 2? why 3?
  ```

- **Build artifacts (CMakeCache, CMakeFiles) committed to repo** (−0.5)

  Generated build files are machine-specific and bloat the repo; they should be listed in `.gitignore` so collaborators' builds don't collide.

- **std::random_shuffle deprecated since C++14, removed in C++17** (−0.5)

  `std::random_shuffle` was removed because its internal RNG is implementation-defined and often not truly random; replace it with `std::shuffle(_cards.begin(), _cards.end(), std::mt19937{std::random_device{}()})` for portable, well-seeded shuffling.

  ```cpp
  std::random_shuffle(_cards.begin(), _cards.end());  // Deck.cpp:20 — removed in C++17
  ```

**Operator Overloading — 8 / 10**
- All three required operators correct
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; canonical form via compiler-generated operations correct

**Inheritance — 0 / 10**
- Not used. A base `CardGame` class could have provided `run()`, `isOver()`, and `showResult()` as a shared contract; the Player/AI distinction could have been a subclass hierarchy rather than two separate `Player` structs, making it easy to add a third player type without touching game logic.

**Game Value Bonus — +8**
- Pretty game with added flavor and skill choices
- ASCII art well-formed
- Only active in round 1 then plays alone
