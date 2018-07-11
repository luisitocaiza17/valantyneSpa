import { Component, OnInit } from '@angular/core';
import {NgbDatepickerConfig, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {FireBaseProcessServices} from '../services/FireBaseProcess.services';
import { Observable } from 'rxjs';
import {Reservas} from '../model/Reservas.model';
import {horarios} from '../model/Horarios.model';
import swal from 'sweetalert2';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {

    primeraSeccion: boolean;
    segundaSeccion: boolean;
    terceraSeccion: boolean;
    fechaActual: Date;
    fechaFormateada: String;
    modelDate: NgbDateStruct;
    horariosList: Array<horarios>;
    objetosHorarios: Array<any>;
    horario: horarios;
    reservasR: Reservas;
    seccionFecha: boolean;
    seccionHora: boolean;
    //preprosesamiento de cita
    correoElectronico:string;
    numeroConvencional:string;
    numeroCelular:string;
    cita:Reservas;

  constructor(config: NgbDatepickerConfig, private firebaseDB:FireBaseProcessServices) {
      this.primeraSeccion=true;
      this.segundaSeccion=false;
      this.terceraSeccion=false;
      this.fechaActual= new Date();
      this.fechaFormateada=""+this.fechaActual.getDate()+"/"+(this.fechaActual.getMonth()+1)+"/"+this.fechaActual.getFullYear();
      //creamos la fecha para datepicker por defecto
      this.modelDate = {year: this.fechaActual.getFullYear(), month: this.fechaActual.getMonth() + 1, day: this.fechaActual.getDate()};
      // customize default values of datepickers used by this component tree
      config.minDate = {year: 2018, month: 7, day: 1};
      config.maxDate = {year: 2099, month: 12, day: 31};
      // days that don't belong to current month are not visible
      config.outsideDays = 'hidden';
      // weekends are disabled
      config.markDisabled = (date: NgbDateStruct) => {
          const d = new Date(date.year, date.month - 1, date.day);
          return d.getDay() === 0;
      };
      this.horariosList= new Array<horarios>();
      this.objetosHorarios= new Array<any>();
      this.reservasR = new Reservas();
      this.horario= new horarios();
      this.seccionFecha=true;
      this.seccionHora=false;
      this.correoElectronico=this.firebaseDB.getUser().currentUser.email;
      this.cita= new Reservas();
  }

  ngOnInit() {
      //this.seleccionFecha();
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
    seleccionFecha(){
        this.seccionHora=true;
        this.fechaFormateada=""+this.modelDate.day+"/"+(this.modelDate.month)+"/"+this.modelDate.year;
        this.fechaActual= new Date(this.modelDate.year,this.modelDate.month-1,this.modelDate.day);
        let diaSemana=this.fechaActual.getDay();
        this.horariosList=[];
        this.firebaseDB.getHorario(diaSemana).subscribe(data => {
            this.objetosHorarios=data;
            for(let o of this.objetosHorarios){
                this.horario = new horarios();
                this.horario.nombre=o.nombre;
                //horario.dia=o.dia;
                let fechaInicio = new Date();
                fechaInicio.setTime(o.hora_inicio.seconds*1000);
                let fechaFin= new Date();
                fechaFin.setTime(o.hora_fin.seconds*1000);
                this.horario.hora_inicio=fechaInicio;
                this.horario.hora_fin=fechaFin;
                this.horariosList.push(this.horario);
            }

            if(this.horariosList.length>0) {
                this.horariosList.sort(function (o1, o2) {
                    let a = new Date(o1.hora_inicio);
                    let b = new Date(o2.hora_inicio);
                    return a > b ? 1 : a < b ? -1 : 0;
                });
            }
            console.log(this.horariosList);
        });
    }

    confirmarFechas(){
        var newArray=this.horariosList.filter( confirmados => confirmados.seleccionado==true);
        let confirmacion=false;
        for(let o of newArray){
            confirmacion = true;
        }
        if(confirmacion){
            swal({
                title: 'Horarios Escogidos?',
                text: "Esta segur@ de confirmar los horarios seleccionados?",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sipiri!'
            }).then((result) => {
                if (result.value) {
                    swal(
                        'Perfecto!',
                        'Sigamos al último paso',
                        'success'
                    )
                    this.seccionFecha=false;
                }
            })
        }else{
            swal({
                title: 'Seleccione un Horario!',
                text: 'Para continuar necesita seleccionar una Fecha y un Horario!!',
                type: 'error',
                confirmButtonText: 'Seleccionar fecha y hora...'
            });
        }
    }
    regresarFecha(){
        this.seccionFecha=true;
    }

    RealizarReserva(){
        if(this.correoElectronico===''||this.numeroCelular===''||this.numeroConvencional===''){
            swal({
                title: 'Obligatorios!',
                text: 'El correo electrónico, número de celular y el número de teléfono convecional son obligatorios!!',
                type: 'error',
                confirmButtonText: 'Ok vamos a llenar...'
            });
        }else{
            //lleno el objeto
            this.cita = new Reservas();
            this.cita.correo_confirmacion=this.correoElectronico;
            this.cita.celular_confirmacion= this.numeroCelular;
            this.cita.telf_confirmacion = this.numeroConvencional;
            this.cita.fecha=this.fechaActual;
            this.cita.horarios_inicios='';
            this.cita.horarios_fin='';
            for(let horario of this.horariosList){
                this.cita.horarios_inicios+=horario.hora_inicio+";";
                this.cita.horarios_fin+=horario.hora_fin+";";
            }
            //llenamos con el id de usuario;
            this.cita.usuario_id=this.firebaseDB.getUser().currentUser.uid;
            //llamamos al servicio para el almacenamiento;
            let respuesta=this.firebaseDB.guardarReserva(this.cita);
            let este=this;
            respuesta.then(function(res) {
                swal({
                    title: 'Felicidades Cita Realizada!',
                    text: 'Tu cita a sido agendada con éxito, nosotros nos estaremos comunicando contigo para confirmarla' +
                    ', o puedes comunicarte con nosotros al 0983852965 ',
                    type: 'success',
                    confirmButtonText: ' Que bacan!!...'
                });
                console.log("Document written with ID: ", res.id);
                este.primeraSeccion=false;
                este.segundaSeccion=true;
                este.terceraSeccion=false;
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
                swal({
                    title: 'Error!',
                    text: 'Tuvimos un error con el sistema:'+error.toString(),
                    type: 'error',
                    confirmButtonText: ' Esta bien...'
                });
            });
        }

    }

}
