import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {

  FormsModule,
  ReactiveFormsModule,

} from '@angular/forms';
import { StoryItem } from 'src/app/models/story';
import { DataserviceService } from 'src/app/services/dataservice.service';
@Component({
  selector: 'app-sprint-calculator',
  templateUrl: './sprint-calculator.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./sprint-calculator.component.scss'],
})
export class SprintCalculatorComponent {
  sprintPoints: number = 0; // The input for sprint points
  storyList: StoryItem[] = []; // List of all stories
  sprintList: StoryItem[] = [];

  constructor(private dataService: DataserviceService) {}

  ngOnInit(): void {
    // Initialize story list and sprint list from the data service
    this.storyList = this.dataService.fetchAllStories();
    this.sprintList = this.dataService.fetchAllSprints();
  }

  generateSprint(): void {
    if (this.sprintPoints > 0) {
      this.dataService.generateSprintsForTargetPoints(this.sprintPoints); // Call the service
      this.sprintList = [...this.dataService.fetchAllSprints()]; // Fetch updated sprints
    } else {
      alert('Please enter valid sprint points.');
    }
  }

  // Method to clear all stories
  clearStories(): void {
    this.dataService.clearAllStories(); // Call the service method to clear stories
    this.storyList = this.dataService.fetchAllStories(); // Update the story list after clearing
    this.sprintList = []; // Clear the sprint list
  }

  // Method to clear the selected stories for the sprint
  clearSelectedStories(): void {
    this.dataService.clearAllSprints(); // Call the service method to clear selected stories in the sprint
    this.sprintList = []; // Clear the sprint list
  }
}
