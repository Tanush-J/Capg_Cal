import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { catchError, Observable } from 'rxjs';
import { BackendFormulaFormat } from '../interfaces/BackendFormulaFormat';

@Injectable({
  providedIn: 'root'
})

export class GetTSIService {

  constructor(private http: HttpClient) { }

  getTSI(): Observable<object> {
    return this.http.get('https://dynamickpitesting.azurewebsites.net/api/MachineParameters?code=Ip7cZzYY1SfvjLU80UCCbW6PjB5RNCo3EN7fz_EblaIpAzFusRernQ==');
  }

  writeFormula(saveFormula: BackendFormulaFormat): Observable<BackendFormulaFormat> {
    return this.http.post<BackendFormulaFormat>('https://dynamickpitesting.azurewebsites.net/api/WriteFormula?code=vsJFbac0eTcnsZODGbe68zVGb2KcdoS7eltrrsj7Op4bAzFuLTMUWg==', saveFormula);
  }

  selectedFormulaApi(selectedFormula: any){
    return this.http.post('https://dynamickpicalculation.azurewebsites.net/api/Calculation?code=z6L3fjjAP-Re6q6MUejUDKOoNJzQbY5jhns-SKhkV_bOAzFukhaaQQ==', selectedFormula)
  }
}