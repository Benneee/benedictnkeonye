import { UpdateModalComponent } from './update-modal/update-modal.component';
import { PostItemComponent } from './../pages/post-item/post-item.component';
import { QuillModule } from 'ngx-quill';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NgModule } from '@angular/core';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PostItemComponent, DeleteModalComponent, UpdateModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    IonicModule.forRoot(),
  ],
  providers: [SplashScreen, StatusBar],
  entryComponents: [],
  exports: [PostItemComponent, DeleteModalComponent, UpdateModalComponent],
})
export class SharedModule {}
