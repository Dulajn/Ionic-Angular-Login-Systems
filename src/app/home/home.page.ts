import { Component } from '@angular/core';
import { AutheticationService } from '../authetication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  user:any

  constructor(public Route:Router, public authService:AutheticationService) {
    this.user=authService.getProfile()

  }
  async logout(){
    
    this.authService.signOut().then(()=>{
      this.Route.navigate(['/landing'])
  
.catch((error)=>{
  console.log(error);
})


    })



  }

}
