import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ContentComponent } from './layout/content/content.component';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeModule } from './features/home/home.module';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent, ContentComponent],
  imports: [
    BrowserModule,
    HttpClientModule,

    SharedModule,

    CoreModule,

    HomeModule,

    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
