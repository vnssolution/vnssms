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
  selector: 'app-user-accounts',
  templateUrl: './user-accounts.component.html',
  styleUrls: ['./user-accounts.component.css']
})
export class UserAccountsComponent implements OnInit {
  dtOptions: any;
  dtTrigger = new Subject();
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  
  constructor(private toastr:ToastrService,private contactService:ContactService,
    private loader:NgxUiLoaderService,private route: ActivatedRoute,private router:Router,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

}
