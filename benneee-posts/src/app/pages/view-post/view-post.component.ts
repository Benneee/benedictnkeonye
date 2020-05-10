import { AuthService } from 'src/app/auth/auth.service';
import { Logger } from '../../core/logger.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { PostsService, PostItem } from 'src/app/services/posts.service';
import { untilDestroyed } from 'src/app/core/until-destroyed';
import { finalize } from 'rxjs/operators';

const log = new Logger('View Post');

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss'],
})
export class ViewPostComponent implements OnInit, OnDestroy {
  isLoading = false;
  id: string;
  post: PostItem;
  body: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private postsService: PostsService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.getPostDetails();
  }

  ngOnDestroy(): void {}

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

  getPostDetails() {
    this.route.params.subscribe((param: Params) => {
      if (!param['id']) {
        log.debug('No ID');
        this.router.navigateByUrl('/tabs/posts');
      }
      this.id = param['id'];
      this.getPost(this.id);
    });
  }

  getPost(id: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({
        message: 'Loading post',
      })
      .then((loader) => {
        loader.present();
        const post$ = this.postsService.getSinglePost(id);
        post$
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
            untilDestroyed(this),
          )
          .subscribe(
            (res: any) => {
              if (res) {
                log.debug('post: ', res);
                this.post = res.data;
                this.body = this.post.body;
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

  updatePost(id: string) {
    log.debug('id: ', id);
  }
}
