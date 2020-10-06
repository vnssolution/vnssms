import { Component, OnInit,ViewChild } from '@angular/core';
import { ToastrService  } from 'ngx-toastr';
import { Routes, Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { ContactService } from '../../services/contact.service';
import * as XLSX from 'xlsx'; 
import * as FileSaver from 'file-saver'; 
import * as Papa from 'papaparse';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { start } from 'repl';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
contactsList:any;
grouplist:any;
groupId:any;
dtOptions: any;
dtTrigger = new Subject();
@ViewChild(DataTableDirective, { static: true })
dtElement: DataTableDirective;

  constructor(private toastr:ToastrService,private contactService:ContactService,
    private loader:NgxUiLoaderService,private route: ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this.getGroupsList();
  }

  createGroup(name:string){
    if(name ==''){
      this.toastr.warning('', 'Group name is required'); return false;
    }
    this.loader.start();
    const data = {"action":"create","group_name":name}
    this.contactService.manageGroup(data)
              .subscribe(  
                 response=>{
      this.loader.stop();
                  if(response['status_code'] == 200){  
                           this.toastr.success('Success', response['success'].message);
                           this.getGroupsList();
                          }else {
                            this.toastr.warning('', response['error'].message);
                          }
                          },error =>{
                          console.log("Some thing went wrong");
              });
  }
  getGroupsList(){
    this.contactService.getGroupsList(localStorage.getItem('vns_auth_token'))
    .subscribe(  
       response=>{
        if(response['status_code'] == 200){  
                this.grouplist = response['data'];
                this.rerender();
              }else {
                  this.toastr.warning('', response['error'].message);
                }
                },error =>{
                console.log("Some thing went wrong");
    });
  }

  getGroupName(name){
    this.groupId = name;
  }
  
  public files:any;
  OnSelectedFile(event){
    this.files =event;
  }

  uploadFile(){
    if(this.groupId ==''){
      this.toastr.warning('', "Please select group name"); return false;
    }
    if(this.files){
    this.loader.start();
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = this.files.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial['contacts'] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      jsonData['group_id']= this.groupId;
     // const dataString = JSON.stringify(jsonData);
     //console.log(jsonData); return false;
        this.contactService.uploadContacts(jsonData)
              .subscribe(  
                 response=>{
          this.loader.stop();
                  if(response['status_code'] == 200){  
                           this.toastr.success('Success', response['success'].message);
                           this.getGroupsList();
                          }else {
                            this.toastr.warning('', response['error'].message);
                          }
                          },error =>{
                          console.log("Some thing went wrong");
              });
    }
    reader.readAsBinaryString(file);
    }else{
      this.toastr.warning('',"Please select file"); return false;
    }
  }

  getContacts(id){
    this.router.navigate([`vns/contacts/group/${id}`]);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    try {
   // this.ngxService.start();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  } catch (err) {
    console.log(err);
  }
    this.loader.stop();
  }
  ngAfterViewInit() {
    // this.ngxService.start();
     this.dtTrigger.next();
     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
       dtInstance.on('draw.dt', function () {
         if (jQuery('.dataTables_empty').length > 0) {
           jQuery('.dataTables_empty').remove();
         }
       });
     });
    // this.ngxService.start();
   }

   deleteGroup(id:number){
     if(id){
      this.loader.start();
      const data = {"action":"drop","group_id":id}
    this.contactService.manageGroup(data)
    .subscribe(  
       response=>{
      this.loader.stop();
        if(response['status_code'] == 200){  
                 this.toastr.success('Success', "Group deleted successfully");
                 this.getGroupsList();
                }else {
                  this.toastr.warning('', response['error'].message);
                }
                },error =>{
                console.log("Some thing went wrong");
    });
   }
  }
}
