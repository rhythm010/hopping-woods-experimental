import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Angular';
  value = 0;
  timeActive = false;

  callFunction() {
    console.log('single click');
    this.value = this.value + 1;
    if (this.value === 1 && !this.timeActive) {
      setTimeout(() => {
        console.log('timer active');
        this.timeActive = true;
        if (this.value === 2) {
          console.log('double click');
          this.value = 0;
          this.timeActive = false;
        }
      }, 250);
    } else if (this.value > 2) {
      this.value = 0;
    }
    console.log(this.value);
  }

  doubleClick() {
    console.log('double click has happened');
  }

}
