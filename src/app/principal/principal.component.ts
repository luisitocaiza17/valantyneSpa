import { Component, OnInit } from '@angular/core';
import {ConfgServices} from '../services/conf.services';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  parrafoInicial:String;
  parrafoInicialDetalle:String;
  arrayImagenRutes:Array<String>;

  constructor(configuration:ConfgServices,config: NgbCarouselConfig) {
      config.interval = 5000;
      this.arrayImagenRutes= new Array<String>();
      this.arrayImagenRutes.push('../../assets/panel-inicial.png');
      this.arrayImagenRutes = configuration.rutasCarosel();
  }

  ngOnInit() {
      this.parrafoInicial='Valantyne Spa, les da la Bienvenida.';
      this.parrafoInicialDetalle='Nuestra pasión guiar a nuestros clientes en una vida sana, que mejero su belleza fisica y su belleza interna';
  }



}
