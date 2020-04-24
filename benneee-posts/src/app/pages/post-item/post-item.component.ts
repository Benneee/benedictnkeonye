import { Component, OnInit, Input } from '@angular/core';
import { PostItem } from 'src/app/services/posts.service';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
})
export class PostItemComponent implements OnInit {
  @Input() post: PostItem;

  constructor() {}

  ngOnInit() {}
}
