# Project Report — cardgame-doris

| | |
|---|---|
| **Members** | Doris |
| **Submission** | On time |
| **Final Score** | 75 / 100 |

---

## Overall

Simple war-style card game, solo project. Clean code overall — correct canonical form with initializer list, all three Card operators implemented correctly (including operator== comparing both suit and rank), and a nice do-while replay loop. The main technical issues: no README anywhere in the repository (−8 pts on §1.3), Deck::draw() returns a silent default Card on empty instead of throwing, and the compilation failure from directly accessing Hand's private _cards member without an accessor or friend declaration (I had to fix it to compile). Inheritance not used.

---

## Sections

**Subject Requirements — 21 / 30**
- **No README at all** (−8)

  The README is where you explain the game rules, how to build and run the program, your student ID, and your contribution — without it, a grader (or any user) has no starting point. This is a large automatic deduction for a missing required deliverable.

- **Deck::draw() returns silent default Card on empty instead of throwing** (−1)

  Returning a default `Card(Hearts, Two)` when the deck is empty silently corrupts the game state — the caller has no way to know it got a fake card. A `throw std::out_of_range("deck is empty")` makes the error loud and catchable.

  ```cpp
  // project/Deck.cpp:24-27
  Card Deck::draw() {
      if (_cards.empty())
          return Card(Card::Suit::Hearts, Card::Rank::Two);  // silent fake card
  ```

- All three Card operators correct, Hand canonical form complete, end condition correct

**Clean Code — 36 / 40**
- **run() handles too many responsibilities inline — needs _playOneRound() helper** (−1)

  `run()` currently owns the welcome banner, do-while loop, deck reset, hand assignment, dealing, printing both hands, and the replay prompt — extracting a `_playOneRound()` helper would make each piece independently readable and testable.

  ```cpp
  // project/Game.cpp:7-33 — all of this in one function
  void Game::run() {
      // welcome banner, do-while loop, deck reset, addCard x2, print hands, replay prompt
      do { _deck.reset(); _playerHand = Hand(); ... _playerHand.addCard(_deck.draw()); ...
      printResult(); ... } while (again == 'y' || again == 'Y');
  ```

- **Deck constructor both builds deck AND shuffles — two responsibilities** (−0.5)

  A constructor should set up the object in a defined state; shuffling is a separate operation. If you call `reset()` later to rebuild the deck, `reset()` also calls `shuffle()` — so you always get a shuffled deck even when you might want an ordered one, and the coupling makes both functions harder to reason about.

  ```cpp
  // project/Deck.cpp:6-15 — constructor builds AND shuffles
  Deck::Deck() {
      for (int s = 0; s < 4; ++s) { ... _cards.emplace_back(...); }
      shuffle();  // separate concern mixed into construction
  }
  ```

- **printResult() accesses Hand::_cards directly (breaks encapsulation)** (−0.5)

  `_cards` is a private member of `Hand`; `Game` reaching into it directly ties these two classes together tightly — if `Hand`'s internal storage ever changes, `Game` breaks too. The correct fix is a `getCard(int)` or `front()` accessor on `Hand`.

  ```cpp
  // project/Game.cpp:37-38 — accessing private member directly
  Card pCard = _playerHand._cards.front();   // _cards is private in Hand
  Card cCard = _computerHand._cards.front();
  ```

- **getValue() redundant if-chains for face cards** (−0.5)

  The `Rank` enum already assigns consecutive integer values (`Jack=11, Queen=12, King=13, Ace=14`), so `static_cast<int>(_rank)` alone gives the correct number — the if-chains for Jack, Queen, King, and Ace are just repeating what the enum already encodes.

  ```cpp
  // project/Card.cpp:9-20
  int Card::getValue() const {
      if (_rank == Rank::Jack)  return 11;   // enum value is already 11
      if (_rank == Rank::Queen) return 12;   // enum value is already 12
      if (_rank == Rank::King)  return 13;   // enum value is already 13
      if (_rank == Rank::Ace)   return 14;   // enum value is already 14
      return static_cast<int>(_rank);        // this alone would suffice for all
  ```

- **time(nullptr) seed risk** (−0.5)

  `static std::mt19937 rng(time(nullptr))` uses second-granularity time as a seed — two programs started within the same second get the same shuffle sequence, which is a predictability risk. `std::random_device{}()` gives a hardware-entropy seed and is the modern idiom.

  ```cpp
  // project/Deck.cpp:20
  static std::mt19937 rng(time(nullptr));  // same seed if constructed within 1 second
  ```

**Operator Overloading — 8 / 10**
- operator==, <, > all correct
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; Hand canonical form complete with initializer list

**Inheritance — 0 / 10**
- Not used. Even a simple design would qualify — for example, a `CardGame` base class with a virtual `run()` that `WarGame` overrides, or a `SpecialCard` subclass of `Card` with different behavior.

**Game Value — 0 / 10**
- Very honest war game. Clean exit handling.
- No screen refresh or added UI.
