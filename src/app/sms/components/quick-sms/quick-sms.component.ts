import { Component, OnInit,ViewChild } from '@angular/core';
import { Validators, ValidatorFn, AbstractControl, FormControl, FormGroup,FormArray, FormBuilder } from '@angular/forms';
import { ToastrService  } from 'ngx-toastr';
import { Routes, Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { ContactService } from '../../services/contact.service';
import * as XLSX from 'xlsx'; 
import * as FileSaver from 'file-saver'; 
import * as Papa from 'papaparse';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-quick-sms',
  templateUrl: './quick-sms.component.html',
  styleUrls: ['./quick-sms.component.css']
})
export class QuickSmsComponent implements OnInit {
  approvedTemplates:any;
  templateMsg:any='';
  grouplist:any;
  whiteList:any;
  whiteListContactsCount:any;
  phoneNumbersList=[];
  
  constructor(private toastr:ToastrService,private contactService:ContactService,
    private loader:NgxUiLoaderService,private route: ActivatedRoute,private router:Router,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.GroupsList();

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
  }

  getTemplate(msg:string){
    this.templateMsg = msg;
  }

  GroupsList(){
    this.contactService.getGroupsList(localStorage.getItem('vns_auth_token'))
    .subscribe(  
       response=>{
        if(response['status_code'] == 200){  
                this.grouplist = response['data'];
              }else {
                  this.toastr.warning('', response['error'].message);
                }
                },error =>{
                console.log("Some thing went wrong");
    });
  }
  getGroupInfo(id){
    var grpArray = [];
    $("input:checkbox[name=groupname]:checked").each(function () {
      grpArray.push($(this).val())
   });
   const data = 
         {"type":"all",
         "group_id":grpArray,
         "free_text":"",
         "report":"download",
         "status":"",
         "page":1,
         "per_page":10
        }
   this.contactService.getContactList(data)
   .subscribe(  
      response=>{
       if(response['status_code'] == 200){  
               this.whiteList = response['data']['contact_list'];
               this.whiteListContactsCount = response['data']['contact_list'].length;
               this.getPhoneNumbers(this.whiteList);

             }else {
                 this.toastr.warning('', response['error'].message);
               }
               },error =>{
               console.log("Some thing went wrong");
   });
  }
  getPhoneNumbers(phone:any){
    phone.forEach(element => {
      this.phoneNumbersList.push(element['contact_phone']);
     });
   }

  sendMessage(campaign:string){
    if(campaign ==''){
      this.toastr.warning('', "Please enter campaign"); return false;
    }
    if(this.templateMsg ==''){
      this.toastr.warning('', "Please select template"); return false;
    }
    this.loader.start();
    const data = {
      "type":"quicksms",
      "campaign_name":campaign,
      "content":this.templateMsg,
      "contacts":this.phoneNumbersList,
      "mediaurl":1
      }
      console.log(data);
  this.contactService.sendMessage(data)
  .subscribe(  
    response=>{
      this.loader.stop();
    if(response['status_code'] == 200){  
              this.toastr.success('', response['success'].message);
            }else {
              this.toastr.warning('', response['error'].message);
            }
            },error =>{
            console.log("Some thing went wrong");
  });  }

}
