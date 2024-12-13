import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataserviceService } from 'src/app/services/dataservice.service';
import { StoryItem } from 'src/app/models/story'; // Add this import
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-story-form',
  templateUrl: './add-story-form.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  styleUrls: ['./add-story-form.component.scss'],
})
export class AddStoryFormComponent {
  submitted = false;

  constructor(
    public _dataserv: DataserviceService,
    private _snackBar: MatSnackBar
  ) {}

   // Form group definition for the story form
  storyForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    point: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  /**
   * Handles form submission. Validates inputs, creates a story item, and adds it via the service.
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.storyForm.valid) {
      const newStory: StoryItem = {
        id: this._dataserv.generateUUID(),
        title: this.storyForm.value.title!,
        point: Number(this.storyForm.value.point!),
        addedOn: new Date(),
        updatedOn: new Date(),
        sprintId: '',
      };

      // Call the service to add the story
      const success = this._dataserv.createStoryItem(newStory);

      if (success) {
        this.storyForm.reset();
        this.submitted = false;
        this._snackBar.open('Story added successfully!', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar'],
        });
      } else {
        // Show error message if adding failed (duplicate found)
        this._snackBar.open(
          'Story name must be unique. Duplicate story names are not allowed.',
          'Close',
          {
            duration: 3000,
            panelClass: ['error-snackbar'],
          }
        );
      }
    }
  }
}
