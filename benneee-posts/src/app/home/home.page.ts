import { PostsService } from 'src/app/services/posts.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { untilDestroyed } from '../core/until-destroyed';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Logger } from '../core/logger.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LoadingController, ToastController } from '@ionic/angular';
import { Credentials } from '../auth/credentials.service';
import { PostItem } from '../services/posts.service';

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
  selectedImg: any;
  editorContent: string;

  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['link', 'image', 'video'],
    ],
  };

  postForm: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private fb: FormBuilder,
    private postsService: PostsService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.initPostForm();
  }

  ngOnDestroy() {}

  initPostForm() {
    this.postForm = this.fb.group({
      body: ['', Validators.required],
      postImages: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      published: [false],
      title: ['', Validators.required],
    });
  }

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

  submit() {
    log.debug('full form: ', this.postForm.value);
    log.debug('values: ', this.postForm.get('body').value);
  }

  previewPost() {
    this.preview = true;
    this.createNow = false;
    log.debug('preview mode!');
    this.editorContent = this.postForm.get('body').value;
  }

  get controls() {
    return this.postForm.controls;
  }

  handleImgUpload(event: any) {
    const reader = new FileReader();
    const file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        // log.debug('img: ', reader.result);
        this.selectedImg = reader.result;
        this.postForm.patchValue({
          postImages: reader.result,
        });
      };
    }
  }

  createNewPost(payload: PostItem) {
    this.isLoading = true;
    log.debug('value: ', this.postForm.value);
    this.loadingCtrl
      .create({
        message: 'Creating your post...',
        keyboardClose: true,
      })
      .then((loader) => {
        loader.present();
        const postData$ = this.postsService.createPost(payload);
        postData$
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
            untilDestroyed(this),
          )
          .subscribe(
            (res: any) => {
              if (res) {
                loader.dismiss();
                this.toastCtrl
                  .create({
                    message: res.message,
                    duration: 2000,
                    position: 'top',
                  })
                  .then((toast) => {
                    toast.present();
                  });
                this.router.navigate(['/', 'tabs', 'posts']);
              }
            },
            (err: any) => {
              loader.dismiss();
              log.debug('error: ', err);
            },
          );
      });
  }
}
