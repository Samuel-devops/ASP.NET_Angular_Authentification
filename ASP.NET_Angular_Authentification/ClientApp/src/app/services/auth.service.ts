import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = "https://localhost:7072/api/User/";
  constructor(private http: HttpClient,
    private router: Router) { }

  register(userObj:any){
    return this.http.post<any>(`${this.baseUrl}register`,userObj);
  }

  login(loginObj:any){
    return this.http.post<any>(`${this.baseUrl}login`,loginObj);
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  storeToken(tokenvalue: string){
    localStorage.setItem('token', tokenvalue);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
