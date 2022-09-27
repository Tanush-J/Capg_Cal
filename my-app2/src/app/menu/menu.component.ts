import { Component, OnInit } from '@angular/core';
import { food } from '../interfaces/food';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  foods: food[] = [
    {name: 'orange', type: 'fruit'},
    {name: 'cabbage', type: 'vegetable'},
  ]

  inputText: string = '';
  inputText2: string = '';
  handleChange(event: any){
    this.inputText = event.target.value;
  }
}
