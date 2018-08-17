import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  myForm: FormGroup;
  processing: Boolean = false;
  notif: Boolean = true;
  msg: String;
  msgClass: String;


  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) { 
    this.createControls();
  }

  // create form controls
  createControls() {
    this.myForm = this._formBuilder.group({
      uname: ['', Validators.required],
      pass: ['', Validators.required]
    })
  }
  ngOnInit() {
  }

  onLoginSubmit() {
    this.notif = true;
    const user = {
      username: this.myForm.get('uname').value,
      password: this.myForm.get('pass').value
    };
    this._authService.loginUser(user).subscribe((data: any) => {
      
      if(data.success) {
        this.disableForm();
        this.processing = true;
        this.msgClass = 'alert alert-success';
        this._authService.storeUserData(data.token, data.user);
        setTimeout(() => {
          this._router.navigate(['/dashboard']);
        }, 2000);
      } else {
        this.enableForm();
        this.processing = false;
        this.msgClass = 'alert alert-danger';
      }
      this.msg = data.message;
    })
  }

  // disable form
  disableForm() {
    this.myForm.get('uname').disable();
    this.myForm.get('pass').disable();
  }

  // disable form
  enableForm() {
    this.myForm.get('uname').enable();
    this.myForm.get('pass').enable();
  }
}
