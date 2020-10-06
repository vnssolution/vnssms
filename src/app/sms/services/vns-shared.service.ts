import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ContactService } from '../services/contact.service';

@Injectable({
  providedIn: 'root'
})
export class VnsSharedService {
public totalsmscount = new BehaviorSubject<number>(0);

  constructor(private smsService:ContactService) {
    smsService.getUserData().subscribe((data:any)=>{
       this.totalsmscount.next(data['data'].credits);
    })
   }
}
