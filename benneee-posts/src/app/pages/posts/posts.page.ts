import { DeleteModalComponent } from '../../shared/delete-modal/delete-modal.component';
import { Logger } from './../../core/logger.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import {
  LoadingController,
  IonItemSliding,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from 'src/app/core/until-destroyed';
import { PostItem, PostsService } from 'src/app/services/posts.service';

const log = new Logger('Posts');

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit, OnDestroy {
  isLoading = false;
  posts: PostItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private postsService: PostsService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.getUserPosts();
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

  getUserPosts() {
    this.isLoading = true;
    this.loadingCtrl
      .create({
        message: 'Loading posts',
      })
      .then((loader) => {
        loader.present();
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

  editPost(postId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    log.debug('Post ID: ', postId);
  }

  async deletePost(post: PostItem, slidingItem: IonItemSliding) {
    slidingItem.close();
    log.debug('post: ', post);
    const modal = await this.modalCtrl.create({
      component: DeleteModalComponent,
      componentProps: {
        postData: post,
      },
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    if (role === 'confirm') {
      const loading = await this.loadingCtrl.create({
        message: 'Deleting Post',
      });
      await loading.present();
      const deletePost$ = this.postsService.deletePost(data._id);
      deletePost$.pipe(untilDestroyed(this)).subscribe(
        (res: any) => {
          if (res) {
            loading.dismiss();
            this.toastCtrl
              .create({
                message: res.message,
                duration: 2000,
                position: 'top',
              })
              .then((toast) => {
                toast.present();
              });
            this.getUserPosts();
          }
        },
        (error: any) => {
          log.debug('error: ', error);
          loading.dismiss();
        },
      );
    }
  }
}
