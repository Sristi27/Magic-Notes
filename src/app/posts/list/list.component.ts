import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { Post } from '../model/post.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

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
  userId :string;
  postsPerPage=2;
  authListener: Subscription;
  status: boolean = false;

  constructor(private postService: PostsService,private authService:AuthService) { }

  ngOnInit(): void {

    this.userId=this.authService.getUserId();
    this.status=this.authService.isAuth();
    this.authListener = this.authService.getAuthStatus().subscribe(
      loggedIn => {
        this.status = loggedIn;
        this.userId=this.authService.getUserId();
      }
    )
    this.postService.getAllPosts(this.postsPerPage,this.currentPage);
    this.postsSub = this.postService.getPostUpdateListener().subscribe(
      (postData:{posts:Post[],postCount:number}) => {
        this.posts = postData.posts;
        this.totalPosts=postData.postCount;
        
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
