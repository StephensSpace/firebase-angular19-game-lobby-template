/**
 * This service uses Angular Firestore to fetch and save data from Firestore.
 * 
 * Key points:
 * - `collectionData` and `docData` return Observable streams that auto-update
 *   whenever the data changes in Firestore. This keeps the UI always in sync.
 * - Some methods are `async` and fetch data just once (Promise-based).
 *   Useful when you don’t need live updates, just a single load.
 * - Other methods return Observables to provide real-time data streams.
 * 
 * Angular Fire Zones:
 * - Firestore calls should run inside Angular Zones to avoid warnings.
 *   These warnings are annoying but don’t break functionality.
 *   This topic is well documented and manageable with AngularFire.
 */
 
import { Injectable } from '@angular/core';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { Game } from '../../models/game';
import { Player } from '../../models/player';
import { GameWithPlayers } from '../../models/GameWithPlayers';
import { Observable, map } from 'rxjs';
/**
 * The FirebaseService provides the two basic methods needed by the Home and Lobby components.
 * 
 * Important note: In Angular 16+, it's recommended **not** to initialize Firebase here.
 * The setup and initialization should instead happen in `app.config.ts`.
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(
    private firestore: Firestore
  ) { }
  /**
   * Creates a new instance of the Game object and adds it to the Firestore 'Games' collection.
   * 
   * Firebase will automatically generate a unique ID for the new document using addDoc(...).
   * This ID is returned and can be used to subscribe to the game or update its data later.
   * 
   * Player subcollections are then created in a loop using the maxPlayers value defined in 
   * the Game class.
   * Each player gets a fixed ID and a default name ('Player1' to 'PlayerX'), which are saved to 
   * Firebase.
   * 
   * Note: If the collection name 'Games' is changed, it must also be updated
   * in the subscribeToGame() and updateGameDataField() method.
   * 
   * @returns The ID of the newly created game document in the Firestore collection.
   *          This ID appears in your URL.
   */
  async createLobby(): Promise<string> {
    const newGame = new Game();
    const docRef = await addDoc(collection(this.firestore, 'Games'), newGame.toJson());
    for (let i = 0; i < newGame.maxPlayers; i++) {
      const player = new Player({
        id: i.toString(),
        name: `Player${i + 1}`,
      });
      await setDoc(doc(this.firestore, 'Games', docRef.id, 'Players', player.id), player.toJson());
    }
    return docRef.id;
  }

  /**
 * Returns an Observable for the current game's Firestore document,
 * used in the Game Lobby component to get real-time updates.
 * 
 * @param gameId - The ID of the Firestore game document to observe.
 * @returns An Observable emitting the Game object with its players.
 */
  getGameObservable(gameId: string) {
    const gameDocRef = doc(this.firestore, 'Games', gameId);
    return docData(gameDocRef, { idField: 'id' }) as Observable<GameWithPlayers>;
  }

  /**
 * This method takes two snapshots from the Firestore backend:
 * one of the Game document and one of its Players subcollection.
 * 
 * The Game snapshot is used to retrieve the `maxPlayers` value defined in the Game class.
 * The Players snapshot loads the current Player data. If no changes have been made by users yet,
 * it will contain the default Players set by `createLobby()`.
 * 
 * @param gameId The ID of the Firestore Game document to load Players from.
 * @returns An array containing the Players for the Lobby. Each index corresponds to a Player slot.
 *          If no Player is set for a given slot, the value will be `null`.
 */
  async loadPlayers(gameId: string): Promise<(Player | null)[]> {
    const snapshot = await getDocs(collection(this.firestore, 'Games', gameId, 'Players'));
    const gameDocSnap = await getDoc(doc(this.firestore, 'Games', gameId));
    const game = gameDocSnap.data() as Game;
    const playersFromDb = snapshot.docs.map(doc => doc.data() as Player);
    const playersArray: (Player | null)[] = [];
    for (let i = 0; i < game.maxPlayers; i++) {
      playersArray[i] = playersFromDb.find(p => p.id === i.toString()) || null;
    }
    console.log(playersArray)
    return playersArray;
  }

  /**
 * Returns an Observable stream of players for a given game,
 * based on the game ID and the maximum number of players.
 * 
 * This method fetches the 'Players' collection inside the 
 * 'Games/{gameId}' Firestore document, then maps the raw data 
 * into a fixed-length array (maxPlayers), filling empty spots 
 * with null.
 * 
 * The Observable always emits an array with the exact length of maxPlayers,
 * ensuring consistent player slot access by index, even if some slots are empty.
 * 
 * For instance, if maxPlayers is 4, the emitted array will always have 4 entries,
 * where missing players are represented by null.
 * 
 * @param gameId - The ID of the game to load players from Firestore
 * @param maxPlayers - The maximum number of players in the game (array length)
 * @returns An Observable that emits an array of Player objects or null 
 *          for empty slots, updating whenever the player data changes in Firestore
 */
  getPlayersObservable(gameId: string, maxPlayers: number): Observable<(Player | null)[]> {
    const playersRef = collection(this.firestore, 'Games', gameId, 'Players');
    return collectionData(playersRef, { idField: 'id' }).pipe(
      map((players: any[]) => {
        const playersArray: (Player | null)[] = [];
        for (let i = 0; i < maxPlayers; i++) {
          playersArray[i] = players.find(p => p.id === i.toString()) || null;
        }
        return playersArray;
      })
    );
  }

  /**
   * Fetches the game document to retrieve the configured maximum number of players
   * set in Game Class.
   * 
   * @param gameId The unique ID of the game lobby.
   * @returns The 'maxPlayers' value from the game data if available, otherwise 0.
   */
  async getMaxPlayers(gameId: string): Promise<number> {
    const gameDocRef = doc(this.firestore, 'Games', gameId);
    const gameSnap = await getDoc(gameDocRef);
    if (gameSnap.exists()) {
      const gameData = gameSnap.data() as Game;
      return gameData.maxPlayers;
    }
    return 0;
  }

  /**
 * Updates a single field in the game document inside the Firestore database.
 * 
 * Takes a game ID, the name of the field, and the new value you want to write.
 * The update is sent directly to Firestore and all connected clients will
 * automatically get the changes.
 * 
 * NOTE: Adjust the collection name ('Games') if you've used a different one.
 * 
 * @param gameId The unique ID of the game in the 'Games' collection.
 * @param fieldPath The name of the field you want to update.
 * @param value The new value to write to that field.
 * 
 * @returns A Promise that resolves once the update is successful.
 */
  updateGameDataField(gameId: string, fieldPath: string, value: any) {
    const gameDoc = doc(this.firestore, 'Games', gameId);
    return updateDoc(gameDoc, { [fieldPath]: value });
  }

  /**
 * Updates specific fields of a player inside a game document in Firestore.
 * 
 * Works just like `updateGameDataField`, but instead of updating the game itself,
 * this targets one specific player by ID. You can pass only the fields you want to change.
 * 
 * Useful if you just want to change the name, ready status, or other parts of a player
 * without touching the rest.
 * 
 * @param gameId The ID of the game the player belongs to.
 * @param playerId The ID of the player you want to update.
 * @param updatedFields An object with the fields you want to change.
 * 
 * @returns A Promise that resolves when the update is done.
 */
  updatePlayerData(gameId: string, playerId: string, updatedFields: Partial<Player>) {
    const playerDocRef = doc(this.firestore, 'Games', gameId, 'Players', playerId);
    return updateDoc(playerDocRef, updatedFields);
  }
}

