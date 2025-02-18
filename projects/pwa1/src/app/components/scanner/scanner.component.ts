import { Component, OnInit } from '@angular/core';

import * as SDCCore from 'scandit-web-datacapture-core';
import * as SDCBarcode from 'scandit-web-datacapture-barcode';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
})
export class ScannerComponent implements OnInit {
  constructor() {}

  async ngOnInit(): Promise<void> {
    await SDCCore.configure({
      licenseKey:
        'Av71em4HSIEnN6dNQM/z5VQVFERGB4bFshKScEA24E+uZqQ2yWMUmX1RP7eQc+QpAVd0pLR7yT9GMjw2pmTy5ZZvbGSZFSr9KWC1KJUfF+ZAVXhKtxbZqhMPraAtbJnQ/nTYWxMf7gMXRqcI91cPYDp9mlQfOAllrx2S9OYisKvRebLMbHM1bPNjUZj2KKZ5WwbMLhMvM8ZPVOjG6hqTLqwcboDSOdKmGRhOF0MeozKVIjEQmi5PPHNKPnmPWz1VOy6r9vczkZfFA/3jYQhXVDgd+e5KLoy82x//op0MuxDPaNdImSQPOlsv2mSHMJFhUDzkH3I2Rb9sKypsUSlBvKod+re1M/R+2kWLPY1GPfAoWmnHrUDNabIdV+YTXxxreVEBCrJCaAelY1HW4ic0j8BadlY4fqOYQV0sRAcJJ3DOTHwcdD8RuA9G5PjoMcbDiFUqOm5FPpTzTGvA4QFVAa5OXJEkUWcowF2Ka70XTWUCZqJqd0ibJtEhRkkCJkIoMmDfPbBgSrzZbJR/6g5+/hVkwoG3an9LYWlR8NJS5/mNFy3F0FQJU5Vf7D+rXDy9NFM/ES9c6vsoatYCB2MqH9dbUaL7dal0olDFvE1KDIGQXJznUA9CL3sEvWv/XcujakjeWH4uz87iM1KAQ2v6BGt9V4cBLfUa+XApVZ08Wb5vSET5bxEyvfxunDO4KYGRRkwfCutzTpuRYWHfoyukOx1/bhRRWhnXUjc7OU0ZzH8GR8mkHzBzvfQ9VLqie3b2Zgi+0Rex9HwyVeksJKOuqiqCSSENXXP1ay/uA20EvujFkVLoFEfuBG5SmF+JumS26x1eHCPAm41JJA6M5JbHMef9fDkBJK3jW6+zL4YYu+8nQDGBw/XaKB65rv3eGAvCQmRXT8ZnACQiqWhSCUf54KeOIoDSXl3QHgV5cuy93nraS/dOkuR8AqbP0VndJfBO0RwAxAJ1AHcXznxAo89C4xkDgBNVkGcDpGtvfFZnLBrfVUE8d2DJ5aNYSJNGm9mqXuYy8UsKWwsQfkHLRKbgtAvUpwlRhdoTDU4WqvvpkS9Ml9wSWPSO+TtX6zBHud/1IndKrs9JRtF5ZSMQM3RDJb7lzpqXgAu35DMFpnQV/X5iKAoU2FGi/S+Pk5cKxOvE0yTJoSDkticDRAbQCm9+UAF69pNT9okYPHNgP/DBmsiQ1yqk0IXIlPOulFK/G2Jk2vNAOqWZ4k+lquoRNIyRl+hrFl3XYBvSrBsjg9WHblpbCHLPyK1twhLnQbjy9rxBFiX+BqYt8rwCEiRdPvlw9vIvMKf5+wFbya0QGTGoYhXy5uJbYXvyYCJr3qf3plrMQzQOA+8Cwk9a6x178vbJQjDx/3FhF0m/mrIpZ8JiM2576tBHpE1Yg/Xh3mA6WfJOmMsFCbDJmAAA1FflswLI+Lch46G5C0CzemlvQg==',
      libraryLocation:
        'https://cdn.jsdelivr.net/npm/scandit-web-datacapture-barcode@6.x/build/engine/',
      moduleLoaders: [SDCBarcode.barcodeCaptureLoader()],
    });

    const context = await SDCCore.DataCaptureContext.create();

    const camera = SDCCore.Camera.default;
    await context.setFrameSource(camera);

    const settings = new SDCBarcode.BarcodeCaptureSettings();
    settings.enableSymbologies([
      SDCBarcode.Symbology.Code128,
      SDCBarcode.Symbology.Code39,
      SDCBarcode.Symbology.QR,
      SDCBarcode.Symbology.EAN8,
      SDCBarcode.Symbology.UPCE,
      SDCBarcode.Symbology.EAN13UPCA,
    ]);

    const symbologySetting = settings.settingsForSymbology(
      SDCBarcode.Symbology.Code39
    );
    symbologySetting.activeSymbolCounts = [
      7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ];

    const barcodeCapture = await SDCBarcode.BarcodeCapture.forContext(
      context,
      settings
    );
    await barcodeCapture.setEnabled(false);

    barcodeCapture.addListener({
      didScan: async (barcodeCapture, session) => {
        await barcodeCapture.setEnabled(false);
        const barcode = session.newlyRecognizedBarcodes[0];
        const symbology = new SDCBarcode.SymbologyDescription(
          barcode.symbology
        );
        console.log('Scanned: ' + barcode.data + ' ' + symbology.readableName);
        //alert('Scanned: ' + barcode.data + ' ' + symbology.readableName);
        await barcodeCapture.setEnabled(true);
      },
    });

    const view = await SDCCore.DataCaptureView.forContext(context);
    view.connectToElement(document.getElementById('data-capture-view')!);
    view.addControl(new SDCCore.CameraSwitchControl());

    const barcodeCaptureOverlay =
      await SDCBarcode.BarcodeCaptureOverlay.withBarcodeCaptureForViewWithStyle(
        barcodeCapture,
        view,
        SDCBarcode.BarcodeCaptureOverlayStyle.Frame
      );

    const viewfinder = new SDCCore.RectangularViewfinder(
      SDCCore.RectangularViewfinderStyle.Square,
      SDCCore.RectangularViewfinderLineStyle.Light
    );
    await barcodeCaptureOverlay.setViewfinder(viewfinder);

    await camera.switchToDesiredState(SDCCore.FrameSourceState.On);
    await barcodeCapture.setEnabled(true);
  }
}
