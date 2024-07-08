import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userData = new BehaviorSubject<any>({});
  currentUserData = this.userData.asObservable();

  constructor() { }

  updateUserData(data: any) {
    this.userData.next(data);
  }
}
