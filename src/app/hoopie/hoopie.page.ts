import { Component, OnInit } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { Gyroscope } from '@ionic-native/gyroscope/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-hoopie',
  templateUrl: './hoopie.page.html',
  styleUrls: ['./hoopie.page.scss'],
})
export class HoopiePage implements OnInit {

  devMotionSub: any;
  gyroSub: any;

  dx_coord: number;
  dy_coord: number;
  dz_coord: number;

  gx_coord: number;
  gy_coord: number;
  gz_coord: number;

  sttButtonColor: string;
  sttButtonText: string;
  sttButtonDisable: boolean;

  stpButtonColor: string;
  stpButtonText: string;
  stpButtonDisable: boolean;

  datColColor: string;
  datColText: string;
  datColDisable: boolean;

  ardatacol: boolean;

  constructor(
    private devMotion: DeviceMotion,
    private gyro: Gyroscope,
    private store: NativeStorage) {

    // Initiate Frontend Stuff
    this.dx_coord = 4;
    this.dy_coord = 0;
    this.dz_coord = 4;
    this.gx_coord = 4;
    this.gy_coord = 0;
    this.gz_coord = 4;
    this.sttButtonText = "Start";
    this.stpButtonText = "Stop";
    this.datColText = "Start Data Collection"
    this.sttButtonColor = "success";
    this.stpButtonColor = "danger";
    this.datColColor = "primary";
    this.sttButtonDisable = false;
    this.stpButtonDisable = true;
    this.datColDisable = false;

    // Get Settings (If Exist)
    this.store.getItem('ardatacol').then(
      data => this.ardatacol,
      error => this.ardatacol = false
    )
  }

  ngOnInit() {
  }

  startAid() {
    console.log("Starting Aid Service...");
    this.sttButtonDisable = true;
    this.sttButtonText = "Running";
    this.sttButtonColor = "medium"
    this.stpButtonDisable = false;
    this.stpButtonText = "Stop";
    this.devMotionSub = this.devMotion.watchAcceleration().subscribe((accel: DeviceMotionAccelerationData) => {
      this.dx_coord = accel.x;
      this.dy_coord = accel.y;
      this.dz_coord = accel.z;
    });
  }

  stopAid() {
    console.log("Stopping Aid Service...");
    this.stpButtonDisable = true;
    this.stpButtonText = "Stopped";
    this.sttButtonDisable = false;
    this.sttButtonText = "Start";
    this.sttButtonColor = "success";
    this.devMotionSub.unsubscribe();
  }

  datCol() {
    console.log("Starting Data Collection for 5 shots.");
    this.sttButtonDisable = true;
    this.stpButtonDisable = true;
    this.datColDisable = true;
    this.datColColor = "secondary";
    this.datColText = "Collecting Data";
    const temp = this;
    setTimeout(function() {
      console.log("Data Collection completed.");
      temp.sttButtonDisable = false;
      temp.datColDisable = false;
      temp.datColColor = "primary";
      temp.datColText = "Collected Data"
    }, 5000);
  }
}
