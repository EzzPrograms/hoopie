import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Component, OnInit, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { ToastController, NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.page.html',
  styleUrls: ['./sensors.page.scss'],
})
export class SensorsPage implements OnInit {
  /*
  pairedlist: pairedList;
  devices: any[] = [];
  bleDetails: any;
  bleNames: any;

  constructor(private ble: BLE,
              private toastCtrl: ToastController,
              private ngzone: NgZone,
              private blueduino: BluetoothSerial) { }

  ngOnInit() {
  }

  scanBLE() {
    this.ble.scan([], 5).subscribe(
      device => this.onDeviceDiscovered(device)
    );
    this.blueduino.list().then(success => {
      this.pairedlist = success;
    })
  }

  onDeviceDiscovered(device) {
    let connectedDevice = this.pairedlist[0];
  }

  scanError(error) {
    this.setStatus("Error: " + error);
    this.presentToast();
  }

  setStatus(message) {
    console.log("[Sensor Log] - " + message);
  }

  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: 'Error Scanning for Bluetooth Low Energy Devices',
      position: 'middle',
      duration: 3000
    });
    toast.present();
  }

  connectPeripheral(address) {
    console.log("Connecting to: " + address);
    this.blueduino.connect(address).subscribe(success => {
      console.log("Success!");
    })
    this.blueduino.write('1');
    this.blueduino.write('8');
  }

  deviceSelected(device) {
    console.log(JSON.stringify(device) + ' selected');
    // var deviceinfo = JSON.parse(device);
    console.log("ID: " + device.id);
    this.connectPeripheral(device.id);
  }
  */
 pairedList: pairedlist;
 listToggle: boolean = false;
 pairedDeviceID: number = 0;
 dataSend: string = "";

 constructor(public navCtrl: NavController,
  private alertCtrl: AlertController,
  private bluetoothSerial: BluetoothSerial) {
   this.checkBluetoothEnabled();
 }

 ngOnInit() {

 }

 checkBluetoothEnabled() {
   this.bluetoothSerial.isEnabled().then(success => {
     this.listPairedDevices();
   }, error => {
     this.showError("Please Enable Bluetooth")
   });
 }

 listPairedDevices() {
   this.bluetoothSerial.list().then(success => {
     this.pairedList = success;
     this.listToggle = true;
   }, error => {
     this.showError("Please Enable Bluetooth")
     this.listToggle = false;
   });
 }

 selectDevice() {
   let connectedDevice = this.pairedList[this.pairedDeviceID];
   if (!connectedDevice.id) {
     this.showError('Select Paired Device to connect');
     return;
   }
   let id = connectedDevice.id;
   let name = connectedDevice.name;

   this.connect(id);
 }

 connect(address) {
   // Attempt to connect device with specified address, call app.deviceConnected if success
   this.bluetoothSerial.connect(address).subscribe(success => {
     this.deviceConnected();
     console.log("Successfully Connected");
   }, error => {
     this.showError("Error: Connecting to Device");
   });
 }

 deviceConnected() {
   // Subscribe to data receiving as soon as the delimiter is read
   this.bluetoothSerial.subscribe('\n').subscribe(success => {
     this.handleData(success);
     console.log("Connected Successfullly");
   }, error => {
     this.showError(error);
   });
 }

 deviceDisconnected() {
   // Unsubscribe from data receiving
   this.bluetoothSerial.disconnect();
   console.log("Device Disconnected");
 }

 handleData(data) {
   console.log(data);
 }

 sendData(data) {
  data+='\n';
  console.log(data);

  this.bluetoothSerial.write(data).then(success => {
    console.log(success);
  }, error => {
    this.showError(error)
  });
}

 sendCustomData() {
   this.dataSend+='\n';
   console.log(this.dataSend);

   this.bluetoothSerial.write(this.dataSend).then(success => {
     console.log(success);
   }, error => {
     this.showError(error)
   });
 }

 async showError(error) {
   const alert = await this.alertCtrl.create({
     header: 'Error',
     subHeader: error,
     buttons: ['Dismiss']
   });
   await alert.present();
 }

 /*
 showToast(msj) {
   const toast = this.toastCtrl.create({
     message: msj,
     duration: 1000
   });
   toast.present();

 }
 */
}

interface pairedlist {
  "class": number,
  "id": string,
  "address": string,
  "name": string
}
