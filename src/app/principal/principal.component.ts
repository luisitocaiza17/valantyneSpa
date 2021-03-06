import { Component, OnInit } from '@angular/core';
import {ConfgServices} from '../services/conf.services';
import {NgbCarouselConfig, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FireBaseProcessServices} from '../services/FireBaseProcess.services';
import swal from "sweetalert2";
import {Router} from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

    parrafoInicial:String;
    parrafoInicialDetalle:String;
    arrayImagenRutes:Array<String>;
    esLogueo=true;
    objetoLogueo:any;
    modalReference: NgbModalRef;

    constructor(configuration:ConfgServices,config: NgbCarouselConfig,private modalService: NgbModal,private autorizacion: FireBaseProcessServices,private router:Router) {
      config.interval = 5000;
      this.arrayImagenRutes= new Array<String>();
      this.arrayImagenRutes.push('../../assets/panel-inicial.png');
      this.arrayImagenRutes = configuration.rutasCarosel();
      this.objetoLogueo = {correo: '' ,contrasenia: '',correo2: '' ,contrasenia2: '',contrasenia22: ''}
  }

    ngOnInit() {
          this.parrafoInicial='Valantyne Spa, les da la Bienvenida.';
          this.parrafoInicialDetalle='Nuestra pasión guiar a nuestros clientes en una vida sana, que mejero su belleza fisica y su belleza interna';
  }

    openLg(content) {
        this.modalReference=this.modalService.open(content, { size: 'sm' }) ;
  }

    activarSeccionRegistro(){
      this.esLogueo=false;
  }

    activarSeccionLogueo(){
  this.esLogueo=true;
}

    ingresarCorreo(){
        if(this.objetoLogueo.correo.trim() === '' && this.objetoLogueo.contrasenia.trim()===''){
            swal({
                title: 'Error!',
                text: 'El correo electrónico y la contraseña no pueden estar vacias!',
                type: 'error',
                confirmButtonText: 'intentar de nuevo!'
            });
        }
        else{
            this.autorizacion.login(this.objetoLogueo.correo.trim(),this.objetoLogueo.contrasenia.trim()).then((response)=>{
                swal({
                    title: 'Logueado!!',
                    text: 'Logueo Correcto!!',
                    type: 'success',
                    confirmButtonText: 'Bacan!!'
                })
                this.modalReference.close();
                this.router.navigate(['reservas']);
            })
            .catch((error)=>{
                let detalle=error.toString();
                if(detalle.includes("password"))
                    detalle='El usuario o contraseña no son correctos, si no los tiene por favor registrate primero.';
                swal({
                    title: 'Error!',
                    text: 'Detalle:'+detalle,
                    type: 'error',
                    confirmButtonText: 'Bacan'
                });
                return false;
            })
        }
    }

    registrarCorreo(){
      debugger;
        if(this.objetoLogueo.correo2.trim() === '' && this.objetoLogueo.contrasenia2.trim()===''&& this.objetoLogueo.contrasenia22.trim()===''){
            swal({
                title: 'Error!',
                text: 'Los campos de registro no pueden estar vacios!',
                type: 'error',
                confirmButtonText: 'intentar de nuevo!'
            });
        }else{
            debugger;
            if( this.objetoLogueo.contrasenia2.trim()!== this.objetoLogueo.contrasenia22.trim()){
                swal({
                    title: 'Error!',
                    text: 'Las contraseñas deben ser iguales!',
                    type: 'error',
                    confirmButtonText: 'rayos!'
                });
            }else{
                this.autorizacion.registro(this.objetoLogueo.correo2.trim(),this.objetoLogueo.contrasenia2.trim()).then(
                    ((response)=>{
                        swal({
                            title: 'Guardado!',
                            text: 'Usuario creado Correctamente!!',
                            type: 'success',
                            confirmButtonText: 'Bacan!!'
                        });
                        this.modalReference.close();
                        this.router.navigate(['reservas']);
                    })
                ).catch((error)=>{
                    swal({
                        title: 'Error!',
                        text: 'Detalle:'+error,
                        type: 'error',
                        confirmButtonText: 'Cool'
                    });
                });
            }
        }
    }

    ingresarRegistrarFacebook(){
        this.autorizacion.facebooLoging().then((result)=>{
            swal({
                title: 'Logueado!',
                text: 'Usuario Logueado Correctamente, realiza yá tu reservación!!',
                type: 'success',
                confirmButtonText: 'Ahora sí a Reservar!'
            });
            this.modalReference.close();
            this.router.navigate(['reservas']);

        }).catch((error)=>{
            swal({
                title: 'Error!',
                text: 'Detalle:'+error,
                type: 'error',
                confirmButtonText: 'Ok'
            });
        })
    }

    cerrar(){
    this.modalReference.close();
}
}
