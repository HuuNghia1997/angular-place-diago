import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { siteName } from '../../../environments/environment';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss', '../../app.component.scss']
})
export class SidebarComponent {

    title = siteName;
    navTitle = 'UBND Tỉnh Tiền Giang';
    sidebarMenu = [
        {
            mainMenu: 'Cổng thông tin',
            icon: 'file_copy', // From https://material.io/resources/icons
            listSubMenu: [
                { title: 'Quản trị thông báo', route: 'notification' }
            ]
        }
    ];

    mobileQuery: MediaQueryList;

    private mobileQueryListener: () => void;

    constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this.mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this.mobileQueryListener);
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this.mobileQueryListener);
    }
}
