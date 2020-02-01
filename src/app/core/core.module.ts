import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubService } from '../data/github/github.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
  ],
  providers: [
    GithubService
  ]
})
export class CoreModule { }
