import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule}   from '@angular/forms';
import {AppComponent}  from './app.component';

import {HttpModule}    from '@angular/http';

import {HeroDetailComponent} from "./heroes/hero-detail.component";

import {HealthCheckComponent} from './healthCheck/health-check.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        HeroDetailComponent,
        HealthCheckComponent
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}