/**
 * Data Management Page
 */
import React, { Component, useState } from "react";
import { Helmet } from "react-helmet";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
// import MenuItem from "@material-ui/core/MenuItem";
// import Select from '@material-ui/core/Select';
import {
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
  Label
} from "reactstrap";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { NotificationManager } from "react-notifications";
import Avatar from "@material-ui/core/Avatar";

// api
import api from "Api";

// delete confirmation dialog
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";

// add new Data form
import VendorFormAdd from "./vendor-form-add";

// update Data form
import VendorFormUpdate from "./vendor-form-update";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

// rct card box
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";

// rct section loader
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import MaterialUIPickers from "./date-picker";

export default class VendorForm extends Component {
  dataInit = [
    {
      id: 1,
      description: "conpany a",
      invoiceNo: "INV-0000112",
      createDate: "06 Jan 2020",
      total: "2000.00",
      checked: false
    },
    {
      id: 2,
      description: "conpany a",
      invoiceNo: "INV-0000112",
      createDate: "06 Jan 2020",
      total: "5000.00",
      checked: false
    },
    {
      id: 3,
      description: "conpany a",
      invoiceNo: "INV-0000112",
      createDate: "06 Jan 2020",
      total: "12000.00",
      checked: false
    },
    {
      id: 4,
      description: "conpany a",
      invoiceNo: "INV-0000112",
      createDate: "06 Jan 2020",
      total: "12000.00",
      checked: false
    },
    {
      id: 5,
      description: "conpany a",
      invoiceNo: "INV-0000112",
      createDate: "06 Jan 2020",
      total: "12000.00",
      checked: false
    },
    {
      id: 6,
      description: "conpany a",
      invoiceNo: "INV-0000112",
      createDate: "06 Jan 2020",
      total: "12000.00",
      checked: false
    }
  ];

  pageSize = 10;
  pageGrop = [10, 25, 50, 100];

