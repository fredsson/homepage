import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './layout/nav/nav.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ContentComponent } from './layout/content/content.component';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app-routing.module';



@NgModule({
  declarations: [AppComponent, NavComponent, FooterComponent, ContentComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
