import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { KeycloakService } from 'keycloak-angular';
import { UserService } from 'src/app/data/service/user.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  title = 'CHÍNH QUYỀN SỐ';
  yourAgency = 'UBND Huyện Cái Bè';
  langSelected = 'VI';
  langIcon = 'VI.png';
  nickname: string;
  avatar: any;
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  protected keycloakService: KeycloakService;
  isLoggedIn = false;

  constructor(changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              keycloakService: KeycloakService,
              private userService: UserService,
              private sanitizer: DomSanitizer) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.keycloakService = keycloakService;
  }

  ngOnInit(): void {
    this.keycloakService.isLoggedIn().then(r => {
      this.isLoggedIn = r;
    });
    this.getAvatar();
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  changeEngLang() {
    this.langSelected = 'EN';
    this.langIcon = 'EN.png';
  }

  changeViLang() {
    this.langSelected = 'VI';
    this.langIcon = 'VI.png';
  }

  getUser() {
    return this.nickname = localStorage.getItem('USER_INFO_NAME');
  }

  getAvatar() {
    this.nickname = localStorage.getItem('USER_INFO_NAME');
    this.userService.getUserInfo(localStorage.getItem('USER_INFO_ID')).subscribe(data => {
      if (data['avatarId'] === null) {
        this.avatar = '../../../assets/img/avt.jpg';
      }

      this.userService.getUserAvatar(data['avatarId']).subscribe((response: any) => {
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

  login(): void {
    this.keycloakService.login();
  }

  logout(): void {
    this.keycloakService.logout();
  }

}
