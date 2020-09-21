import { Injectable } from '@angular/core';
import { AppSettings } from '../../app.settings';
import { AppApiEndpoints } from '../../app.api-endpoints';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClientModule, HttpParams,HttpClient,HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  reqHeader:any;

  constructor(private httpClient: HttpClient,private _appSettings: AppSettings, 
    private appapiEndpoint: AppApiEndpoints) { 
      this.reqHeader = new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('vns_auth_token'),
      });
    }
    uploadContacts(data:any):Observable<any>
      { 
        let apiUrl = this._appSettings.API_NAMESPACE + this.appapiEndpoint.uploadContacts;    
        return this.httpClient.post(apiUrl, data,{ headers: this.reqHeader });
      }
    getContactList(data:any):Observable<any>
      { 
        let apiUrl = this._appSettings.API_NAMESPACE + this.appapiEndpoint.contactList;    
        return this.httpClient.post(apiUrl, data,{ headers: this.reqHeader });
      } 
      manageGroup(data:any):Observable<any>
      { 
        let apiUrl = this._appSettings.API_NAMESPACE + this.appapiEndpoint.manageGroup;    
        return this.httpClient.post(apiUrl, data,{ headers: this.reqHeader });
      }
      getGroupsList(data):Observable<any>
      { 
        let apiUrl = this._appSettings.API_NAMESPACE + this.appapiEndpoint.groupList;    
        return this.httpClient.post(apiUrl, data,{ headers: this.reqHeader });
      }

      createTemplate(data:any):Observable<any>
      { 
        let apiUrl = this._appSettings.API_NAMESPACE + this.appapiEndpoint.manageTemplate;    
        return this.httpClient.post(apiUrl, data,{ headers: this.reqHeader });
      }
      manageTemplate(data:any):Observable<any>
      { 
        let apiUrl = this._appSettings.API_NAMESPACE + this.appapiEndpoint.manageTemplate;    
        return this.httpClient.post(apiUrl, data,{ headers: this.reqHeader });
      }
      sendMessage(data:any):Observable<any>
      { 
        let apiUrl = this._appSettings.API_NAMESPACE + this.appapiEndpoint.sendMessage;    
        return this.httpClient.post(apiUrl, data,{ headers: this.reqHeader });
      }
      getStatusList():Observable<any>
      { 
        let apiUrl = this._appSettings.API_NAMESPACE + this.appapiEndpoint.getStatusList;    
        return this.httpClient.post(apiUrl, { headers: this.reqHeader });
      }
}
