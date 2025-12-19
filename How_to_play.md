# How to play — Darts Score Keeper

This short guide explains the darts rules used in the app and how to use the interface.

## Goal
Reduce your starting score (301 or 501) to exactly 0. A set consists of several legs; the player who wins the majority of legs wins the set (for example, 3 legs in best-of-5).

## Setup
1. Open the app and fill the Setup form.
2. Enter two player names.
3. Choose game type (`301` or `501`).
4. Choose set size (best-of 1, 3, 5, etc.).
5. Click **Start Game**.

## Playing a Turn
- Players take turns. Each turn represents up to three darts — enter the total points scored in that turn.
- The app subtracts the turn total from the player's remaining score.
- If a turn causes the remaining score to go below zero, that turn is a **bust**: the player's score reverts to the pre-turn value and play continues with the next player.
- If a player's remaining score becomes exactly `0`, they win the leg.

> Note: Traditional darts require finishing on a double (or bull). This application does not enforce finishing-on-double rules by default — follow the rule manually if you want stricter play.

## Legs & Sets
- When someone reaches 0 the leg ends: the winner's legs-won counter is incremented and leg scores reset for the next leg.
- The first player to reach the majority of legs (based on set size) wins the set. The app announces the set winner and stops scoring.

## Interface Features
- **Record Turns:** Use the score buttons (or custom input) to record the current player's turn; the app advances automatically.
- **Turn History:** Shows every turn with Turn #, Player, Points, Remaining score, and status (bust/win/ok).
- **Edit / Delete Turns:** Editing or deleting a turn triggers a full recalculation of scores for the leg.
- **Progress Display:** Legs won and progress bars show set progress toward victory.

## Example
- Start 301: Player A (301), Player B (301)
- Player A scores 60 → remaining 241
- Player B scores 100 → remaining 201
- Player A scores 180 → remaining 61
- If Player A then tries 100 from 61 → bust (score stays 61)

## Accessibility & Tips
- The app includes ARIA roles/labels for tables and controls to help screen readers.
- Use keyboard navigation where available in your browser.

## Persistence
- The app does not persist data across refreshes — a reload resets the current game.

## Troubleshooting
- If scores look wrong after edits, check Turn History order; the app recalculates from recorded turns.

---
_Save or print this file for a quick reference during play._
