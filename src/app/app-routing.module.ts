import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentComponent } from './layout/content/content.component';
import { HomeComponent } from './modules/home/home.component';


const routes: Routes = [
  {path: "", component: ContentComponent, children: [{path: "", component: HomeComponent }] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
