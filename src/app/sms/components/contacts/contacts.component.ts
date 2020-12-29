import { Component, OnInit,ViewChild } from '@angular/core';
import { Validators, ValidatorFn, AbstractControl, FormControl, FormGroup,FormArray, FormBuilder } from '@angular/forms';
import { ToastrService  } from 'ngx-toastr';
import { Routes, Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { ContactService } from '../../services/contact.service';
import { VnsSharedService } from '../../services/vns-shared.service';
import * as XLSX from 'xlsx'; 
import * as FileSaver from 'file-saver'; 
import * as Papa from 'papaparse';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ExportExcelService } from '../export-excel.service';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
 addContactForm:FormGroup;
 contactsList:any;
 approvedTemplates:any;
 statusList:any;
 templateMsg:any;
 dtOptions: any;
 dtTrigger = new Subject();
 @ViewChild(DataTableDirective, { static: true })
 dtElement: DataTableDirective;
 groupId:any;
 phoneNumbersList=[];
 showSpinner: any = false;
 currentPage = 1;
 public pageInformation:any;
 public totalCount:number=0; 

 //createWhiteListForm:FormGroup;
 totalsmscount:any;
  constructor(private toastr:ToastrService,private contactService:ContactService,
    private loader:NgxUiLoaderService,private route: ActivatedRoute,private router:Router,
    private formBuilder: FormBuilder, private vnsservice: VnsSharedService, public ete:ExportExcelService
    ) { 

      // this.createWhiteListForm = this.formBuilder.group({
      //   //'whitelist_msg':['',Validators.required],
      //  });

    }
 
  ngOnInit(): void {
    this.showSpinner = true;
    this.addContactForm = this.formBuilder.group({
      'contacts':this.formBuilder.array([
        this.addContactFormGroup()
      ])
    }); 
    this.route.params.subscribe(params => {
      this.groupId = params.groupId;
      if(params.groupId>0){
     const data = 
        {"type":"all",
         "group_id":params.groupId,
         "free_text":"",
         "report":"",
         "page":1,
         "per_page":10
        }
        this.contactService.getContactList(data)
        .subscribe(  
           response=>{
            this.loader.stop();
            if(response['status_code'] == 200){  
              console.log('haii',response);
                      this.contactsList = response['data']['contact_list'];
                      this.pageInformation = response['data']['pageInformation'];
                      this.totalCount =  this.pageInformation.totalCount;
                      this.currentPage = 1;  
                      this.showSpinner = false;
                      this.getPhoneNumbers(this.contactsList);
                   }else {
                      this.toastr.warning('', response['error'].message);
                    }
                    },error =>{
                    console.log("Some thing went wrong");
        });
      }
    })
    //get templates list
    const data = {"action":"list","free_text":"","status":1,"page":1,"per_page":10}
        this.contactService.manageTemplate(data)
        .subscribe(  
           response=>{
            this.loader.stop();
            if(response['status_code'] == 200){  
                      this.approvedTemplates = response['data']['template_list'];
                   }else {
                      this.toastr.warning('', response['error'].message);
                    }
                    },error =>{
                    console.log("Some thing went wrong");
        });

        this.contactService.getStatusList()
        .subscribe(  
           response=>{
            this.loader.stop();
            if(response['status_code'] == 200){  
                      this.statusList = response['data'];
                   }else {
                      this.toastr.warning('', response['error'].message);
                    }
                    },error =>{
                    console.log("Some thing went wrong");
              });
     }
  getContactsType(status:any){
    this.loader.start();
    const data = 
          {"type": status,
          "group_id":this.groupId,
          "free_text":"",
          "report":"",
          "page":1,
          "per_page":10
        }
   this.contactService.getContactList(data)
    .subscribe(  
       response=>{
        this.loader.stop();
        if(response['status_code'] == 200){  
                  this.contactsList = response['data']['contact_list'];
                  this.pageInformation = response['data']['pageInformation'];
                  this.totalCount =  this.pageInformation.totalCount;
                  //this.getPhoneNumbers(this.contactsList);
               }else {
                  this.toastr.warning('', response['error'].message);
                }
                },error =>{
                console.log("Some thing went wrong");
    });
  }
  getTemplate(msg:string){
    this.templateMsg = msg;
  }
  getPhoneNumbers(phone:any){
   phone.forEach(element => {
     this.phoneNumbersList.push(element['contact_phone']);
    });
  }
  
  addContactButton(){
    (<FormArray>this.addContactForm.get('contacts')).push(this.addContactFormGroup());
  }
  addContactFormGroup(): FormGroup{
    return this.formBuilder.group({
      "contact_name": ['', Validators.required],
      "contact_phone": ['',[Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    });
  }
  onSubmit(post:any){
    if(post['contacts'][0]['contact_name'] == '' && post['contacts'][0]['contact_phone']==''){
       this.toastr.warning('','Please enter valid data'); return false;
    }
    this.loader.start();

    post['group_id']= this.groupId;
        this.contactService.uploadContacts(post)
        .subscribe(  
          response=>{
            this.loader.stop();
          if(response['status_code'] == 200){  
                    this.toastr.success('', response['success'].message);
                    $('#exampleModal .close').trigger('click');
                    this.ngOnInit();
                  }else {
                    this.toastr.warning('', response['error'].message);
                  }
                  },error =>{
                  console.log("Some thing went wrong");
        });
  }
  remove(index){
    const control = <FormArray>this.addContactForm.get('contacts'); 
     if(control.length != 1){
         control.removeAt(index);
      }    
  }

  whiteListFormSubmit(){
    if(this.templateMsg == ''){
      this.toastr.warning('','Please enter valid data'); return false;
     }
    this.loader.start();
    const data = {
      "type":"whitelist",
      "campaign_name":"whitelist",
      "content":this.templateMsg,
      "contacts":this.phoneNumbersList,
      "mediaurl":1
      }
  this.contactService.sendMessage(data)
  .subscribe(  
    response=>{
      this.loader.stop();
    if(response['status_code'] == 200){  
              this.toastr.success('', response['success'].message);
              $('#createwhitelistModal .close').trigger('click');
              this.vnsservice.totalsmscount.subscribe(totalCredits =>{
                this.totalsmscount.next(totalCredits);
              });
            }else {
              this.toastr.warning('', response['error'].message);
            }
            },error =>{
            console.log("Some thing went wrong");
  });
  }
  
  pageChanged(event,filters:any){

    this.currentPage = event;
   
    this.loader.start();
    const data = 
          {"type": "all",
          "group_id":this.groupId,
          "free_text":"",
          "report":"",
          "page":this.currentPage,
          "per_page":10
        }
   this.contactService.getContactList(data)
    .subscribe(  
       response=>{
        this.loader.stop();
        if(response['status_code'] == 200){  
                  this.contactsList = response['data']['contact_list'];
                  //this.getPhoneNumbers(this.contactsList);
               }else {
                  this.toastr.warning('', response['error'].message);
                }
                },error =>{
                console.log("Some thing went wrong");
    });
  }

  searchValue:any='';
  searchList(event: any): void {  
    this.searchValue = event.target.value;
    this.contactsList = []; 
    this.showSpinner = true;
    const data = 
          {"type": "all",
          "group_id":this.groupId,
          "free_text":event.target.value,
          "report":"",
          "page":1,
          "per_page":10
         }
   this.contactService.getContactList(data)
    .subscribe(  
       response=>{
        this.loader.stop();
        if(response['status_code'] == 200)
               {  
                  this.showSpinner = false;
                  this.contactsList = response['data']['contact_list'];
                  this.pageInformation = response['data']['pageInformation'];
                  this.totalCount =  this.pageInformation.totalCount;
               }else {
                this.showSpinner = false;
                  this.toastr.warning('', response['error'].message);
                }
                },error =>{
                  this.toastr.error('', error);
                }); 
           }

           downloadReport() {
            const body = {"type":"all","group_id":this.groupId,"free_text":this.searchValue,"report":"download","status" : "","page":1,"per_page":10}	
            this.contactService.getContactList(body)
            .subscribe(  
               response=>{
                this.contactsList = response['data']['contact_list'];
                this.exportToExcel(this.contactsList);
            });
           }

           dataForExcel = [];
           exportToExcel(contactsList:any) {
            this.dataForExcel=[];
            contactsList.forEach((row: any) => {
              this.dataForExcel.push(Object.values(row))
            })
           var year= new Date().getFullYear()          
            let reportData = {
              title: 'Contacts List -'+ year,
              data: this.dataForExcel,
              headers: Object.keys(this.contactsList[0])
            }
            this.ete.exportExcel(reportData,'Contacts');
          }


  numberOnly(event:any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
