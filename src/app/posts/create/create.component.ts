import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../model/post.model';
import { PostsService } from '../services/posts.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  enteredTitle: string = "";
  enteredContent: string = "";
  post: Post;
  postId:string;
  mode = 'create';
  constructor(public postService: PostsService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId=paramMap.get('postId');
          this.postService.getPostById(this.postId).subscribe(
            postData=>{

              this.post={id:postData._id,title:postData.title,content:postData.content}
            }
          );
        }
        else {
          this.mode = 'create';
          this.postId=null;
        }

      }
    )
  }



  onAddPost(f: NgForm) {
    console.log(f.value)
    if(this.mode=='create'){
      this.postService.addPost(f.value.title, f.value.content);
    }
    else{
      this.postService.updatePost(this.postId,f.value.title,f.value.content);
    }
    
    f.resetForm();
    this.router.navigate(['/']);
  }
}
