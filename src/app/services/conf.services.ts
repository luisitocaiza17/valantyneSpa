import {Component, Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
@Injectable()
export class ConfgServices implements OnInit {

    constructor(private http: HttpClient) {

    }
    ngOnInit(): void {
    }

    rutasCarosel():Array<String>{
        var arrayImagen:Array<String>= new Array<String>();
        arrayImagen= new Array<String>();
        const jsonFile = 'assets/configuration.properties';
        this.http.get(jsonFile).toPromise().then((response : Response) => {
            let imagenCarusel1=response['caruselImagen1'];
            let imagenCarusel2=response['caruselImagen2'];
            let imagenCarusel3=response['caruselImagen3'];

            arrayImagen.push(imagenCarusel1);
            arrayImagen.push(imagenCarusel2);
            arrayImagen.push(imagenCarusel3);

        }).catch((response: any) => {
            debugger;
            arrayImagen.push(response.toString());
        });
        return arrayImagen;
    }

}