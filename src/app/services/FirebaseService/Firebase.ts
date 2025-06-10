import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc } from '@angular/fire/firestore';
import { onSnapshot } from 'firebase/firestore';
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
  ) {}
/**
 * This Methode creates a new Instance of the Game Object class and .
 * 
 * Important note: In Angular 19+, it's recommended **not** to initialize Firebase here.
 * The setup and initialization should instead happen in `app.config.ts`.
 */
  async createLobby(): Promise<string> {
    const newGame = new Game(); // Instanz mit Standardwerten
    const docRef = await addDoc(collection(this.firestore, 'Games'), newGame.toJson()); // 'Games' is the Firestore collection name – you can replace it with any name you'd like for your game lobbies.
    return docRef.id;
  }

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
}