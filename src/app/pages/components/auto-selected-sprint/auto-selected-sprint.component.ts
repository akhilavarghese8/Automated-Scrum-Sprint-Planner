import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StoryItem } from 'src/app/models/story';
import { DataserviceService } from 'src/app/services/dataservice.service';

@Component({
  selector: 'app-auto-selected-sprint',
  templateUrl: './auto-selected-sprint.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./auto-selected-sprint.component.scss'],
})
export class AutoSelectedSprintComponent {
  autoSelectedSprintList: StoryItem[] = []; // Store the selected sprint items

  constructor(private dataServ: DataserviceService) {}

  ngOnInit(): void {
    this.getData();
  }

  // Fetch the sprint list from the service
  getData(): void {
    this.autoSelectedSprintList = this.dataServ.fetchAllSprints();
  }
}
