import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
  SimpleChanges,
  EventEmitter
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import * as BpmnJS from 'bpmn-js/dist/bpmn-viewer.production.min.js';
import { importDiagram } from 'src/app/data/schema/rx';
import { throwError } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements AfterContentInit, OnChanges, OnDestroy {

  private bpmnJS: BpmnJS;

  @ViewChild('ref', { static: true }) private el: ElementRef;
  @Output() private importDone: EventEmitter<any> = new EventEmitter();

  @Input() private url: string;

  constructor(private http: HttpClient,
              private keycloak: KeycloakService) {

    this.bpmnJS = new BpmnJS();

    this.bpmnJS.on('import.done', ({ error }) => {
      if (!error) {
        this.bpmnJS.get('canvas').zoom('fit-viewport');
      }
    });
  }

  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(this.el.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.url) {
      this.loadUrl(changes.url.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  loadUrl(url: string) {
    const token = this.keycloak.getKeycloakInstance().token;
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + token);
    return (
      this.http.get(url, { headers, responseType: 'text' }).pipe(catchError(err =>
        throwError(err)), importDiagram(this.bpmnJS)).subscribe((warnings) => {
          this.importDone.emit({
            type: 'success',
            warnings
          });
        }, (err) => {
          this.importDone.emit({
            type: 'error',
            error: err
          });
        }
      )
    );
  }
}
