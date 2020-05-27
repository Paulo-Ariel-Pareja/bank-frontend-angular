import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url: any = 'http://localhost:4200/login';
  errorSubject: any = new BehaviorSubject<any>(null);
  userSubject = new BehaviorSubject<any>(null);
  errorMessage: any = this.errorSubject.asObservable();
  user = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  login(username: string, password: string) {
    this.http.post(this.url, { username, password }, httpOptions).toPromise().then((res: any) => {
      if (res && res.jwt) {
        sessionStorage.setItem('jwt', res.jwt);
        this.errorSubject.next(null);
        this.userSubject.next(res.data);
        this.router.navigateByUrl('dashboard');
      } else if (res.Message) {
        this.errorSubject.next(res.Message);
      }
    });
  }

  isAuthenticated():boolean {
    if (sessionStorage.getItem('jwt')) {
      return true;
    }
    return false;
  }
}