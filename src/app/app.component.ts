import { Component } from '@angular/core';
import {FireBaseProcessServices} from './services/FireBaseProcess.services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    loggedIn=false;
    loggedUser:any = null;
    constructor(private autorizacionServices:FireBaseProcessServices, private router:Router){
        debugger;
        this.autorizacionServices.isLogue()
            .subscribe((result)=>{
                if(result && result.uid){
                    this.loggedIn = true;
                    setTimeout(()=>{
                        this.loggedUser = this.autorizacionServices.getUser().currentUser.email;
                    }, 500);
                }else{
                    this.loggedIn = false;
                }
            }, (error)=>{
                this.loggedIn = false;
            })
    }
    logout(){
        this.autorizacionServices.logout();
        this.router.navigate(['principal']);
    }
}
