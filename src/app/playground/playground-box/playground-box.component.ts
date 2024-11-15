import {Component, Input} from '@angular/core';
import { BoxState } from './box-state.enum.component';

@Component({
  selector: 'playground-box',
  standalone: true,
  templateUrl: './playground-box.component.html',
  styleUrl: './playground-box.component.scss'
})
export class PlaygroundBoxComponent {
  @Input() state: BoxState = BoxState.default;
}
