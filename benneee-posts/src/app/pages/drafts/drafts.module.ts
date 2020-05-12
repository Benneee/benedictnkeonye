import { UpdateModalComponent } from './../../shared/update-modal/update-modal.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DraftsPageRoutingModule } from './drafts-routing.module';

import { DraftsPage } from './drafts.page';
import { DeleteModalComponent } from 'src/app/shared/delete-modal/delete-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    DraftsPageRoutingModule,
  ],
  declarations: [DraftsPage],
  entryComponents: [DeleteModalComponent, UpdateModalComponent],
})
export class DraftsPageModule {}
