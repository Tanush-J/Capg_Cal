import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MenuComponent } from './menu/menu.component';
import { ColorRedDirective } from './directives/color-red.directive';
import { MouseActionDirective } from './directives/mouse-action.directive';
import { FormsModule } from '@angular/forms';
import { FoodItemComponent } from './food-item/food-item.component';
import { CalculatorComponent } from './calculator/calculator.component';

import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import { CalculatorModalComponent } from './calculator-modal/calculator-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

registerLocaleData(localeNl);

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    MenuComponent,
    ColorRedDirective,
    MouseActionDirective,
    FoodItemComponent,
    CalculatorComponent,
    CalculatorModalComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, NgbModule],
  providers: [],
  bootstrap: [AppComponent],
})

export class AppModule {}
