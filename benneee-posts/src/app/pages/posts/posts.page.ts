import { Logger } from './../../core/logger.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from 'src/app/core/until-destroyed';
import { PostItem } from 'src/app/services/posts.service';

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
  ) {}

  ngOnInit() {}

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
}
