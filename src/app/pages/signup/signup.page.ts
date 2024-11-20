import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AutheticationService } from 'src/app/authetication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  regForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authService: AutheticationService,  
    public router: Router
  ) { }

  ngOnInit() {
    this.regForm = this.formBuilder.group({
      fullname: ['', [Validators.required]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"),
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}") 
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  get errorControl() {
    return this.regForm.controls;
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ mismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  async signUp() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await loading.present();

    if (this.regForm.valid) {
      const { email, password } = this.regForm.value;
      try {
        const user = await this.authService.registerUser(email, password).catch(error => {
          console.log(error);
          loading.dismiss();
          return null;
        });

        if (user) {
          loading.dismiss();
          this.router.navigate(['/login']);
        } else {
          console.log('Provide correct values');
        }

      } catch (error) {
        console.error('Registration Error:', error);
        const alert = await this.alertCtrl.create({
          header: 'Registration Error',
          message: 'There was an error during registration. Please try again later.',
          buttons: ['OK']
        });
        await alert.present();
      }
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Validation Error',
        message: 'Please enter valid information for all fields.',
        buttons: ['OK']
      });
      await alert.present();
    }

    await loading.dismiss();
  }
}
