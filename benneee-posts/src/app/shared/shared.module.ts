import { PostItemComponent } from './../pages/post-item/post-item.component';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [PostItemComponent],
  imports: [CommonModule, IonicModule.forRoot()],
  providers: [SplashScreen, StatusBar],
  entryComponents: [],
  exports: [PostItemComponent],
})
export class SharedModule {}
