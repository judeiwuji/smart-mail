import { Component, Input } from '@angular/core';
import { AvatarComponent } from '../avatar/avatar.component';
import { IMessage } from '../../shared/models/IMessage';
import { IUser } from '../../shared/models/IUser';
import { DatePipe, NgClass } from '@angular/common';
import { LinkifyPipe } from '../../shared/pipes/linkify.pipe';
import { SafePipe } from '../../shared/pipes/safe.pipe';
import { ShowdownPipe } from '../../shared/pipes/showdown.pipe';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [AvatarComponent, NgClass, LinkifyPipe, DatePipe],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  @Input({ required: true }) message!: IMessage;
  public user: IUser = { name: 'Jude Iwuji', email: 'judeiwuji@gmail.com' };

  get isCurrent() {
    return this.message.sender.email === this.user.email;
  }

  get time() {
    return this.message.timestamp;
  }
}
