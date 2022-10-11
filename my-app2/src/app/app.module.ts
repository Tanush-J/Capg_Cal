import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CalculatorComponent } from './calculator/calculator.component';

import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import { CalculatorModalComponent } from './calculator-modal/calculator-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorHandlingInterceptor } from './Interceptors/error-handling.interceptor';

registerLocaleData(localeNl);

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CalculatorComponent,
    CalculatorModalComponent,
  ],
  imports: [BrowserModule,
    ReactiveFormsModule, AppRoutingModule, FormsModule, NgbModule,
    BrowserAnimationsModule, HttpClientModule, ToastrModule.forRoot({preventDuplicates: true, autoDismiss: true, closeButton: true}),
  ],
  providers: [ {provide: HTTP_INTERCEPTORS, useClass: ErrorHandlingInterceptor, multi: true}],
  bootstrap: [AppComponent],
})

export class AppModule { }
