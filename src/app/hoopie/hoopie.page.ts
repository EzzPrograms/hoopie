import { Component, OnInit } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion/ngx';
import { Gyroscope, GyroscopeOptions, GyroscopeOrientation } from '@ionic-native/gyroscope/ngx';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-hoopie',
  templateUrl: './hoopie.page.html',
  styleUrls: ['./hoopie.page.scss'],
  providers: [],
})
export class HoopiePage implements OnInit {

  devMotionSub: any;
  gyroSub: any;
  gyroSubData: any;

  dx_coord: number;
  dy_coord: number;
  dz_coord: number;

  gx_coord: number;
  gy_coord: number;
  gz_coord: number;

  cgx_coord: number;
  cgy_coord: number;
  cgz_coord: number;

  cdx_coord: number;
  cdy_coord: number;
  cdz_coord: number;

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
  ardatacolg: boolean;

  constructor(
    private devMotion: DeviceMotion,
    private gyro: Gyroscope,
    private store: NativeStorage,
    private sub: Events,
    private blueSer: BluetoothSerial) {

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

    this.cdx_coord = 4;
    this.cdy_coord = 0;
    this.cdz_coord = 4;
    this.cgx_coord = 0;
    this.cgy_coord = 0;
    this.cgz_coord = 0;

    // Get Settings (If Exist)
    this.store.getItem('ardatacol').then(
      data => this.ardatacol,
      error => this.ardatacol = false
    )
    
    this.sub.subscribe("ardatacol", (data) => {
      console.log(data);
      this.ardatacol = (data);
    })

    this.sub.publish("ardatacol", this.ardatacolg);
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
    if(this.ardatacol == false) {
      try {
        const option: DeviceMotionAccelerometerOptions = {
          frequency: 100
        };
  
        this.devMotionSub = this.devMotion.watchAcceleration(option).subscribe((accel: DeviceMotionAccelerationData) => {
          this.dx_coord = accel.x;
          this.dy_coord = accel.y;
          this.dz_coord = accel.z;
        });
  
        let options: GyroscopeOptions = {
          frequency: 100
        }
  
        this.gyroSub = this.gyro.watch(options).subscribe((orient: GyroscopeOrientation) => {
          this.gx_coord = orient.x;
          this.gy_coord = orient.y;
          this.gz_coord = orient.z;
        });
      } catch {
        console.log("Sensor Error! Stopping...");
        this.stpButtonDisable = true;
        this.stpButtonText = "Stop";
        this.sttButtonDisable = false;
        this.sttButtonText = "Sensor Error!";
        this.sttButtonColor = "warning";
        this.devMotionSub.unsubscribe();
      }
    } else if (this.ardatacol == true) {
      // Incomplete due to: Lack of Bluetooth Classic support for iOS
    }
  }

  datCol() {
    console.log("Starting Data Collection for shots.");
    this.sttButtonDisable = true;
    this.stpButtonDisable = false;
    this.datColDisable = true;
    this.datColColor = "secondary";
    this.datColText = "Collecting Data";
    try {
      let options: GyroscopeOptions = {
        frequency: 100
      }

      this.gyroSubData = this.gyro.watch(options).subscribe((orient: GyroscopeOrientation) => {
        this.gx_coord = orient.x;
        this.gy_coord = orient.y;
        this.gz_coord = orient.z;
        if(this.gx_coord > this.cgx_coord) {
          this.cgx_coord = this.gx_coord;
        }
        if(this.gy_coord > this.cgy_coord) {
          this.cgy_coord = this.gy_coord;
        }
        if(this.gz_coord > this.cgz_coord) {
          this.cgz_coord = this.gz_coord;
        }
      });
    } catch {
      console.log("Sensor Error! Stopping...");
      this.stpButtonDisable = true;
      this.stpButtonText = "Stop";
      this.sttButtonDisable = false;
      this.sttButtonText = "Sensor Error!";
      this.sttButtonColor = "warning";
      this.gyroSubData.unsubscribe();
    }
    /*
    setTimeout(function() {
      console.log("Data Collection completed.");
      temp.sttButtonDisable = false;
      temp.datColDisable = false;
      temp.datColColor = "primary";
      temp.datColText = "Collected Data"
    }, 5000);
    */
  }

  stopAid() {
    console.log("Stopping Aid Service...");
    this.stpButtonDisable = true;
    this.stpButtonText = "Stopped";
    this.sttButtonDisable = false;
    this.sttButtonText = "Start";
    this.sttButtonColor = "success";
    this.devMotionSub.unsubscribe();
    this.gyroSub.unsubscribe();
    this.gyroSubData.unsubscribe();
  }
}
