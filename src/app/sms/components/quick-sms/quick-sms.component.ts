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

  constructor(private toastr:ToastrService,private contactService:ContactService,
    private loader:NgxUiLoaderService,private route: ActivatedRoute,private router:Router,private formBuilder: FormBuilder) { }

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
    console.log(id);
  }
}