  dataBranch = ["Petrol 001", "Petrol 002"];
  state = {
    all: false,
    data: null,
    selectedData: null,
    loading: false,
    addNewDataModal: false,
    addNewDataDetail: {
      id: "",
      description: "",
      invoiceNo: "",
      createDate: "",
      total: "",
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
    pagesCount: Math.ceil(this.dataInit.length / this.pageSize)
  };

  handleClick(e, index) {
    e.preventDefault();
    this.setState({
      currentPage: index
    });
  }

  componentDidMount() {
    this.setState({ data: this.dataInit });
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
    setTimeout(() => {
      self.setState({ loading: false, data, selectedData: null });
      NotificationManager.success("Data Deleted!");
    }, 500);
  }

  /**
   * Open Add New Data Modal
   */
  opnAddNewDataModal(e) {
    e.preventDefault();
    this.setState({ addNewDataModal: true });
  }

  /**
   * On Reload
   */
  onReload(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let self = this;
    setTimeout(() => {
      self.setState({ loading: false });
    }, 500);
  }

  /**
   * On Select Data
   */
  onSelectData(data) {
    data.checked = !data.checked;
    let selectedDatas = 0;
    let datas = this.state.data.map(dataData => {
      if (dataData.checked) {
        selectedDatas++;
      }
      if (dataData.id === data.id) {
        if (dataData.checked) {
          selectedDatas++;
        }
        return data;
      } else {
        return dataData;
      }
    });
    this.setState({ datas, selectedDatas });
  }

  /**
   * On Change Add New Data Details
   */
  onChangeAddNewDataDetails(key, value) {
    this.setState({
      addNewDataDetail: {
        ...this.state.addNewDataDetail,
        [key]: value
      }
    });
  }

  /**
   * Add New Data
   */
  addNewData() {
    NotificationManager.success("Data Created!");
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
  onUpdateDataDetails(key, value) {
    this.setState({
      editData: {
        ...this.state.editData,
        [key]: value
      }
    });
  }

  /**
   * Update Data
   */
  updateData() {
    NotificationManager.success("Data Updated!");
  }

  //Select All Data
  onSelectAllData(e) {
    const { selectedDatas, data } = this.state;
    let selectAll = selectedDatas < data.length;
    if (selectAll) {
      let selectAllDatas = data.map(item => {
        item.checked = true;
        return item;
      });
      this.setState({
        data: selectAllDatas,
        selectedDatas: selectAllDatas.length
      });
    } else {
      let unselectedDatas = data.map(item => {
        item.checked = false;
        return item;
      });
      this.setState({ selectedDatas: 0, data: unselectedDatas });
    }
  }

  shopMoreTap(status) {
    this.setState({ moreTap: status });
  }

  selectPageSize(e) {
    this.setState({
      pageSize: e.target.value,
      pagesCount: Math.ceil(this.dataInit.length / e.target.value),
      currentPage: 0
    });
    // console.log(e.target.value);
    // this.state.pageSize = e;
  }

  render() {
    const {
      data,
      loading,
      selectedData,
      editData,
      allSelected,
      selectedDatas,
      currentPage
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
            {this.state.moreTap ? (
              <div className="d-flex justify-content-between py-20 px-10 border-bottom">
                <div></div>
                <div style={{ float: "left" }}></div>
                <div style={{ float: "left" }}>
                  <div>
                    <div className="row">
                      <div style={{ paddingRight: 15, paddingTop: 35 }}>
                        <Label style={{ fontWeight: "bold" }}>Date : </Label>
                      </div>
                      <div style={{ float: "left" }}>
                        <MaterialUIPickers></MaterialUIPickers>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ float: "left" }}>
                  <div>
                    <div className="row">
                      <div style={{ paddingRight: 15, paddingTop: 35 }}>
                        <Label style={{ fontWeight: "bold" }}>Branch : </Label>
                      </div>
                      <div style={{ float: "left", paddingTop: 15 }}>
                        <Input
                          style={{
                            height: 56,
                            width: 279,
                            borderColor: "#CBCBCB"
                          }}
                          type="select"
                          name="select"
                          id="Select"
                        >
                          {this.dataBranch.map((value, key) => (
                            <option key={key} value={value}>
                              {value}
                            </option>
                          ))}
                        </Input>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ float: "left" }}></div>
                <div style={{ float: "left" }}></div>
              </div>
            ) : (
              ""
            )}
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
                  {this.state.moreTap ? (
                    <a
                      href="#"
                      onClick={() => this.shopMoreTap(false)}
                      className="btn-outline-default mr-10"
                    >
                      Hide Filter
                    </a>
                  ) : (
                    <a
                      href="#"
                      onClick={() => this.shopMoreTap(true)}
                      className="btn-outline-default mr-10"
                    >
                      Show Filter
                    </a>
                  )}
                </div>
              </div>
              <div style={{ float: "left" }}>
                <a
                  href="#"
                  onClick={e => e.preventDefault()}
                  className="btn-sm btn-outline-default mr-10"
                >
                  Export to Excel
                </a>
                <a
                  href="#"
                  onClick={e => this.opnAddNewDataModal(e)}
                  color="primary"
                  className="caret btn-sm mr-10"
                >
                  Add Vendor <i className="zmdi zmdi-plus"></i>
                </a>
              </div>
            </div>
            <table className="table table-middle table-hover mb-0">
              <thead>
                <tr>
                  {/* <th style={{ width: "6%" }}></th> */}
                  {/* <th style={{ width: "5%" }} className="w-5">
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
                      // label="All"
                    />
                  </th> */}
                  <th style={{ width: "2%" }}></th>
                  <th style={{ width: "3%" }}>No.</th>
                  <th style={{ width: "50%" }}>Description</th>
                  <th style={{ width: "15%" }}>Invoice No.</th>
                  <th style={{ width: "10%" }}>Create Date</th>
                  <th style={{ width: "10%" }}>Total</th>
                  <th style={{ width: "10%" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data
                    .slice(
                      currentPage * this.state.pageSize,
                      (currentPage + 1) * this.state.pageSize
                    )
                    .map((item, key) => (
                      <tr key={key}>
                        <td></td>
                        {/* <td>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={item.checked}
                                onChange={() => this.onSelectData(item)}
                                color="primary"
                              />
                            }
                          />
                        </td> */}
                        <td>{item.id}</td>
                        <td>
                          <h5 className="mb-5 fw-bold">{item.description}</h5>
                        </td>
                        <td>{item.invoiceNo}</td>
                        <td>{item.createDate}</td>
                        <td>{item.total}</td>
                        <td className="list-action">
                          <button
                            type="button"
                            className="rct-link-btn"
                            onClick={() => this.viewDataDetail(item)}
                          >
                            <i className="ti-eye"></i>
                          </button>
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
          title="Are You Sure Want To Delete?"
          message="This will delete data permanently."
          onConfirm={() => this.deleteDataPermanently()}
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
              <VendorFormAdd
                addNewDataDetails={this.state.addNewDataDetail}
                onChangeAddNewDataDetails={this.onChangeAddNewDataDetails.bind(
                  this
                )}
              />
            ) : (
              <VendorFormUpdate
                data={editData}
                onUpdateDataDetail={this.onUpdateDataDetails.bind(this)}
              />
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
        <Dialog
          onClose={() => this.setState({ openViewDataDialog: false })}
          open={this.state.openViewDataDialog}
        >
          <DialogContent>
            {selectedData !== null && (
              <div>
                <div className="clearfix d-flex">
                  <div className="media pull-left">
                    <div className="media-body">
                      <p>
                        Description :{" "}
                        <span className="fw-bold">
                          {selectedData.description}
                        </span>
                      </p>
                      <p>
                        Invoice No. :{" "}
                        <span className="fw-bold">
                          {selectedData.invoiceNo}
                        </span>
                      </p>
                      <p>
                        Create Date :{" "}
                        <span className="badge badge-warning">
                          {selectedData.createDate}
                        </span>
                      </p>
                      <p>
                        Total :{" "}
                        <span className="badge badge-warning">
                          {selectedData.total}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
