/**
 * Data Management Page
 */
import AppConfig from "../../../constants/AppConfig";
import axios from "axios";
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import MatButton from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {
  Button,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label
} from "reactstrap";
import { NotificationManager } from "react-notifications";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import Grid from "@material-ui/core/Grid";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

// delete confirmation dialog
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

// rct card box
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";

// rct section loader
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";

import { connect } from "react-redux";

// redux action
import {
  fetchingDataVendor,
  updateDataVendor,
  addDataVendor,
  deleteDataVendor,
  activeSession,
  clearUser
} from "Actions";

import { isMobile } from "react-device-detect";

import "date-fns";
import FormHelperText from "@material-ui/core/FormHelperText";
import {
  roundN,
  parseDateInt,
  parseDateString,
  convertDateToWebservice,
  addPropsToObject,
  decryptData
} from "../../../helpers/helpers";
import { CSVLink } from "react-csv";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";

import { STORAGE_USERMODELS, STORAGE_TOKEN } from "../../../store/storages";

const moment = require("moment");
class VendorForm extends Component {
  pageSize = 10;
  pageGrop = [10, 25, 50, 100];
  arrProps = [["checked", false]];
  state = {
    Locale: "",
    placeholderSearch: "Search..",
    placeholderName: "Enter Name",
    placeholderDescription: "Enter Description",
    sessionTimeOutTitle: "Session Timeout",
    sessionTimeOutContent:
      "You are timed out due to inactivity you must push accept and login again.",
    sessionInvalidOutTitle: "Invalid session",
    sessionInvalidOutContent:
      "Your session is Invalid. due to might have another person try to login with this account, you must push accept and login again.",
    tokenInvalidTitle: "Invalid Token",
    tokenInvalidContent:
      "Your Token is Invalid. you must push accept and login again.",
    networkErrorTitle: "Network Error",
    networkErrorContent:
      "Cannot to connect with server, please contact customer service",
    errorTitle: "Critical Error",
    errorContent: "Found some error, please contact customer service",
    sessionTitle: "",
    sessionContent: "",
    sessionStatus: false,
    all: false,
    data: null,
    selectedData: null,
    loading: false,
    previewDataModal: false,
    addNewDataModal: false,
    addNewDataDetail: {
      Id: 0,
      Name: "",
      Description: "",
      checked: false
    },
    openViewDataDialog: false,
    editData: null,
    allSelected: false,
    selectedDatas: 0,
    currentPage: 0,
    pageSize: this.pageSize,
    moreTap: false,
    selectedDelete: null,
    pagesCount: 0,
    selectedBranch: this.props.authUser.user.fk_Branch,
    filterData: null,
    q: "",
    originalData: null,
    selectedDate: new Date(),
    csvData: [],
    validateName: false
  };

  // handleDateChange = this.handleDateChange.bind(this);
  filterList = this.filterList.bind(this);
  searchData = this.searchData.bind(this);
  changeBranch = this.changeBranch.bind(this);

  Transition = React.forwardRef(function Transition(props, ref) {
    if (props === undefined || ref === undefined) return;
    return <Slide direction="up" ref={ref} {...props} />;
  });

  handleClick(e, index) {
    e.preventDefault();
    this.setState({
      currentPage: index
    });
  }

  getUserModels() {
    let usermodelsL = localStorage.getItem(STORAGE_USERMODELS);
    if (usermodelsL === null) return "";
    return JSON.parse(decryptData(usermodelsL));
  }

  async activeSession() {
    let usermodelsL = this.getUserModels();
    let tokenL = localStorage.getItem(STORAGE_TOKEN);
    await this.props.activeSession(usermodelsL.user_Name, tokenL);
    if (this.props.authUser.session.description === "success") {
      if (this.props.authUser.session.data === "Valid session") return;
      if (this.props.authUser.session.data === "Session timeout")
        await this.setState({
          sessionDialog: true,
          sessionTitle: this.state.sessionTimeOutTitle,
          sessionContent: this.state.sessionTimeOutContent
        });
      if (this.props.authUser.session.data === "Invalid session")
        await this.setState({
          sessionDialog: true,
          sessionTitle: this.state.sessionInvalidOutTitle,
          sessionContent: this.state.sessionInvalidOutContent
        });
    }
  }

  async onAccept() {
    await this.props.clearUser();
    this.props.history.push("/signin");
  }

