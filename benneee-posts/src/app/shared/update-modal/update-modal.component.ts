import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { PostItem } from 'src/app/services/posts.service';

@Component({
  selector: 'app-update-modal',
  templateUrl: './update-modal.component.html',
  styleUrls: ['./update-modal.component.scss'],
})
export class UpdateModalComponent implements OnInit {
  @Input() postData: PostItem;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  async closeModal() {
    await this.modalCtrl.dismiss({ dismissed: true }, 'cancel');
  }
}
