import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GitHubActivityComponent } from './github-widget/github-activity.component';

@NgModule({
  declarations: [HomeComponent, GitHubActivityComponent],
  imports: [SharedModule]
})
export class HomeModule {
}