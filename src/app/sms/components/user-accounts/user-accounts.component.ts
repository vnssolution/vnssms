import { Component, OnInit,ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService  } from 'ngx-toastr';
import { Routes, Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { AccountService } from '../../services/account.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-user-accounts',
  templateUrl: './user-accounts.component.html',
  styleUrls: ['./user-accounts.component.css']
})
export class UserAccountsComponent implements OnInit {
  addUserForm: FormGroup;
  submitted = false;
  accountsList:any;
  currentPage = 1;
  public pageInformation:any;
  public totalCount:number=0; 
  showSpinner: any = false;

  constructor(private toastr:ToastrService,private accountService:AccountService,
    private loader:NgxUiLoaderService,private route: ActivatedRoute,private router:Router,
    private formBuilder: FormBuilder) { 

      this.addUserForm = this.formBuilder.group({
        'username':['',Validators.required],
        'email': ['', [
          Validators.required, 
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
           ]],
        'mobile': ['',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        'orgnaization':[''],
        'credits': [''],
        'senderId': [''],
    
      });
    }

  ngOnInit(): void {
    this.loader.start();
    this.getAccountlistData();
 }
 getAccountlistData(){
    const data = { "action" : "sub_accounts","free_text":"","page":1,"per_page":10}
    this.fetchSubAccountList(data);
  }
 
 searchValue:any;
searchList(event: any): void {  
  this.accountsList =[];
  this.showSpinner = true;
  this.searchValue = event.target.value;
  const data = { "action" : "sub_accounts","free_text":this.searchValue,"page":1,"per_page":10}
    this.fetchSubAccountList(data);
}
 fetchSubAccountList(data){
  this.accountService.getSubAccountsList(data)
  .subscribe(  
     response=>{
      this.loader.stop();
      if(response['status_code'] == 200){  
               this.showSpinner = false;
               this.accountsList = response['data']['user_list'];
               this.pageInformation = response['data']['pageInformation'];
               this.totalCount =  this.pageInformation.totalCount;
               this.currentPage = 1;  
             }else {
                this.toastr.warning('', response['error'].message);
              }
              },error =>{
              console.log("Some thing went wrong");
        });
 }
 pageChanged(event){
   
  this.currentPage = event;
  this.loader.start();
  const data = { "action" : "sub_accounts","free_text":"","page":this.currentPage,"per_page":10}
  this.accountService.getSubAccountsList(data)
  .subscribe(  
     response=>{
      this.loader.stop();
      if(response['status_code'] == 200){  
                this.accountsList = response['data']['user_list'];
                this.pageInformation = response['data']['pageInformation'];
                this.totalCount =  this.pageInformation.totalCount;
             }else {
                this.toastr.warning('', response['error'].message);
              }
              },error =>{
              console.log("Some thing went wrong");
        });
}


 get f() { return this.addUserForm.controls; }

 onSubmit(post:any){
   this.submitted = true;
  //  const invalid = [];
  //  const controls = this.addUserForm.controls;
  //  for (const name in controls) {
  //      if (controls[name].invalid) {
  //          invalid.push(name);
  //      }
  //  }
  //  console.log(invalid);
  //  return invalid;
   if (this.addUserForm.invalid) {     
     console.log("invalid"); return false;
    } 
    this.loader.start();
   const signupData = {
         "username":post['username'],
         "email":post['email'],
         "std_code":"+91",
         "phone":post['mobile'],
         "organization":post['orgnaization'],
         "credits":post['credits'],
         "sender_id":post['senderId'],
         "profile_pic":""
      }

   this.accountService.createAccount(signupData)
   .subscribe(
       response=>{
         this.loader.stop();
         if(response['status_code'] == 200){
           this.toastr.success('Success', response['success'].message);

           const data = { "action" : "sub_accounts","free_text":"","page":1,"per_page":10}
           this.fetchSubAccountList(data);
         }else {
           this.toastr.warning('', response['error'].message);
         } 
       },error =>{
         this.loader.stop();
         console.log("Some thing went wrong");  
   }); 
 }

}


