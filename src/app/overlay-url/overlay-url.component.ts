/**
 * This Overlay Component is as described in the readme, completly optional and just my way to 
 * show the Link of the Lobby to share with other Users. You can also just display this 
 * in your Lobby Component if prefered.
 * Actual State shows the Componenz only for Player1 (Lobby creator).
 * 
 * 'Input: gameID' from Lobby component to create the Url in the HTML Template
 * 
 * NOTE:
 * - This component includes an unused `@Output() close` EventEmitter prepared for closing 
 *   the overlay. It's not yet used in the Lobby component. You can safely remove it 
 *   or use what is preset.
 * - If you use this HTML Template make sure to change the preset to your own Domain.
 */

import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-overlay-url',
  imports: [],
  templateUrl: './overlay-url.component.html',
  styleUrl: './overlay-url.component.scss'
})
export class OverlayUrlComponent {
  @Output() close = new EventEmitter<void>();
  @Input() gameId!: string;

  /**
 * Emits the close event when the user triggers a closing action (e.g. a close button).
 * This allows the parent component to react and hide the overlay if wired up.
 */
  closeOverlay() {
    this.close.emit();
  }

}