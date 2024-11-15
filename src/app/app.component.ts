import {Component, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Playground} from './playground/playground.component';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Playground, FormsModule, MatLabel, MatHint, MatInput, MatFormField, MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild(Playground) playgroundComponent!: Playground;

  gameActive: boolean = false;
  intervalTime: number = 100;

  startClick() {
    this.gameActive = true;
    this.playgroundComponent.start();
  }

  stopClick() {
    this.gameActive = false;
    this.playgroundComponent.reset();
  }

  pauseClick() {
    this.gameActive = false;
    this.playgroundComponent.pause();
  }
}
