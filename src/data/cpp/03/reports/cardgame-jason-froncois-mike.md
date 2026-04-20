# Project Report — cardgame-jason-froncois-mike

| | |
|---|---|
| **Members** | Jason · Froncois · Mike |
| **Submission** | On time |
| **Final Score** | 98 / 100 |

---

## Overall

A bluffing card game with an extraordinary feature set: personalized name entry, background music via afplay, ANSI colors, rock-paper-scissors mini-game to decide who goes first, hidden card mechanics, odds display, betting system, and a sigmoid+EMA AI opponent. Excellent phase decomposition in run() (deal_phase, action_phase, settle_phase, shop_phase). The main technical weakness is zero operator overloading — all three Card operators and both operator<< are absent, replaced with to_string() and direct comparisons at call sites. Hand canonical form also missing entirely.

---

## Sections

**Subject Requirements — 26 / 30**
- **Card, Deck: skeleton renamed (get_suit/get_rank/get_weight vs getSuit/getRank/getValue) (−1 each)** (−2)

  Renaming the required interface methods means your classes don't satisfy the API contract — any code written against the specification (including the grading harness) will fail to compile without knowing your alternative names.

  ```cpp
  // Card.hh — required getSuit()/getRank()/getValue() replaced with:
  Rank get_rank() const;  Suit get_suit() const;  int get_weight() const;
  ```

- **Hand: canonical form completely absent — no copy constructor, copy-assignment, or destructor** (−1)

  The provided `Hand.hh` skeleton explicitly declared the copy constructor, copy-assignment, and destructor — leaving all three out means the required interface is missing, and Hand objects have no safe copy semantics.

- **Game: main.cpp heavily rewritten — constructor requires player name, doesn't match skeleton** (−1)

  The provided `main.cpp` is `Game game; game.run();` — if the constructor requires a string argument, the unmodified main.cpp won't compile. The skeleton's main.cpp must be left unchanged.

  ```cpp
  // Game.cpp:153 — constructor now requires a name parameter
  Game::Game(const std::string& human_name) : ... { ... }
  ```

- README full marks — detailed bilingual with per-member breakdown; Git full marks (3 members, 1 committer, +5)

**Clean Code — 32 / 40**
- Excellent phase decomposition in run()

- **play_one_trick() (~150 lines), init_round() (~80 lines), rock_paper_scissors_odds() (~80 lines) all too large** (−2)

  Functions this long are hard to test, hard to read, and hide logic that deserves its own name — for example `rock_paper_scissors_odds()` mixes user input, validation, tie-loop, and odds assignment all in one block that would benefit from at least one helper.

  ```cpp
  // Game.cpp:397 — play_one_trick() runs 150 lines mixing I/O, card play, bluff, challenge, and score all inline
  bool Game::play_one_trick(bool human_goes_first) { ... }  // ~Game.cpp:397-549
  ```

- **Hand canonical form absent** (−3)

  The provided `Hand.hh` skeleton explicitly declared the copy constructor, copy-assignment, and destructor — none of them were implemented. Without these, copying a Hand has undefined behavior if the class ever manages resources.

- **`using std::string` in 3 headers; both `#pragma once` and `#ifndef` guards redundant in all headers** (−1.5)

  `using std::string` in a header pollutes the global namespace of every file that includes it — other developers' code breaks if they also define a `string` name. Having both `#pragma once` and `#ifndef` guards is harmless but redundant; pick one.

  ```cpp
  // Card.hh:6 — pollutes every includer's namespace
  using std::string;
  ```

- **Magic numbers (1000 for balance, 50 for peek cost, 5 for hand size); short formula vars (bu, bc, P, U)** (−1.5)

  A bare `1000` or `50` in code forces every reader to guess what it means; a named constant like `constexpr int STARTING_BALANCE = 1000` is self-documenting. Single-letter variables in non-math context are similarly opaque — `bu` and `bc` could mean anything.

  ```cpp
  // Game.cpp:161 — magic number with no name
  user = std::make_unique<HumanPlayer>(human_name, 1000);  // what is 1000?
  ```

**Operator Overloading — 0 / 10**
- **operator==, <, > all absent from Card — comparisons done inline at call sites** (−6)

  Without these operators, every comparison must reach into the Card's internals at the call site, scattering the comparison logic across the codebase. If the weight formula changes, every call site must be updated individually. `operator<` should live in Card once.

  ```cpp
  // Game.cpp:438-440 — comparison done by hand instead of card1 < card2
  int w1 = c_first.get_weight();
  int w2 = c_second.get_weight();
  if (w1 > w2 || w1 == w2) { ... }
  ```

- **operator<< absent for both Card and Hand — to_string() used instead** (−2)

  `operator<<` lets you write `cout << card` and `cout << hand` naturally, and integrates with the standard stream system. Using `to_string()` works but requires calling it explicitly everywhere and cannot be used with things like `std::ostream_iterator`.

  ```cpp
  // Game.cpp:390-393 — hand printed by iterating and calling to_string() at each site
  for (const Card& c : user->get_hand().get_cards()) { Card_ui::draw_card_ascii(c); }
  ```

- No bonus overloads

**Heap / Dynamic Memory — 10 / 10**
- Canonical form penalized in §2.2 only (no double-count)
- std::move used correctly throughout (add_card, card_out, win_trick)
- unique_ptr<Player> in Game for correct polymorphic ownership

**Inheritance — 10 / 10**
- Player abstract base with pure virtual decide_bluff() / decide_challenge()
- HumanPlayer and AIPlayer both inherit; virtual ~Player() = default; all overrides annotated
- unique_ptr<Player> storage — no object slicing; perfect score

**Game Value — 20 / 10**
- Name entry, background music (afplay trick), ANSI colors
- Rock-paper-scissors mini-game to decide who starts — very creative
- Hidden card mechanics, odds display, betting, challenge/bluff modes
- Sigmoid+EMA AI opponent with real decision logic
- Congratulations — very complete game, I am proud
