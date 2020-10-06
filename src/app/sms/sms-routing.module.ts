import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutOneComponent } from './components/layout-one/layout-one.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { GroupsComponent } from './components/groups/groups.component';
import { TemplatesComponent } from './components/templates/templates.component';
import {QuickSmsComponent } from './components/quick-sms/quick-sms.component'
import { SmsHistoryComponent } from './components/sms-history/sms-history.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { UserAccountsComponent } from './components/user-accounts/user-accounts.component';
const routes: Routes = [{
  path: 'vns', component: LayoutOneComponent,
  children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'contacts', component: ContactsComponent },
    { path: 'contacts/group/:groupId', component: ContactsComponent },
    { path: 'contacts/groups', component: GroupsComponent },
    { path: 'templates', component: TemplatesComponent },
    { path: 'quick-sms', component: QuickSmsComponent },
    { path: 'sms-history', component: SmsHistoryComponent },
    { path: 'settings', component: ProfileSettingsComponent },
    { path: 'user-account', component: UserAccountsComponent },
    
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsRoutingModule { }
