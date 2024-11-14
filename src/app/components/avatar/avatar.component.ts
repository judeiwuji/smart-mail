import { Component, Input } from '@angular/core';
import { IUser } from '../../models/IUser';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css',
})
export class AvatarComponent {
  @Input() user: IUser = { email: '', name: 'Jude Iwuji' };
  @Input() bgColor = '#000000';
  @Input() fgColor = '#ffffff';

  get initial() {
    return this.user.name.substring(0, 1);
  }
}
