import { Logger } from '../../core/logger.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { PostItem } from 'src/app/services/posts.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

const log = new Logger('Update');

@Component({
  selector: 'app-update-modal',
  templateUrl: './update-modal.component.html',
  styleUrls: ['./update-modal.component.scss'],
})
export class UpdateModalComponent implements OnInit {
  @Input() postData: PostItem;
  postForm: FormGroup;
  selectedImg: any;
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

  constructor(private modalCtrl: ModalController, private fb: FormBuilder) {}

  ngOnInit() {
    this.initPostForm();
    if (this.postData !== null) {
      this.setValuesInPostForm(this.postData);
    }
  }

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

  setValuesInPostForm(post: PostItem) {
    this.postForm = this.fb.group({
      body: post.body,
      postImages: post.postImages['0'].images[0],
      category: post.category,
      description: post.description,
      published: post.published,
      title: post.title,
      _id: post._id,
    });
  }

  async closeModal() {
    await this.modalCtrl.dismiss({ dismissed: true }, 'cancel');
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
        this.selectedImg = reader.result;
        const result = [reader.result];
        const img = { images: [...result] };
        this.postForm.patchValue({
          postImages: img,
        });
      };
    }
  }

  async submit() {
    log.debug('full form: ', this.postForm.value);
    this.modalCtrl.dismiss(this.postForm.value, 'confirm');
  }
}
