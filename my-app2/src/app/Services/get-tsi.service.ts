import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendFormulaFormat } from '../interfaces/BackendFormulaFormat';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class GetTSIService {

  constructor(private http: HttpClient) { }

  getTSI(): Observable<object> {
    return this.http.get(environment.GETTSIVALUESAPI);
  }

  writeFormula = (saveFormula: BackendFormulaFormat) => {
    return this.http.post(environment.WRITEFORMULAPI, saveFormula, {responseType: 'text'});
  }

  selectedFormulaApi(selectedFormula: any): Observable<any> {
    return this.http.post(environment.APPLYAPI, selectedFormula);
  }
}
