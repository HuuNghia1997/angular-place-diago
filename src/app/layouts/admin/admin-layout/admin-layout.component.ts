import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { KeycloakService } from 'keycloak-angular';
import { UserService } from 'src/app/data/service/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LANGUAGE_DATA } from 'src/app/data/schema/language';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  yourAgency = 'UBND Huyện Cái Bè';
  nickname: string;
  avatar: any;
  mobileQuery: MediaQueryList;
  language = LANGUAGE_DATA;
  langSelected = LANGUAGE_DATA[0];
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
    // this.getUser();
    this.getAvatar();
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  changeLanguage(id) {
    LANGUAGE_DATA.forEach(element => {
      if (element.id === id) {
        this.langSelected = element;
      }
    });
  }

  // getUser() {
  //   this.keycloakService.loadUserProfile().then(data => {
  //     this.nickname = data.firstName + ' ' + data.lastName;
  //   });
  //   return this.nickname;
  // }

  getAvatar() {
    this.keycloakService.loadUserProfile().then(user => {
      this.userService.getUserInfo(user['attributes'].user_id).subscribe(data => {
        this.nickname = data['fullname'];
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
    });
  }

  login(): void {
    this.keycloakService.login();
  }

  logout(): void {
    this.keycloakService.logout();
  }

}
