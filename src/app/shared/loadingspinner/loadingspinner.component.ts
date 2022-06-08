import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loadingspinner',
  template: '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>',
  styleUrls: ['./loadingspinner.component.css']
})
export class LoadingspinnerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
