/**
 * Set up your routes as needed, startLobby() from homeComponent needs a path like
 * 'lobby/:id' in the example, make sure to change this in the HomeComponent Method too.
 */

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LobbyComponent } from './lobby/lobby.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, //Landingpage
  { path: 'lobby/:id', component: LobbyComponent }, 
  // NOTE: If you change the Path here make sure to also change in startLobby()@HomeComponent
];