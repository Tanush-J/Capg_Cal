import { Injectable } from '@angular/core';
import * as math from 'mathjs';

@Injectable({
  providedIn: 'root'
})
export class SyntaxValidationService {

  constructor() { }
  isValid(input: string){
    try{
      math.parse(input);
    }
    catch(err: any){
      return false;
    }
    return true;
  } 
}
