import { Component, OnInit,ViewChild } from '@angular/core';
import { Validators, ValidatorFn, AbstractControl, FormControl, FormGroup,FormArray, FormBuilder } from '@angular/forms';
import { ToastrService  } from 'ngx-toastr';
import { Routes, Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { ContactService } from '../../services/contact.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-sms-history',
  templateUrl: './sms-history.component.html',
  styleUrls: ['./sms-history.component.css']
})
export class SmsHistoryComponent implements OnInit {
  dateRangeSearchForm:FormGroup;
  dtOptions: any;
  dtTrigger = new Subject();
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  getMsgsHistory:any;
  public pageInformation:any;
  public totalCount:number=0; 
  currentPage = 1;

  constructor(private toastr:ToastrService,private contactService:ContactService,
    private loader:NgxUiLoaderService,private route: ActivatedRoute,private router:Router,private formBuilder: FormBuilder,
    ) {
      this.dtOptions = {
        pagingType: 'full_numbers',
        dom: 'lBfrtip',
        responsive: true,
        buttons: [
          'csv', 'excel', 'pdf', 'print'
        ]
      };

      this.dateRangeSearchForm = this.formBuilder.group({
        'dateRange':['',Validators.required],
       });
     }

  ngOnInit(): void {
    this.getMsgsTypeHistory('campaigns');
  }
  getMsgsTypeHistory(msgType:string){
    this.loader.start();
    const data = {"type":msgType,
                "free_text":"",
                "from_date":"",
                "to_date":"",
                "report":"",
                "page":1,
                "per_page":10}
        this.contactService.sentHistory(data)
        .subscribe(  
           response=>{
            this.loader.stop();
            if(response['status_code'] == 200){  
                     this.getMsgsHistory = response['data']['sent_history_list'];
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
  }



 
}
