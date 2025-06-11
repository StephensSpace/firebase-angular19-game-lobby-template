import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc } from '@angular/fire/firestore';
import { onSnapshot, updateDoc } from 'firebase/firestore';
import { Router } from '@angular/router';
import { Game } from '../../models/game';
/**
 * The FirebaseService provides the two basic methods needed by the Home and Lobby components.
 * 
 * Important note: In Angular 19+, it's recommended **not** to initialize Firebase here.
 * The setup and initialization should instead happen in `app.config.ts`.
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(
    private firestore: Firestore,
    private router: Router,
  ) { }
  /**
   * Creates a new instance of the Game object and adds it to the Firestore 'Games' collection.
   * 
   * Firebase will automatically generate a unique ID for the new document.
   * This ID is returned and can be used to subscribe to the game or update its data later.
   * 
   * Note: If the collection name 'Games' is changed, it must also be updated
   * in the subscribeToGame() method.
   * 
   * @returns The ID of the newly created game document in the Firestore collection.
   *          This ID appears in your URL.
   */
  async createLobby(): Promise<string> {
    const newGame = new Game(); // Instanz mit Standardwerten
    const docRef = await addDoc(collection(this.firestore, 'Games'), newGame.toJson()); // 'Games' is the Firestore collection name – you can replace it with any name you'd like for your game lobbies.
    return docRef.id;
  }
  /**
   * Subscribes to the Firestore document of the specified game.
   * 
   * This method is called when the Lobby component is opened. It listens
   * to real-time updates (via onSnapshot) of the game data stored in Firestore,
   * allowing us to update, edit, or save changes to the lobby's game data.
   *
   * If the document doesn't exist, the user is redirected to the home page.
   * 
   * NOTE: 'change 'Games' if you did before.
   *
   * @param gameId - The ID of the game document to subscribe to.
   * @param callback - Function to call with the updated game data.
   * @returns A function to unsubscribe from the listener.
   */
  subscribeToGame(gameId: string, callback: (data: any) => void): () => void {
    const gameDoc = doc(this.firestore, 'Games', gameId); // 'Games' = Firestore collection name; replace as needed.
    const unsubscribe = onSnapshot(gameDoc, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        console.warn('Spiel nicht gefunden!');
        this.router.navigate(['/']);
      }
    });
    return unsubscribe;
  }

  /**
 * Aktualisiert die Spieldaten des angegebenen Spiels in der Firestore-Datenbank.
 * 
 * Diese Methode nimmt das geänderte Game-Objekt entgegen, wandelt es in ein
 * JSON-kompatibles Format um (mittels `toJson()`) und schreibt die aktualisierten
 * Werte live in die Firestore-Datenbank.
 * 
 * Dadurch werden alle verbundenen Clients (z. B. Lobby-Teilnehmer) über die
 * Änderungen informiert und können ihre Ansicht entsprechend aktualisieren.
 * 
 * NOTE: 'change 'Games' if you did before.
 * 
 * @param gameId Die eindeutige ID des Spiels in der Firestore-Collection 'Games'.
 * @param updatedGame Die aktuelle Instanz des Game-Objekts mit den neuen Werten.
 * 
 * @returns Ein Promise, das aufgelöst wird, wenn die Aktualisierung erfolgreich
 *          in der Firestore-Datenbank durchgeführt wurde.
 */
  updateGameData(gameId: string, updatedGame: Game): Promise<void> {
    const gameDoc = doc(this.firestore, 'Games', gameId); // 'Games' = Firestore collection name; replace as needed.
    return updateDoc(gameDoc, updatedGame.toJson());
  }
}

