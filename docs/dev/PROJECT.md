# Project Brief: Browser-Based Tetris Game

## Purpose
A classic browser-based Tetris game intended to provide an entertaining, nostalgic experience that runs in modern web browsers without plugins. 

## Intended Users
- Casual players looking for a quick browser game.
- Fans of classic puzzle games.

## Principal Scope (Included Capabilities)
- A 10x20 grid serving as the playfield.
- Standard set of 7 Tetrominoes (I, J, L, O, S, T, Z).
- Basic game mechanics: pieces falling, movement (left, right, soft drop, hard drop), and rotation.
- Collision detection with boundaries and other blocks.
- Line clearing and scoring system.
- Game Over state detection.
- Simple, classic visual style using standard HTML5 Canvas/CSS.

## Non-Goals
- Multiplayer or network features.
- Persistent high-score leaderboards (local storage only, or none initially).
- Advanced modern rules (like hold piece, ghost piece, wall kicks) unless specified. The core engine focuses on classic, basic mechanics.
- Mobile touch controls (initially focused on keyboard input).

## Consequential Constraints
- Must be implemented purely with HTML, CSS, and plain JavaScript.
- Must run in any modern standard desktop web browser without additional plugins.

## Assumptions / Open Questions
- Default game speed/gravity and score curve assumptions will be finalized during spec/design.
- The game will scale to a fixed canvas size.
