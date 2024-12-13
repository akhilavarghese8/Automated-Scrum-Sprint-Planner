import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataserviceService } from 'src/app/services/dataservice.service';
import { StoryItem } from 'src/app/models/story';

@Component({
  standalone: true,
  selector: 'app-storylist-and-points',
  templateUrl: './storylist-and-points.component.html',

  imports: [CommonModule],
  styleUrls: ['./storylist-and-points.component.scss'],
})
export class StorylistAndPointsComponent implements OnInit {
  stories: StoryItem[] = [];

  constructor(private _dataserv: DataserviceService) {}

  ngOnInit(): void {
    this.stories = this._dataserv.fetchAllStories();
  }
}
