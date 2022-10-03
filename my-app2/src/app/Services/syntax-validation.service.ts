import { Injectable } from '@angular/core';
import * as math from 'mathjs';

@Injectable({
  providedIn: 'root'
})
export class SyntaxValidationService {

  constructor() { }
  isValid = (input: string) => {
    try {
      math.parse(input);
    } catch (err: any) {
      return false;
    }
    try {
      math.evaluate(input);
    } catch (e) {
      if (e instanceof TypeError) {
        return false;
      }
    }
    return true;
  }
}
