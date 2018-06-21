import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { PrincipalComponent } from './principal/principal.component';
import {RouterModule, Routes} from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// modulo principal

/**Todo: configuracion de rutas**/
const APP_ROUTES: Routes = [
    { path: '', component: PrincipalComponent, pathMatch: 'full' },
    { path: 'principal', component: PrincipalComponent }
];
const Routing = RouterModule.forRoot(APP_ROUTES);

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent
  ],
  imports: [
      BrowserModule,
      Routing,//instancia para referenciar las rutas
      BrowserModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule
  ],
  providers: [
      HttpClient
  ],
  bootstrap: [AppComponent] //npm install bootstrap  -- en angular-cli.json "../node_modules/bootstrap/dist/css/bootstrap.min.css",
})
export class AppModule { }
