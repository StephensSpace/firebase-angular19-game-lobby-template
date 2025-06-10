/**
 * The `Game` class defines the data model for a Firebase game object.
 * 
 * By default, it includes a sample array of four players (name, color, score),
 * which you can freely extend or customize to fit your own needs.
 * 
 * This class serves as a template for the basic game setup – for example game options,
 * flags, or player information – that can be configured in the lobby by players before 
 * the game starts and later used by the game logic.
 */
export class Game {
    players: { name: string; Color: string; score: number }[] = [];
   
    constructor() {
    const defaultPlayers = [
      { name: 'Player1', Color: 'red', score: 0 },
      { name: 'Player2', Color: 'blue', score: 0 },
      { name: 'Player3', Color: 'green', score: 0 },
      { name: 'Player4', Color: 'purple', score: 0 }
    ];
    this.players = defaultPlayers;
  }

  toJson() {
    return {
      players: this.players
    };
  }
}
