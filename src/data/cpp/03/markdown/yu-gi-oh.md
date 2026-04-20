# Project Report — yu-gi-oh

|                 |                                |
| --------------- | ------------------------------ |
| **Members**     | Arthur · Daniel · Brown · Noah |
| **Submission**  | ⏰ Late (~14 hours)            |
| **Final Score** | 94 / 100                       |

---

## Overall

The game is extra. I know you added a lot of value in it. It's pretty, it's fun, it's ambitious. It has its small flaws, but they're very well balanced by its huge strengths — the shop, the graphics, the choices you can make. It's the most ambitious and original project I've seen.

I expect great things from you all in the individual project.

---

## Sections

**Subject Requirements — 28 / 30**

- Card, Deck, Hand, End condition all correct
- README full marks — rules, per-member breakdown

- **`Game` implemented as a namespace instead of a class; `run()` is a free function; `main.cpp` modified** (−2)

  The rubric requires `Game` to be a class with a `run()` method, and `main.cpp` to only create a `Game` and call `run()`. A namespace can't hold state or be instantiated, so it can't satisfy OOP requirements; and modifying `main.cpp` means your public API is wrong.

  ```cpp
  namespace Game { void run(vector<Player*>& players, Deck& gameDeck, Shop& shop); }  // Game.hh:16-19
  // main.cpp allocates players with new, no delete — leaked at exit
  ```

**Clean Code — 28 / 40**

- `Logic.cpp`, `Player.cpp`, `Item.cpp`, `Shop.cpp` all show well-decomposed, focused methods

- **`Game::run()` is ~645 lines — input handling, AI routing, game-state mutation, and rendering all inline; three near-identical AI/human scenario branches duplicate hundreds of lines** (−8)

  When three scenarios (AI vs human, AI vs AI, human vs AI) each inline the same card-play logic, a bug fix must be made in three places. Extract a `playCard(Player*, int)` helper and dispatch once.

  ```cpp
  // situation 1: AI vs human — Game.cpp:131, inlines ~80 lines of card/challenge logic
  // situation 2: AI vs AI — Game.cpp:281, same logic repeated
  // situation 3: human vs AI — Game.cpp:~450, same logic a third time
  ```

- **Debug prints left in production: `cout << "test 1"`, `cout << "init shop"`, `cout << "Item be deleted"`** (−2)

  Debug output mixed into game output confuses the player and shows the code wasn't cleaned up before submission. These must be removed before shipping.

  ```cpp
  cout <<"test 1"<<endl;  // Game.cpp:173 — inside challenge resolution branch
  cout << "init shop" << endl;  // Shop.cpp:26 — printed every time the shop initializes
  ```

- **`using namespace std` in four headers** (−1)

  Putting `using namespace std` in a header forces every file that includes it to also import the entire standard namespace, which can cause name collisions that are hard to debug. Use `std::` explicitly in headers.

  ```cpp
  using namespace std;  // Game.hh:14, Logic.hh:10, Shop.hh:7, Player.hh:11 — pollutes all includers
  ```

- **Mixed `#ifndef` / `#pragma once` guard styles** (−0.5)

  Mixing two different include-guard mechanisms in the same project is inconsistent and signals no shared style convention. Pick one and apply it everywhere.

- **`#define` macros for ANSI colors instead of `constexpr`** (−0.5)

  `#define` has no type, no scope, and no namespace — it can silently replace any token with that name anywhere in the file. `constexpr std::string_view` gives the same zero-cost result with type safety and scope.

  ```cpp
  #define RESET "\033[0m"  // Card.cpp:25 — no type, no scope, replaces the word RESET everywhere
  ```

**Operator Overloading — 5 / 10**

- `operator==` correct (checks both suit and rank)

- **`operator<` and `operator>` absent from Card** (−4)

  Without comparison operators on `Card`, you can't sort a hand, find the highest card with `std::max_element`, or use cards in sorted containers — fundamental operations for any card game. They were required by the rubric and not implemented.

  ```cpp
  // Card.hh — operator< and operator> are not declared anywhere
  bool Card::operator==(const Card& other) const { ... }  // Card.cpp:13 — only equality is present
  ```

- Bonus: `Item::operator==` and `Item::operator<<` — meaningful additions (+1)

**Heap / Dynamic Memory — 5 / 10**

- `Player` correctly pairs `new Hand()` with `delete hand` in destructor
- `Shop` correctly deletes Item pointers in destructor

- **`main.cpp` allocates four `Player*` with `new` and never `delete`s them — memory leak** (−2)

  Every `new` needs a matching `delete`; without it the memory (and the Hand objects inside each Player) is never freed. Use a `std::unique_ptr` or delete manually before exit.

  ```cpp
  players.push_back(new HumanPlayer("player1"));  // main.cpp:8 — never deleted
  players.push_back(new AIPlayer("player2"));      // main.cpp:9 — never deleted
  ```

- **`Player` copy constructor shallow-copies `Hand*` — double-free hazard** (−2)

  When two objects share the same raw pointer, both destructors call `delete` on the same address — this is undefined behavior (a crash or heap corruption). The copy constructor must allocate a fresh `Hand` and copy the contents into it.

  ```cpp
  Player::Player(const Player& other) : ... hand(other.hand) ...  // Player.cpp:18 — copies the pointer, not the Hand
  Player::~Player() { delete hand; }  // Player.cpp:43 — both copies delete the same address
  ```

- **No `nullptr` after `delete` in `~Player()`** (−1)

  After `delete hand`, the pointer still holds the old address — if any code accidentally dereferences it again, the result is undefined behavior. Setting it to `nullptr` immediately makes a double-use detectable.

  ```cpp
  Player::~Player() { delete hand; }  // Player.cpp:43 — hand still points to freed memory after this line
  ```

**Inheritance — 8 / 10**

- Two strong hierarchies: `Player → HumanPlayer / AIPlayer` and `Item → Magnifier / CylinderSpin / Handcuffs / Whiskey / SleepingPill`
- `override` used correctly throughout
- `vector<Player*>` used throughout — no object slicing

- **`Player::~Player()` not declared `virtual` — deleting through `Player*` is undefined behavior** (−2)

  When you `delete` a `HumanPlayer` through a `Player*`, C++ only calls `Player::~Player()` — the derived class's destructor is silently skipped, leaving any resources the subclass owns leaked or corrupted. Adding `virtual` to the base destructor fixes this.

  ```cpp
  ~Player();  // Player.hh:83 — non-virtual; deleting via Player* won't call HumanPlayer/AIPlayer destructors
  ```

**Game Value Bonus — +20**

- Pretty, fun, ambitious
- The shop, ASCII art, ANSI colors, and game choices make this genuinely impressive
