import { untilDestroyed } from '../core/until-destroyed';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Logger } from '../core/logger.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { Credentials } from '../auth/credentials.service';

const log = new Logger('Home');

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  isLoading = true;
  userObj: any;
  createNow = false;
  preview = false;
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

  createPost() {
    this.createNow = true;
    this.preview = false;
    if (this.createNow === true) {
      log.debug('Btn Clicked!');
    }
  }

  previewPost() {
    this.preview = true;
    this.createNow = false;
    log.debug('preview mode!');
  }
}
