import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { AppApiEndpoints } from '../app.api-endpoints';
import { HttpClientModule, HttpParams,HttpClient,HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient, private _appSettings: AppSettings, private appapiEndpoint: AppApiEndpoints) { }

  signup(data:any){
    let apiUrl = this._appSettings.API_NAMESPACE + this.appapiEndpoint.UserSignUp;
      return this.http.post(apiUrl, data).pipe(
          //map(responce=>responce),
      ); 
   }
   login(data) {
    let apiUrl = this._appSettings.API_NAMESPACE + this.appapiEndpoint.Userlogin;
    return this.http.post<any>(apiUrl, data) 
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user.data && user.data.access_token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem("vns_auth_user",JSON.stringify(user.data));
          localStorage.setItem("vns_auth_token",user.data.access_token);
        }
        return user;
      }));
  }
  
  verifyPhoneNumber(phoneData:any): Observable<any>
  {
    let apiUrl = this._appSettings.API_NAMESPACE + this.appapiEndpoint.verifyPhone;
    return this.http.post(apiUrl,phoneData);
  }

  }
