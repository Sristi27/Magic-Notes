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

  addPost(title: string, content: string) {
    const url = `${this.baseUrl}/api/posts`;
    const post = { id: null, title: title, content: content }
    this.http.post<{ message: string, postId: string }>(url, post).subscribe(
      (res) => {
        const id = res.postId;
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
    return this.http.get<{_id:string,title:string,content:string}>(url + id);
  }


  updatePost(id: string, title: string, content: string) {

    const post = { id: id, title: title, content: content };
    const url = `${this.baseUrl}/api/posts/`;
    this.http.put<{ message: string }>(url + id, post).subscribe(
      response =>{
        const updatedPosts=[...this.posts]
        const oldIndex=updatedPosts.findIndex(p=>p.id===post.id);
        updatedPosts[oldIndex]=post;
        this.posts=updatedPosts;
        this.postsChanged.next([...this.posts]);
      }
    );
  }


  getAllPosts() {
    //return this.posts;
    const url = `${this.baseUrl}/api/posts`;
    this.http.get<{ message: string, posts: any }>(url).
      pipe(map((postData) => {
        return postData.posts.map
          (post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
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
