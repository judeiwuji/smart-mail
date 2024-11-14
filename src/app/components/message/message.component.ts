import { Component, Input } from '@angular/core';
import { AvatarComponent } from '../avatar/avatar.component';
import { IMessage } from '../../models/IMessage';
import { IUser } from '../../models/IUser';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [AvatarComponent, NgClass],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  @Input() message!: IMessage;
  public user: IUser = { name: 'Jude Iwuji', email: 'judeiwuji@gmail.com' };

  get isCurrent() {
    return true;
  }
}
