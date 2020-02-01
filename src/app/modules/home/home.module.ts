import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GithubActivityComponent } from './github-activity/github-activity.component';

@NgModule({
  declarations: [HomeComponent, GithubActivityComponent],
  imports: [
    SharedModule
  ]
})
export class HomeModule { }
