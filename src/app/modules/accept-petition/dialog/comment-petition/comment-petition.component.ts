import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-comment-petition',
  templateUrl: './comment-petition.component.html',
  styleUrls: ['./comment-petition.component.scss'],
})
export class CommentPetitionComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<CommentPetitionComponent>) {}

  ngOnInit(): void {}

  onDismiss(): void {
    // Close dialog, return false
    this.dialogRef.close();
  }
}
