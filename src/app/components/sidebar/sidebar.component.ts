import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { siteName } from '../../../environments/environment';

import { OauthService } from '../../services/oauth.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss', '../../app.component.scss']
})
export class SidebarComponent implements OnInit  {

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

    constructor(
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        private auth: OauthService,
        private sidebarService: SidebarService) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this.mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this.mobileQueryListener);
    }
    ngOnInit(): void {
        
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this.mobileQueryListener);
    }

    logout() {
        console.log('logout');
        this.auth.logout();
    }

    // getFullname() {
    //     return this.auth.getUserInfo().fullname;
    // }

    getAvatar() {
        this.sidebarService.getUserInfo('5e8157d8fb542b71ce4de858').subscribe(data => {
            console.log(data['avatarId']);
        }, error => {

        });
    }
}
