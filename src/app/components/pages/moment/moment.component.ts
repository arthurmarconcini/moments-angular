import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';

import { MessagesService } from '../../../services/messages.service';
import { MomentService } from 'src/app/services/moment.service';
import { CommentService } from 'src/app/services/comment.service';

import { Moment } from 'src/app/Moment';
import { environment } from 'src/environments/environment';
import { Comment } from 'src/app/Comment';
import { Subscriber } from 'rxjs';

@Component({
  selector: 'app-moment',
  templateUrl: './moment.component.html',
  styleUrls: ['./moment.component.css']
})
export class MomentComponent implements OnInit {
  moment?: Moment;
  baseApiUrl = environment.baseApiUrl;

  faTimes = faTimes;
  faEdit = faEdit;

  commentForm!: FormGroup;

  constructor(
    private momentService: MomentService,
    private route: ActivatedRoute,
    private messageService: MessagesService,
    private router: Router,
    private commentService: CommentService
  ) { }

  ngOnInit(): void {
    //id que está na url
    const id = Number(this.route.snapshot.paramMap.get('id'))

    this.momentService
      .getMoment(id)
      .subscribe(item => this.moment = item.data
    );

    this.commentForm = new FormGroup({
      text: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required])
    })
  }

  get text() {
    return this.commentForm.get('text')!
  }

  get username() {
    return this.commentForm.get('username')!
  }

  async removeHandler(id: number) {
    await this.momentService
      .removeMoment(id)
      .subscribe();

    this.messageService.add('Momento removido com sucesso!')

    this.router.navigate(['/'])
  }

  async onSubmit(FormDirective: FormGroupDirective) {
    if(this.commentForm.invalid) {
      return
    }

    const data: Comment = this.commentForm.value
    data.momentId = Number(this.moment!.id)

    await this.commentService
      .createComment(data)
      .subscribe((comment) => this.moment!.comments!.push(comment.data))


    this.messageService.add("Comentário adicionado!")

    //reset formuladrio
    this.commentForm.reset()
    FormDirective.resetForm()
  }
}
