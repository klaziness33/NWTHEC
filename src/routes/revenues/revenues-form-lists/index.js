/**
 * Data Management Page
 */
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import MatButton from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import Checkbox from "@material-ui/core/Checkbox";
import {
  Button,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import { NotificationManager } from "react-notifications";
import "date-fns";

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
  fetchingDataRevenue,
  activeSession,
  clearUser,
  deleteDataRevenue,
  sendDataRevenue,
  approveRevenue,
  disapproveRevenue
} from "Actions";

import { isMobile } from "react-device-detect";
import { STORAGE_USERMODELS, STORAGE_TOKEN } from "../../../store/storages";

import "date-fns";
import FormHelperText from "@material-ui/core/FormHelperText";
import {
  parseDateInt,
  parseDateString,
  convertDateToWebservice,
  addPropsToObject,
  decryptData,
  getHttpBase64
} from "../../../helpers/helpers";
import { CSVLink } from "react-csv";
import RevenueCardForm from "../revenues-form-card";

import DialogActions from "@material-ui/core/DialogActions";
const moment = require("moment");

class RevenueListForm extends Component {
  pageSize = 10;
  pageGrop = [10, 25, 50, 100];
  arrProps = [["checked", false]];

  dataBranch = ["Petrol 001", "Petrol 002"];
  state = {
    Locale: "",
    placeholderTotal: "Enter Total",
    placeholderBillNo: "Enter Bill No.",
    placeholderSearch: "Search..",
    placeholderTitleUpdate: "Update Revenue",
    placeholderTitleAdd: "Add Revenue",
    placeholderTitlePreview: "Preview Revenue",
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
    alertDeleteTitle:
      "cannot to delete due to current status is approved, please check again",
    alertSendTitle:
      "cannot to send due to current status is approved, please check again",
    alertApproveTitle:
      "cannot to approve again due to status has been already approved, please check again",
    alertDisApproveTitle:
      "cannot to disapprove due to current status is approved, please check again",
    sessionTitle: "",
    sessionContent: "",
    sessionStatus: false,
    showAttach: false,
    all: false,
    data: null,
    selectedData: null,
    loading: false,
    addNewDataModal: false,
    addNewDataDetail: {
      BillDate: parseDateString(Date.now()),
      FK_Branch: 0,
      Approve: false,

      petrol_attach: null,
      petrol_b20diesal_total: 0,
      petrol_b20diesal_quantity: 0,
      petrol_b20diesal_price: 0,
      petrol_b20diesal_paymentType: 1,

      petrol_e20gsh_total: 0,
      petrol_e20gsh_quantity: 0,
      petrol_e20gsh_price: 0,
      petrol_e20gsh_paymentType: 1,

      petrol_fsdiesal_total: 0,
      petrol_fsdiesal_quantity: 0,
      petrol_fsdiesal_price: 0,
      petrol_fsdiesal_paymentType: 1,

      petrol_fsgsh91_total: 0,
      petrol_fsgsh91_quantity: 0,
      petrol_fsgsh91_price: 0,
      petrol_fsgsh91_paymentType: 1,

      petrol_vpdiesal_total: 0,
      petrol_vpdiesal_quantity: 0,
      petrol_vpdiesal_price: 0,
      petrol_vpdiesal_paymentType: 1,

      petrol_vpgsh95_total: 0,
      petrol_vpgsh95_quantity: 0,
      petrol_vpgsh95_price: 0,
      petrol_vpgsh95_paymentType: 1,

      engineoil_attach: null,
      engineoil_b20diesal_total: 0,
      engineoil_b20diesal_price: 0,

      engineoil_e20gsh_total: 0,
      engineoil_e20gsh_price: 0,

      engineoil_fsdiesal_total: 0,
      engineoil_fsdiesal_price: 0,

      carcare_attach: null,
      carcare_size_s_washcar_total: 0,
      carcare_size_s_washcar_price: 0,
      carcare_size_s_wax_total: 0,
      carcare_size_s_wax_price: 0,

      carcare_size_m_washcar_total: 0,
      carcare_size_m_washcar_price: 0,
      carcare_size_m_wax_total: 0,
      carcare_size_m_wax_price: 0,

      carcare_size_l_washcar_total: 0,
      carcare_size_l_washcar_price: 0,
      carcare_size_l_wax_total: 0,
      carcare_size_l_wax_price: 0,

      conveniencestore_attach: null,
      conveniencestore_food_total: 0,
      conveniencestore_food_price: 0,

      conveniencestore_nonfood_total: 0,
      conveniencestore_nonfood_price: 0,

      cafe_attach: null,
      cafe_revenuecafe_total: 0,
      cafe_revenuecafe_price: 0
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
    actionType: "",
    permission: 0
  };

  Transition = React.forwardRef(function Transition(props, ref) {
    if (props === undefined || ref === undefined) return;
    return <Slide direction="up" ref={ref} {...props} />;
  });

  // handleDateChange = this.handleDateChange.bind(this);
  filterList = this.filterList.bind(this);
  searchData = this.searchData.bind(this);
  changeBranch = this.changeBranch.bind(this);

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
      if (this.props.authUser.session.data === "Session timeout") {
        await this.setState({
          sessionDialog: true,
          sessionTitle: this.state.sessionTimeOutTitle,
          sessionContent: this.state.sessionTimeOutContent
        });
      }
      if (this.props.authUser.session.data === "Invalid session") {
        await this.setState({
          sessionDialog: true,
          sessionTitle: this.state.sessionInvalidOutTitle,
          sessionContent: this.state.sessionInvalidOutContent
        });
      }
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
              {<IntlMessages id="sidebar.dialog.session.btn.accept" />}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  errorDialog() {
    const { revenueReducer } = this.props;
    if (revenueReducer.unauthorized) {
      setTimeout(async () => {
        await this.setState({
          sessionDialog: true,
          sessionTitle: this.state.tokenInvalidTitle,
          sessionContent: this.state.tokenInvalidContent
        });
      }, 5000);
    } else if (revenueReducer.network) {
      setTimeout(async () => {
        await this.setState({
          sessionDialog: true,
          sessionTitle: this.state.networkErrorTitle,
          sessionContent: this.state.networkErrorContent
        });
      }, 5000);
    } else if (revenueReducer.error) {
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
    this.shopMoreTap(true);
    this.tabArrange();
  }

  async onApprove() {
    const { data } = this.state;
    await this.setState({ selectedData: data });
    this.refs.approveMutipleConfirmationDialog.open();
  }

  async onConfirmApproveMultiple() {
    let breakL = false;
    const { selectedData } = this.state;
    for (let index = 0; index < selectedData.length; index++) {
      const element = selectedData[index];
      if (element.checked && element.Approve) {
        alert(this.state.alertApproveTitle);
        breakL = true;
        break;
      }
    }
    if (breakL) return;
    //ToDo
    let selectedL = this.returnSelectedKeys(selectedData);
    await this.props.approveRevenue(selectedL);
    setTimeout(() => {
      this.loadData();
      this.handleClose();
      this.refs.approveMutipleConfirmationDialog.close();
    }, 500);
  }

  async onDisapprove() {
    const { data } = this.state;
    await this.setState({ selectedData: data });
    this.refs.disapproveMutipleConfirmationDialog.open();
  }

  async onConfirmDisapproveMultiple() {
    let breakL = false;
    const { selectedData } = this.state;
    for (let index = 0; index < selectedData.length; index++) {
      const element = selectedData[index];
      if (element.checked && element.Approve) {
        alert(this.state.alertDisApproveTitle);
        breakL = true;
        break;
      }
    }
    if (breakL) return;
    //ToDo
    let selectedL = this.returnSelectedKeys(selectedData);
    await this.props.disapproveRevenue(selectedL);
    setTimeout(() => {
      this.loadData();
      this.handleClose();
      this.refs.disapproveMutipleConfirmationDialog.close();
    }, 500);
  }

  arrangeNumber(arrP) {
    var arrangeL = [];
    for (let index = 0; index < arrP.length; index++) {
      const element = arrP[index];
      arrangeL.push({
        checked: false,
        No: index + 1,
        Id: element.Id,
        BillDate: element.BillDate,
        FK_Branch: element.Fk_Branch,
        Description: element.Description,

        petrol_attach: element.Petrol_Attach,
        petrol_b20diesal_total: element.Petrol_B20_DIESAL_Total,
        petrol_b20diesal_quantity: element.Petrol_B20_DIESAL_Quantity,
        petrol_b20diesal_price: element.Petrol_B20_DIESAL_Price,
        petrol_b20diesal_paymentType: element.Petrol_B20_DIESAL_Payment_Type,

        petrol_e20gsh_total: element.Petrol_E20_GSH_Total,
        petrol_e20gsh_quantity: element.Petrol_E20_GSH_Quantity,
        petrol_e20gsh_price: element.Petrol_E20_GSH_Price,
        petrol_e20gsh_paymentType: element.Petrol_E20_GSH_Payment_Type,

        petrol_fsdiesal_total: element.Petrol_FS_DIESAL_Total,
        petrol_fsdiesal_quantity: element.Petrol_FS_DIESAL_Quantity,
        petrol_fsdiesal_price: element.Petrol_FS_DIESAL_Price,
        petrol_fsdiesal_paymentType: element.Petrol_FS_DIESAL_Payment_Type,

        petrol_fsgsh91_total: element.Petrol_FS_GSH91_Total,
        petrol_fsgsh91_quantity: element.Petrol_FS_GSH91_Quantity,
        petrol_fsgsh91_price: element.Petrol_FS_GSH91_Price,
        petrol_fsgsh91_paymentType: element.Petrol_FS_GSH91_Payment_Type,

        petrol_vpdiesal_total: element.Petrol_VP_DIESAL_Total,
        petrol_vpdiesal_quantity: element.Petrol_VP_DIESAL_Quantity,
        petrol_vpdiesal_price: element.Petrol_VP_DIESAL_Price,
        petrol_vpdiesal_paymentType: element.Petrol_VP_DIESAL_Payment_Type,

        petrol_vpgsh95_total: element.Petrol_VP_GSH95_Total,
        petrol_vpgsh95_quantity: element.Petrol_VP_GSH95_Quantity,
        petrol_vpgsh95_price: element.Petrol_VP_GSH95_Price,
        petrol_vpgsh95_paymentType: element.Petrol_VP_GSH95_Payment_Type,

        engineoil_attach: element.Engineoil_Attach,
        engineoil_b20diesal_total: element.Engineoil_B20_DIESAL_Total,
        engineoil_b20diesal_price: element.Engineoil_B20_DIESAL_Price,

        engineoil_e20gsh_total: element.Engineoil_E20_GSH_Total,
        engineoil_e20gsh_price: element.Engineoil_E20_GSH_Price,

        engineoil_fsdiesal_total: element.Engineoil_FS_DIESAL_Total,
        engineoil_fsdiesal_price: element.Engineoil_FS_DIESAL_Price,

        carcare_attach: element.Car_Care_Attach,
        carcare_size_s_washcar_total: element.Car_Care_Size_S_Wash_Car_Total,
        carcare_size_s_washcar_price: element.Car_Care_Size_S_Wash_Car_Price,
        carcare_size_s_wax_total: element.Car_Care_Size_S_Wax_Total,
        carcare_size_s_wax_price: element.Car_Care_Size_S_Wax_Price,

        carcare_size_m_washcar_total: element.Car_Care_Size_M_Wash_Car_Total,
        carcare_size_m_washcar_price: element.Car_Care_Size_M_Wash_Car_Price,
        carcare_size_m_wax_total: element.Car_Care_Size_M_Wax_Total,
        carcare_size_m_wax_price: element.Car_Care_Size_M_Wax_Price,

        carcare_size_l_washcar_total: element.Car_Care_Size_L_Wash_Car_Total,
        carcare_size_l_washcar_price: element.Car_Care_Size_L_Wash_Car_Price,
        carcare_size_l_wax_total: element.Car_Care_Size_L_Wax_Total,
        carcare_size_l_wax_price: element.Car_Care_Size_L_Wax_Price,

        conveniencestore_attach: element.Convenience_Store_Attach,
        conveniencestore_food_total: element.Convenience_Store_Food_Total,
        conveniencestore_food_price: element.Convenience_Store_Food_Price,

        conveniencestore_nonfood_total: element.Convenience_Store_NoFood_Total,
        conveniencestore_nonfood_price: element.Convenience_Store_NoFood_Price,

        cafe_attach: element.Cafe_Attach,
        cafe_revenuecafe_total: element.Cafe_Revenue_Cafe_Total,
        cafe_revenuecafe_price: element.Cafe_Revenue_Cafe_Price,
        Approve: element.Approve,
        Send: element.Send,
        CreateBy: element.CreateBy,
        Time_Diff: element.Time_Diff
      });
    }
    return arrangeL;
  }

  arrangeNumber2(arrP) {
    var arrangeL = [];
    for (let index = 0; index < arrP.length; index++) {
      const element = arrP[index];
      arrangeL.push({
        checked: false,
        No: index + 1,
        Id: element.Id,
        BillDate: element.BillDate,
        FK_Branch: element.FK_Branch,
        Description: element.Description,

        petrol_attach: element.petrol_attach,
        petrol_b20diesal_total: element.petrol_b20diesal_total,
        petrol_b20diesal_quantity: element.petrol_b20diesal_quantity,
        petrol_b20diesal_price: element.petrol_b20diesal_price,
        petrol_b20diesal_paymentType: element.petrol_b20diesal_paymentType,

        petrol_e20gsh_total: element.petrol_e20gsh_total,
        petrol_e20gsh_quantity: element.petrol_e20gsh_quantity,
        petrol_e20gsh_price: element.petrol_e20gsh_price,
        petrol_e20gsh_paymentType: element.petrol_e20gsh_paymentType,

        petrol_fsdiesal_total: element.petrol_fsdiesal_total,
        petrol_fsdiesal_quantity: element.petrol_fsdiesal_quantity,
        petrol_fsdiesal_price: element.petrol_fsdiesal_price,
        petrol_fsdiesal_paymentType: element.petrol_fsdiesal_paymentType,

        petrol_fsgsh91_total: element.petrol_fsgsh91_total,
        petrol_fsgsh91_quantity: element.petrol_fsgsh91_quantity,
        petrol_fsgsh91_price: element.petrol_fsgsh91_price,
        petrol_fsgsh91_paymentType: element.petrol_fsgsh91_paymentType,

        petrol_vpdiesal_total: element.petrol_vpdiesal_total,
        petrol_vpdiesal_quantity: element.petrol_vpdiesal_quantity,
        petrol_vpdiesal_price: element.petrol_vpdiesal_price,
        petrol_vpdiesal_paymentType: element.petrol_vpdiesal_paymentType,

        petrol_vpgsh95_total: element.petrol_vpgsh95_total,
        petrol_vpgsh95_quantity: element.petrol_vpgsh95_quantity,
        petrol_vpgsh95_price: element.petrol_vpgsh95_price,
        petrol_vpgsh95_paymentType: element.petrol_vpgsh95_paymentType,

        engineoil_attach: element.engineoil_attach,
        engineoil_b20diesal_total: element.engineoil_b20diesal_total,
        engineoil_b20diesal_price: element.engineoil_b20diesal_price,

        engineoil_e20gsh_total: element.engineoil_e20gsh_total,
        engineoil_e20gsh_price: element.engineoil_e20gsh_price,

        engineoil_fsdiesal_total: element.engineoil_fsdiesal_total,
        engineoil_fsdiesal_price: element.engineoil_fsdiesal_price,

        carcare_attach: element.carcare_attach,
        carcare_size_s_washcar_total: element.carcare_size_s_washcar_total,
        carcare_size_s_washcar_price: element.carcare_size_s_washcar_price,
        carcare_size_s_wax_total: element.carcare_size_s_wax_total,
        carcare_size_s_wax_price: element.carcare_size_s_wax_price,

        carcare_size_m_washcar_total: element.carcare_size_m_washcar_total,
        carcare_size_m_washcar_price: element.carcare_size_m_washcar_price,
        carcare_size_m_wax_total: element.carcare_size_m_wax_total,
        carcare_size_m_wax_price: element.carcare_size_m_wax_price,

        carcare_size_l_washcar_total: element.carcare_size_l_washcar_total,
        carcare_size_l_washcar_price: element.carcare_size_l_washcar_price,
        carcare_size_l_wax_total: element.carcare_size_l_wax_total,
        carcare_size_l_wax_price: element.carcare_size_l_wax_price,

        conveniencestore_attach: element.conveniencestore_attach,
        conveniencestore_food_total: element.conveniencestore_food_total,
        conveniencestore_food_price: element.conveniencestore_food_price,

        conveniencestore_nonfood_total: element.conveniencestore_nonfood_total,
        conveniencestore_nonfood_price: element.conveniencestore_nonfood_price,

        cafe_attach: element.cafe_attach,
        cafe_revenuecafe_total: element.cafe_revenuecafe_total,
        cafe_revenuecafe_price: element.cafe_revenuecafe_price,
        Approve: element.Approve,
        Send: element.Send,
        CreateBy: element.CreateBy,
        Time_Diff: element.Time_Diff
      });
    }
    return arrangeL;
  }

  async loadData() {
    this.setState({ loading: true });
    await this.props.fetchingDataRevenue(this.state.selectedBranch);
    var dataL = this.props.revenueReducer.data;
    if (dataL == null) {
      this.setState({
        loading: false,
        data: null,
        originalData: null,
        pagesCount: 0,
        currentPage: 0,
        selectedDatas: 0,
        permission: 0
      });
      return;
    }

    var arrangeL = this.arrangeNumber(dataL);
    await this.setState({
      selectedDatas: 0,
      originalData: addPropsToObject(arrangeL, this.arrProps),
      filterData: addPropsToObject(arrangeL, this.arrProps),
      pagesCount: Math.ceil(arrangeL.length / this.state.pageSize),
      data: addPropsToObject(arrangeL, this.arrProps),
      loading: false,
      filteredData: addPropsToObject(arrangeL, this.arrProps)
    });

    let roleL = this.filterRole(this.props.authUser.user.fk_Role);
    this.setRoleState(roleL);
    this.setDataExportCsv();
    this.errorDialog();
  }

  async setRoleState(roleP) {
    await this.setState({ Fk_Role: this.props.authUser.user.fk_Role });
    if (roleP.toLowerCase() === "leader") {
      await this.setState({ permission: this.props.authUser.user.fk_Role });
    }
  }

  filterRole(RoleIdP) {
    let roleL = this.props.masterReducer.role;
    for (let index = 0; index < roleL.length; index++) {
      const element = roleL[index];
      if (element.Id != RoleIdP) continue;
      return element.Name;
    }
  }

  filterBranch(branchIdP) {
    let branchL = this.props.masterReducer.data;
    for (let index = 0; index < branchL.length; index++) {
      const element = branchL[index];
      if (element.Id != branchIdP) continue;
      return element.Name;
    }
  }

  async setDataExportCsv() {
    this.filterBranch();
    let arrayNew = [];
    arrayNew.push([
      "No.",
      "Branch",
      "Description",
      "Send",
      "Approve",
      "CreateBy",
      "CreateDate"
    ]);
    const { data } = this.state;
    for (let index = 0; index < data.length; index++) {
      arrayNew.push([
        data[index].No,
        this.filterBranch(data[index].FK_Branch),
        data[index].Description,
        data[index].Send.toString(),
        data[index].Approve.toString(),
        data[index].CreateBy,
        convertDateToWebservice(data[index].CreateDate)
      ]);
    }
    await this.setState({ csvData: arrayNew });
  }

  async onConfirmDeleteMultiple() {
    let breakL = false;
    const { selectedData } = this.state;
    for (let index = 0; index < selectedData.length; index++) {
      const element = selectedData[index];
      if (element.checked && element.Approve) {
        alert(this.state.alertDeleteTitle);
        breakL = true;
        break;
      }
    }

    if (breakL) return;
    let selectedL = this.returnSelectedKeys(selectedData);
    await this.props.deleteDataRevenue(selectedL);
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

  async onConfirmSendMultiple() {
    let breakL = false;
    const { selectedData } = this.state;
    for (let index = 0; index < selectedData.length; index++) {
      const element = selectedData[index];
      if (element.checked && element.Approve) {
        alert(this.state.alertSendTitle);
        breakL = true;
        break;
      }
    }

    if (breakL) return;
    let selectedL = this.returnSelectedKeys(selectedData);
    await this.props.sendDataRevenue(selectedL);
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
  async onDelete(data) {
    await this.setState({
      selectedData: data,
      actionType: "Delete"
    });
    this.refs.deleteConfirmationDialog.open();
  }

  /**
   * Delete Data Permanently
   */
  deleteDataPermanently() {
    const { selectedData } = this.state;
    if (selectedData.Approve) {
      alert(this.state.alertDeleteTitle);
      return;
    }

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
      await this.props.deleteDataRevenue(arrayKey);
    }, 500);
  }

  /**
   * Open Add New Data Modal
   */
  opnAddNewDataModal(e) {
    e.preventDefault();
    this.setState({
      actionType: "Add",
      showAttach: true,
      addNewDataDetail: {
        BillDate: parseDateString(Date.now()),
        FK_Branch: 0,
        Approve: false,

        petrol_attach: null,
        petrol_b20diesal_total: 0,
        petrol_b20diesal_quantity: 0,
        petrol_b20diesal_price: 0,
        petrol_b20diesal_paymentType: 1,

        petrol_e20gsh_total: 0,
        petrol_e20gsh_quantity: 0,
        petrol_e20gsh_price: 0,
        petrol_e20gsh_paymentType: 1,

        petrol_fsdiesal_total: 0,
        petrol_fsdiesal_quantity: 0,
        petrol_fsdiesal_price: 0,
        petrol_fsdiesal_paymentType: 1,

        petrol_fsgsh91_total: 0,
        petrol_fsgsh91_quantity: 0,
        petrol_fsgsh91_price: 0,
        petrol_fsgsh91_paymentType: 1,

        petrol_vpdiesal_total: 0,
        petrol_vpdiesal_quantity: 0,
        petrol_vpdiesal_price: 0,
        petrol_vpdiesal_paymentType: 1,

        petrol_vpgsh95_total: 0,
        petrol_vpgsh95_quantity: 0,
        petrol_vpgsh95_price: 0,
        petrol_vpgsh95_paymentType: 1,

        engineoil_attach: null,
        engineoil_b20diesal_total: 0,
        engineoil_b20diesal_price: 0,

        engineoil_e20gsh_total: 0,
        engineoil_e20gsh_price: 0,

        engineoil_fsdiesal_total: 0,
        engineoil_fsdiesal_price: 0,

        carcare_attach: null,
        carcare_size_s_washcar_total: 0,
        carcare_size_s_washcar_price: 0,
        carcare_size_s_wax_total: 0,
        carcare_size_s_wax_price: 0,

        carcare_size_m_washcar_total: 0,
        carcare_size_m_washcar_price: 0,
        carcare_size_m_wax_total: 0,
        carcare_size_m_wax_price: 0,

        carcare_size_l_washcar_total: 0,
        carcare_size_l_washcar_price: 0,
        carcare_size_l_wax_total: 0,
        carcare_size_l_wax_price: 0,

        conveniencestore_attach: null,
        conveniencestore_food_total: 0,
        conveniencestore_food_price: 0,

        conveniencestore_nonfood_total: 0,
        conveniencestore_nonfood_price: 0,

        cafe_attach: null,
        cafe_revenuecafe_total: 0,
        cafe_revenuecafe_price: 0
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

  base64Encode(file) {
    var body = fs.readFileSync(file);
    return body.toString("base64");
  }

  async prepareBase64(petrolP, engineoilP, carcareP, conveniencestoreP, cafeP) {
    if (petrolP)
      await getHttpBase64(petrolP, async resultL => {
        await this.setState({ petrol_attach_base64: resultL });
      });

    if (engineoilP)
      await getHttpBase64(engineoilP, async resultL => {
        await this.setState({ engineoil_attach_base64: resultL });
      });

    if (carcareP)
      await getHttpBase64(carcareP, async resultL => {
        await this.setState({ carcare_attach_base64: resultL });
      });

    if (conveniencestoreP)
      await getHttpBase64(conveniencestoreP, async resultL => {
        await this.setState({ conveniencestore_attach_base64: resultL });
      });

    if (cafeP)
      await getHttpBase64(cafeP, async resultL => {
        await this.setState({ cafe_attach_base64: resultL });
      });
  }

  /**
   * On Edit Data
   */
  async onEditData(element) {
    this.prepareBase64(
      element.petrol_attach,
      element.engineoil_attach,
      element.carcare_attach,
      element.conveniencestore_attach,
      element.cafe_attach
    );

    setTimeout(async () => {
      let petrol_attachL = null;
      if (element.petrol_attach !== "") {
        petrol_attachL = {
          name: element.petrol_attach !== "" ? "Attach Doc.jpg" : "",
          base64: this.state.petrol_attach_base64,
          realname: element.petrol_attach
        };
      }

      let engineoil_attachL = null;
      if (element.engineoil_attach !== "") {
        engineoil_attachL = {
          name: element.engineoil_attach !== "" ? "Attach Doc.jpg" : "",
          base64: this.state.engineoil_attach_base64,
          realname: element.engineoil_attach
        };
      }
      let carcare_attachL = null;
      if (element.carcare_attach !== "") {
        carcare_attachL = {
          name: element.carcare_attach !== "" ? "Attach Doc.jpg" : "",
          base64: this.state.carcare_attach_base64,
          realname: element.carcare_attach
        };
      }

      let conveniencestore_attachL = null;
      if (element.conveniencestore_attach !== "") {
        conveniencestore_attachL = {
          name: element.conveniencestore_attach !== "" ? "Attach Doc.jpg" : "",
          base64: this.state.conveniencestore_attach_base64,
          realname: element.conveniencestore_attach
        };
      }

      let cafe_attachL = null;
      if (element.cafe_attach !== "") {
        cafe_attachL = {
          name: element.cafe_attach !== "" ? "Attach Doc.jpg" : "",
          base64: this.state.cafe_attach_base64,
          realname: element.cafe_attach
        };
      }

      let resultL = {
        Id: element.Id,
        BillDate: element.BillDate,
        FK_Branch: element.FK_Branch,
        Description: element.Description,

        petrol_attach: petrol_attachL,
        petrol_b20diesal_total: element.petrol_b20diesal_total,
        petrol_b20diesal_quantity: element.petrol_b20diesal_quantity,
        petrol_b20diesal_price: element.petrol_b20diesal_price,
        petrol_b20diesal_paymentType: element.petrol_b20diesal_paymentType,

        petrol_e20gsh_total: element.petrol_e20gsh_total,
        petrol_e20gsh_quantity: element.petrol_e20gsh_quantity,
        petrol_e20gsh_price: element.petrol_e20gsh_price,
        petrol_e20gsh_paymentType: element.petrol_e20gsh_paymentType,

        petrol_fsdiesal_total: element.petrol_fsdiesal_total,
        petrol_fsdiesal_quantity: element.petrol_fsdiesal_quantity,
        petrol_fsdiesal_price: element.petrol_fsdiesal_price,
        petrol_fsdiesal_paymentType: element.petrol_fsdiesal_paymentType,

        petrol_fsgsh91_total: element.petrol_fsgsh91_total,
        petrol_fsgsh91_quantity: element.petrol_fsgsh91_quantity,
        petrol_fsgsh91_price: element.petrol_fsgsh91_price,
        petrol_fsgsh91_paymentType: element.petrol_fsgsh91_paymentType,

        petrol_vpdiesal_total: element.petrol_vpdiesal_total,
        petrol_vpdiesal_quantity: element.petrol_vpdiesal_quantity,
        petrol_vpdiesal_price: element.petrol_vpdiesal_price,
        petrol_vpdiesal_paymentType: element.petrol_vpdiesal_paymentType,

        petrol_vpgsh95_total: element.petrol_vpgsh95_total,
        petrol_vpgsh95_quantity: element.petrol_vpgsh95_quantity,
        petrol_vpgsh95_price: element.petrol_vpgsh95_price,
        petrol_vpgsh95_paymentType: element.petrol_vpgsh95_paymentType,

        engineoil_attach: engineoil_attachL,
        engineoil_b20diesal_total: element.engineoil_b20diesal_total,
        engineoil_b20diesal_price: element.engineoil_b20diesal_price,

        engineoil_e20gsh_total: element.engineoil_e20gsh_total,
        engineoil_e20gsh_price: element.engineoil_e20gsh_price,

        engineoil_fsdiesal_total: element.engineoil_fsdiesal_total,
        engineoil_fsdiesal_price: element.engineoil_fsdiesal_price,

        carcare_attach: carcare_attachL,
        carcare_size_s_washcar_total: element.carcare_size_s_washcar_total,
        carcare_size_s_washcar_price: element.carcare_size_s_washcar_price,
        carcare_size_s_wax_total: element.carcare_size_s_wax_total,
        carcare_size_s_wax_price: element.carcare_size_s_wax_price,

        carcare_size_m_washcar_total: element.carcare_size_m_washcar_total,
        carcare_size_m_washcar_price: element.carcare_size_m_washcar_price,
        carcare_size_m_wax_total: element.carcare_size_m_wax_total,
        carcare_size_m_wax_price: element.carcare_size_m_wax_price,

        carcare_size_l_washcar_total: element.carcare_size_l_washcar_total,
        carcare_size_l_washcar_price: element.carcare_size_l_washcar_price,
        carcare_size_l_wax_total: element.carcare_size_l_wax_total,
        carcare_size_l_wax_price: element.carcare_size_l_wax_price,

        conveniencestore_attach: conveniencestore_attachL,
        conveniencestore_food_total: element.conveniencestore_food_total,
        conveniencestore_food_price: element.conveniencestore_food_price,

        conveniencestore_nonfood_total: element.conveniencestore_nonfood_total,
        conveniencestore_nonfood_price: element.conveniencestore_nonfood_price,

        cafe_attach: cafe_attachL,
        cafe_revenuecafe_total: element.cafe_revenuecafe_total,
        cafe_revenuecafe_price: element.cafe_revenuecafe_price,
        Approve: element.Approve,
        Send: element.Send,
        CreateBy: element.CreateBy,
        Time_Diff: element.Time_Diff
      };

      await this.setState({
        showAttach: true,
        addNewDataModal: true,
        editData: resultL,
        actionType: "Update"
      });
    }, 500);
  }

  async onPreviewData(element) {
    let resultL = {
      Id: element.Id,
      BillDate: element.BillDate,
      FK_Branch: element.FK_Branch,
      Description: element.Description,

      petrol_attach: element.petrol_attach,
      petrol_b20diesal_total: element.petrol_b20diesal_total,
      petrol_b20diesal_quantity: element.petrol_b20diesal_quantity,
      petrol_b20diesal_price: element.petrol_b20diesal_price,
      petrol_b20diesal_paymentType: element.petrol_b20diesal_paymentType,

      petrol_e20gsh_total: element.petrol_e20gsh_total,
      petrol_e20gsh_quantity: element.petrol_e20gsh_quantity,
      petrol_e20gsh_price: element.petrol_e20gsh_price,
      petrol_e20gsh_paymentType: element.petrol_e20gsh_paymentType,

      petrol_fsdiesal_total: element.petrol_fsdiesal_total,
      petrol_fsdiesal_quantity: element.petrol_fsdiesal_quantity,
      petrol_fsdiesal_price: element.petrol_fsdiesal_price,
      petrol_fsdiesal_paymentType: element.petrol_fsdiesal_paymentType,

      petrol_fsgsh91_total: element.petrol_fsgsh91_total,
      petrol_fsgsh91_quantity: element.petrol_fsgsh91_quantity,
      petrol_fsgsh91_price: element.petrol_fsgsh91_price,
      petrol_fsgsh91_paymentType: element.petrol_fsgsh91_paymentType,

      petrol_vpdiesal_total: element.petrol_vpdiesal_total,
      petrol_vpdiesal_quantity: element.petrol_vpdiesal_quantity,
      petrol_vpdiesal_price: element.petrol_vpdiesal_price,
      petrol_vpdiesal_paymentType: element.petrol_vpdiesal_paymentType,

      petrol_vpgsh95_total: element.petrol_vpgsh95_total,
      petrol_vpgsh95_quantity: element.petrol_vpgsh95_quantity,
      petrol_vpgsh95_price: element.petrol_vpgsh95_price,
      petrol_vpgsh95_paymentType: element.petrol_vpgsh95_paymentType,

      engineoil_attach: element.engineoil_attach,
      engineoil_b20diesal_total: element.engineoil_b20diesal_total,
      engineoil_b20diesal_price: element.engineoil_b20diesal_price,

      engineoil_e20gsh_total: element.engineoil_e20gsh_total,
      engineoil_e20gsh_price: element.engineoil_e20gsh_price,

      engineoil_fsdiesal_total: element.engineoil_fsdiesal_total,
      engineoil_fsdiesal_price: element.engineoil_fsdiesal_price,

      carcare_attach: element.carcare_attach,
      carcare_size_s_washcar_total: element.carcare_size_s_washcar_total,
      carcare_size_s_washcar_price: element.carcare_size_s_washcar_price,
      carcare_size_s_wax_total: element.carcare_size_s_wax_total,
      carcare_size_s_wax_price: element.carcare_size_s_wax_price,

      carcare_size_m_washcar_total: element.carcare_size_m_washcar_total,
      carcare_size_m_washcar_price: element.carcare_size_m_washcar_price,
      carcare_size_m_wax_total: element.carcare_size_m_wax_total,
      carcare_size_m_wax_price: element.carcare_size_m_wax_price,

      carcare_size_l_washcar_total: element.carcare_size_l_washcar_total,
      carcare_size_l_washcar_price: element.carcare_size_l_washcar_price,
      carcare_size_l_wax_total: element.carcare_size_l_wax_total,
      carcare_size_l_wax_price: element.carcare_size_l_wax_price,

      conveniencestore_attach: element.conveniencestore_attach,
      conveniencestore_food_total: element.conveniencestore_food_total,
      conveniencestore_food_price: element.conveniencestore_food_price,

      conveniencestore_nonfood_total: element.conveniencestore_nonfood_total,
      conveniencestore_nonfood_price: element.conveniencestore_nonfood_price,

      cafe_attach: element.cafe_attach,
      cafe_revenuecafe_total: element.cafe_revenuecafe_total,
      cafe_revenuecafe_price: element.cafe_revenuecafe_price,
      Approve: element.Approve,
      Send: element.Send,
      CreateBy: element.CreateBy,
      Time_Diff: element.Time_Diff
    };

    await this.setState({
      showAttach: true,
      addNewDataModal: true,
      editData: resultL,
      actionType: "Preview"
    });
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

  componentDidUpdate() {
    const { Locale } = this.state;
    const { settings } = this.props;
    if (Locale === settings.locale.locale) return;
    if (settings.locale.locale === "th") {
      this.setState({
        Locale: "th",
        placeholderSearch: "ค้นหา..",
        placeholderTotal: "ระบุหมายเลขบิล",
        placeholderBillNo: "ระบุยอดรวม",
        placeholderTitleUpdate: "อัพเดทรายได้",
        placeholderTitleAdd: "เพิ่มรายได้",
        placeholderTitlePreview: "ดูตัวอย่างรายได้",
        sessionTimeOutTitle: "เซสชันหมดอายุ",
        sessionTimeOutContent:
          "คุณหมดเวลาเนื่องจากไม่มีการใช้งานคุณจะต้องกดยอมรับและลงชื่อเข้าใช้อีกครั้ง",
        sessionInvalidOutTitle: "เซสชันไม่ถูกต้อง",
        sessionInvalidOutContent:
          "เซสชันของคุณไม่ถูกต้อง เนื่องจากอาจมีบุคคลอื่นพยายามลงชื่อเข้าใช้ด้วยบัญชีนี้คุณต้องกดยอมรับและลงชื่อเข้าใช้อีกครั้ง",
        tokenInvalidTitle: "โทเค็นไม่ถูกต้อง",
        tokenInvalidContent:
          "โทเค็นของคุณไม่ถูกต้อง คุณต้องกดยอมรับและลงชื่อเข้าใช้อีกครั้ง",
        networkErrorTitle: "พบข้อผิดพลาดขณะเชื่อมต่อระหว่างเซิร์ฟเวอร์",
        networkErrorContent:
          "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้, กรุณาติดต่อฝ่ายบริการลูกค้า",
        errorTitle: "พบข้อผิดพลาด",
        errorContent:
          "เกิดข้อผิดพลาดขณะที่ระบบทำงาน, กรุณาติดต่อฝ่ายบริการลูกค้า",
        alertDeleteTitle:
          "ไม่สามารถลบได้เนื่องจากสถานะปัจจุบัญคืออนุมัติ, กรุณาตรวจสอบอีกครั้ง",
        alertSendTitle:
          "ไม่สามารถนำส่งได้เนื่องจากสถานะปัจจุบัญคืออนุมัติ, กรุณาตรวจสอบอีกครั้ง",
        alertApproveTitle:
          "ไม่สามารถอนุมัติอีกครั้งเนื่องจากสถานะได้รับการอนุมัติแล้ว, กรุณาตรวจสอบอีกครั้ง",
        alertDisApproveTitle:
          "ไม่สามารถเปลี่ยนสถานะเป็นไม่อนุมัติได้เนื่องจากสถานะปัจจุบัญคืออนุมัติ, กรุณาตรวจสอบอีกครั้ง"
      });
    } else {
      this.setState({
        Locale: "en",
        placeholderSearch: "Search..",
        placeholderTotal: "Enter Total",
        placeholderBillNo: "Enter Bill No.",
        placeholderTitleUpdate: "Update Revenue",
        placeholderTitleAdd: "Add Revenue",
        placeholderTitlePreview: "Preview Revenue",
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
        alertDeleteTitle:
          "cannot to delete due to current status is approved, please check again",
        alertSendTitle:
          "cannot to send due to current status is approved, please check again",
        alertApproveTitle:
          "cannot to approve again due to status has been already approved, please check again",
        alertDisApproveTitle:
          "cannot to disapprove due to current status is approved, please check again"
      });
    }
  }

  // arrange for ui (web or mobile)
  tabArrange() {
    const { selectedBranch, q, selectedDatas, permission } = this.state;

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
                    {<IntlMessages id="sidebar.revenues.dialog.btn.delete" />}{" "}
                    <i className="zmdi zmdi-delete"></i>
                  </MatButton>
                  <MatButton
                    style={{
                      display: this.state.permission === 0 ? "inline" : "none"
                    }}
                    onClick={() => this.onSend()}
                    variant="contained"
                    className="btn-secondary mr-10 mb-10 text-white btn-icon"
                  >
                    {<IntlMessages id="sidebar.revenues.dialog.btn.send" />}{" "}
                    <i className="zmdi zmdi-mail-send"></i>
                  </MatButton>
                  <MatButton
                    style={{
                      visibility: permission !== 0 ? "visible" : "hidden"
                    }}
                    onClick={() => this.onApprove()}
                    variant="contained"
                    className="btn-success mr-10 mb-10 text-white btn-icon"
                  >
                    {<IntlMessages id="sidebar.revenues.dialog.btn.approve" />}{" "}
                    <i className="zmdi zmdi-mail-send"></i>
                  </MatButton>
                  <MatButton
                    style={{
                      visibility: permission !== 0 ? "visible" : "hidden"
                    }}
                    onClick={() => this.onDisapprove()}
                    variant="contained"
                    className="btn-danger mr-10 mb-10 text-white btn-icon"
                  >
                    {
                      <IntlMessages id="sidebar.revenues.dialog.btn.disapprove" />
                    }{" "}
                    <i className="zmdi zmdi-mail-send"></i>
                  </MatButton>
                </div>
              ) : (
                ""
              )}
            </div>

            <div style={{ float: "left" }}>
              <div style={{ paddingLeft: 25 }}>
                <FormHelperText style={{ paddingBottom: 5 }}>
                  {<IntlMessages id="sidebar.revenues.filter.branch" />}
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
                {<IntlMessages id="sidebar.revenues.button.exportexcel" />}
              </CSVLink>
              <a
                href="#"
                onClick={e => this.opnAddNewDataModal(e)}
                color="primary"
                className="caret btn-sm mr-10"
              >
                {<IntlMessages id="sidebar.revenues.button.addrevenielist" />}
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
            {<IntlMessages id="sidebar.revenues.table.no" />}
          </th>
          <th style={{ width: "50%" }}>
            {<IntlMessages id="sidebar.revenues.table.discription" />}
          </th>
          <th style={{ width: "10%" }}>
            {<IntlMessages id="sidebar.revenues.table.billdate" />}
          </th>
          <th style={{ width: "15%" }}>
            {<IntlMessages id="sidebar.revenues.table.lastactionby" />}
          </th>
          <th style={{ width: "10%" }}>
            {<IntlMessages id="sidebar.revenues.table.status" />}
          </th>
          <th style={{ width: "10%" }}>
            {<IntlMessages id="sidebar.revenues.table.action" />}
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
                  {!isMobile ? <td>{item.No}</td> : ""}
                  <td>
                    <h5 className="mb-5 fw-bold">
                      <a href="#" onClick={() => this.onPreviewData(item)}>
                        {item.Description}
                      </a>
                    </h5>
                  </td>
                  <td>{moment(item.BillDate).format("DD/MM/YYYY")}</td>
                  <td>{item.CreateBy}</td>
                  <td className="d-flex justify-content-start">
                    <span
                      className={`badge badge-xs ${
                        item.Approve
                          ? "badge-success"
                          : item.Send
                          ? "badge-secondary"
                          : "badge-danger"
                      } mr-10 mt-10 position-relative`}
                    >
                      &nbsp;
                    </span>
                    <div className="status">
                      <span className="d-block">
                        {item.Approve
                          ? "Approved"
                          : item.Send
                          ? "Submitted"
                          : "Pending"}
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
        object["Description"].toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
        object["CreateBy"].toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
        moment(object["BillDate"])
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
      data: this.arrangeNumber2(searchOriL),
      pagesCount: Math.ceil(searchOriL.length / this.state.pageSize),
      currentPage: 0
    });
  }

  async searchData(event) {
    const { originalData } = this.state;
    await this.setState({ q: event.target.value });
    await this.setDataAfterFilter(originalData, this.state.q);
  }

  handleClose = () => {
    this.setState({ showAttach: false });
  };

  render() {
    const { loading, currentPage, selectedDatas, data } = this.state;

    return (
      <div className="data-management">
        <Helmet>
          <title>NWTHEC | Revenues Management</title>
          <meta name="description" content="Reactify Widgets" />
        </Helmet>
        <PageTitleBar
          title={<IntlMessages id="sidebar.revenuesManagement" />}
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
          title={<IntlMessages id="sidebar.revenues.dialog.delete.title" />}
          message={<IntlMessages id="sidebar.revenues.dialog.delete.message" />}
          onConfirm={() => this.deleteDataPermanently()}
        />

        <DeleteConfirmationDialog
          ref="deleteMutipleConfirmationDialog"
          title={<IntlMessages id="sidebar.revenues.dialog.delete.title" />}
          message={<IntlMessages id="sidebar.revenues.dialog.delete.message" />}
          onConfirm={() => this.onConfirmDeleteMultiple()}
        />

        <DeleteConfirmationDialog
          ref="sendMutipleConfirmationDialog"
          title={<IntlMessages id="sidebar.revenues.dialog.send.title" />}
          message={<IntlMessages id="sidebar.revenues.dialog.send.message" />}
          onConfirm={() => this.onConfirmSendMultiple()}
        />

        <DeleteConfirmationDialog
          ref="approveMutipleConfirmationDialog"
          title={<IntlMessages id="sidebar.revenues.dialog.approve.title" />}
          message={
            <IntlMessages id="sidebar.revenues.dialog.approve.message" />
          }
          onConfirm={() => this.onConfirmApproveMultiple()}
        />

        <DeleteConfirmationDialog
          ref="disapproveMutipleConfirmationDialog"
          title={<IntlMessages id="sidebar.revenues.dialog.disapprove.title" />}
          message={
            <IntlMessages id="sidebar.revenues.dialog.disapprove.message" />
          }
          onConfirm={() => this.onConfirmDisapproveMultiple()}
        />

        {this.sessionDialog()}

        {this.state.showAttach ? (
          <Dialog
            fullWidth={true}
            maxWidth={"xl"}
            open={this.state.showAttach}
            TransitionComponent={this.Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogContent>
              <div className="row justify-content-between">
                <DialogTitle id="form-dialog-title">
                  {this.state.actionType === "Add"
                    ? this.state.placeholderTitleAdd
                    : this.state.actionType === "Preview"
                    ? this.state.placeholderTitlePreview +
                      " : " +
                      this.state.editData.Description
                    : this.state.placeholderTitleUpdate +
                      " : " +
                      this.state.editData.Description}
                </DialogTitle>
                <IconButton
                  style={{ justifyContent: "flex-end" }}
                  color="inherit"
                  onClick={this.handleClose}
                  aria-label="Close"
                >
                  <CloseIcon />
                </IconButton>
              </div>
              <DialogContentText
                id="alert-dialog-slide-description"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <RevenueCardForm
                  permission={this.state.permission}
                  reloadData={this.loadData.bind(this)}
                  closeModal={this.handleClose.bind(this)}
                  dataInit={this.state.editData}
                  switchMode={this.state.actionType}
                ></RevenueCardForm>
              </DialogContentText>
            </DialogContent>
          </Dialog>
        ) : (
          ""
        )}
      </div>
    );
  }
}

// // map state to props
const mapStateToProps = state => {
  const { revenueReducer, masterReducer, authUser, settings } = state;
  return { revenueReducer, masterReducer, authUser, settings };
};

export default connect(mapStateToProps, {
  deleteDataRevenue,
  fetchingDataRevenue,
  activeSession,
  clearUser,
  sendDataRevenue,
  approveRevenue,
  disapproveRevenue
})(RevenueListForm);
