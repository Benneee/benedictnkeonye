import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './../core/base.service';
import { Injectable } from '@angular/core';

const routes = {
  signup: 'users',
  login: 'users/login'
};
@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http);
  }

  login(payload: any): Observable<any> {
    return this.sendPost(routes.login, payload);
  }

  register(payload: any): Observable<any> {
    return this.sendPost(routes.signup, payload);
  }
}
