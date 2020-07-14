import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { Post } from '../model/post.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  posts: Post[] = [];
  private postsSub: Subscription;
  totalPosts=0;
  currentPage=1;
  postsPerPage=2;

  constructor(private postService: PostsService) { }

  ngOnInit(): void {
    this.postService.getAllPosts(this.postsPerPage,this.currentPage);
    this.postsSub = this.postService.getPostUpdateListener().subscribe(
      (postData:{posts:Post[],postCount:number}) => {
        this.posts = postData.posts;
        this.totalPosts=postData.postCount
      }
    )
  } 

  onPageChanged(pageData:PageEvent){
    this.currentPage = pageData.pageIndex +1;
    this.postsPerPage = pageData .pageSize;
    this.postService.getAllPosts(this.postsPerPage,this.currentPage);
  }

  onDelete(id: string) {
    this.postService.deletePost(id).subscribe(
      ()=>{
        this.postService.getAllPosts(this.postsPerPage,this.currentPage);
      }
    );
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
