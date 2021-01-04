import { Component, OnInit } from '@angular/core';
import { Validators, ValidatorFn, AbstractControl, FormControl, FormGroup,FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { AccountService } from '../../services/account.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService  } from 'ngx-toastr';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-credit-history',
  templateUrl: './credit-history.component.html',
  styleUrls: ['./credit-history.component.css']
})
export class CreditHistoryComponent implements OnInit {
  dateRangeSearchForm:FormGroup;
  userId:any;
  currentPage = 1;
  public pageInformation:any;
  public totalCount:number=0; 
  showSpinner: any = false;
  credHistory;

  constructor(private toastr:ToastrService, private route: ActivatedRoute, private formBuilder: FormBuilder, private accountService:AccountService,
    private loader:NgxUiLoaderService ) { 

    this.dateRangeSearchForm = this.formBuilder.group({
      'dateRange':['',Validators.required],
     });

  }

  ngOnInit(): void {
    this.loader.start();
    this.route.params.subscribe(params => {
      this.userId = params.uid;
      if(params.uid>0){
         const data = {"action":"sub_account_history","user_id":this.userId,"from_date":"","to_date":"","page":1,"per_page":10}
         this.getCreditHistory(data);
      }
    });

  }
getCreditHistory(data){
  this.credHistory =[];
  this.showSpinner = true;
  this.accountService.manageUserAccounts(data)
  .subscribe(  
     response=>{
      this.loader.stop();
      if(response['status_code'] == 200){  
               this.showSpinner = false;
               this.credHistory = response['data']['user_list'];
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
onSubmit(postData:any){
  if(postData['dateRange']==''){
    this.toastr.warning('', "Please select date"); return false;
  } 
  var startDate = this.convertDate(postData['dateRange'][0]);
  var endDate = this.convertDate(postData['dateRange'][1]);
  const data = {"action":"sub_account_history","user_id":this.userId,"from_date":startDate,"to_date":endDate,"page":1,"per_page":10}
  this.getCreditHistory(data);
}

  reset(){
    const data = {"action":"sub_account_history","user_id":this.userId,"from_date":"","to_date":"","page":1,"per_page":10}
    this.getCreditHistory(data);
    $("#daterange").val("");
  }
convertDate(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
} 


}
