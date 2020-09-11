import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';

import { SmsRoutingModule } from './sms-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MenuComponent } from './components/menu/menu.component';
import { HeaderComponent } from './components/header/header.component';
import { LayoutOneComponent } from './components/layout-one/layout-one.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { GroupsComponent } from './components/groups/groups.component';

@NgModule({
  declarations: [DashboardComponent,MenuComponent, LayoutOneComponent,HeaderComponent, ContactsComponent, GroupsComponent],
  imports: [
    CommonModule,
    SmsRoutingModule,
    DataTablesModule,

  ]
})
export class SmsModule { }
