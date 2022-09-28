import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { formula } from '../interfaces/formula';

@Injectable({
  providedIn: 'root'
})

export class GetTSIService {

  constructor(private http: HttpClient) { }

  getTSI(): Observable<object>{
    return this.http.get('https://jsonplaceholder.typicode.com/users');
  }

  writeFormula(saveFormula: formula): Observable<formula>{
    return this.http.post<formula>('https://reqres.in/invalid-url', saveFormula);
  }
}
