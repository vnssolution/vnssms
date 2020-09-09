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
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
 contactsList:any;
 //dtOptions: any;
 //dtTrigger = new Subject();
 //@ViewChild(DataTableDirective, { static: true })
 //dtElement: DataTableDirective;

  constructor(private toastr:ToastrService,private contactService:ContactService,
    private loader:NgxUiLoaderService,private route: ActivatedRoute,private router:Router) { 
      // this.dtOptions = {
      //   pagingType: 'full_numbers',
      //   dom: 'lBfrtip',
      //   responsive: true,
      //   buttons: [
      //     'csv', 'excel', 'pdf', 'print'
      //   ]
      // };
    }
 
  ngOnInit(): void {
   // this.getContacts();

    this.route.params.subscribe(params => {
      if(params.groupId>0){
     const data = 
        {"type":"all",
         "group_id":params.groupId,
         "free_text":"",
         "page":1,
         "per_page":10
        }
        console.log('test',data);
        this.contactService.getContactList(data)
        .subscribe(  
           response=>{
            this.loader.stop();
            if(response['status_code'] == 200){  
                      this.contactsList = response['data']['contact_list'];
                      //this.rerender();
                      console.log('result',this.contactsList);
                   }else {
                      this.toastr.warning('', response['error'].message);
                    }
                    },error =>{
                    console.log("Some thing went wrong");
        });
      }
    })
    setTimeout(function(){ $('#example').DataTable(); }, 1000);
  }

  // getContacts(){
  //   const data = 
  //       {"type":"all",
  //        "group_id":2,
  //        "free_text":"",
  //        "page":1,
  //        "per_page":10
  //       }
  //   this.contactService.getContactList(data)
  //   .subscribe(  
  //      response=>{
  //       this.loader.stop();
  //       if(response['status_code'] == 200){  
  //                 this.contactsList = response['data']['contact_list'];
  //                 //this.rerender();
  //                 console.log('result',this.contactsList);
  //              }else {
  //                 this.toastr.warning('', response['error'].message);
  //               }
  //               },error =>{
  //               console.log("Some thing went wrong");
  //   });
  // }

  // ngOnDestroy(): void {
  //   // Do not forget to unsubscribe the event
  //   this.dtTrigger.unsubscribe();
  // }

  // rerender(): void {
  //   try {
  //  // this.ngxService.start();
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     // Destroy the table first
  //     dtInstance.destroy();
  //     // Call the dtTrigger to rerender again
  //     this.dtTrigger.next();
  //   });
  // } catch (err) {
  //   console.log(err);
  // }
  //   this.loader.stop();
  // }
  // ngAfterViewInit() {
  //   // this.ngxService.start();
  //    this.dtTrigger.next();
  //    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //      dtInstance.on('draw.dt', function () {
  //        if (jQuery('.dataTables_empty').length > 0) {
  //          jQuery('.dataTables_empty').remove();
  //        }
  //      });
  //    });
  //   // this.ngxService.start();
  //  }

}
