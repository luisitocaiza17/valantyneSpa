import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {FireBaseProcessServices} from '../services/FireBaseProcess.services';
import swal from "sweetalert2";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    logueP:any={};
    constructor(private router: Router, private autorizacion: FireBaseProcessServices) {
        this.objetoLogueo = {correo: '' ,contrasenia: '',correo2: '' ,contrasenia2: '',contrasenia22: ''}
    }
    esLogueo=true;
    objetoLogueo:any;

    ngOnInit() {
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
            this.router.navigate(['reservas']).then((result)=>{
                alert('si')
            }).catch((error)=>{
                alert(error);
            });


            swal({
                title: 'Logueado!',
                text: 'Usuario Logueado Correctamente, realiza yá tu reservación!!',
                type: 'success',
                confirmButtonText: 'Ahora sí a Reservar!'
            });

        }).catch((error)=>{
            swal({
                title: 'Error!',
                text: 'Detalle:'+error,
                type: 'error',
                confirmButtonText: 'Ok'
            });
        })
    }

}
