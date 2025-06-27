/**
 * Extended Game object including an array of Player objects (or empty slots).
 * 
 * Used for combined Lobby state (Game metadata + assigned players).
 * 
 * NOTE:
 * - `players` is an array with a fixed length based on maxPlayers.
 * - Empty slots are represented as `null` until a player joins.
 */
import { Game } from "./game";
import { Player } from "./player";

export interface GameWithPlayers extends Game {
  players: (Player | null)[];
}