import { Logger } from './../../core/logger.service';
import { Component, OnInit, Input } from '@angular/core';
import { PostItem } from 'src/app/services/posts.service';
import { Router } from '@angular/router';

const log = new Logger('Post Item');

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
})
export class PostItemComponent implements OnInit {
  @Input() post: PostItem;

  constructor(private router: Router) {}

  ngOnInit() {}

  openPost(id: string) {
    log.debug('id: ', id);
    this.router.navigate(['/', 'post', id]);
  }
}
