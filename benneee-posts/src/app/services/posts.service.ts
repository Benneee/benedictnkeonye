import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './../core/base.service';
import { Injectable } from '@angular/core';

export interface PostItem {
  title: string;
  createdAt: string;
  postImages?: string[];
  category: string;
  description: string;
}

const routes = {
  posts: 'posts',
};

@Injectable({
  providedIn: 'root',
})
export class PostsService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http);
  }

  getPosts(): Observable<any> {
    return this.sendGet(this.baseUrl(routes.posts));
  }
}
