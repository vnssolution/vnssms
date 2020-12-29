import { Injectable } from '@angular/core';
import { AppSettings } from '../../app.settings';
import { AppApiEndpoints } from '../../app.api-endpoints';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClientModule, HttpParams,HttpClient,HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  reqHeader:any;

  constructor(private httpClient: HttpClient,private _appSettings: AppSettings, 
    private appapiEndpoint: AppApiEndpoints) { 
      this.reqHeader = new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('vns_auth_token'),
      });
    }
    getSubAccountsList(data:any):Observable<any>
    { 
      let apiUrl = this._appSettings.API_NAMESPACE + this.appapiEndpoint.userAccountList;   
      return this.httpClient.post(apiUrl, data,{ headers: this.reqHeader });
    }

    createAccount(data:any):Observable<any>
    { 
      let apiUrl = this._appSettings.API_NAMESPACE + this.appapiEndpoint.addUserAccount;   
      return this.httpClient.post(apiUrl, data,{ headers: this.reqHeader });
    }
    
  }
