/// <reference types="web-bluetooth" />

import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-bluetooth-scanner',
  templateUrl: './bluetooth-scanner.component.html',
  styleUrls: ['./bluetooth-scanner.component.css'],
  imports: [NgIf, NgFor],
})
export class BluetoothScannerComponent implements OnInit, OnDestroy {
  devices: BluetoothDevice[] = [];
  isScanning: boolean = false;
  connectedDevice: BluetoothDevice | null = null;
  server: BluetoothRemoteGATTServer | null = null;
  characteristic: BluetoothRemoteGATTCharacteristic | null = null;
  value: number = 0;

  ngOnInit(): void {
    // No initialization needed for Web Bluetooth, permissions are handled on demand
  }

  async scanForDevices() {
    this.devices = []; // Clear previous results
    this.isScanning = true;

    try {
      const options = {
        acceptAllDevices: true, // Or filter by services:  services: ['YOUR_SERVICE_UUID']
        // optional: filters: [{ namePrefix: 'MyDevice' }] // Filter by name
      };

      const device = await navigator.bluetooth.requestDevice(options);
      console.log('Device found:', device);
      this.devices.push(device); // Add the device to the list

      // Listen for 'advertisementreceived' if you want to update device list
      // dynamically. This is more complex but provides a better UX.

      device.addEventListener('advertisementreceived', (event) => {
        // Handle updates, but be very careful of performance
        console.log('Advertisement Received', event);
      });
    } catch (error) {
      console.error('Error requesting device:', error);
    } finally {
      this.isScanning = false;
    }
  }

  async connect(device: BluetoothDevice) {
    try {
      if (device.gatt) {
        this.server = await device.gatt.connect(); // Connect to GATT server
      } else {
        throw new Error('GATT server is not available on this device.');
      }
      this.connectedDevice = device;
      console.log('Connected to GATT server:', this.server);

      // Example: Get a service and characteristic (replace with your UUIDs)
      const service = await this.server.getPrimaryService('YOUR_SERVICE_UUID');
      const characteristic = await service.getCharacteristic(
        'YOUR_CHARACTERISTIC_UUID'
      );
      this.characteristic = characteristic;

      // Example: Read a value
      const value = await characteristic.readValue();
      this.value = value.getUint8(0); // Assuming 8-bit value
      console.log('Value read:', this.value);

      // Example: Start notifications (if supported)
      // await characteristic.startNotifications();
      // characteristic.addEventListener('characteristicvaluechanged', this.handleCharacteristicValueChanged.bind(this));
    } catch (error) {
      console.error('Error connecting:', error);
    }
  }

  async disconnect() {
    if (this.server) {
      if (this.characteristic) {
        // await this.characteristic.stopNotifications();
        // this.characteristic.removeEventListener('characteristicvaluechanged', this.handleCharacteristicValueChanged.bind(this));
        this.characteristic = null;
      }
      this.server.disconnect();
      this.server = null;
      this.connectedDevice = null;
      console.log('Disconnected');
    }
  }

  handleCharacteristicValueChanged(event: any) {
    const value = event.target.value;
    // Process the new value
    console.log('Characteristic Value Changed', value);
    this.value = value.getUint8(0);
  }

  ngOnDestroy() {
    this.disconnect(); // Disconnect when component is destroyed
  }
}
