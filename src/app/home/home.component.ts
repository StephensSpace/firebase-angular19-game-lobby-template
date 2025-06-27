/**
 * This is your Home component where users can start a lobby.
 * As mentioned in the README: design is minimal (no CSS here) and focused solely on functionality.
 * 
 * You will likely want to personalize this component.
 * It has one method that creates a new lobby via the Firebase service and
 * navigates the user to the unique lobby instance (based on your `app.routes.ts` configuration).
 */

import { Component } from '@angular/core';
import { FirebaseService } from '../services/FirebaseService/Firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(
    private firestore: FirebaseService,
    private router: Router
  ) { }

  /**
     * This starts the Lobby by calling the FirebaseService.
     * It creates a new Lobby instance and routes the user directly to it
     * using the returned unique lobby ID.
     * Its bound to the button click event in the Template, you might 
     * wanna costumize this depending on how your Home Component handles
     * Lobby creation.
     */
  startLobby() {
    this.firestore.createLobby().then((lobbyId: string) => {
      this.router.navigate([
        'lobby', // NOTE: If you change 'lobby' here, update the path in your routes too
        lobbyId
      ]);
    });
  }
}
