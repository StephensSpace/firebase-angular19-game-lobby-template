import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-urloverlay',
  imports: [],
  templateUrl: './urloverlay.component.html',
  styleUrl: './urloverlay.component.scss'
})
export class OverlayUrlComponent {
  @Output() close = new EventEmitter<void>();
  @Input() gameId!: string;

  closeOverlay(){
    this.close.emit();
  }
}