  async onValidateName(valP, idP) {
    if (valP === "") return;
    await axios
      .post(
        AppConfig.serviceUrl + "vendor/validate",
        {
          Id: idP,
          Name: valP
        },
        {
          headers: {
            "content-type": "application/json; charset=utf-8",
            Authorization: "bearer " + localStorage.getItem(STORAGE_TOKEN)
          }
        }
      )
      .then(response => {
        if (
          response.data.description === "success" &&
          response.data.data === "Valid"
        ) {
          this.setState({ validateName: false });
        } else {
          this.setState({ validateName: true });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  sessionDialog() {
    const { sessionDialog, sessionTitle, sessionContent } = this.state;
    return (
      <div>
        <Dialog
          open={sessionDialog}
          TransitionComponent={this.Transition}
          keepMounted
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {sessionTitle}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {sessionContent}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.onAccept()}
              variant="contained"
              className="btn-primary text-white mr-10"
            >
              {<IntlMessages id="sidebar.vendor.button.action" />}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  errorDialog() {
    const { vendorReducer } = this.props;
    if (vendorReducer.unauthorized) {
      setTimeout(async () => {
        await this.setState({
          sessionDialog: true,
          sessionTitle: this.state.tokenInvalidTitle,
          sessionContent: this.state.tokenInvalidContent
        });
      }, 5000);
    } else if (vendorReducer.network) {
      setTimeout(async () => {
        await this.setState({
          sessionDialog: true,
          sessionTitle: this.state.networkErrorTitle,
          sessionContent: this.state.networkErrorContent
        });
      }, 5000);
    } else if (vendorReducer.error) {
      setTimeout(async () => {
        await this.setState({
          sessionDialog: true,
          sessionTitle: this.state.errorTitle,
          sessionContent: this.state.errorContent
        });
      }, 5000);
    }
  }

  componentDidMount() {
    this.activeSession();
    this.loadData();
    this.tabArrange();
  }

  arrangeNumber(arrP) {
    var arrangeL = [];
    for (let index = 0; index < arrP.length; index++) {
      const element = arrP[index];
      arrangeL.push({
        checked: false,
        No: index + 1,
        Id: element.Id,
        Name: element.Name,
        Description: element.Description,
        CreateDate: element.CreateDate,
        UpdateDate: element.UpdateDate,
        CreateBy: element.CreateBy,
        UpdateBy: element.UpdateBy,
        Enable: element.Enable
      });
    }
    return arrangeL;
  }

  async loadData() {
    this.setState({ loading: true });
    await this.props.fetchingDataVendor("0");

    var vendorL = this.props.vendorReducer.data;

    if (vendorL == null) {
      this.setState({
        loading: false,
        data: null,
        originalData: null,
        pagesCount: 0,
        currentPage: 0,
        selectedDatas: 0
      });
      return;
    }

    var arrangeL = this.arrangeNumber(vendorL);
    await this.setState({
      selectedDatas: 0,
      originalData: addPropsToObject(arrangeL, this.arrProps),
      filterData: addPropsToObject(arrangeL, this.arrProps),
      pagesCount: Math.ceil(arrangeL.length / this.state.pageSize),
      data: addPropsToObject(arrangeL, this.arrProps),
      loading: false,
      filteredData: addPropsToObject(arrangeL, this.arrProps)
    });

    this.setDataExportCsv();
    this.errorDialog();
  }

  async setDataExportCsv() {
    let arrayNew = [];
    arrayNew.push(["No.", "Name", "Description", "CreateDate"]);
    const { data } = this.state;
    for (let index = 0; index < data.length; index++) {
      arrayNew.push([
        data[index].No,
        data[index].Name,
        data[index].Description,
        convertDateToWebservice(data[index].CreateDate)
      ]);
    }
    await this.setState({ csvData: arrayNew });
  }

  async onConfirmDeleteMultiple() {
    const { selectedData } = this.state;
    let selectedL = this.returnSelectedKeys(selectedData);
    await this.props.deleteDataVendor(selectedL);
    this.loadData();
    this.refs.deleteMutipleConfirmationDialog.close();
  }

  async onDeleteMultiple() {
    const { data } = this.state;
    await this.setState({ selectedData: data });
    this.refs.deleteMutipleConfirmationDialog.open();
  }

  returnSelectedKeys(selectedData) {
    let arrayIndex = [];
    if (selectedData) {
      for (let index = 0; index < selectedData.length; index++) {
        const element = selectedData[index];
        if (!element.checked) continue;
        arrayIndex.push(element.Id);
      }
    }
    return arrayIndex;
  }

  /**
   * On Delete
   */
  onDelete(data) {
    this.refs.deleteConfirmationDialog.open();
    this.setState({ selectedData: data });
  }

  /**
   * Delete Data Permanently
   */
  deleteDataPermanently() {
    const { selectedData } = this.state;

    let data = this.state.data;
    let indexOfDeleteData = data.indexOf(selectedData);
    data.splice(indexOfDeleteData, 1);
    this.refs.deleteConfirmationDialog.close();
    this.setState({ loading: true });
    let self = this;
    setTimeout(async () => {
      self.setState({ loading: false, data, selectedData: null });
      let arrayKey = [];
      arrayKey.push(selectedData.Id);
      await this.props.deleteDataVendor(arrayKey);
    }, 500);
  }

  /**
   * Open Add New Data Modal
   */
  opnAddNewDataModal(e) {
    e.preventDefault();
    this.setState({
      addNewDataModal: true,
      addNewDataDetail: {
        Id: 0,
        Name: "",
        Description: "",
        checked: false
      }
    });
  }

  /**
   * On Reload
   */
  async onReload(e) {
    e.preventDefault();
    await this.loadData();
    NotificationManager.success("Data Reloaded!");
  }

  /**
   * On Select Data
   */
  async onSelectData(data) {
    data.checked = !data.checked;
    let selectedDatas = 0;
    let datas = this.state.data.map(dataData => {
      if (dataData.checked) {
        selectedDatas++;
      }
      if (dataData.Id === data.Id) {
        if (dataData.checked) {
          selectedDatas++;
        }
        return data;
      } else {
        return dataData;
      }
    });
    await this.setState({ datas, selectedDatas });
  }

  /**
   * Add New Data
   */
  async addNewData() {
    const { addNewDataDetail } = this.state;
    await this.onValidateName(addNewDataDetail.Name, addNewDataDetail.Id);
    if (this.state.validateName) return;
    await this.props.addDataVendor(addNewDataDetail);
    await this.setState({ addNewDataModal: false, loading: true });
    this.loadData();
    await this.setState({ loading: false });
  }

  /**
   * View Data Detail Hanlder
   */
  viewDataDetail(data) {
    this.setState({ openViewDataDialog: true, selectedData: data });
  }

  /**
   * On Edit Data
   */
  onEditData(data) {
    this.setState({ addNewDataModal: true, editData: data });
  }

  /**
   * On Add & Update Data Modal Close
   */
  onAddUpdateDataModalClose() {
    this.setState({ addNewDataModal: false, editData: null });
  }

  /**
   * On Update Data Details
   */
  async onUpdateDataDetails(key, value) {
    if (key === "Total" && (value <= 0 || value === "")) {
      value = 0;
    }

    await this.setState({
      editData: {
        ...this.state.editData,
        [key]:
          key === "CreateDate"
            ? parseDateString(new Date(value).getTime())
            : value
      }
    });
  }

  /**
   * On Change Add New Data Details
   */
  async onChangeAddNewDataDetails(key, value) {
    await this.setState({
      addNewDataDetail: {
        ...this.state.addNewDataDetail,
        [key]:
          key === "CreateDate"
            ? parseDateString(new Date(value).getTime())
            : value
      }
    });
  }

  /**
   * Update Data
   */
  async updateData() {
    const { editData } = this.state;
    await this.onValidateName(editData.Name, editData.Id);
    if (this.state.validateName) return;

    await this.props.updateDataVendor(editData);
    // data for show on ui //
    let indexOfUpdateData = "";
    let datas = this.state.data;
    for (let i = 0; i < datas.length; i++) {
      const data = datas[i];
      if (data.Id === editData.Id) {
        indexOfUpdateData = i;
      }
    }
    datas[indexOfUpdateData] = editData;

    // reset data original //
    let indexOfUpdateOriData = "";
    let oriDatas = this.state.originalData;
    for (let i = 0; i < oriDatas.length; i++) {
      const data = oriDatas[i];
      if (data.Id === editData.Id) {
        indexOfUpdateOriData = i;
      }
    }
    oriDatas[indexOfUpdateOriData] = editData;

    this.setState({ loading: true, editData: null, addNewDataModal: false });
    let self = this;
    setTimeout(async () => {
      await self.setState({ datas, loading: false });
      await self.setState({ oriDatas, loading: false });
    }, 500);
  }

  //Select All Data
  async onSelectAllData(e) {
    const { selectedDatas, data } = this.state;
    let selectAll = selectedDatas < data.length;

    if (selectAll) {
      let selectAllDatas = data.map(item => {
        item.checked = true;
        return item;
      });
      await this.setState({
        data: selectAllDatas,
        // originalData: selectAllDatas,
        filterData: selectAllDatas,
        filteredData: selectAllDatas,
        selectedDatas: selectAllDatas.length
      });
    } else {
      let unselectedDatas = data.map(item => {
        item.checked = false;
        return item;
      });
      await this.setState({ selectedDatas: 0, data: unselectedDatas });
    }
  }

  selectPageSize(e) {
    this.setState({
      pageSize: e.target.value,
      pagesCount: Math.ceil(this.state.data.length / e.target.value),
      currentPage: 0
    });
  }

  redirectToVendor() {
    this.props.history.push("/app/vendor/vendor-management");
  }

  async changeBranch(event) {
    await this.setState({ selectedBranch: event.target.value, q: "" });
    this.loadData();
  }

  // arrange for ui (web or mobile)
  tabArrange() {
    const { selectedBranch, q, selectedDatas } = this.state;

    if (isMobile) {
      return "";
    } else {
      return (
        <div>
          <div className="d-flex justify-content-between py-20 px-10 border-bottom">
            <div>
              {selectedDatas > 0 ? (
                <div style={{ paddingLeft: 20, paddingTop: 25 }}>
                  <MatButton
                    onClick={() => this.onDeleteMultiple()}
                    variant="contained"
                    color="primary"
                    className="mr-10 mb-10 text-white btn-icon"
                  >
                    {<IntlMessages id="sidebar.vendor.btn.delete" />}{" "}
                    <i className="zmdi zmdi-delete"></i>
                  </MatButton>
                </div>
              ) : (
                ""
              )}
            </div>

            <div style={{ float: "left", visibility: "hidden" }}>
              <div style={{ paddingLeft: 25 }}>
                <FormHelperText style={{ paddingBottom: 5 }}>
                  {<IntlMessages id="sidebar.vendor.filter.branch" />}
                </FormHelperText>
                <Input
                  onChange={this.changeBranch}
                  value={selectedBranch}
                  style={{
                    height: 56,
                    width: 279,
                    borderColor: "#CBCBCB"
                  }}
                  type="select"
                  name="select"
                  id="Select"
                >
                  {this.props.masterReducer.data &&
                    this.props.masterReducer.data.map((value, key) => (
                      <option key={key} value={value.Id}>
                        {value.Name}
                      </option>
                    ))}
                </Input>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between py-20 px-10 border-bottom">
            <div className="row">
              <div style={{ paddingLeft: 25 }}>
                <Input
                  onChange={e => this.selectPageSize(e)}
                  type="select"
                  name="select"
                  id="Select"
                >
                  {this.pageGrop.map((value, key) => (
                    <option key={key} value={value}>
                      {value}
                    </option>
                  ))}
                </Input>
              </div>
              <div style={{ float: "left", paddingLeft: 10 }}>
                <a
                  href="#"
                  onClick={e => this.onReload(e)}
                  className="btn-outline-default mr-10"
                >
                  <i className="ti-reload"></i>
                </a>
              </div>
              <div style={{ float: "left", paddingLeft: 5 }}>
                <Input
                  value={q}
                  onChange={this.searchData}
                  type="search"
                  className="search-input-lg"
                  placeholder={this.state.placeholderSearch}
                />
              </div>
            </div>

            <div style={{ float: "left" }}>
              <CSVLink
                style={{
                  visibility:
                    this.state.csvData.length === 0 ? "hidden" : "visible"
                }}
                className="btn-sm btn-outline-default mr-10"
                data={this.state.csvData}
                filename={Date.now() + ".csv"}
              >
                {<IntlMessages id="sidebar.vendor.button.exportexcel" />}
              </CSVLink>
              <a
                href="#"
                onClick={e => this.opnAddNewDataModal(e)}
                color="primary"
                className="caret btn-sm mr-10"
              >
                {<IntlMessages id="sidebar.vendor.button.addvendorlist" />}
                <i className="zmdi zmdi-plus"></i>
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  tableHeaderArrange(selectedDatas, data) {
    // const { selectedDatas, data } = this.state;
    if (isMobile) {
      return "";
    } else {
      return (
        <tr>
          <th style={{ width: "2%", paddingLeft: 25 }} className="w-5">
            <FormControlLabel
              control={
                <Checkbox
                  indeterminate={
                    selectedDatas > 0 && selectedDatas < data.length
                  }
                  checked={selectedDatas > 0}
                  onChange={e => this.onSelectAllData(e)}
                  value="all"
                  color="primary"
                />
              }
            />
          </th>
          <th style={{ width: "3%" }}>
            {<IntlMessages id="sidebar.vendor.table.no" />}
          </th>
          <th style={{ width: "75%" }}>
            {<IntlMessages id="sidebar.vendor.table.name" />}
          </th>
          <th style={{ width: "10%" }}>
            {<IntlMessages id="sidebar.vendor.table.createdate" />}
          </th>
          <th style={{ width: "10%" }}>
            {<IntlMessages id="sidebar.vendor.button.action" />}
          </th>
        </tr>
      );
    }
  }

  tableLineArrange(data, currentPage) {
    // const { data, currentPage } = this.state;
    if (isMobile) {
      return "";
    } else {
      return (
        <tbody>
          {data &&
            data
              .slice(
                currentPage * this.state.pageSize,
                (currentPage + 1) * this.state.pageSize
              )
              .map((item, key) => (
                <tr key={key}>
                  <td style={{ paddingLeft: 25 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.checked}
                          onChange={() => this.onSelectData(item)}
                          color="primary"
                        />
                      }
                    />
                  </td>
                  <td>{item.No}</td>
                  <td>
                    {" "}
                    <h5 className="mb-5 fw-bold">
                      <a href="#" onClick={() => this.onPreviewData(item)}>
                        {item.Name}
                      </a>
                    </h5>
                  </td>
                  {!isMobile ? (
                    <td>{moment(item.CreateDate).format("DD/MM/YYYY")}</td>
                  ) : (
                    ""
                  )}
                  <td className="list-action">
                    <button
                      type="button"
                      className="rct-link-btn"
                      onClick={() => this.onEditData(item)}
                    >
                      <i className="ti-pencil"></i>
                    </button>
                    <button
                      type="button"
                      className="rct-link-btn"
                      onClick={() => this.onDelete(item)}
                    >
                      <i className="ti-close"></i>
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      );
    }
  }

  _ = require("lodash");
  filterList(arr, value) {
    return this._.filter(arr, function(object) {
      return (
        object["Name"]
          .toString()
          .toLowerCase()
          .indexOf(value.toLowerCase()) >= 0 ||
        object["Description"].toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
        moment(object["CreateDate"].toLowerCase())
          .format("DD/MM/YYYY")
          .indexOf(value.toLowerCase()) >= 0
      );
    });
  }

  async setDataAfterFilter(originalData, keySearch) {
    if (keySearch === "") {
      this.setState({ selectedDatas: 0 });
    }

    let result = this.filterList(originalData, keySearch);
    if (result.length === 0) {
      await this.setState({
        data: null,
        pagesCount: Math.ceil(0 / this.state.pageSize),
        currentPage: 0
      });
    }

    var searchOriL = this.filterList(originalData, keySearch);
    await this.setState({
      data: this.arrangeNumber(searchOriL),
      pagesCount: Math.ceil(searchOriL.length / this.state.pageSize),
      currentPage: 0
    });
  }

  async searchData(event) {
    const { originalData } = this.state;
    await this.setState({ q: event.target.value });
    await this.setDataAfterFilter(originalData, this.state.q);
  }

  onPreviewData(itemP) {
    this.setState({ previewDataModal: true, editData: itemP });
  }

  previewDialog() {
    const { editData } = this.state;
    return (
      <Modal
        isOpen={this.state.previewDataModal}
        toggle={() => this.setState({ previewDataModal: false })}
      >
        <ModalHeader toggle={() => this.setState({ previewDataModal: false })}>
          <IntlMessages id="sidebar.vendor.dialog.preview.title" />
        </ModalHeader>
        <ModalBody>
          {editData === null ? (
            ""
          ) : (
            <Form>
              <FormGroup>
                <Label for="Name">
                  <IntlMessages id="sidebar.vendor.dialog.add.name" />
                </Label>
                <Input
                  disabled="true"
                  max="250"
                  style={{ borderColor: "#CBCBCB", height: 56 }}
                  type="text"
                  name="Name"
                  id="Name"
                  placeholder={this.state.placeholderName}
                  value={editData.Name}
                />
              </FormGroup>
              <FormGroup>
                <Label for="Description">
                  <IntlMessages id="sidebar.vendor.dialog.add.description" />
                </Label>
                <Input
                  disabled="true"
                  max="250"
                  style={{ borderColor: "#CBCBCB", height: 56 }}
                  type="text"
                  name="Description"
                  id="Description"
                  placeholder={this.state.placeholderDescription}
                  value={editData.Description}
                />
              </FormGroup>
            </Form>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="contained"
            className="text-white btn-danger"
            onClick={() => this.setState({ previewDataModal: false })}
          >
            <IntlMessages id="sidebar.vendor.dialog.button.cancel" />
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  componentDidUpdate() {
    const { Locale } = this.state;
    const { settings } = this.props;
    if (Locale === settings.locale.locale) return;
    if (settings.locale.locale === "th") {
      this.setState({
        Locale: "th",
        placeholderSearch: "ค้นหา..",
        placeholderName: "ระบุชื่อ",
        placeholderDescription: "ระบุรายละเอียด",
        networkErrorTitle: "พบข้อผิดพลาดขณะเชื่อมต่อระหว่างเซิร์ฟเวอร์",
        networkErrorContent:
          "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้, กรุณาติดต่อฝ่ายบริการลูกค้า",
        errorTitle: "พบข้อผิดพลาด",
        errorContent:
          "เกิดข้อผิดพลาดขณะที่ระบบทำงาน, กรุณาติดต่อฝ่ายบริการลูกค้า"
      });
    } else {
      this.setState({
        Locale: "en",
        placeholderSearch: "Search..",
        placeholderName: "Enter Name",
        placeholderDescription: "Enter Description",
        networkErrorTitle: "Network Error",
        networkErrorContent:
          "Cannot to connect with server, please contact customer service",
        errorTitle: "Critical Error",
        errorContent: "Found some error, please contact customer service"
      });
    }
  }

  render() {
    const {
      loading,
      editData,
      currentPage,
      addNewDataDetail,
      selectedDatas,
      data
    } = this.state;

    return (
      <div className="data-management">
        <Helmet>
          <title>NWTHEC | Vendor Management</title>
          <meta name="description" content="Reactify Widgets" />
        </Helmet>
        <PageTitleBar
          title={<IntlMessages id="sidebar.vendorManagement" />}
          match={this.props.match}
        />
        <RctCollapsibleCard fullBlock>
          <div className="table-responsive">
            {/* depend on each platform (web or mobile) */}
            {this.tabArrange()}
            {/* depend on each platform (web or mobile) */}
            <table className="table table-middle table-hover mb-0">
              <thead>{this.tableHeaderArrange(selectedDatas, data)}</thead>
              {this.tableLineArrange(data, currentPage)}
              <tfoot className="border-top">
                <tr>
                  <td colSpan="100%">
                    <Pagination className="mb-0 py-10 px-10">
                      <PaginationItem disabled={currentPage <= 0}>
                        <PaginationLink
                          onClick={e => this.handleClick(e, currentPage - 1)}
                          previous
                          href="#"
                        />
                      </PaginationItem>

                      {[...Array(this.state.pagesCount)].map((page, i) => (
                        <PaginationItem active={i === currentPage} key={i}>
                          <PaginationLink
                            onClick={e => this.handleClick(e, i)}
                            href="#"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem
                        disabled={currentPage >= this.state.pagesCount - 1}
                      >
                        <PaginationLink
                          onClick={e => this.handleClick(e, currentPage + 1)}
                          next
                          href="#"
                        />
                      </PaginationItem>
                    </Pagination>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          {loading && <RctSectionLoader />}
        </RctCollapsibleCard>
        <DeleteConfirmationDialog
          ref="deleteConfirmationDialog"
          title="Delete?"
          message="Are you sure want to delete?"
          onConfirm={() => this.deleteDataPermanently()}
        />

        <DeleteConfirmationDialog
          ref="deleteMutipleConfirmationDialog"
          title="Delete?"
          message="Are you sure want to delete?"
          onConfirm={() => this.onConfirmDeleteMultiple()}
        />

        <Modal
          isOpen={this.state.addNewDataModal}
          toggle={() => this.onAddUpdateDataModalClose()}
        >
          <ModalHeader toggle={() => this.onAddUpdateDataModalClose()}>
            {editData === null ? (
              <IntlMessages id="sidebar.vendor.dialog.add.title" />
            ) : (
              <IntlMessages id="sidebar.vendor.dialog.update.title" />
            )}
          </ModalHeader>
          <ModalBody>
            {editData === null ? (
              <Form>
                <FormGroup>
                  <Label for="Name">
                    <IntlMessages id="sidebar.vendor.dialog.add.name" />
                  </Label>
                  <Input
                    max="250"
                    style={{ borderColor: "#CBCBCB", height: 56 }}
                    type="text"
                    name="Name"
                    id="Name"
                    placeholder={this.state.placeholderName}
                    value={addNewDataDetail.Name}
                    onBlur={e =>
                      this.onValidateName(e.target.value, addNewDataDetail.Id)
                    }
                    onChange={e =>
                      this.onChangeAddNewDataDetails("Name", e.target.value)
                    }
                  />
                  <Label
                    style={{
                      display: !this.state.validateName ? "none " : "inline",
                      color: "red",
                      fontSize: 15
                    }}
                  >
                    <IntlMessages id="sidebar.vendor.alert" />
                  </Label>
                </FormGroup>
                <FormGroup>
                  <Label for="Description">
                    <IntlMessages id="sidebar.vendor.dialog.add.description" />
                  </Label>
                  <Input
                    max="250"
                    style={{ borderColor: "#CBCBCB", height: 56 }}
                    type="text"
                    name="Description"
                    id="Description"
                    placeholder={this.state.placeholderDescription}
                    value={addNewDataDetail.Description}
                    onChange={e =>
                      this.onChangeAddNewDataDetails(
                        "Description",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
              </Form>
            ) : (
              <Form>
                <FormGroup>
                  <Label for="Name">
                    <IntlMessages id="sidebar.vendor.dialog.add.name" />
                  </Label>
                  <Input
                    max="250"
                    style={{ borderColor: "#CBCBCB", height: 56 }}
                    type="text"
                    name="Name"
                    id="Name"
                    placeholder={this.state.placeholderName}
                    value={editData.Name}
                    onBlur={e =>
                      this.onValidateName(e.target.value, editData.Id)
                    }
                    onChange={e =>
                      this.onUpdateDataDetails("Name", e.target.value)
                    }
                  />
                  <Label
                    style={{
                      display: !this.state.validateName ? "none " : "inline",
                      color: "red",
                      fontSize: 15
                    }}
                  >
                    <IntlMessages id="sidebar.vendor.alert" />
                  </Label>
                </FormGroup>
                <FormGroup>
                  <Label for="Description">
                    <IntlMessages id="sidebar.vendor.dialog.add.description" />
                  </Label>
                  <Input
                    max="250"
                    style={{ borderColor: "#CBCBCB", height: 56 }}
                    type="text"
                    name="Description"
                    id="Description"
                    placeholder={this.state.placeholderDescription}
                    value={editData.Description}
                    onChange={e =>
                      this.onUpdateDataDetails("Description", e.target.value)
                    }
                  />
                </FormGroup>
              </Form>
            )}
          </ModalBody>
          <ModalFooter>
            {editData === null ? (
              <Button
                variant="contained"
                className="text-white btn-success"
                onClick={() => this.addNewData()}
              >
                <IntlMessages id="sidebar.vendor.dialog.button.add" />
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                className="text-white"
                onClick={() => this.updateData()}
              >
                <IntlMessages id="sidebar.vendor.dialog.button.update" />
              </Button>
            )}{" "}
            <Button
              variant="contained"
              className="text-white btn-danger"
              onClick={() => this.onAddUpdateDataModalClose()}
            >
              <IntlMessages id="sidebar.vendor.dialog.button.cancel" />
            </Button>
          </ModalFooter>
        </Modal>
        {this.sessionDialog()}
        {this.previewDialog()}
      </div>
    );
  }
}

// // map state to props
const mapStateToProps = state => {
  const { vendorReducer, masterReducer, authUser, settings } = state;
  return { vendorReducer, masterReducer, authUser, settings };
};

export default connect(mapStateToProps, {
  fetchingDataVendor,
  updateDataVendor,
  addDataVendor,
  deleteDataVendor,
  activeSession,
  clearUser
})(VendorForm);
