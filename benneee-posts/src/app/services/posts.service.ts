import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './../core/base.service';
import { Injectable } from '@angular/core';

export interface PostItem {
  _id?: string;
  title: string;
  createdAt: string;
  postImages?: string[];
  category: string;
  description: string;
  published?: boolean;
  body: string;
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

  getSinglePost(id: string) {
    return this.sendGet(this.baseUrl(`${routes.posts}/${id}`));
  }

  getPosts(): Observable<any> {
    return this.sendGet(this.baseUrl(routes.posts));
  }

  deletePost(id: string): Observable<any> {
    return this.sendDelete(this.baseUrl(`${routes.posts}/${id}`));
  }

  createPost(payload: PostItem): Observable<any> {
    return this.sendPost(this.baseUrl(routes.posts), payload, true);
  }

  updatePost(payload: PostItem) {
    return this.sendPatch(
      this.baseUrl(`${routes.posts}/${payload._id}`),
      payload,
    );
  }
}
