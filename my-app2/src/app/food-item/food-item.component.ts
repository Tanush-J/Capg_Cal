import { Component, OnInit } from '@angular/core';
import { food } from '../interfaces/food';

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.scss']
})
export class FoodItemComponent implements OnInit {

  // @Input() foodItem: food = { } as food;

  constructor() { }

  ngOnInit(): void {
  }

}
