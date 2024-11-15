import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';

interface Score {
  you: number;
  bot: number
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, MatLabel, MatHint, MatInput, MatFormField, MatButton, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogTitle],
  templateUrl: './score-popup.component.html',
})
export class ScorePopupComponent {
  readonly dialogRef = inject(MatDialogRef<ScorePopupComponent>);
  readonly data = inject<Score>(MAT_DIALOG_DATA);
  readonly userWon = this.data.you > this.data.bot;
}
