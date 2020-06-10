import { Component, OnInit } from '@angular/core';
import { ConfigPetitionElement, CONFIG_PETITION_DATA } from 'src/app/data/schema/config-petition-element';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfigPetitionService } from 'src/app/data/service/config-petition.service';

@Component({
  selector: 'app-detail-config-petition',
  templateUrl: './detail-config-petition.component.html',
  styleUrls: ['./detail-config-petition.component.scss']
})
export class DetailConfigPetitionComponent implements OnInit {

  configPetitionId: string;
  configPetition: ConfigPetitionElement;
  status: number;

  constructor(private actRoute: ActivatedRoute,
              private dialog: MatDialog,
              private service: ConfigPetitionService) {
    this.configPetitionId = this.actRoute.snapshot.params.id;
    this.getConfigPetition(this.configPetitionId);
    this.status = this.getState(this.configPetition.status);
    // this.commentDataSource.data = TREE_DATA;
  }

  ngOnInit(): void {
  }

  getConfigPetition(id): void {
    CONFIG_PETITION_DATA.forEach(element => {
      if (element.id === id) {
        // console.log(element);
        this.configPetition =  element;
      }
    });
  }

  getState(status: string): number {
    if (status === 'Chưa áp dụng') {
      return 0;
    } else if (status === 'Đã áp dụng') {
      return 1;
    } else {
      return 2;
    }
  }

  addProcess() {
    this.service.addProcess();
  }

  updateProcess(id, name): void {
    this.service.updateProcess(id, name);
  }

  deleteProcess(id, name): void {
    this.service.deleteProcess(id, name);
  }

  unApplyProcess(id, name): void {
    this.service.unApplyProcess(id, name);
  }

  applyProcess(id, name): void {
    this.service.applyProcess(id, name);
  }
}
