import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { Post } from '../model/post.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  posts: Post[] = [];
  private postsSub: Subscription;
  constructor(private postService: PostsService) { }

  ngOnInit(): void {
    this.postService.getAllPosts();
    this.postsSub = this.postService.getPostUpdateListener().subscribe(
      (posts: Post[]) => {
        this.posts = posts;
      }
    )
  }

  onDelete(id: string) {
    this.postService.deletePost(id);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
