import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  constructor(private toastrService: ToastrService) { }

  showWarning = (msg: string) => {
    this.toastrService.warning(msg);
  }

  showSuccess = (msg: string) => {
    this.toastrService.success(msg);
  }

  showError = (msg: string) => {
    this.toastrService.error(msg);
  }

  // interceptionError = (msg: string) => {
  //   this.toastrService.error(msg, '', {
  //     timeOut: 7000,
  //     positionClass: 'toast-top-center',
  //   });
  // }

  showHttpResponse = (msg: string) => {
    if (msg === 'Formula Exists!') {
      this.toastrService.info('Formula Exist in Backend');
    } else {
      this.toastrService.success('Formula Added to Backend');
    }
  }

  dismissToastrs = () => {
    this.toastrService.clear();
  }
}
