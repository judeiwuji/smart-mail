import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { MessageTabs } from '../../models/enums';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [FooterComponent, NgClass],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  activeTab = MessageTabs.Smart;
  MessageTabs = MessageTabs;

  selectTab(tab = MessageTabs.Smart) {
    this.activeTab = tab;
  }
}
