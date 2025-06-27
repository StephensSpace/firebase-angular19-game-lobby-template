/**
 * The LobbyComponent manages the central game lobby, including player display,
 * name selection, ready status, and overall game state. Each user has their own
 * instance of this component, with a personal name input and a ready button.
 * You can easily extend this area with additional customizable options for players
 * or main application options.
 * These values should be stored either in the `Game` or `Player` class,
 * or you may introduce new fields as needed.
 *
 * The structure of this component is intentionally kept simple and flexible:
 * - The HTML template includes no predefined CSS styles, allowing full design
 *   freedom to fit your project. (Only a simple green checkmark is included
 *   to indicate when a player is marked as ready.)
 *
 * NOTE:
 * - This component uses two key observables: `players$` (player list) and `game$` 
 *   (game state including metadata). These are initialized later via the Firebase service 
 *   and remain automatically synchronized.
 * - The constructor injects `FirebaseService`, `Router`, and `ActivatedRoute` 
 *   to handle data loading and to extract the game ID from the route.
 * - You might want to check the HTML template to adjust e.g. who is allowed 
 *   to click "Start", as this is currently handled in the DOM logic.
 * 
 * NOTE ON START BUTTON:
 * - The current startGame() method simply toggles a boolean and serves as a template.
 *   It does NOT trigger the actual game start or stop logic.
 *   You will want to replace or extend this method to implement your own start behavior.
 */

import { Component } from '@angular/core';
import { FirebaseService } from '../services/FirebaseService/Firebase';
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayUrlComponent } from '../overlay-url/overlay-url.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player } from '../models/player';
import { Observable, take } from 'rxjs';
import { GameWithPlayers } from '../models/GameWithPlayers';

