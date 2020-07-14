import { Injectable } from '@angular/core';
import { Post } from '../model/post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsChanged = new Subject<Post[]>();
  constructor(private http: HttpClient) { }

  baseUrl = "http://localhost:3000";

  addPost(title: string, content: string, image: File) {
    const url = `${this.baseUrl}/api/posts`;
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append('image', image, title);

    this.http.post<{ message: string, post: Post }>(url, postData).subscribe(
      (res) => {

        const post: Post = {
          id: res.post.id,
          title: title,
          content: content,
          imagePath: res.post.imagePath

        };
        const id = res.post.id;
        post.id = id;
        this.posts.push(post);
        this.postsChanged.next([...this.posts]);
      });
  }

  deletePost(id: string) {
    const url = `${this.baseUrl}/api/posts/`;
    this.http.delete<{ message: string }>(url + id).subscribe(
      () => {
        const updatedPosts = this.posts.filter(post => post.id !== id)
        this.posts = updatedPosts;
        this.postsChanged.next([...this.posts]);
      }
    );
  }


  getPostById(id: string) {
    const url = `${this.baseUrl}/api/posts/`;
    return this.http.get<{ _id: string, title: string, content: string ,imagePath:string}>
    (url + id);
  }


  updatePost(id: string, title: string, content: string, image: File | string) {

    // const post = { id: id, title: title, content: content ,imagePath:null };
    let postData:FormData | Post;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append("id",id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append('image', image, title);
    }
    else {

      postData= {
        id: id,
        title: title,
        content: content,
        imagePath: image

      }
    }
    const url = `${this.baseUrl}/api/posts/`;
    this.http.put<{ message: string }>(url + id, postData).subscribe(
      response => {
        const updatedPosts = [...this.posts]
        const oldIndex = updatedPosts.findIndex(p => p.id === id);
        const post:Post={
        id: id,
        title: title,
        content: content,
        imagePath:""
        }
        updatedPosts[oldIndex] = post;
        this.posts = updatedPosts;
        this.postsChanged.next([...this.posts]);
      }
    );
  }


  getAllPosts(postsPerPage:number,currentPage:number) {
    //return this.posts;
    const queryParams=`?pagesize=${postsPerPage}&page=${currentPage}`;
    const url = `${this.baseUrl}/api/posts`;
    this.http.get<{ message: string, posts: any }>(url + queryParams).
      pipe(map((postData) => {
        return postData.posts.map
          (post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            }
          }
          );
      }
      ))
      .subscribe(
        (transformedPosts) => {
          this.posts = transformedPosts;
          this.postsChanged.next([...this.posts]);
        }
      );
  }


  getPostUpdateListener() {
    return this.postsChanged.asObservable();
  }
}
