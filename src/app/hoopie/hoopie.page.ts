import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hoopie',
  templateUrl: './hoopie.page.html',
  styleUrls: ['./hoopie.page.scss'],
})
export class HoopiePage implements OnInit {

  x_coord: number;
  y_coord: number;
  z_coord: number;

  constructor() {
    this.x_coord = 4;
    this.y_coord = 0;
    this.z_coord = 4;
  }

  ngOnInit() {
  }

}
