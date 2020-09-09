import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userData:any;

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem("vns_auth_user"));
    console.log(this.userData);
  }
  
  logOut(){
    // remove user from local storage to log user out
    this.router.navigate(["/"]);
    localStorage.removeItem('vns_auth_user');
    localStorage.removeItem('vns_auth_token');
}

}
