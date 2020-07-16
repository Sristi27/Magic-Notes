import { Injectable } from '@angular/core';
import { Post } from '../model/post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsChanged = new Subject<{posts:Post[],postCount:number}>();
  constructor(private http: HttpClient,private router:Router) { }

  baseUrl = "http://localhost:3000";

  addPost(title: string, content: string, image: File) {
    const url = `${this.baseUrl}/api/posts`;
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append('image', image, title);

    this.http.post<{ message: string, post: Post }>(url, postData).subscribe(
      (res) => {
        this.router.navigate(['/']);
       
      });
  }

  deletePost(id: string) {
    const url = `${this.baseUrl}/api/posts/`;
    return this.http.delete<{ message: string }>(url + id);
  }


  getPostById(id: string) {
    const url = `${this.baseUrl}/api/posts/`;
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>
      (url + id);
  }


  updatePost(id: string, title: string, content: string, image: File | string) {

    let postData: FormData | Post;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append('image', image, title);
    }
    else {

      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image

      }
    }
    const url = `${this.baseUrl}/api/posts/`;
    this.http.put<{ message: string }>(url + id, postData).subscribe(
      response => {
        this.router.navigate(['/']);
  });
}


  getAllPosts(postsPerPage: number, currentPage: number) {
    //return this.posts;
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    const url = `${this.baseUrl}/api/posts`;
    this.http.get<{ message: string, posts: any, maxPosts: number }>(url + queryParams).
      pipe(map((postData) => {
        return {
          post: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          }),
          maxPosts:postData.maxPosts
        };
      }
      ))
      .subscribe(
        (transformedPostData) => {
          this.posts = transformedPostData.post;
          this.postsChanged.next({
            posts:[...this.posts],
            postCount:transformedPostData.maxPosts
  
          });
        }
      );
  }


  getPostUpdateListener() {
    return this.postsChanged.asObservable();
  }
}
