/**
 * Data Management Page
 */
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

// add new Data form
//import ExpenseFormAdd from "./expense-form-add";

// update Data form
// import ExpenseFormUpdate from "./expense-form-update";

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
  fetchingDataExpense,
  updateDataExpense,
  addDataExpense,
  deleteDataExpense,
  sendDataExpense,
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
class ExpenseForm extends Component {
  pageSize = 10;
  pageGrop = [10, 25, 50, 100];
  arrProps = [["checked", false]];

  dataBranch = ["Petrol 001", "Petrol 002"];
  state = {
    sessionTitle: "",
    sessionContent: "",
    sessionStatus: false,
    all: false,
    data: null,
    selectedData: null,
    loading: false,
    addNewDataModal: false,
    addNewDataDetail: {
      Id: "",
      Description: "",
      Invoice_No: "",
      CreateDate: parseDateString(Date.now()),
      Total: "",
      Fk_Branch: "",
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
    csvData: []
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
          sessionTitle: "Session Timeout",
          sessionContent:
            "You are timed out due to inactivity you must push accept and login again."
        });
      if (this.props.authUser.session.data === "Invalid session")
        await this.setState({
          sessionDialog: true,
          sessionTitle: "Invalid session",
          sessionContent:
            "Your session is Invalid. due to might have another person try to login with this account."
        });
    }
  }

  async onAccept() {
    await this.props.clearUser();
    this.props.history.push("/signin");
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
              Accept
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  errorDialog() {
    console.log(this.props.expenseReducer.error);

    setTimeout(async () => {
      if (this.props.expenseReducer.error) {
        await this.setState({
          sessionDialog: true,
          sessionTitle: "Invalid Token",
          sessionContent:
            "Your Token is Invalid. you must push accept and login again."
        });
      }
    }, 1000);
  }

  componentDidMount() {
    this.activeSession();
    this.loadData();
    this.shopMoreTap(true);
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
        Description: element.Description,
        CreateDate: element.CreateDate,
        UpdateDate: element.UpdateDate,
        CreateBy: element.CreateBy,
        UpdateBy: element.UpdateBy,
        Enable: element.Enable,
        Invoice_No: element.Invoice_No,
        Total: element.Total,
        Image: element.Image,
        Send: element.Send,
        Fk_Branch: element.Fk_Branch,
        Time_Diff: element.Time_Diff
      });
    }
    return arrangeL;
  }

  async loadData() {
    this.errorDialog();

    this.setState({ loading: true });
    await this.props.fetchingDataExpense(this.state.selectedBranch);

    var expenseL = this.props.expenseReducer.data;
    if (expenseL == null) {
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

    var arrangeL = this.arrangeNumber(expenseL);
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
  }

  async setDataExportCsv() {
    let arrayNew = [];
    arrayNew.push([
      "No.",
      "Description",
      "Invoice No.",
      "CreateDate",
      "Total",
      "Send"
    ]);
    const { data } = this.state;
    for (let index = 0; index < data.length; index++) {
      arrayNew.push([
        data[index].No,
        data[index].Description,
        data[index].Invoice_No,
        convertDateToWebservice(data[index].CreateDate),
        data[index].Total.toFixed(2),
        data[index].Send
      ]);
    }
    await this.setState({ csvData: arrayNew });
  }

  async onConfirmDeleteMultiple() {
    const { selectedData } = this.state;
    let selectedL = this.returnSelectedKeys(selectedData);
    await this.props.deleteDataExpense(selectedL);
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

  async onConfirmUpdateMultiple() {
    const { selectedData } = this.state;
    let selectedL = this.returnSelectedKeys(selectedData);
    await this.props.sendDataExpense(selectedL);
    this.loadData();
    this.refs.sendMutipleConfirmationDialog.close();
  }

  async onSend() {
    const { data } = this.state;
    await this.setState({ selectedData: data });
    this.refs.sendMutipleConfirmationDialog.open();
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
      await this.props.deleteDataExpense(arrayKey);
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
        Id: "",
        Description: "",
        Invoice_No: "",
        CreateDate: parseDateString(Date.now()),
        Total: "",
        Fk_Branch: "",
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
    await this.props.addDataExpense(
      addNewDataDetail,
      this.state.data[0].Fk_Branch
    );
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
    if (key === "Total" && (value <= 0 || value === "")) {
      value = 0;
    }

    await this.setState({
      addNewDataDetail: {
        ...this.state.addNewDataDetail,
        ["Fk_Branch"]: this.state.data[0].Fk_Branch
      }
    });

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
    await this.props.updateDataExpense(editData, this.state.data[0].Fk_Branch);

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

  shopMoreTap(status) {
    this.setState({ moreTap: status });
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
      return (
        <div>
          <div className="row">
            <div>
              {selectedDatas > 0 ? (
                <div style={{ paddingLeft: 25, paddingTop: 25 }}>
                  <MatButton
                    onClick={() => this.onDeleteMultiple()}
                    variant="contained"
                    color="primary"
                    className="mr-10 mb-10 text-white btn-icon"
                  >
                    Delete <i className="zmdi zmdi-delete"></i>
                  </MatButton>
                  <MatButton
                    onClick={() => this.onSend()}
                    variant="contained"
                    className="btn-secondary mr-10 mb-10 text-white btn-icon"
                  >
                    Send <i className="zmdi zmdi-mail-send"></i>
                  </MatButton>
                </div>
              ) : (
                ""
              )}
            </div>

            <div style={{ float: "left" }}>
              <div style={{ paddingLeft: 25 }}>
                <FormHelperText style={{ paddingBottom: 5 }}>
                  Select Branch
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
          <div className="row" style={{ paddingTop: 15 }}>
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
                placeholder="Search.."
              />
            </div>
          </div>
          <div className="row" style={{ paddingTop: 15, paddingBottom: 15 }}>
            <div style={{ paddingLeft: 25, float: "left" }}>
              <CSVLink
                style={{
                  visibility:
                    this.state.csvData.length === 0 ? "hidden" : "visible"
                }}
                className="btn-sm btn-outline-default mr-10"
                data={this.state.csvData}
                filename={Date.now() + ".csv"}
              >
                Export to Excel
              </CSVLink>
              <a
                href="#"
                onClick={e => this.opnAddNewDataModal(e)}
                color="primary"
                className="caret btn-sm mr-10"
              >
                Add Vendor List
                <i className="zmdi zmdi-plus"></i>
              </a>
            </div>
          </div>
        </div>
      );
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
                    Delete <i className="zmdi zmdi-delete"></i>
                  </MatButton>
                  <MatButton
                    onClick={() => this.onSend()}
                    variant="contained"
                    className="btn-secondary mr-10 mb-10 text-white btn-icon"
                  >
                    Send <i className="zmdi zmdi-mail-send"></i>
                  </MatButton>
                </div>
              ) : (
                ""
              )}
            </div>

            <div style={{ float: "left" }}>
              <div style={{ paddingLeft: 25 }}>
                <FormHelperText style={{ paddingBottom: 5 }}>
                  Select Branch
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
                  placeholder="Search.."
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
                Export to Excel
              </CSVLink>
              <a
                href="#"
                onClick={e => this.opnAddNewDataModal(e)}
                color="primary"
                className="caret btn-sm mr-10"
              >
                Add Vendor List
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
      return (
        <tr>
          <th style={{ width: "35%" }}>Description</th>
          <th style={{ width: "35%" }}>Invoice No.</th>
          <th style={{ width: "10%" }}>Total</th>
          <th style={{ width: "10%" }}>Status</th>
          <th style={{ width: "10%" }}>Action</th>
        </tr>
      );
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
          <th style={{ width: "3%" }}>No.</th>
          <th style={{ width: "40%" }}>Description</th>
          <th style={{ width: "15%" }}>Invoice No.</th>
          <th style={{ width: "10%" }}>Create Date</th>
          <th style={{ width: "10%" }}>Total</th>
          <th style={{ width: "10%" }}>Status</th>
          <th style={{ width: "10%" }}>Action</th>
        </tr>
      );
    }
  }

  tableLineArrange(data, currentPage) {
    // const { data, currentPage } = this.state;
    if (isMobile) {
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
                  <td>
                    <h5 className="mb-5 fw-bold">{item.Description}</h5>
                  </td>
                  <td>{item.Invoice_No}</td>
                  <td>{roundN(item.Total, 2)}</td>
                  <td className="d-flex justify-content-start">
                    <span
                      className={`badge badge-xs ${
                        item.Send ? "badge-success" : "badge-danger"
                      } mr-10 mt-10 position-relative`}
                    >
                      &nbsp;
                    </span>
                    <div className="status">
                      <span className="d-block">
                        {item.Send ? "Submitted" : "Pending"}
                      </span>
                      <span className="small">{item.Time_Diff}</span>
                    </div>
                  </td>
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
                  {!isMobile ? <td>{item.No}</td> : ""}
                  <td>
                    <h5 className="mb-5 fw-bold">{item.Description}</h5>
                  </td>
                  <td>{item.Invoice_No}</td>
                  {!isMobile ? (
                    <td>{moment(item.CreateDate).format("DD/MM/YYYY")}</td>
                  ) : (
                    ""
                  )}
                  <td>{roundN(item.Total, 2)}</td>
                  <td className="d-flex justify-content-start">
                    <span
                      className={`badge badge-xs ${
                        item.Send ? "badge-success" : "badge-danger"
                      } mr-10 mt-10 position-relative`}
                    >
                      &nbsp;
                    </span>
                    <div className="status">
                      <span className="d-block">
                        {item.Send ? "Submitted" : "Pending"}
                      </span>
                      <span className="small">{item.Time_Diff}</span>
                    </div>
                  </td>
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
        object["Total"]
          .toString()
          .toLowerCase()
          .indexOf(value.toLowerCase()) >= 0 ||
        object["Description"].toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
        object["Invoice_No"].toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
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

        <DeleteConfirmationDialog
          ref="sendMutipleConfirmationDialog"
          title="Send?"
          message="Are you sure want to Send?"
          onConfirm={() => this.onConfirmUpdateMultiple()}
        />

        <Modal
          isOpen={this.state.addNewDataModal}
          toggle={() => this.onAddUpdateDataModalClose()}
        >
          <ModalHeader toggle={() => this.onAddUpdateDataModalClose()}>
            {editData === null ? "Add New Data" : "Update Data"}
          </ModalHeader>
          <ModalBody>
            {editData === null ? (
              <Form>
                <FormGroup>
                  <Label for="Description">Description</Label>
                  <Input
                    max="250"
                    style={{ borderColor: "#CBCBCB", height: 56 }}
                    type="text"
                    name="Description"
                    id="Description"
                    placeholder="Enter Description"
                    value={addNewDataDetail.Description}
                    onChange={e =>
                      this.onChangeAddNewDataDetails(
                        "Description",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="Invoice_No">Invoice No.</Label>
                  <Input
                    max="50"
                    style={{ borderColor: "#CBCBCB", height: 56 }}
                    type="text"
                    name="Invoice_No"
                    id="Invoice_No"
                    placeholder="Enter invoice No."
                    value={addNewDataDetail.Invoice_No}
                    onChange={e =>
                      this.onChangeAddNewDataDetails(
                        "Invoice_No",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="CreateDate">Create Date</Label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container>
                      <KeyboardDatePicker
                        fullWidth
                        inputVariant="outlined"
                        margin="normal"
                        id="date-picker-dialog"
                        format="dd/MM/yyyy"
                        value={parseDateInt(addNewDataDetail.CreateDate)}
                        onChange={e =>
                          this.onChangeAddNewDataDetails("CreateDate", e)
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date"
                        }}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                </FormGroup>
                <FormGroup>
                  <Label for="Total">Total</Label>
                  <Input
                    min="0"
                    required
                    style={{ borderColor: "#CBCBCB", height: 56 }}
                    type="number"
                    name="Total"
                    id="Total"
                    placeholder="Enter Total"
                    value={addNewDataDetail.Total}
                    onChange={e =>
                      this.onChangeAddNewDataDetails("Total", e.target.value)
                    }
                  />
                </FormGroup>
              </Form>
            ) : (
              <Form>
                <FormGroup>
                  <Label for="Description">Description</Label>
                  <Input
                    max="250"
                    style={{ borderColor: "#CBCBCB", height: 56 }}
                    type="text"
                    name="Description"
                    id="Description"
                    placeholder="Enter Description"
                    value={editData.Description}
                    onChange={e =>
                      this.onUpdateDataDetails("Description", e.target.value)
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="Invoice_No">Invoice No.</Label>
                  <Input
                    max="50"
                    style={{ borderColor: "#CBCBCB", height: 56 }}
                    type="text"
                    name="Invoice_No"
                    id="Invoice_No"
                    placeholder="Enter invoice No."
                    value={editData.Invoice_No}
                    onChange={e =>
                      this.onUpdateDataDetails("Invoice_No", e.target.value)
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="CreateDate">Create Date</Label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container>
                      <KeyboardDatePicker
                        fullWidth
                        inputVariant="outlined"
                        margin="normal"
                        id="date-picker-dialog"
                        format="dd/MM/yyyy"
                        value={parseDateInt(editData.CreateDate)}
                        onChange={e =>
                          this.onUpdateDataDetails("CreateDate", e)
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date"
                        }}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                </FormGroup>
                <FormGroup>
                  <Label for="Total">Total</Label>
                  <Input
                    min="0"
                    required
                    style={{ borderColor: "#CBCBCB", height: 56 }}
                    type="number"
                    name="Total"
                    id="Total"
                    placeholder="Enter Total"
                    value={editData.Total}
                    onChange={e =>
                      this.onUpdateDataDetails("Total", e.target.value)
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
                Add
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                className="text-white"
                onClick={() => this.updateData()}
              >
                Update
              </Button>
            )}{" "}
            <Button
              variant="contained"
              className="text-white btn-danger"
              onClick={() => this.onAddUpdateDataModalClose()}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {this.sessionDialog()}
      </div>
    );
  }
}

// // map state to props
const mapStateToProps = state => {
  const { expenseReducer, masterReducer, authUser } = state;
  return { expenseReducer, masterReducer, authUser };
};

export default connect(mapStateToProps, {
  fetchingDataExpense,
  updateDataExpense,
  addDataExpense,
  deleteDataExpense,
  sendDataExpense,
  activeSession,
  clearUser
})(ExpenseForm);
