# Project Report — cardgame-emile-carl

| | |
|---|---|
| **Members** | Emile · Carl |
| **Submission** | On time |
| **Final Score** | 85 / 100 |

---

## Overall

Simple game but I like the two-player mode, switching between players. No screen refresh, clean and ok.

---

## Sections

**Subject Requirements — 30 / 30**
- All classes correct and complete — full marks
- README full marks — full Gin Rummy rules, per-member breakdown

**Clean Code — 34.5 / 40**
- `run()` is 17 lines and delegates cleanly; most helpers are short and focused
- `calculateDeadwood()` is justified at ~47 lines given the algorithmic complexity

- **`playerTurn()` and `player2Turn()` are near-identical 28-line functions — a single `executeTurn()` helper would remove the duplication** (−3)

  The two functions differ only in which hand is active and the player-number string in the output — every bug fix or rule change has to be made twice, and the duplication is large enough that the two copies will inevitably drift.

  ```cpp
  void Game::playerTurn()  { cout << "PLAYER 1 TURN"; ... discard(playerHand, idx);  ... }  // game.cpp:236
  void Game::player2Turn() { cout << "PLAYER 2 TURN"; ... discard(player2Hand, idx); ... }  // game.cpp:267 — near-identical
  ```

- **`g_invalidCard` / `g_emptyCard` global sentinels — poor practice** (−0.5)

  Global variables introduce hidden shared state that any code can accidentally modify — and returning a sentinel `Card` on error instead of throwing an exception means callers can silently receive a bad value without knowing it.

  ```cpp
  const Card g_invalidCard;  // hand.cpp:2 — global sentinel returned on invalid index
  return g_invalidCard;      // hand.cpp:33 — caller gets a fake card instead of an exception
  ```

- **Both `#pragma once` and `#ifndef` guard in the same header — redundant** (−0.5)

  `#pragma once` and `#ifndef` guards do the same thing — using both is redundant and suggests the author wasn't sure which to use. Pick one convention and stick with it across all headers.

  ```cpp
  #pragma once     // game.hh:1
  #ifndef GAME_HH  // game.hh:3 — duplicate include guard; one of these should be removed
  #define GAME_HH
  ```

- **`program.exe` committed to repo** (−0.5)

  Windows executables are platform-specific, binary, and large — they can't be reviewed and go stale every build. Add `*.exe` to `.gitignore` so they are never tracked.

- **Unused `isPlayerTurn` member alongside `isPlayer1Turn`** (−1)

  Two nearly-identical member names for what appears to be the same concept is confusing — one is used throughout the code and the other appears never to be set or read after construction, suggesting it is a leftover from an earlier version.

  ```cpp
  bool isPlayerTurn;   // game.hh:17 — declared but never meaningfully used
  bool isPlayer1Turn;  // game.hh:21 — the actual flag used throughout run(), playerTurn(), etc.
  ```

**Operator Overloading — 8 / 10**
- All required operators correct; `operator>` delegates to `other < *this`
- No bonus overloads — 2 extra points were available here and left on the table

**Heap / Dynamic Memory — 10 / 10**
- STL-only; Hand canonical form complete with initializer list

**Inheritance — 0 / 10**
- Not used. A `Player` base class with a virtual `takeTurn()` method could have replaced the near-identical `playerTurn()` and `player2Turn()` pair — the game loop in `run()` would iterate over a list of players and call the same interface on each.

**Game Value Bonus — +2**
- Two-player local mode is a nice touch
- Clean, no screen refresh
