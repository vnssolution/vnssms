import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VnsSharedService } from '../../services/vns-shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userData:any;
  totalCredits:any;
  constructor(private router:Router, private vnsservice:VnsSharedService) { 
    this.vnsservice.totalsmscount.subscribe(totalCredits =>{
      this.totalCredits = totalCredits;
    })
  }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem("vns_auth_user"));
  }
  
  logOut(){
    // remove user from local storage to log user out
    this.router.navigate(["/"]);
    localStorage.removeItem('vns_auth_user');
    localStorage.removeItem('vns_auth_token');
}

}
