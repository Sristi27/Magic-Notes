import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from '../model/post.model';
import { PostsService } from '../services/posts.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator'

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  enteredTitle: string = "";
  enteredContent: string = "";
  post: Post;
  imagePreview: string;
  postId: string;
  form: FormGroup;
  mode = 'create';
  constructor(public postService: PostsService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      'content': new FormControl(null, { validators: [Validators.required] }),
      'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] }),
    });

    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.postService.getPostById(this.postId).subscribe(
            postData => {

              this.post = { 
                id: postData._id,
                 title: postData.title, 
                 content: postData.content,
                 imagePath:postData.imagePath,
                 creator:postData.creator
                };


              this.form.setValue({
                'title': this.post.title,
                'content': this.post.content,
                'image':this.post.imagePath
              })
            }
          );

        }
        else {
          this.mode = 'create';
          this.postId = null;
        }

      }
    )
  }
  onImagePicked(event: Event) {

    const file = (event.target as HTMLInputElement).files[0];  //.files gives array of files
    this.form.patchValue({ image: file });  //targets a single control
    this.form.get('image').updateValueAndValidity(); //tells angular that changes have been made
    const reader = new FileReader;
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);

  }


  onAddPost() {

    if (this.mode == 'create') {
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    }
    else {
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content,this.form.value.image);
    }

    this.form.reset();
    this.router.navigate(['/']);
  }



}
