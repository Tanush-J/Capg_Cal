import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  counter(i: number) {
    return new Array(i);
  }
  constructor() { }

  ngOnInit(): void {
  }

}
