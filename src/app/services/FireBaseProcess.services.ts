import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {HttpClient} from '@angular/common/http';
import swal from "sweetalert2";
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';
import {Router} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import {Reservas} from '../model/Reservas.model';

@Injectable()

export class FireBaseProcessServices{
    URL_BASE:string ='https://valantynespa.firebaseio.com';
    constructor( private afDB: AngularFireDatabase, private angularFireAuth:AngularFireAuth, private anfs:AngularFirestore , private http:HttpClient, private router:Router) {
        this.isLogue();
    }
    public login =( email:string ,password:string )=>{
        return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password)
    }

    public registro =( email:string ,password:string)=>{
        return this.angularFireAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(email,password);
    }

    public facebooLoging(){
        return this.angularFireAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider);
    }

    public isLogue(){
        return this.angularFireAuth.authState;
    }

    public logout(){
        this.angularFireAuth.auth.signOut();
        swal({
            title: 'Sesión Cerrada!',
            text: 'Gracias por visitarnos!!',
            type: 'success',
            confirmButtonText: 'Regresa Pronto...'
        });
        this.router.navigate(['principal']);
    }

    public getUser(){
        return this.angularFireAuth.auth;
    }

    /**Todo: SECCION HORARIOS**/
    //metodo para traer todos los horarios
    public getHorarios(){
        return this.anfs.collection('/Horarios').valueChanges();
    }
    //metodo para traer los horarios especificios dependiendo del dia
    //https://github.com/angular/angularfire2/blob/master/docs/firestore/querying-collections.md
    public getHorario(diaDeSemana:number){
        return this.anfs.collection('/Horarios',ref => ref.where('dia','==',diaDeSemana)).valueChanges();
    }

    /**Todo: SECCION RESERVAS**/
    //crear una reserva
    public guardarReserva(reserva:Reservas){
        let respuesta:string='';
        var data = JSON.parse(JSON.stringify(reserva));
        return this.anfs.collection("Reservas").add(data);

    }
}