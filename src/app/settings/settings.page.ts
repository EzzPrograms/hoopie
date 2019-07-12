import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  providers: [],
})
export class SettingsPage implements OnInit {

  ardatatgl: boolean;

  constructor(private sub: Events) {
    
  }

  ngOnInit() {
  }

  setData(){
   this.sub.publish("ardatacol", this.ardatatgl);
  }

}
