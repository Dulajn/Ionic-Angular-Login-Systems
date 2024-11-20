import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AutheticationService } from 'src/app/authetication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public authService: AutheticationService,
    public Route: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"),
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")
      ]],
    });
  }

  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Logging in...'
    });
    await loading.present();



    if (this.loginForm?.valid) {
      const { email, password } = this.loginForm.value;
      try {
        const user = await this.authService.loginuser(this.loginForm.value.email, this.loginForm.value.password).catch(()=>{


        }).catch((error)=>{

            console.log(error);
            loading.dismiss()

        })


        if(user){

         loading.dismiss()
         this.Route.navigate(['/home'])

        }else{

           console.log('provide correct values');

        }





        
        // Optionally, you can do something with the user object here after registration
      } catch (error) {
        console.error('Registration Error:', error);
        // Handle registration error, show alert or other appropriate actions
      }
    } else {
   
  
    }

  }
}
