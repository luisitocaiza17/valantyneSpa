import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {

  primeraSeccion:boolean;
  segundaSeccion:boolean;
  terceraSeccion:boolean;
  constructor() {
    this.primeraSeccion=true;
    this.segundaSeccion=false;
    this.terceraSeccion=false;
  }

  ngOnInit() {
  }

    activarPrimeraSeccion(){
        this.primeraSeccion=true;
        this.segundaSeccion=false;
        this.terceraSeccion=false;
    }
    activarSegundaSeccion(){
        this.primeraSeccion=false;
        this.segundaSeccion=true;
        this.terceraSeccion=false;
    }
    activarTerceraSeccion(){
        this.primeraSeccion=false;
        this.segundaSeccion=false;
        this.terceraSeccion=true;
    }
}
