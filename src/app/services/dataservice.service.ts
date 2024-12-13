import { Injectable, signal } from '@angular/core';
import { STORY_ITEM_KEY, SPRINT_KEY, StoryItem } from 'src/app/models/story';
/**
 * DataService handles user story and sprint management, including
 * storage and retrieval from local storage.
 */
@Injectable({
  providedIn: 'root',
})
export class DataserviceService {
  storyItems = signal<StoryItem[]>([]);    // Signal to track story items
  sprintItems = signal<StoryItem[]>([]);   // Signal to track sprint items

  constructor() {
    this.loadStoredData(); // Initialize data when service is created
  }

   /**
   * Loads story and sprint data from local storage into signals.
   */
  loadStoredData(): void {
    const storedStoryData = JSON.parse(
      localStorage.getItem(STORY_ITEM_KEY) || '[]'
    );
    const storedSprintData = JSON.parse(
      localStorage.getItem(SPRINT_KEY) || '[]'
    );
    this.storyItems.set(storedStoryData);
    this.sprintItems.set(storedSprintData);
  }

  /**
   * Fetches all stories currently stored.
   * @returns Array of story items.
   */
  fetchAllStories(): StoryItem[] {
    return this.storyItems();
  }


  /**
   * Fetches all sprints currently stored.
   * @returns Array of sprint items.
   */
  fetchAllSprints(): StoryItem[] {
    return this.sprintItems();
  }


   /**
   * Adds a new story item to the collection if it does not already exist.
   * @param newStory - The story to add.
   * @returns `true` if the story was added successfully, `false` if it is a duplicate.
   */
  createStoryItem(newStory: StoryItem): boolean {
    if (this.checkIfStoryExists(newStory.title)) {
      return false; // Return false if the story is a duplicate
    }

    this.storyItems.update((existingStories) => {
      const updatedList = [
        ...existingStories,
        {
          ...newStory,
          id: this.generateUUID(),
          updatedOn: new Date(),
          addedOn: new Date(),
        },
      ];
      localStorage.setItem(STORY_ITEM_KEY, JSON.stringify(updatedList));
      return updatedList;
    });

    return true; // Return true if the story was added successfully
  }

   /**
   * Generates a unique identifier for a story item.
   * @returns A UUID string.
   */

  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const randomValue = (Math.random() * 16) | 0;
        const value = c === 'x' ? randomValue : (randomValue & 0x3) | 0x8;
        return value.toString(16);
      }
    );
  }

    /**
   * Checks if a story with the given title already exists.
   * @param storyTitle - The title of the story to check.
   * @returns `true` if the story exists, `false` otherwise.
   */
  checkIfStoryExists(storyTitle: string): boolean {
    const normalizedTitle = storyTitle.trim().toLowerCase();
    return this.storyItems().some(
      (story) => story.title.trim().toLowerCase() === normalizedTitle
    );
  }

   /**
   * Groups stories into sprints based on the target points provided.
   * @param targetPoints - The maximum points for a sprint.
   */
  generateSprintsForTargetPoints(targetPoints: number): void {
    const allStories = this.storyItems();

    // Validate if any story can fit the target points
    if (allStories.every((story) => story.point > targetPoints)) {
      this.sprintItems.set([]);
      localStorage.removeItem(SPRINT_KEY);
      return;
    }

    const groupedStories = this.groupStoriesIntoSprints(
      allStories,
      targetPoints
    );

    if (groupedStories.length > 0) {
      // Save only the first sprint (as per requirement)
      this.sprintItems.set(groupedStories[0]);
      localStorage.setItem(SPRINT_KEY, JSON.stringify(groupedStories[0]));
    } else {
      this.sprintItems.set([]);
      localStorage.removeItem(SPRINT_KEY);
    }
  }

   /**
   * Groups stories into multiple sprints using a greedy algorithm.
   * @param userStories - Array of story items.
   * @param maxSprintPoints - Maximum points allowed in a sprint.
   * @returns An array of grouped sprints.
   */
  groupStoriesIntoSprints(
    userStories: StoryItem[],
    maxSprintPoints: number
  ): StoryItem[][] {
    const sprints: StoryItem[][] = [];
    let remainingStories = [...userStories];

    while (remainingStories.length > 0) {
      const selectedStories = this.selectStoriesForSprint(
        remainingStories,
        maxSprintPoints
      );

      // Stop if no stories can be selected for the current sprint
      if (selectedStories.length === 0) {
        break;
      }

      sprints.push(selectedStories);

      // Remove selected stories from the remaining list
      remainingStories = remainingStories.filter(
        (story) => !selectedStories.includes(story)
      );
    }

    return sprints;
  }

    /**
   * Selects stories for a single sprint using the knapsack algorithm.
   * @param userStories - Array of story items.
   * @param maxPoints - Maximum points for the sprint.
   * @returns Array of selected stories.
   */
  selectStoriesForSprint(
    userStories: StoryItem[],
    maxPoints: number
  ): StoryItem[] {
    if (
      maxPoints <= 0 ||
      userStories.every((story) => story.point > maxPoints)
    ) {
      return []; // No stories can fit
    }

    const n = userStories.length;
    const dp = Array.from({ length: n + 1 }, () =>
      Array(maxPoints + 1).fill(0)
    );
    const keep = Array.from({ length: n + 1 }, () =>
      Array(maxPoints + 1).fill(0)
    );

    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= maxPoints; w++) {
        if (userStories[i - 1].point <= w) {
          const include =
            userStories[i - 1].point + dp[i - 1][w - userStories[i - 1].point];
          const exclude = dp[i - 1][w];

          if (include > exclude) {
            dp[i][w] = include;
            keep[i][w] = 1;
          } else {
            dp[i][w] = exclude;
          }
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    // Backtrack to find selected stories
    let w = maxPoints;
    const selectedStories: StoryItem[] = [];
    for (let i = n; i > 0; i--) {
      if (keep[i][w] === 1) {
        selectedStories.push(userStories[i - 1]);
        w -= userStories[i - 1].point;
      }
    }

    return selectedStories;
  }

   /**
   * Clears all stories and removes them from local storage.
   */
  clearAllStories(): void {
    this.storyItems.set([]);
    this.sprintItems.set([]);
    localStorage.removeItem(STORY_ITEM_KEY);
    localStorage.removeItem(SPRINT_KEY);
  }

    /**
   * Clears all sprints and removes them from local storage.
   */
  clearAllSprints(): void {
    this.sprintItems.set([]);
    localStorage.removeItem(SPRINT_KEY);
  }
}
