/**
 * The Player Object represents a single user in your Lobby/Game.
 * It will be created as a subcollection within a Game document when a Lobby is started.
 * You might want to costumize here and add more Userdata needed in your application.
 * 
 * Each player slot gets initialized with default values. 
 * These can later be updated by user actions (e.g. selecting a name or color).
 * 
 * NOTE:
 * - In the current state of the template, the 'color' field is unused.
 *   You can safely remove it if you don't plan to use player colors.
 * - 'ready' becomes true when the player clicks their Ready button.
 * - 'inLobby' is a helper flag to mark if the player has actually joined.
 *    Used to check if Slot is occupied.
 * - 'id' is the number of the player in the Lobby, starting from 0.
 *   It is generated automatically in a for-loop according to maxPlayers.
 * - 'name' defaults to "Player" and should be updated by user input.
 * - Extend this object if you need more Player metadata (avatar, ping, host flag etc.).
 */
export class Player {
  id: string = '';              
  name: string = 'Player';
  color: string = 'red';        // Currently unused — remove if unnecessary
  score: number = 0;
  inLobby: boolean = false;     
  ready: boolean = false;       

  constructor(init?: Partial<Player>) {
    Object.assign(this, init);
  }

  /**
   * Converts the current Player instance into a plain JSON-serializable object.
   * Used to store player data in Firestore or transmit it via HTTP.
   * 
   * @returns A plain object representing the Player instance.
   */
  toJson() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      score: this.score,
      inLobby: this.inLobby,
      ready: this.ready
    };
  }
}