import {
  Component,
  ViewChild,
} from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';

// import { }
// const tf = require('@tensorflow/tfjs');
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

// const mobilenet = require('@tensorflow-models/mobilenet');

// webcam = await tf.data.webcam(webcamElement);

@Component({
  selector: 'dwu-pp-test-app',
  templateUrl: './pp-test-app.component.html',
  styleUrls: ['./pp-test-app.component.scss']
})
export class PpTestAppComponent {

  public selectedImageSource$: Observable<any>;
  // @ViewChild('videoEl', { static: true }) videoEl;
  @ViewChild('webCamEl', { static: true }) webCamEl;

  public results: any[];
  public webCamStopper;

  constructor(
    public store: Store,
  ) {
    // this.selectedImageSource$ = this.store.pipe(select(getSelectedImageSource$));
  }

  public ngOnInit() {
    // console.log(this.videoEl)

  }

  public ngOnDestroy() {
    this.stopVideo(this.webCamEl.nativeElement);
  }

  public stopVideo(video) {
    const stream = video.srcObject;
    const tracks = (stream && stream.getTracks()) || [];
    tracks.forEach((track) => track.stop());
    // this.stopStream(video.srcObject);
    video.srcObject = null;
  }

  // public stopStream(stream) {
  //   const tracks = (stream && stream.getTracks()) || [];
  //   tracks.forEach((track) => track.stop());
  // }

  public async onEnableCamera() {
    if (navigator.mediaDevices.getUserMedia) {
      // this.webCamStopper = await this.runClassifierOnStream();
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          console.log('stream', stream)
          this.webCamEl.nativeElement.srcObject = stream;
          // this.runClassifierOnStream();
        })
        .catch((error) => {
          console.log("Something went wrong!", error);
        });
    }
  }

  public async runClassifierOnStream(stream?: any) {
    const net = await mobilenet.load();

    const webcam = await tf.data.webcam(this.webCamEl.nativeElement, {
      resizeWidth: 320,
      resizeHeight: 160,
    });
    console.log('webcam', webcam);

    const interval = setInterval(async () => {
      const img = await webcam.capture();
      const results = await net.classify(img);
      this.results = results;
      // console.log('results', results)
      // document.getElementById('console').innerText = `
      //   prediction: ${result[0].className}\n
      //   probability: ${result[0].probability}
      // `;
      // Dispose the tensor to release the memory.
      img.dispose();

      // Give some breathing room by waiting for the next animation frame to
      // fire.
      await tf.nextFrame();
    }, 1000);

    return () => {
      webcam.stop();
      clearInterval(interval);
    };

    // while (true) {
      // const img = await webcam.capture();
      // const result = await net.classify(img);

      // console.log('result', result);
      // // document.getElementById('console').innerText = `
      // //   prediction: ${result[0].className}\n
      // //   probability: ${result[0].probability}
      // // `;
      // // Dispose the tensor to release the memory.
      // img.dispose();

      // // Give some breathing room by waiting for the next animation frame to
      // // fire.
      // await tf.nextFrame();
    // }

  }

  public onDisableCamera() {
    this.webCamStopper && this.webCamStopper();
    this.results = [];
    this.stopVideo(this.webCamEl.nativeElement);
  }

  public onLabelChange(imageSourceId: string, label: string) {
    // this.store.dispatch(ImageSourcesActions.updateImageSource({ imageSourceId, patch: { label } }));
  }

  public onDescriptionChange(imageSourceId: string, description: string) {
    // this.store.dispatch(ImageSourcesActions.updateImageSource({ imageSourceId, patch: { description } }));
  }

}
