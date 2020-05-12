import { UpdateModalComponent } from './../../shared/update-modal/update-modal.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostsPageRoutingModule } from './posts-routing.module';

import { PostsPage } from './posts.page';
import { DeleteModalComponent } from '../../shared/delete-modal/delete-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    PostsPageRoutingModule,
  ],
  declarations: [PostsPage],
  entryComponents: [DeleteModalComponent, UpdateModalComponent],
})
export class PostsPageModule {}
