/**
 * Your Central Game Collection Objekt; Here you want to costumize for additional Options
 * or Metadata which you need in your Lobby/Application later on.
 * The Game Object will get Subcollections defined in 'Player' Class once the Lobby 
 * starts. They are used to fill the Lobby with empty Lobby slots (Player1-x) according to 
 * the 'maxPlayers' value.
 * 
 * 'allPlayersReady' becomes true when everyone in the Lobby clicked "Ready".
 * This is used in the Lobby component to unlock the "Start Game" button.
 * 
 * NOTE: -Changing Max Players here will change the allowed Maximum Lobby Members.
 *       -'id' is empty by default. You can bind the Firebase-generated Lobby ID here later,
 *        or remove the property if unused. 
 *       -Same Goes for 'name': bind this if you want named games, e.g. inside LobbyComponent.ngOnInit
 *        after the Game observable has been fetched.
 *       -If you add any new Game metadata/options here, make sure you handle them in your
 *        Lobby component accordingly (fetch, display, update etc.).    
 */

export class Game {
  id: string = '';
  name: string = '';
  maxPlayers: number = 8;  // NOTE: Chang Maximum Lobby member count here
  allPlayersReady: boolean = false;

  constructor(init?: Partial<Game>) {
    Object.assign(this, init);
  }
  /**
 * Converts the current Game instance into a plain JSON-serializable object.
 * Useful for storing it in Firebase or transmitting it over HTTP.
 * 
 * @returns A plain object representing the Game instance for Firebase.
 */
  toJson() {
    return {
      id: this.id,
      name: this.name,
      maxPlayers: this.maxPlayers,
      allPlayersReady: this.allPlayersReady
    };
  }
}
