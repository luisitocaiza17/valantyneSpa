import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {HttpClient} from '@angular/common/http';
import swal from "sweetalert2";
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';
import {Router} from '@angular/router';

@Injectable()

export class FireBaseProcessServices{
    URL_BASE:string ='https://valantynespa.firebaseio.com';
    constructor( private afDB: AngularFireDatabase, private angularFireAuth:AngularFireAuth , private http:HttpClient, private router:Router) {
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
}