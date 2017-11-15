import { DataApiProvider } from './../../providers/data-api/data-api';
import { ApiProvider } from './../../providers/api/api';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public newUser = {
    serverPath: '',
    email: '',
    password: ''
  };

  public loginFormControl: FormGroup;
  private data: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public authService: AuthServiceProvider,
    private api: ApiProvider,
    private dataApi: DataApiProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.loginFormControl = new FormGroup({
      // name: new FormControl(this.dataApi.get('name'), [Validators.required, Validators.email]),
      // staffNumber: new FormControl(this.dataApi.get('token'), [Validators.required, Validators.email]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

  public inputEmailChange() {
    document.getElementById("email").style.backgroundColor = "white";
    document.getElementById("email").style.border = "1px solid #27aae2";
  }

  public inputPasswordChange() {
    document.getElementById("password").style.backgroundColor = "white";
    document.getElementById("password").style.border = "1px solid #27aae2";
  }

  public onBlurEmail() {
    document.getElementById("email").style.backgroundColor = "#EBE5E5";
    document.getElementById("email").style.border = "1px solid #EBE5E5";
  }

  public onBlurPassword() {
    document.getElementById("password").style.backgroundColor = "#EBE5E5";
    document.getElementById("password").style.border = "1px solid #EBE5E5";
  }

  public navigate() {
    this.navCtrl.setRoot(HomePage, {});
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter LoginPage');

    if (!this.dataApi.get('debug')) {
      this.dataApi.clear('token');
      this.dataApi.clear('user_id');
    }
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave LoginPage');
    if (this.data) {
      this.dataApi.update('name', this.data.name);
      this.dataApi.update('token', this.data.key);
      this.dataApi.update('user_id', this.data.user_id);
      this.dataApi.update('activate', this.data.isActivated);
      // this._nav.push(Settings);
    }
  }

  public login() {

    // Validation
    if (!this.loginFormControl.controls.email.valid) {
      alert("Invalid username! Use full email address as username.");
      return;
    }

    if (!this.loginFormControl.controls.password.valid) {
      alert("Invalid password! Minimum 8 characters.");
      return;
    }

    let loading = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });

    loading.present();

    //Take the values from  the form control
    this.newUser.serverPath = this.dataApi.get('serverPath');
    this.newUser.email = this.loginFormControl.get("email").value.trim();
    this.newUser.password = this.loginFormControl.get("password").value;

    console.log(JSON.stringify(this.newUser));

    //Sign in
    this.api.signin(this.newUser.email, this.newUser.password)
      .then((result) => {
        loading.dismiss();
        this.data = result;
        console.log(this.data);
        // Save token and server path to localStorage
        this.dataApi.update('name', this.data.name);
        this.dataApi.update('token', this.data.key);
        this.dataApi.update('user_id', this.data.user_id);
        this.dataApi.update('activate', this.data.isActivated);
        // Close login page after successful signin
        this.navCtrl.setRoot(HomePage);
      }, (err) => {
        loading.dismiss();
        // Display signin error code
        alert(err);
      });
  }

  showAlert(message: string) {
    let confirm = this.alertCtrl.create({
      title: 'Alert!',
      message: message,
      buttons: [
        {
          text: 'ok',
          handler: () => {
            console.log('ok clicked');
          }
        },

      ]
    });
    confirm.present();
  }
}
