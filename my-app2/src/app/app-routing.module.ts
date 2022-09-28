import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculatorComponent } from './calculator/calculator.component';

const routes: Routes = [
  { path: '', component: CalculatorComponent},
  { path: 'menu', component: CalculatorComponent },
  {path: 'calculator', component: CalculatorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
