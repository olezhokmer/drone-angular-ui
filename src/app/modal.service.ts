import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SaveSolutionComponent } from './save-solution/save-solution.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(public dialog: MatDialog) {}

  openSaveSolutionModal(): void {
    this.dialog.open(SaveSolutionComponent);
  }
}
