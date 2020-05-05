import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { siteName } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

import { OauthService } from '../../services/oauth.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss', '../../app.component.scss']
})
export class SidebarComponent implements OnInit  {

    title = siteName;

    nickname: string;

    avatar: any;

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
        private sidebarService: SidebarService,
        private sanitizer: DomSanitizer) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this.mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this.mobileQueryListener);
    }
    ngOnInit(): void {
        this.getAvatar();
    }

    ngOnDestroy() {
        this.mobileQuery.removeListener(this.mobileQueryListener);
    }

    logout() {
        // tslint:disable-next-line: no-console
        console.info('logout');
        this.auth.logout();
    }

    getAvatar() {
        
        this.nickname = this.auth.getUserInfo().fullname;
        this.sidebarService.getUserInfo(this.auth.getUserInfo().id).subscribe(data => {

            if (data['avatarId'] === null) {
                this.avatar = '../../../assets/img/avt.jpg'
            }

            this.sidebarService.getUserAvatar(data['avatarId']).subscribe((response: any) => {
                let dataType = response.type;
                let binaryData = [];
                binaryData.push(response);
                let downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
                document.body.appendChild(downloadLink);
                this.avatar = this.sanitizer.bypassSecurityTrustUrl(downloadLink.href);
            });
        }, error => {
            console.error(error);
        });
    }
}
