# Project Report — cardgame-tom-log-maple-leo

| | |
|---|---|
| **Members** | Tom · Leo · Log · Maple |
| **Submission** | On time |
| **Final Score** | 65 / 100 |

---

## Overall

Golden Flower (Zha Jin Hua) card game with a complete hand-ranking system (SPECIAL_235, three-of-a-kind, straight flush, flush, straight, pair, single), fold/raise/open betting mechanics, and a 10-round game loop. run() is exemplary. The main technical gaps: Hand interface completely diverges from the skeleton (no addCard, size, isEmpty), no canonical form, all Card operators and operator<< missing, no README, and rand() without srand() gives the same shuffle every run.

---

## Sections

**Subject Requirements — 16 / 30**
- **Card: no enum class Suit/Rank (plain int), operator==/</>/<< all missing** (−1)

  Using plain `int` for suit and rank means you can pass `Card(42, -1)` and the compiler won't complain — `enum class` restricts valid values and makes the code self-documenting. Without the comparison operators, callers can't write `if (a < b)` and must manually compare raw integers at every call site.

  ```cpp
  class Card { int rank; int suit; ... };  // Card.hh:9 — plain int; magic: 0=H,1=D,2=C,3=S
  // no operator==, <, >, or <<
  ```

- **Deck: no draw()/reset()/isEmpty()/size() — has deal(int n) instead** (−2)

  The required interface specifies one-at-a-time `draw()` with guard methods; `deal(int n)` that returns a whole vector in one call is a fundamentally different design that breaks any code expecting the standard interface. Without `isEmpty()` and `size()`, callers can't safely check whether cards remain before drawing.

  ```cpp
  std::vector<Card> deal(int numCards);  // Deck.hh:15 — bulk deal replaces draw()/isEmpty()/size()
  ```

- **Hand: entirely different interface — addCard/size/isEmpty all absent; no canonical form** (−3)

  The Hand class was rebuilt around a constructor that takes a pre-built vector of cards — this is incompatible with the skeleton's add-one-card model and means none of the required interface methods (`addCard`, `size`, `isEmpty`) exist. Without canonical form (copy constructor, copy-assignment, destructor), the class cannot be safely copied.

  ```cpp
  Hand(const std::vector<Card>& cards);  // Hand.hh:11 — whole-vector ctor; no addCard/size/isEmpty
  ```

- Game + run(): run() present and unmodified main.cpp ✓
- End condition: isGameOverEarly() + 10-round limit + printFinalResult() ✓

- **No README anywhere** (−8 in §1.3)

  The README is where student IDs, the game description, and per-member contributions are documented — without it, 8 of the 10 repository marks cannot be awarded.

**Clean Code — 33.5 / 40**
- run() (~10 lines) exemplary; setupModeAndPlayers, isGameOverEarly, printFinalResult all focused

- **playRound() (~78 lines) — dealHands/collectAnte/handlePlayerAction should be extracted** (−2.5)

  A 78-line function that deals cards, collects the ante, runs the full fold/raise/open betting loop with input validation, and settles the round is doing too many things — any change to one phase risks breaking another. Extracting `dealHands()`, `collectAnte()`, and `handlePlayerAction()` would each give you a function you can read and reason about in isolation.

  ```cpp
  void Game::playRound(int round) {  // Game.cpp:52 — deals, antes, betting loop, all 78 lines inline
      deck.shuffle(); player1.setHand(deck.deal(3)); ...
  ```

- Hand canonical form absent (−3 in §2.2, being gentle)

- **No enum class for Suit/Rank** (−1 in §2.3)

  With plain integers, creating a card looks like `Card(3, 1)` — you have to look up a comment or convention to know what 3 and 1 mean. `enum class Rank` and `enum class Suit` make every call site self-explanatory and prevent accidental swapping of suit and rank arguments.

  ```cpp
  Card(int r, int s);  // Card.hh:13 — plain int args; caller must know 0=H,1=D,2=C,3=S by convention
  ```

- README absence not double-counted in §2.4

**Operator Overloading — 0 / 10**
- **operator==, <, > all absent from Card**

  Without these, every card comparison in the game logic must directly compare raw integer fields — the comparison semantics are invisible at the call site and must be re-implemented wherever needed.

  ```cpp
  // Card.hh — no operator== / < / > declared
  // Hand.cpp uses: compareTo() returning -1/0/1 instead of operator< / operator>
  ```

- **operator<< absent for Card and Hand; only toString() used**

  `toString()` produces a string that the caller must then print; `operator<<` writes directly to the stream and composes naturally with the rest of the standard library output.

  ```cpp
  std::string toString() const;  // Card.hh:17 — only toString(); no operator<<
  ```

- No bonus overloads

**Heap / Dynamic Memory — 10 / 10**
- STL-only; canonical form penalized in §2.2 only (no double-count)

**Inheritance — 0 / 10**
- Not used. The game has two Player objects with identical state (points, name, hand) — a `Player` base class could have generalised this, and a virtual `makeDecision()` method would allow AI vs human player variants without duplicating Player logic.

**Game Value — 5.5 / 10**
- `cls` Windows command used without platform check — prints "sh: cls: command not found" on macOS repeatedly. `system("cls")` is Windows-only; on macOS/Linux it fails with an error message every time it runs. Guard it with `#ifdef _WIN32` / `#else system("clear")` to make it cross-platform.
- Screen refresh attempted and ASCII art with horizontal hand display — nice effort
- Game is playable nicely
