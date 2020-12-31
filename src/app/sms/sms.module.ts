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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemplatesComponent } from './components/templates/templates.component';
import { QuickSmsComponent } from './components/quick-sms/quick-sms.component';
import { SmsHistoryComponent } from './components/sms-history/sms-history.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { UserAccountsComponent } from './components/user-accounts/user-accounts.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreditHistoryComponent } from './creditHistory/credit-history/credit-history.component';
@NgModule({
  declarations: [DashboardComponent,MenuComponent, LayoutOneComponent,HeaderComponent, ContactsComponent, GroupsComponent, TemplatesComponent, QuickSmsComponent, SmsHistoryComponent, ProfileSettingsComponent, UserAccountsComponent, CreditHistoryComponent],
  imports: [
    CommonModule,
    SmsRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    NgxPaginationModule
  ]
})
export class SmsModule { }
