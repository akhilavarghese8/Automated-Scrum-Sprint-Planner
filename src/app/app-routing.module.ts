import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'storylist-and-points',
    loadComponent: () =>
      import(
        './pages/components/storylist-and-points/storylist-and-points/storylist-and-points.component'
      ).then((c) => c.StorylistAndPointsComponent),
  },
  {
    path: 'add-story',
    loadComponent: () =>
      import('./pages/components/add-story-form/add-story-form.component').then(
        (c) => c.AddStoryFormComponent
      ),
  },
  {
    path: 'auto-selected-sprint',
    loadComponent: () =>
      import(
        './pages/components/auto-selected-sprint/auto-selected-sprint.component'
      ).then((c) => c.AutoSelectedSprintComponent),
  },
  {
    path: 'sprint-calculator',
    loadComponent: () =>
      import('./pages/components/sprint-calculator/sprint-calculator/sprint-calculator.component').then(
        (c) => c.SprintCalculatorComponent
      ),
  },


  { path: '', redirectTo: '/add-story', pathMatch: 'full' }, // Default redirect
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
