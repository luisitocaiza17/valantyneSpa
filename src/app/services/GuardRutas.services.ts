import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {FireBaseProcessServices} from './FireBaseProcess.services';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class MyGuard implements CanActivate{
    isLogged: boolean = false
    constructor(private authService: FireBaseProcessServices) {

        authService.isLogue().subscribe(result => {

            if (result && result.uid)
                this.isLogged = true
            else
                this.isLogged = false

        }, err => {
            this.isLogged = false
        })
    }

    canActivate(next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.isLogged;
    }

}