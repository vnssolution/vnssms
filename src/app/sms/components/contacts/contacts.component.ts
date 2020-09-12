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
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
 addContactForm:FormGroup
 contactsList:any;
 dtOptions: any;
 dtTrigger = new Subject();
 @ViewChild(DataTableDirective, { static: true })
 dtElement: DataTableDirective;
 groupId:any;
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
    }
 
  ngOnInit(): void {
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
         "page":1,
         "per_page":10
        }
        this.contactService.getContactList(data)
        .subscribe(  
           response=>{
            this.loader.stop();
            if(response['status_code'] == 200){  
                      this.contactsList = response['data']['contact_list'];
                      console.log('test',this.contactsList);
                      this.rerender();
                   }else {
                      this.toastr.warning('', response['error'].message);
                    }
                    },error =>{
                    console.log("Some thing went wrong");
        });
      }
    })
    //setTimeout(function(){ $('#example').DataTable(); }, 1000);
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
    if(post == ''){
       this.toastr.warning('','Please enter valid data'); return false;
    }
    this.loader.start();

    post['group_id']= this.groupId;
    console.log('jalendra',post);
        this.contactService.uploadContacts(post)
        .subscribe(  
          response=>{
            this.loader.stop();
          if(response['status_code'] == 200){  
                    this.toastr.success('', response['success'].message);
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

  numberOnly(event:any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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

}