@Component({
  selector: 'app-lobby',
  imports: [OverlayUrlComponent, CommonModule, FormsModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss'
})
export class LobbyComponent {
  players$!: Observable<Array<Player | null>>;
  game$!: Observable<GameWithPlayers>;
  currentPlayerIndex = -1;
  overlayVisible = false;
  ID = '';
  localNames: { [index: number]: string } = {};
  gameStart: boolean = false;

  constructor(
    private firestore: FirebaseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  /**
   * Initializes the component after Angular loads it.
   * Retrieves the game ID from the URL, loads game and player data,
   * and assigns the local player role.
   * The observables 'game$' and 'players$' are initialized here.
   * 
   * It uses some helper methods to, e.g., get the maxPlayers as a number 
   * for further use.
   * 
   * Initializes the 'localNames' array through the 
   * initializeLocalNames(players: (Player | null)[]) method.
   * 
   * Runs 'assignPlayerRole(gameId)' to set 'currentPlayerIndex' through a loop,
   * locking your spot in the lobby after the promise is fulfilled (.then).
   * 
   * NOTE:
   *   - Remove the console.log if needed. It might help you identify whether your 
   *     observables fetch correctly from Firebase when the lobby gets started
   *     (debugging).
   *   - At the moment, the overlay used to show the Lobby URL (share) is set
   *     to only be visible for player 1 (if (this.currentPlayerIndex === 0)).
   *     You can change this behavior here if you want the overlay visible to others.
   * 
   * @returns A Promise that resolves when all initialization logic is complete.
   */
  async ngOnInit(): Promise<void> {
    const gameId = this.route.snapshot.paramMap.get('id');
    if (!gameId) {
      this.router.navigate(['/']);
      return;
    }
    this.ID = gameId;
    const maxPlayers = await this.firestore.getMaxPlayers(gameId);
    this.players$ = this.firestore.getPlayersObservable(this.ID, maxPlayers);
    this.players$.subscribe(players => {
      this.initializeLocalNames(players);
    });
    this.game$ = this.firestore.getGameObservable(this.ID)
    this.assignPlayerRole(gameId).then(() => {
      if (this.currentPlayerIndex === 0) {  //NOTE: change here if you want Overlay to be visible for others.
        this.toggleOverlay();
        console.log(this.players$, this.game$);
      }
    });
  }

  /**
 * Initializes the localNames array with player names if not already set.
 * If a player name is missing, assigns a default name like "Player1", "Player2", etc.
 * @param players Array of Player objects or nulls.
 */
  initializeLocalNames(players: (Player | null)[]) {
    players.forEach((p, i) => {
      if (p && typeof this.localNames[i] === 'undefined') {
        this.localNames[i] = p.name || `Player${i + 1}`;
      }
    });
  }

/**
 * Assigns the current user to the first available player slot in the lobby.
 *
 * This method fetches the array of players from Firestore using `loadPlayers()`,
 * then loops through the array to find the first player object that:
 * - exists
 * - is not yet marked as `inLobby`
 *
 * Once such a slot is found:
 * - `currentPlayerIndex` is set
 * - the player's `name` and `inLobby` status are updated in Firestore
 * - the method returns early
 *
 * If no available player slot is found:
 * - a warning is logged to the console
 * - the user is redirected to the home page (`/`)
 *
 * @param gameId - Unique lobby ID retrieved from the route on initialization.
 * @returns A Promise that resolves when player assignment or redirection is complete.
 */
  async assignPlayerRole(gameId: string) {
  const playersArray = await this.firestore.loadPlayers(gameId);
  for (let i = 0; i < playersArray.length; i++) {
    const player = playersArray[i];
    if (player && !player.inLobby) {
      player.inLobby = true;
      this.currentPlayerIndex = i;
      const name = `Player${i + 1}`;
      player.name = name;
      await this.firestore.updatePlayerData(gameId, player.id, {
        inLobby: true,
        name,
      });
      return;
    }
  }
  console.warn('No free Player Slots available');
  this.router.navigate(['/']);  
}

  /**
 * Handles a name change from the user's input by updating the player's name in Firestore.
 * @param name The new name entered by the user.
 * @param index The index of the player in the array.
 * @param playerId The Firestore ID of the player.
 */
  onNameChange(name: string, index: number, playerId: string) {
    if (!playerId) return;
    this.firestore.updatePlayerData(this.ID, playerId, { name });
  }

  /**
 * Saves the name from localNames array to Firestore for a given player.
 * @param i Index of the player in the localNames array.
 * @param playerId Optional Firestore ID of the player.
 */
  saveName(i: number, playerId?: string) {
    const name = this.localNames[i];
    if (name && playerId) {
      this.firestore.updatePlayerData(this.ID, playerId, { name });
    }
  }

  /**
 * Toggles the 'ready' status of a player and updates Firestore.
 * After the update Promise is fulfilled, `checkAllReady()` is called 
 * to verify if all players are ready.
 * @param player Player object or null.
 */
  toggleReady(player: Player | null) {
    if (!player) return;
    const newReadyState = !player.ready;
    this.firestore.updatePlayerData(this.ID, player.id, { ready: newReadyState }).then(() => this.checkAllReady());
  }

  /**
 * Toggles the overlay visibility state.
 */
  toggleOverlay() {
    this.overlayVisible = !this.overlayVisible;
  }

/**
 * checkAllReady performs a one-time snapshot of the current players stream
 * using the `take(1)` operator — meaning it listens only once and then
 * unsubscribes automatically (a momentary state capture).
 * 
 * The method filters all entries from `players$` to collect only valid players
 * (`isPlayer(p)`) who are currently marked as `inLobby`, since only these are 
 * relevant for the readiness evaluation.
 * 
 * This method is triggered every time a player changes their `ready` status.
 * That’s why it makes sense to always re-evaluate the entire lobby:
 * 
 * - If at least one player is not ready, the loop breaks early and `allReady` 
 *   becomes false.
 * - If all players in the lobby are ready, `allReady` remains true.
 * 
 * The result is then pushed to the Firestore `Game` document under the 
 * `allPlayersReady` field, so other clients can react accordingly to the global
 * lobby state.
 */
  checkAllReady() {
    this.players$.pipe(take(1)).subscribe(players => {
      const lobbyPlayers: Player[] = players.filter(
        (p): p is Player => this.isPlayer(p) && p.inLobby
      );
      let allReady = false;
      if (lobbyPlayers.length > 0) {
        allReady = true;
        for (const p of lobbyPlayers) {
          if (!p.ready) {
            allReady = false;
            break;
          }
        }
      }
      this.firestore.updateGameDataField(this.ID, 'allPlayersReady', allReady);
    });
  }

  /**
 * Checks whether the given object is a valid Player (not null or undefined).
 * @param p Player or null.
 * @returns true if p is a Player, false otherwise.
 */
  isPlayer(p: Player | null): p is Player {
    return p !== null && p !== undefined;
  }

  /**
 * Toggles the game start flag when Player1 presses Start.
 */
  startGame() {
    this.gameStart = !this.gameStart;
  }
}