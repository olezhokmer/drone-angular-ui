import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from '../app.service';

@Component({
  selector: 'app-save-solution',
  templateUrl: './save-solution.component.html',
  styleUrls: ['./save-solution.component.css']
})
export class SaveSolutionComponent {
  constructor(
    private appService: AppService,
    public dialogRef: MatDialogRef<SaveSolutionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  saveSolutionForm: FormGroup = new FormGroup({
    name: new FormControl(''),
  });
  saveSolutionFormSubmit() : void {

  }

  onClose(): void {
    this.dialogRef.close();
  }
}
