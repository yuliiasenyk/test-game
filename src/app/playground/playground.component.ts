import {Component, inject, Input, OnDestroy, Output} from '@angular/core';
import { PlaygroundBoxComponent } from './playground-box/playground-box.component';
import { NgForOf } from '@angular/common';
import { BoxState } from './playground-box/box-state.enum.component';
import { interval, Subscription } from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ScorePopupComponent} from '../score-popup/score-popup.component';
import { EventEmitter } from '@angular/core';

const gridArray: number[] = Array.from({ length: 100 });

export interface PlaygroundItem {
  state: BoxState;
  index: number;
}

@Component({
  selector: 'playground',
  standalone: true,
  templateUrl: './playground.component.html',
  imports: [
    PlaygroundBoxComponent,
    NgForOf
  ],
  styleUrl: './playground.component.scss'
})
export class Playground implements OnDestroy {
  @Input() intervalTime!: number;
  @Output() endGame$: EventEmitter<any> = new EventEmitter();
  private intervalSubscription!: Subscription;
  private gameEnded = false;
  readonly dialog = inject(MatDialog);

  itemsArray: PlaygroundItem[] = gridArray.map((_, i) => ({ state: BoxState.default, index: i }));
  caughtCount = 0;
  missedCount = 0;

  itemClick(item: PlaygroundItem) {
    if (item.state === BoxState.active) {
      item.state = BoxState.caught;
      this.caughtCount++;
      if (this.caughtCount === 10) {
        this.endGame();
      }
    }
  }

  activateRandom(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }

    this.intervalSubscription = interval(this.intervalTime).pipe().subscribe(() => {
      if (this.gameEnded) {
        this.intervalSubscription.unsubscribe();
        return;
      }
      const defaultItems = this.itemsArray.filter(item => item.state === BoxState.default);
      if (defaultItems.length === 0) {
        this.intervalSubscription.unsubscribe();
        return;
      }
      if (this.caughtCount === 10 || this.missedCount === 10) {
        this.endGame();
        return;
      }
      if (this.missedCount < 10) {
        const randomIndex = Math.floor(Math.random() * defaultItems.length);
        const randomItem = defaultItems[randomIndex];
        randomItem.state = BoxState.active;
        setTimeout(() => {
          if (randomItem.state === BoxState.active) {
            randomItem.state = BoxState.missed;
            ++this.missedCount;
            if (this.missedCount === 10) {
              this.endGame();
            }
          }
        }, this.intervalTime);
      }
    });
  }

  start() {
    this.activateRandom();
  }

  pause() {
    this.intervalSubscription?.unsubscribe();
  }

  reset() {
    this.gameEnded = false;
    this.caughtCount = 0;
    this.missedCount = 0;
    this.itemsArray.forEach(item => item.state = BoxState.default);
    this.endGame$.emit(null);
    this.intervalSubscription?.unsubscribe();
  }

  endGame() {
    this.gameEnded = true;
    this.openDialog();
    this.intervalSubscription?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.reset();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ScorePopupComponent, {
      height: '300px',
      width: '500px',
      data: {you: this.caughtCount, bot: this.missedCount},
    });

    dialogRef.afterClosed().subscribe(() => {
      this.reset()
    });
  }
}
