import { Component, OnInit } from '@angular/core';
import {NgbDatepickerConfig, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {FireBaseProcessServices} from '../services/FireBaseProcess.services';
import { Observable } from 'rxjs';
import {Reservas} from '../model/Reservas.model';
import {horarios} from '../model/Horarios.model';
import swal from 'sweetalert2';
import {Utils} from '../configuration/Utils';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {

    primeraSeccion: boolean;
    segundaSeccion: boolean;
    terceraSeccion: boolean;
    fechaGlobal:Date;
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
    listaCitas: Array<Reservas>;
    procesoGuardado:boolean;
    listaErrores:String;
    listaCitasRealizadas:Array<Reservas>;
    util:Utils;
    //id de Cita Generada
    idCitaGenerada="";

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
      this.listaCitas= new Array<Reservas>();
      this.procesoGuardado=false;
      this.listaErrores='';
      this.listaCitasRealizadas = new Array<Reservas>();
      this.fechaGlobal= new Date();
      this.idCitaGenerada="";
  }

  ngOnInit() {
      //this.seleccionFecha();
      this.modelDate = {year: this.fechaActual.getFullYear(), month: this.fechaActual.getMonth() + 1, day: this.fechaActual.getDate()};
      this.util= new Utils();
  }

    activarPrimeraSeccion(){
        this.idCitaGenerada="";//si es guardado o reagendacion luego del proceso enceramos
        for(let horario of this.horariosList) {
            horario.seleccionado=false;
        }
        this.primeraSeccion=true;
        this.segundaSeccion=false;
        this.terceraSeccion=false;
    }
    activarSegundaSeccion(){
        this.primeraSeccion=false;
        this.segundaSeccion=true;
        this.terceraSeccion=false;
        this.TraerReservas();
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
                this.horario.turno=o.turno;
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
        //hacemos una verificacion, si es actualizacion solo podemos seleccionar una fecha
        if(this.idCitaGenerada!=undefined && this.idCitaGenerada!=""){
            let ArraySeleccionado=this.horariosList.filter( confirmados => confirmados.seleccionado==true);
            if(ArraySeleccionado.length>1){
                swal({
                    title: 'Seleccione solo un Horario!',
                    text: 'En le reagendación de horarios solo puede cambiar un horario a la vez!',
                    type: 'error',
                    confirmButtonText: 'rayos!! voy a seleccionar solo uno...'
                });
                return false;
            }
        }

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
        if(this.correoElectronico===''||this.numeroCelular===''){
            swal({
                title: 'Obligatorios!',
                text: 'El correo electrónico, número de celular y el número de teléfono convecional son obligatorios!!',
                type: 'error',
                confirmButtonText: 'Ok vamos a llenar...'
            });
        }else{
            //lleno el objeto
             this.listaCitas=[];
             let idUsuario=this.firebaseDB.getUser().currentUser.uid;
            for(let horario of this.horariosList){
                if(horario.seleccionado==true) {
                    this.cita = new Reservas();
                    if(this.idCitaGenerada!=undefined&&this.idCitaGenerada!="") {
                        this.cita.id = this.idCitaGenerada;
                    }else{
                        this.cita.id = this.util.uuid();
                    }
                    this.cita.correo_confirmacion = this.correoElectronico;
                    this.cita.celular_confirmacion = this.numeroCelular;
                    this.cita.telf_confirmacion = this.numeroConvencional;
                    this.cita.fecha = this.fechaActual;
                    this.cita.horarios_inicios = horario.hora_inicio;
                    this.cita.horarios_fin = horario.hora_fin;
                    this.cita.turno = horario.turno;
                    this.cita.usuario_id = idUsuario;
                    this.listaCitas.push(this.cita);
                }
            }
            //llamamos al servicio para el almacenamiento;
            this.procesoGuardado=true;
            for(let citaR of this.listaCitas){
                //esto entra solo en la actualizacon
                if(this.idCitaGenerada!=undefined&&this.idCitaGenerada!=""){
                    var data = JSON.parse(JSON.stringify(citaR));
                    var lt = this.firebaseDB.updateReserva(citaR);
                    lt.then(querySnapshot => {
                        querySnapshot.forEach((doc) => {

                            console.log('doc:');
                            console.log(doc);
                            doc.ref.update(data).then(() => {
                                swal({
                                    title: 'Felicidades Cita Reagendada!',
                                    text: 'Tu cita a sido Reagendada con éxito, nosotros nos estaremos comunicando contigo para confirmarla' +
                                    ', o puedes comunicarte con nosotros al 0983852965 ',
                                    type: 'success',
                                    confirmButtonText: ' Que bacan!!...'
                                });
                                this.primeraSeccion=false;
                                this.segundaSeccion=true;
                                this.terceraSeccion=false;
                                this.seccionFecha=true;
                                this.seccionHora=false;
                                this.numeroCelular='';
                                this.numeroConvencional='';
                                this.fechaActual=new Date();
                                this.horariosList=[];
                            }).catch(function (error) {
                                console.error("Error update document: ", error);
                            });
                        });
                    }).catch(function (error) {
                        swal({
                            title: 'Error!',
                            text: 'Tuvimos un error con el sistema:'+error,
                            type: 'error',
                            confirmButtonText: ' Esta bien...'
                        });
                    });
                    return false;
                }

                let respuesta=this.firebaseDB.guardarReserva(citaR);
                let este=this;
                respuesta.then(function(res) {
                    console.log("Document written with ID: ", res.id);
                })
                .catch(function(error) {
                    este.procesoGuardado=false;
                    este.listaErrores+=error+'\n';
                });
            }
            this.idCitaGenerada="";//si es guardado o reagendacion luego del proceso enceramos
            if(this.procesoGuardado){
                this.TraerReservas();
                swal({
                    title: 'Felicidades Cita Realizada!',
                    text: 'Tu cita a sido agendada con éxito, nosotros nos estaremos comunicando contigo para confirmarla' +
                    ', o puedes comunicarte con nosotros al 0983852965 ',
                    type: 'success',
                    confirmButtonText: ' Que bacan!!...'
                });
                this.primeraSeccion=false;
                this.segundaSeccion=true;
                this.terceraSeccion=false;
                this.seccionFecha=true;
                this.seccionHora=false;
                this.numeroCelular='';
                this.numeroConvencional='';
                this.fechaActual=new Date();
                this.horariosList=[];
            }else{
                console.error("Error adding document: ", this.listaErrores);
                swal({
                    title: 'Error!',
                    text: 'Tuvimos un error con el sistema:'+this.listaErrores,
                    type: 'error',
                    confirmButtonText: ' Esta bien...'
                });
            }
        }
    }

    TraerReservas(){
        this.listaCitasRealizadas=[];
        let idUsuario=this.firebaseDB.getUser().currentUser.uid;
        this.firebaseDB.getReservas(idUsuario.toString()).subscribe(data => {
            this.listaCitasRealizadas = data;
            for (let color of this.listaCitasRealizadas){
                color.fecha=new Date(color.fecha);
                color.horarios_inicios= new Date(color.horarios_inicios);
                color.horarios_fin= new Date(color.horarios_fin);
            }
            //ordenamos por hora
            this.listaCitasRealizadas.sort(function(o1,o2){
                if (o1.horarios_inicios<o2.horarios_inicios)    return -1;
                else if(o1.horarios_inicios>o2.horarios_inicios) return  1;
                else                      return  0;
            });
            //ordenamos por fecha
            this.listaCitasRealizadas.sort(function(o1,o2){
                if (o1.fecha>o2.fecha)    return -1;
                else if(o1.fecha<o2.fecha) return  1;
                else                      return  0;
            });

            console.log(this.listaCitasRealizadas);

        })
    }
    //modificar las citas
    ModificarCita(reservas:Reservas){
        this.activarPrimeraSeccion();
        let fecha =  new Date(reservas.fecha);
        this.reiniciarFecha(fecha);
        this.seleccionFechaReasignacion(reservas);
        this.numeroConvencional=reservas.telf_confirmacion;
        this.numeroCelular=reservas.celular_confirmacion;
        this.idCitaGenerada=reservas.id;
    }
    //reiniciar apartir de fechas preagendadas
    reiniciarFecha(fecha?:Date){
        if(fecha===undefined|| fecha === null)
            this.fechaActual= new Date();
        else
            this.fechaActual= fecha;
        this.fechaFormateada=""+this.fechaActual.getDate()+"/"+(this.fechaActual.getMonth()+1)+"/"+this.fechaActual.getFullYear();
        //creamos la fecha para datepicker por defecto
        this.modelDate = {year: this.fechaActual.getFullYear(), month: this.fechaActual.getMonth() + 1, day: this.fechaActual.getDate()};
        this.horariosList= [];
        this.objetosHorarios= [];
        this.reservasR = new Reservas();
        this.horario= new horarios();
        this.seccionFecha=true;
        this.seccionHora=false;
        this.correoElectronico=this.firebaseDB.getUser().currentUser.email;
        this.cita= new Reservas();
        this.listaCitas= new Array<Reservas>();
        this.procesoGuardado=false;
        this.listaErrores='';
        this.listaCitasRealizadas = new Array<Reservas>();
        this.fechaGlobal= new Date();
    }
    //seleccion de horarios preasignados
    seleccionFechaReasignacion(reservas:Reservas){
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
                this.horario.turno=o.turno;
                //seleccioamos los horarios ya escogidos
                if(reservas.turno===this.horario.turno){
                    this.horario.seleccionado=true;
                }
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
    //eliminar citas
    eliminarCita(reservas:Reservas) {
        var lt = this.firebaseDB.deleteReserva(reservas);
        debugger;

        console.log('borrando');
        lt.then(querySnapshot => {
            querySnapshot.forEach((doc) => {

                console.log('doc:');
                console.log(doc);
                doc.ref.delete().then(() => {
                    swal({
                        title: 'Cita Eliminada!',
                        text: 'Tu cita a sido eliminada con éxito',
                        type: 'success',
                        confirmButtonText: ' De acuerdo!!...'
                    });
                }).catch(function (error) {
                    swal({
                        title: 'Error!',
                        text: 'Tuvimos un error con el sistema:'+error,
                        type: 'error',
                        confirmButtonText: ' Esta bien...'
                    });
                });
            });
        }).catch(function (error) {
            swal({
                title: 'Error!',
                text: 'Tuvimos un error con el sistema:'+error,
                type: 'error',
                confirmButtonText: ' Esta bien...'
            });
        });
    }


}
