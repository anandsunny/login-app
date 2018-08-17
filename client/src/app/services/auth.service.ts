import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from './../classes/auth';
import { RequestOptions, Headers } from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private domain = "http://localhost:8080";
  private authToken: string;
  private user:  Object;
  private option: Object;

  constructor(
    private _httpClient: HttpClient
  ) { }

  // new user registration
  userRegistration(user: Auth){
    return this._httpClient.post(`${this.domain}/authentication/register`, user);
  }

  // check if email taken
  checkEmail(email) {
    return this._httpClient.get(`${this.domain}/authentication/checkEmail/${email}`);
  }

  // check if username taken
  checkUsername(uname) {
    return this._httpClient.get(`${this.domain}/authentication/checkUsername/${uname}`);
  }

  // login user
  loginUser(user) {
    return this._httpClient.post(`${this.domain}/authentication/login`, user);
  }

  // function for store user data on client local storage
  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  // get token to client localstorage
  loadToken() {
    return localStorage.getItem('token');
  }

  // create header, add token, to be use for http requist
  createAuthenticationRequist() {
    this.loadToken();
    // header configuration options
    this.option = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authToken
      })
    })
  }

}
