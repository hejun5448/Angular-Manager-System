import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { STComponent, STChange, STColumn } from '@delon/abc';
import { RestService } from '@app/service';
import {
  ProvinceList,
  getCityOrAreaListByCode,
  SexList,
  query,
  defaultQuery,
  pages,
  total,
  loading,
  data,
  selectedRows,
  selectedRow,
} from '@app/common';

@Component({
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleComponent implements OnInit {
  query = query;
  pages = pages;
  total = total;
  loading = loading;
  data = data;
  selectedRows = selectedRows;
  selectedRow = selectedRow;
  columns: STColumn[] = [
    { title: '姓名', index: 'name' },
    { title: '性别', index: 'gender' },
    { title: '与业主关系', index: 'residentIdRel' },
    { title: '手机号', index: 'tel' },
    { title: '所在楼栋单元', index: 'building' },
    { title: '所在房间', index: 'roomNo' },
    { title: '年龄', index: 'age' },
    { title: '证件号码', index: 'credentialNo' },
    {
      title: '操作',
      fixed: 'right',
      width: 100,
      buttons: [
        {
          text: '审核',
          icon: 'eye',
          click: (item: any) => {
            this.selectedRow = item;
            this.addOrEditOrView(this.tpl, 'view');
          },
        },
        {
          text: '编辑',
          icon: 'edit',
          click: (item: any) => {
            this.selectedRow = item;
            this.addOrEditOrView(this.tpl, 'view');
          },
        },
        {
          text: '删除',
          icon: 'delete',
          click: (item: any) => {
            this.selectedRow = item;
            this.addOrEditOrView(this.tpl, 'view');
          },
        },
        {
          text: '查看',
          icon: 'eye',
          click: (item: any) => {
            this.selectedRow = item;
            this.addOrEditOrView(this.tpl, 'view');
          },
        },
        {
          text: '同步',
          icon: 'eye',
          click: (item: any) => {
            this.selectedRow = item;
            this.addOrEditOrView(this.tpl, 'view');
          },
        },
      ],
    },
  ];

  @ViewChild('st', { static: true })
  st: STComponent;
  @ViewChild('modalContent', { static: true })
  tpl: TemplateRef<any>;

  genderList = SexList;
  provinceList = ProvinceList;
  cityList = [];
  areaList = [];

  constructor(
    private api: RestService,
    public msg: NzMessageService,
    public modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData(pageIndex?: number) {
    this.loading = true;
    this.query.pageNo = pageIndex ? pageIndex : this.query.pageNo;
    this.api.getResidentList(this.query).subscribe(res => {
      this.loading = false;
      const { rows, total: totalItem } = res.data || { rows: [], total: 0 };
      this.data = rows;
      this.total = totalItem;
      this.pages = {
        ...this.pages,
        total: `共 ${totalItem} 条记录`,
      };
      this.cdr.detectChanges();
    });
  }

  stChange(e: STChange) {
    switch (e.type) {
      case 'checkbox':
        this.selectedRows = e.checkbox!;
        this.cdr.detectChanges();
        break;
      case 'filter':
        this.getData(e.pi);
        break;
      case 'pi':
        this.getData(e.pi);
        break;
      case 'ps':
        this.query.pageSize = e.ps;
        this.getData(e.pi);
        break;
    }
  }

  reset() {
    this.query = { ...defaultQuery };
    this.loading = true;
    setTimeout(() => this.getData(1));
  }

  addOrEditOrView(tpl: TemplateRef<{}>, type: 'add' | 'edit' | 'view') {
    this.modalSrv.create({
      nzTitle: type === 'add' ? '新增住户' : '编辑住户',
      nzContent: tpl,
      nzWidth: 800,
      nzOnOk: () => {
        this.loading = true;
        // this.http.post('/api/package/save', this.selectedRow).subscribe(() => this.getData());
      },
    });
  }

  handleProvinceSelected(e) {
    this.cityList = getCityOrAreaListByCode(e);
  }

  handleCitySelected(e) {
    this.areaList = getCityOrAreaListByCode(this.query.provinceCode || this.selectedRow.provinceCode, e);
  }

  getImage(e) {
    this.api.uploadBase64({ base64: e }).subscribe(res => {
      if (res.code === 0) {
        this.selectedRow.faceImg = res.link;
      }
    });
  }
}
