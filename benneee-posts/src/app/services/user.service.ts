import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './../core/base.service';
import { Injectable } from '@angular/core';

const routes = {
  profile: 'users/profile',
};

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http);
  }

  getUserProfile(): Observable<any> {
    return this.sendGet(this.baseUrl(routes.profile));
  }
}
