# Project Report — freeway

| | |
|---|---|
| **Members** | Robin · Daniel · Zack · Kenley |
| **Submission** | On time |
| **Final Score** | 92 / 100 |

---

## Overall

The game is a custom created on blackjack and turn based gambling. It's a good idea and I want to encourage you to add your flavors and immagination to things. Good.

I like the idea of creating a cheated bot that you'll never win again, or only if you're brave.

The overall mode of easy, smart and cheat is a good thing to add.

I would say although that the game looks is quite modest, No screen refresh, but still some good ascii art for the card, it's very readable.

---

## Sections

**Subject Requirements — 29 / 30**
- All classes correct; README full marks — AI modes, per-member breakdown

- **Hand provides `getCardCount()` but is missing the required `size()` and `isEmpty()` interface** (−1)

  The required interface specifies `size()` and `isEmpty()` by name; naming them differently means any code that depends on the standard Hand API (including the grading harness) won't work without knowing your custom name. Consistent naming is part of the contract.

  ```cpp
  int Hand::getCardCount() const { ... }  // Hand.cpp — should be size() / isEmpty()
  ```

**Clean Code — 27 / 40**
- `run()` is 14 lines and delegates cleanly; `playSeries()`, `setupGame()`, `selectMode()`, `selectDifficulty()` all focused

- **`gameLoop()` is ~120 lines with the dealer turn block duplicated twice — extract `playerTurn()` / `dealerTurn()`** (−6)

  The entire dealer turn logic appears at Game.cpp:150-171 and again at Game.cpp:175-196 — any bug fix or rule change must be made in two places, and the two copies are already out of sync (the second uses a hardcoded `score < 17` instead of the polymorphic `getAction()` call). Extracting a `dealerTurn()` function removes the duplication.

  ```cpp
  // Game.cpp:150-171 — first dealer block (uses polymorphic getAction)
  Player::Action dAction = _dealer->getAction(nextCard, _deck);
  // Game.cpp:184 — second dealer block (ignores AI, hardcodes threshold)
  if (_dealer->getScore() < 17) { ... }  // copy-paste drift
  ```

- **Chinese inline comments throughout `Game.cpp`, `Player.cpp`, `Deck.cpp`** (−1)

  Comments in a language the grader or future collaborators may not read make the code harder to maintain and review. Use English for all inline comments in a course submission.

  ```cpp
  // Game.cpp:122 — 只要双方中还有人没有 Stand，且都没爆牌，就继续交替回合
  ```

- **`_aiDifficulty` stored as int (1–3) instead of a named enum** (−1)

  Magic integers like `1`, `2`, `3` carry no meaning without reading the surrounding code; a reader has to search for the comparison site to understand what each value means. An `enum class Difficulty { Easy, Smart, Cheater }` makes every branch self-documenting.

  ```cpp
  std::cin >> _aiDifficulty;  // Game.cpp:71 — 1, 2, or 3; meaning only clear at the if-chain below
  ```

- **Game copy constructor copies only int stats — `_player` / `_dealer` raw pointers left uninitialized** (−1)

  If a `Game` object is ever copied, the copy's `_player` and `_dealer` pointers contain garbage — accessing them causes undefined behavior, and the destructor will `delete` an invalid pointer. When a class owns raw pointers, the copy constructor must either deep-copy the pointed-to objects or be `= delete`d.

  ```cpp
  // Game.cpp:25-26 — _player and _dealer not copied; both left uninitialized
  Game::Game(const Game& other)
      : _playerWins(other._playerWins), _dealerWins(other._dealerWins), ... {}
  ```

- **CMakeLists.txt comment says "C++25 standard" but sets C++14; `.DS_Store` committed** (−1)

  A contradicting comment in the build file is actively misleading to anyone who reads it. `.DS_Store` is a macOS metadata file that should be in `.gitignore` — committing it pollutes the repo history for all collaborators.

**Operator Overloading — 8 / 10**
- All required operators correct
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 8 / 10**
- Hand and Deck use STL exclusively; Hand canonical form correct

- **Game owns raw `Player*` pointers — copy constructor does not copy them, leaving a copied Game with uninitialized pointers** (−2)

  This is the same issue as the Clean Code deduction: raw owning pointers require an explicit deep-copy or `= delete` on copy operations, otherwise copying the Game creates a dangling-pointer time bomb. The standard fix is to use `unique_ptr` (which auto-deletes and prevents accidental copies) or to write a proper deep-copy constructor.

**Inheritance — 10 / 10**
- `IPlayer` abstract base with 6 pure virtual methods; `Player` implements all; `HumanPlayer`, `AISimple`, `AIBasic`, `AICheat` all override `getAction()` correctly
- Polymorphic dispatch used throughout — full marks

**Game Value Bonus — +10**
- The game is a custom created on blackjack and turn based gambling. It's a good idea and I want to encourage you to add your flavors and immagination to things. Good.
- I like the idea of creating a cheated bot that you'll never win again, or only if you're brave.
- The overall mode of easy, smart and cheat is a good thing to add.
- I would say although that the game looks is quite modest, No screen refresh, but still some good ascii art for the card, it's very readable.
