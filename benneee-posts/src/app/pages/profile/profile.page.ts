import { PostsService, PostItem } from './../../services/posts.service';
import { UserService } from './../../services/user.service';
import { Logger } from './../../core/logger.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from 'src/app/core/until-destroyed';

const log = new Logger('Profile');
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  isLoading = false;
  profileInfo = null;
  posts: PostItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private userService: UserService,
    private postsService: PostsService,
  ) {}

  ngOnInit() {
    this.getUserPosts();
    this.getUserProfileInfo();
  }

  ngOnDestroy() {}

  logOut() {
    this.isLoading = true;
    this.loadingCtrl
      .create({
        message: 'Logging you out...',
      })
      .then((loader) => {
        loader.present();
        const logout$ = this.authService.logout({});
        logout$
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
            untilDestroyed(this),
          )
          .subscribe(
            (res: any) => {
              if (res) {
                // log.debug('res: ', res);
                sessionStorage.removeItem('credentials');
                this.router.navigate(['login']);
                loader.dismiss();
              }
            },
            (error: any) => {
              log.debug('error: ', error);
              loader.dismiss();
            },
          );
      });
  }

  getUserProfileInfo() {
    this.isLoading = true;
    this.loadingCtrl
      .create({
        message: 'Loading profile information',
      })
      .then((loader) => {
        loader.present();
        const logout$ = this.userService.getUserProfile();

        logout$
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
            untilDestroyed(this),
          )
          .subscribe(
            (res: any) => {
              if (res) {
                log.debug('profileInfo: ', res.data);
                this.profileInfo = res.data;
                loader.dismiss();
              }
            },
            (error: any) => {
              log.debug('error: ', error);
              this.profileInfo = null;
              loader.dismiss();
            },
          );
      });
  }

  getUserPosts() {
    this.isLoading = true;
    this.loadingCtrl
      .create({
        message: 'Loading posts',
      })
      .then((loader) => {
        // loader.present();
        const posts$ = this.postsService.getPosts();

        posts$
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
            untilDestroyed(this),
          )
          .subscribe(
            (res: any) => {
              if (res) {
                log.debug('posts: ', res.data);
                this.posts = res.data;
                this.posts = this.posts.slice(0, 3);
                // this.posts.map((post: PostItem) => {
                //   log.debug('post images: ', post.postImages['0'].images[0]);
                // });
                // loader.dismiss();
              }
            },
            (error: any) => {
              log.debug('error: ', error);
              // loader.dismiss();
            },
          );
      });
  }
}
