import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import Speech from 'speak-tts';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  speech: any;
  speechData: any;
  result: any;
  html: any;
  ax = false;
  constructor() {
    this.speech = new Speech();
    if (this.speech.hasBrowserSupport()) {
      console.log('Soportado!!!');
      this.speech.init({
        'volume': 0,
        'lang': 'es-MX',
        'rate': 0,
        'pitch': 1,
        'splitSentences': true,
        'listeners': {
          'onvoiceschanged': (voices) => {
            // console.log('Cambio de voces', voices)
          }
        }
      }).then((data) => {
        // console.log('Speech is ready, voices are available', data);
        this.speechData = data;
        // console.log(this.speechData);
        data.voices.forEach(voice => {
          // console.log(voice.name + ' ' + voice.lang)
        });
      }).catch(e => {
        console.error('An error occured while initializing : ', e)
      });
    }
  }

  start(text: string) {
    this.speech.cancel();
    // console.log(text);
    this.result = text;
    // console.log(this.result);
    this.speech.speak({
      text: this.result,
    }).then(() => {
      console.log('Success !');
    }).catch(e => {
      console.error('An error occurred :', e);
    });
  }

  pause() {
    this.speech.pause();
  }

  resume() {
    this.speech.resume();
  }

  setLanguage(i) {
    // console.log(i);
    // console.log(this.speechData.voices[i].lang + this.speechData.voices[i].name);
    this.speech.setLanguage(this.speechData.voices[i].lang);
    this.speech.setVoice(this.speechData.voices[i].name);
  }

  getSpeechData() {
    // console.log(this.speechData);
    return this.speechData;
  }

  setVolume(v) {
    this.speech.setVolume(v);
  }

  getVolume() {
    // console.log(this.speech.volume);
    return this.speech.volume;
  }

  prueba() {
   // console.log(this.speechData);
  }
}
