import { NgModule } from '@angular/core';
import { CustomLoggedHeaderComponent } from './custom-logged-header/custom-logged-header';
import { UserInfoComponent } from './user-info/user-info';
import { UserMenuComponent } from './user-menu/user-menu';
import { ProgressBarComponent } from './progress-bar/progress-bar';
@NgModule({
	declarations: [
        CustomLoggedHeaderComponent,
        UserInfoComponent,
        UserMenuComponent,
        ProgressBarComponent
    ],
	imports: [],
	exports: [
        CustomLoggedHeaderComponent,
        UserInfoComponent,
        UserMenuComponent,
        ProgressBarComponent
    ]
})
export class ComponentsModule {}
