import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { PrincipalComponent } from './principal/principal.component';
import {RouterModule, Routes} from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ConfgServices} from './services/conf.services';
import { ReservasComponent } from './reservas/reservas.component';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../environments/environment';
import { LoginComponent } from './login/login.component';
import {FireBaseProcessServices} from './services/FireBaseProcess.services';
import {MyGuard} from './services/GuardRutas.services';
// modulo principal

/**Todo: configuracion de rutas**/
const APP_ROUTES: Routes = [
    { path: '', component: PrincipalComponent, pathMatch: 'full' },
    { path: 'principal', component: PrincipalComponent },
    { path: 'reservas', component: ReservasComponent },
    { path: 'login', component: LoginComponent }
];
const Routing = RouterModule.forRoot(APP_ROUTES);

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    ReservasComponent,
    LoginComponent
  ],
  imports: [
      BrowserModule,
      Routing,//instancia para referenciar las rutas
      BrowserModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      NgbModule.forRoot(),// bootstrap ngb
      // para firebase
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireDatabaseModule ,
      AngularFireAuthModule,
  ],
  providers: [
      HttpClient,
      ConfgServices,
      FireBaseProcessServices,
      MyGuard
  ],
  bootstrap: [AppComponent] //npm install bootstrap  -- en angular-cli.json "../node_modules/bootstrap/dist/css/bootstrap.min.css",
})
export class AppModule { }
