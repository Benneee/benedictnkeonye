import { Logger } from './../../core/logger.service';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PostItem } from 'src/app/services/posts.service';

const log = new Logger('Modal');

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteModalComponent implements OnInit {
  @Input() postData: PostItem;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  async closeModal() {
    await this.modalCtrl.dismiss({ dismissed: true }, 'cancel');
  }

  async deletePost(selectedPost: PostItem) {
    this.modalCtrl.dismiss(selectedPost, 'confirm');
  }
}
