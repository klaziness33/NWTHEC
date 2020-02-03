// Revenue Page

import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { Form, FormGroup, Label, Input } from "reactstrap";
import MatButton from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

// rct card box
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";

import Grid from "@material-ui/core/Grid";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import FormHelperText from "@material-ui/core/FormHelperText";
import { connect } from "react-redux";
import {
  addDataRevenue,
  sendRevenue,
  activeSession,
  updateDataRevenue,
  approveRevenue,
  disapproveRevenue
} from "../../../actions";
import {
  parseDateInt,
  parseDateString,
  getBase64,
  decryptData
} from "../../../helpers/helpers";
import { STORAGE_USERMODELS } from "../../../store/storages";

class RevenueCardForm extends Component {
  state = {
    addNewDataDetail: {
      BillDate: parseDateString(Date.now()),
      FK_Branch: 0,

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
    readOnly: false,
    showAttach: false,
    imageUrl: "",
    paymentType: [],
    branch: [],
    fk_Role: 0,
    permission: 0,
    FK_Branch: 0
  };

  onAttachFile(valueP, fromP) {
    let nameL = valueP.target.files[0].name;
    let fromL = fromP;
    getBase64(valueP.target.files[0], async resultL => {
      let fileObj = {
        name: nameL,
        base64: resultL
      };
      switch (fromL) {
        case "Petrol":
          this.setState(prevState => ({
            addNewDataDetail: {
              ...prevState.addNewDataDetail,
              petrol_attach: fileObj
            }
          }));
          break;

        case "Engine Oil":
          this.setState(prevState => ({
            addNewDataDetail: {
              ...prevState.addNewDataDetail,
              engineoil_attach: fileObj
            }
          }));
          break;

        case "Car Care":
          this.setState(prevState => ({
            addNewDataDetail: {
              ...prevState.addNewDataDetail,
              carcare_attach: fileObj
            }
          }));
          break;

        case "Convenience Store":
          this.setState(prevState => ({
            addNewDataDetail: {
              ...prevState.addNewDataDetail,
              conveniencestore_attach: fileObj
            }
          }));
          break;

        case "Cafe":
          this.setState(prevState => ({
            addNewDataDetail: {
              ...prevState.addNewDataDetail,
              cafe_attach: fileObj
            }
          }));
          break;
      }
    });
  }

  async onDisapprove() {
    let arrayIndex = [this.state.addNewDataDetail.Id];
    if (this.state.addNewDataDetail.Approve) {
      this.setState({
        alertDialog: true,
        alertTitle: "Alert",
        alertContent:
          "Cannot to action due to this information already approved"
      });
    } else {
      await this.props.disapproveRevenue(arrayIndex);
      setTimeout(() => {
        this.props.reloadData();
        this.props.closeModal();
      }, 500);
    }
  }

  async onApprove() {
    let arrayIndex = [this.state.addNewDataDetail.Id];
    if (this.state.addNewDataDetail.Approve) {
      this.setState({
        alertDialog: true,
        alertTitle: "Alert",
        alertContent:
          "Cannot to action due to this information already approved"
      });
    } else {
      await this.props.approveRevenue(arrayIndex);
      setTimeout(() => {
        this.props.reloadData();
        this.props.closeModal();
      }, 500);
    }
  }

  async onClear() {
    await this.setState({
      addNewDataDetail: {
        BillDate: parseDateString(Date.now()),
        FK_Branch: 0,

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

  async onChangeDataInForm(valueP, valueTypeP) {
    if (valueTypeP === "FK_Branch") {
      await this.setState({ FK_Branch: valueP.target.value });
      return;
    }

    await this.setState({
      addNewDataDetail: {
        ...this.state.addNewDataDetail,
        [valueTypeP]:
          valueTypeP === "BillDate"
            ? parseDateString(new Date(valueP).getTime())
            : valueP.target.value
      }
    });
  }

  async setProductByType() {}

  async showAttactImage(actionFromP) {
    if ((actionFromP === "") | (actionFromP === undefined)) return;

    await this.setState({
      showAttach: true,
      imageUrl: actionFromP
    });
  }

  handleClose = () => {
    this.setState({ showAttach: false });
  };

  onAdd = async () => {
    await this.setState({
      addNewDataDetail: {
        ...this.state.addNewDataDetail,
        ["FK_Branch"]:
          this.state.FK_Branch === 0
            ? this.state.branch[0].Id
            : this.state.FK_Branch
      }
    });
    this.props.addDataRevenue(this.state.addNewDataDetail);
    setTimeout(() => {
      this.props.reloadData();
      this.props.closeModal();
    }, 500);
  };

  onSend = async () => {
    await this.setState({
      addNewDataDetail: {
        ...this.state.addNewDataDetail,
        ["FK_Branch"]: this.props.authUser.user.fk_Branch
      }
    });
    this.props.sendRevenue(this.state.addNewDataDetail);
    setTimeout(() => {
      this.props.reloadData();
      this.props.closeModal();
    }, 500);
  };

  Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  onCloseAlertDialog() {
    this.setState({ alertDialog: false });
  }

  alertDialog() {
    const { alertDialog, alertTitle, alertContent } = this.state;
    return (
      <div>
        <Dialog
          open={alertDialog}
          TransitionComponent={this.Transition}
          keepMounted
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{alertTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {alertContent}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.onCloseAlertDialog()}
              variant="contained"
              className="btn-primary text-white mr-10"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  componentDidMount() {
    this.setState({ permission: this.props.permission });
    this.setState({ branch: this.props.masterReducer.data });
    this.setState({
      paymentType: this.props.masterReducer.paymentType
    });

    if (this.props.switchMode === "Preview") {
      this.setState({ addNewDataDetail: this.props.dataInit });
      this.setState({
        readOnly: true,
        showAttach: false
      });
    } else if (this.props.switchMode === "Update") {
      this.setState({ addNewDataDetail: this.props.dataInit });
      this.setState({
        readOnly: false,
        showAttach: false
      });
    } else if (this.props.switchMode === "Add") {
      this.onClear();
      this.setState({
        readOnly: false,
        showAttach: false
      });
    }
  }

  onUpdateData() {
    this.props.updateDataRevenue(this.state.addNewDataDetail);
    setTimeout(() => {
      this.props.reloadData();
      this.props.closeModal();
    }, 500);
  }

  dialogInfo(actionP) {
    var closeModalL = this.props.closeModal;
    if (actionP === "Add") {
      return (
        <RctCollapsibleCard>
          <div
            style={{ display: "flex", justifyContent: "flex-end" }}
            className="table-responsive"
          >
            <MatButton
              onClick={() => this.onAdd()}
              variant="contained"
              className="btn-primary mr-10 mb-10 text-white"
            >
              <i
                style={{ paddingRight: 7 }}
                className="zmdi zmdi-plus zmdi-hc-lg"
              ></i>
              Add
            </MatButton>

            <MatButton
              onClick={() => this.onClear()}
              variant="contained"
              className="btn-secondary mr-10 mb-10 text-white"
            >
              Clear
            </MatButton>

            <MatButton
              onClick={closeModalL}
              variant="contained"
              className="btn-danger mr-10 mb-10 text-white"
            >
              Close
            </MatButton>
          </div>
        </RctCollapsibleCard>
      );
    } else if (actionP === "Preview") {
      return (
        <RctCollapsibleCard>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end"
            }}
            className="table-responsive"
          >
            <MatButton
              style={{
                display: this.state.permission === 0 ? "inline" : "none"
              }}
              onClick={() => this.onSend()}
              variant="contained"
              className="btn-secondary mr-10 mb-10 text-white"
            >
              <i
                style={{ paddingRight: 7 }}
                className="zmdi zmdi-mail-send zmdi-hc-lg"
              ></i>
              Send
            </MatButton>
            <MatButton
              style={{
                display:
                  this.state.permission === 0 ||
                  this.state.addNewDataDetail.Approve === true
                    ? "none"
                    : "inline"
              }}
              onClick={() => this.onApprove()}
              variant="contained"
              className="btn-success mr-10 mb-10 text-white"
            >
              <i
                style={{ paddingRight: 7 }}
                className="zmdi zmdi-check zmdi-hc-lg"
              ></i>
              Approve
            </MatButton>
            <MatButton
              style={{
                display:
                  this.state.permission === 0 ||
                  this.state.addNewDataDetail.Approve === true
                    ? "none"
                    : "inline"
              }}
              onClick={() => this.onDisapprove()}
              variant="contained"
              className="btn-secondary mr-10 mb-10 text-white"
            >
              <i
                style={{ paddingRight: 7 }}
                className="zmdi zmdi-close zmdi-hc-lg"
              ></i>
              Disapprove
            </MatButton>

            <MatButton
              onClick={closeModalL}
              variant="contained"
              className="btn-danger mr-10 mb-10 text-white"
            >
              Close
            </MatButton>
          </div>
        </RctCollapsibleCard>
      );
    } else if (actionP === "Update") {
      return (
        <RctCollapsibleCard>
          <div
            style={{ display: "flex", justifyContent: "flex-end" }}
            className="table-responsive"
          >
            <MatButton
              onClick={() => this.onUpdateData()}
              variant="contained"
              className="btn-success mr-10 mb-10 text-white"
            >
              <i
                style={{ paddingRight: 7 }}
                className="zmdi zmdi-check zmdi-hc-lg"
              ></i>
              Update
            </MatButton>
            <MatButton
              onClick={closeModalL}
              variant="contained"
              className="btn-danger mr-10 mb-10 text-white"
            >
              Close
            </MatButton>
          </div>
        </RctCollapsibleCard>
      );
    }
  }

  render() {
    const { readOnly, branch, paymentType, addNewDataDetail } = this.state;
    return (
      <div>
        {/* <PageTitleBar
          title={<IntlMessages id="sidebar.revenuesCard" />}
          match={this.props.match}
        /> */}
        <div className="row">
          <div className="col-sm-12 col-md-12 col-xl-12">
            <RctCollapsibleCard>
              <div
                style={{ display: "flex", justifyContent: "flex-end" }}
                className="row"
              >
                <div style={{ paddingRight: 10 }}>
                  <FormHelperText>Select Date</FormHelperText>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container>
                      <KeyboardDatePicker
                        disabled={readOnly}
                        style={{
                          height: 56,
                          width: 251
                        }}
                        inputVariant="outlined"
                        margin="normal"
                        id="date-picker-dialog"
                        format="dd/MM/yyyy"
                        value={parseDateInt(addNewDataDetail.BillDate)} //
                        onChange={e => this.onChangeDataInForm(e, "BillDate")}
                        KeyboardButtonProps={{
                          "aria-label": "change date"
                        }}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                </div>
                <div style={{ float: "left", paddingRight: 25 }}>
                  <Form>
                    <FormGroup>
                      <FormHelperText style={{ paddingBottom: 16 }}>
                        Select Branch
                      </FormHelperText>
                      <Input
                        onChange={e => this.onChangeDataInForm(e, "FK_Branch")}
                        disabled={readOnly}
                        style={{
                          height: 53.63,
                          width: 251,
                          borderColor: "#CBCBCB"
                        }}
                        type="select"
                        name="hidden99"
                        id="hidden99"
                      >
                        {branch &&
                          branch.map((value, key) => (
                            <option key={key} value={value.Id}>
                              {value.Name}
                            </option>
                          ))}
                      </Input>
                    </FormGroup>
                  </Form>
                </div>
              </div>
            </RctCollapsibleCard>
            <RctCollapsibleCard heading="Product Type : Petrol">
              <div
                style={{ display: "flex", justifyContent: "center" }}
                className="table-responsive"
              >
                <table>
                  <thead style={{ backgroundColor: "#FFF" }}>
                    <tr>
                      <th></th>
                      <th style={{ paddingLeft: 30 }}>Total</th>
                      <th style={{ paddingLeft: 30 }}>Quantity</th>
                      <th style={{ paddingLeft: 30 }}>Price</th>
                      <th style={{ paddingLeft: 30 }}>Payment Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ paddingBottom: 30 }}>
                        {" "}
                        <Form inline>
                          <FormGroup>
                            <Label
                              style={{
                                fontWeight: "bold"
                              }}
                              for="B20 DIESAL"
                            >
                              B20 DIESAL :{" "}
                            </Label>
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.petrol_b20diesal_total}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_b20diesal_total"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="total1"
                              id="Total1"
                              placeholder="Total"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.petrol_b20diesal_quantity}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_b20diesal_quantity"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="quantity1"
                              id="Quantity1"
                              placeholder="Quantity"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.petrol_b20diesal_price}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_b20diesal_price"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="price1"
                              id="Price1"
                              placeholder="Price"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        <Form>
                          <FormGroup>
                            <Input
                              value={
                                addNewDataDetail.petrol_b20diesal_paymentType
                              }
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_b20diesal_paymentType"
                                )
                              }
                              disabled={readOnly}
                              type="select"
                              name="paymentType1"
                              id="paymentType1"
                            >
                              {paymentType &&
                                paymentType.map((value, key) => (
                                  <option key={key} value={value.Id}>
                                    {value.Name}
                                  </option>
                                ))}
                            </Input>
                          </FormGroup>
                        </Form>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ paddingBottom: 30 }}>
                        {" "}
                        <Form inline>
                          <FormGroup>
                            <Label
                              style={{
                                fontWeight: "bold"
                              }}
                              for="E20 GSH"
                            >
                              E20 GSH :{" "}
                            </Label>
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.petrol_e20gsh_total}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_e20gsh_total"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="total2"
                              id="Total2"
                              placeholder="Total"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.petrol_e20gsh_quantity}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_e20gsh_quantity"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="quantity2"
                              id="Quantity2"
                              placeholder="Quantity"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.petrol_e20gsh_price}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_e20gsh_price"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="price2"
                              id="Price2"
                              placeholder="Price"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.petrol_e20gsh_paymentType}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_e20gsh_paymentType"
                                )
                              }
                              disabled={readOnly}
                              type="select"
                              name="paymentType2"
                              id="paymentType2"
                            >
                              {paymentType &&
                                paymentType.map((value, key) => (
                                  <option key={key} value={value.Id}>
                                    {value.Name}
                                  </option>
                                ))}
                            </Input>
                          </FormGroup>
                        </Form>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ paddingBottom: 30 }}>
                        {" "}
                        <Form inline>
                          <FormGroup>
                            <Label
                              style={{
                                fontWeight: "bold"
                              }}
                              for="FS DIESAL"
                            >
                              FS DIESAL :{" "}
                            </Label>
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.petrol_fsdiesal_total}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_fsdiesal_total"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="total3"
                              id="Total3"
                              placeholder="Total"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.petrol_fsdiesal_quantity}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_fsdiesal_quantity"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="quantity3"
                              id="Quantity3"
                              placeholder="Quantity"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.petrol_fsdiesal_price}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_fsdiesal_price"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="price3"
                              id="Price3"
                              placeholder="Price"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        <Form>
                          <FormGroup>
                            <Input
                              value={
                                addNewDataDetail.petrol_fsdiesal_paymentType
                              }
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_fsdiesal_paymentType"
                                )
                              }
                              disabled={readOnly}
                              type="select"
                              name="paymentType3"
                              id="paymentType3"
                            >
                              {paymentType &&
                                paymentType.map((value, key) => (
                                  <option key={key} value={value.Id}>
                                    {value.Name}
                                  </option>
                                ))}
                            </Input>
                          </FormGroup>
                        </Form>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ paddingBottom: 30 }}>
                        {" "}
                        <Form inline>
                          <FormGroup>
                            <Label
                              style={{
                                fontWeight: "bold"
                              }}
                              for="FS GSH91"
                            >
                              FS GSH91 :{" "}
                            </Label>
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.petrol_fsgsh91_total}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_fsgsh91_total"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="total4"
                              id="Total4"
                              placeholder="Total"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.petrol_fsgsh91_quantity}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_fsgsh91_quantity"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="quantity4"
                              id="Quantity4"
                              placeholder="Quantity"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.petrol_fsgsh91_price}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_fsgsh91_price"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="price4"
                              id="Price4"
                              placeholder="Price"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        <Form>
                          <FormGroup>
                            <Input
                              value={
                                addNewDataDetail.petrol_fsgsh91_paymentType
                              }
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_fsgsh91_paymentType"
                                )
                              }
                              disabled={readOnly}
                              type="select"
                              name="paymentType4"
                              id="paymentType4"
                            >
                              {paymentType &&
                                paymentType.map((value, key) => (
                                  <option key={key} value={value.Id}>
                                    {value.Name}
                                  </option>
                                ))}
                            </Input>
                          </FormGroup>
                        </Form>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ paddingBottom: 30 }}>
                        {" "}
                        <Form inline>
                          <FormGroup>
                            <Label
                              style={{
                                fontWeight: "bold"
                              }}
                              for="VP DIESAL"
                            >
                              VP DIESAL :{" "}
                            </Label>
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.petrol_vpdiesal_total}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_vpdiesal_total"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="total5"
                              id="Total5"
                              placeholder="Total"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.petrol_vpdiesal_quantity}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_vpdiesal_quantity"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="quantity5"
                              id="Quantity5"
                              placeholder="Quantity"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.petrol_vpdiesal_price}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_vpdiesal_price"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="price5"
                              id="Price5"
                              placeholder="Price"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        <Form>
                          <FormGroup>
                            <Input
                              value={
                                addNewDataDetail.petrol_vpdiesal_paymentType
                              }
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_vpdiesal_paymentType"
                                )
                              }
                              disabled={readOnly}
                              type="select"
                              name="paymentType5"
                              id="paymentType5"
                            >
                              {paymentType &&
                                paymentType.map((value, key) => (
                                  <option key={key} value={value.Id}>
                                    {value.Name}
                                  </option>
                                ))}
                            </Input>
                          </FormGroup>
                        </Form>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ paddingBottom: 30 }}>
                        {" "}
                        <Form inline>
                          <FormGroup>
                            <Label
                              style={{
                                fontWeight: "bold"
                              }}
                              for="VP GSH95"
                            >
                              VP GSH95 :{" "}
                            </Label>
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.petrol_vpgsh95_total}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_vpgsh95_total"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="total6"
                              id="Total6"
                              placeholder="Total"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.petrol_vpgsh95_quantity}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_vpgsh95_quantity"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="quantity6"
                              id="Quantity6"
                              placeholder="Quantity"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.petrol_vpgsh95_price}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_vpgsh95_price"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="price6"
                              id="Price6"
                              placeholder="Price"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        <Form>
                          <FormGroup>
                            <Input
                              value={
                                addNewDataDetail.petrol_vpgsh95_paymentType
                              }
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "petrol_vpgsh95_paymentType"
                                )
                              }
                              disabled={readOnly}
                              type="select"
                              name="paymentType6"
                              id="paymentType6"
                            >
                              {paymentType &&
                                paymentType.map((value, key) => (
                                  <option key={key} value={value.Id}>
                                    {value.Name}
                                  </option>
                                ))}
                            </Input>
                          </FormGroup>
                        </Form>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <input
                  onChange={e => this.onAttachFile(e, "Petrol")}
                  accept="image/png, image/jpeg"
                  style={{ display: "none" }}
                  id="contained-button-file-petrol"
                  type="file"
                />
                {readOnly ? (
                  <label
                    style={{
                      visibility:
                        addNewDataDetail.petrol_attach === ""
                          ? "hidden"
                          : "visible"
                    }}
                  >
                    <Button
                      onClick={() =>
                        this.showAttactImage(addNewDataDetail.petrol_attach)
                      }
                      variant="contained"
                      color="primary"
                      component="span"
                    >
                      <i
                        style={{ paddingRight: 7 }}
                        className="zmdi zmdi-attachment-alt zmdi-hc-lg"
                      ></i>
                      Show Attach
                    </Button>
                  </label>
                ) : (
                  <label htmlFor="contained-button-file-petrol">
                    {addNewDataDetail.petrol_attach ? (
                      <p>
                        <span className="material-icons mr-10">attachment</span>
                        <a
                          href="#"
                          onClick={() =>
                            this.showAttactImage(
                              addNewDataDetail.petrol_attach.base64
                            )
                          }
                        >
                          {addNewDataDetail.petrol_attach &&
                            addNewDataDetail.petrol_attach.name}
                        </a>
                      </p>
                    ) : (
                      ""
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                    >
                      <i
                        style={{ paddingRight: 7 }}
                        className="zmdi zmdi-attachment zmdi-hc-lg"
                      ></i>
                      Attach Document
                    </Button>
                  </label>
                )}
              </div>
            </RctCollapsibleCard>
            <RctCollapsibleCard heading="Product Type : Engine Oil">
              <div
                style={{ display: "flex", justifyContent: "center" }}
                className="table-responsive"
              >
                <table>
                  <thead style={{ backgroundColor: "#FFF" }}>
                    <tr>
                      <th></th>
                      <th style={{ paddingLeft: 30 }}>Total</th>
                      <th style={{ paddingLeft: 30 }}>Price</th>
                      <th style={{ paddingLeft: 30, visibility: "hidden" }}>
                        Quantity
                      </th>
                      <th style={{ paddingLeft: 30, visibility: "hidden" }}>
                        Payment Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ paddingBottom: 30 }}>
                        {" "}
                        <Form inline>
                          <FormGroup>
                            <Label
                              style={{
                                fontWeight: "bold"
                              }}
                              for="B20 DIESAL"
                            >
                              B20 DIESAL :{" "}
                            </Label>
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.engineoil_b20diesal_total}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "engineoil_b20diesal_total"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="total7"
                              id="Total7"
                              placeholder="Total"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.engineoil_b20diesal_price}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "engineoil_b20diesal_price"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="price7"
                              id="price7"
                              placeholder="Price"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30, visibility: "hidden" }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              disabled={readOnly}
                              type="number"
                              name="hidden7"
                              id="hidden7"
                              placeholder="Hidden"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30, visibility: "hidden" }}>
                        <Form>
                          <FormGroup>
                            <Input
                              disabled={readOnly}
                              type="select"
                              name="paymentType7"
                              id="paymentType7"
                            >
                              {paymentType &&
                                paymentType.map((value, key) => (
                                  <option key={key} value={value.Id}>
                                    {value.Name}
                                  </option>
                                ))}
                            </Input>
                          </FormGroup>
                        </Form>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ paddingBottom: 30 }}>
                        {" "}
                        <Form inline>
                          <FormGroup>
                            <Label
                              style={{
                                fontWeight: "bold"
                              }}
                              for="E20 GSH"
                            >
                              E20 GSH :{" "}
                            </Label>
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.engineoil_e20gsh_total}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "engineoil_e20gsh_total"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="total8"
                              id="Total8"
                              placeholder="Total"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.engineoil_e20gsh_price}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "engineoil_e20gsh_price"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="price8"
                              id="price8"
                              placeholder="Price"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30, visibility: "hidden" }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              disabled={readOnly}
                              type="number"
                              name="hidden8"
                              id="hidden8"
                              placeholder="Hidden"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30, visibility: "hidden" }}>
                        <Form>
                          <FormGroup>
                            <Input
                              disabled={readOnly}
                              type="select"
                              name="paymentType8"
                              id="paymentType8"
                            >
                              {paymentType &&
                                paymentType.map((value, key) => (
                                  <option key={key} value={value.Id}>
                                    {value.Name}
                                  </option>
                                ))}
                            </Input>
                          </FormGroup>
                        </Form>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ paddingBottom: 30 }}>
                        {" "}
                        <Form inline>
                          <FormGroup>
                            <Label
                              style={{
                                fontWeight: "bold"
                              }}
                              for="FS DIESAL"
                            >
                              FS DIESAL :{" "}
                            </Label>
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.engineoil_fsdiesal_total}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "engineoil_fsdiesal_total"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="total9"
                              id="Total9"
                              placeholder="Total"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.engineoil_fsdiesal_price}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "engineoil_fsdiesal_price"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="price9"
                              id="price9"
                              placeholder="Price"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30, visibility: "hidden" }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              disabled={readOnly}
                              type="number"
                              name="hidden9"
                              id="hidden9"
                              placeholder="Hidden"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30, visibility: "hidden" }}>
                        <Form>
                          <FormGroup>
                            <Input
                              disabled={readOnly}
                              type="select"
                              name="paymentType9"
                              id="paymentType9"
                            >
                              {paymentType &&
                                paymentType.map((value, key) => (
                                  <option key={key} value={value.Id}>
                                    {value.Name}
                                  </option>
                                ))}
                            </Input>
                          </FormGroup>
                        </Form>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <input
                  onChange={e => this.onAttachFile(e, "Engine Oil")}
                  accept="image/png, image/jpeg"
                  style={{ display: "none" }}
                  id="contained-button-file-engineoil"
                  type="file"
                />
                {readOnly ? (
                  <label
                    style={{
                      visibility:
                        addNewDataDetail.engineoil_attach === ""
                          ? "hidden"
                          : "visible"
                    }}
                  >
                    <Button
                      onClick={() =>
                        this.showAttactImage(addNewDataDetail.engineoil_attach)
                      }
                      variant="contained"
                      color="primary"
                      component="span"
                    >
                      <i
                        style={{ paddingRight: 7 }}
                        className="zmdi zmdi-attachment-alt zmdi-hc-lg"
                      ></i>
                      Show Attach
                    </Button>
                  </label>
                ) : (
                  <label htmlFor="contained-button-file-engineoil">
                    {addNewDataDetail.engineoil_attach ? (
                      <p>
                        <span className="material-icons mr-10">attachment</span>
                        <a
                          href="#"
                          onClick={() =>
                            this.showAttactImage(
                              addNewDataDetail.engineoil_attach.base64
                            )
                          }
                        >
                          {addNewDataDetail.engineoil_attach &&
                            addNewDataDetail.engineoil_attach.name}
                        </a>
                      </p>
                    ) : (
                      ""
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                    >
                      <i
                        style={{ paddingRight: 7 }}
                        className="zmdi zmdi-attachment zmdi-hc-lg"
                      ></i>
                      Attach Document
                    </Button>
                  </label>
                )}
              </div>
            </RctCollapsibleCard>
            <RctCollapsibleCard heading="Product Type : Car Care">
              <div
                style={{ display: "flex", justifyContent: "center" }}
                className="table-responsive"
              >
                <table>
                  <thead style={{ backgroundColor: "#FFF" }}>
                    <tr>
                      <th style={{ fontWeight: "bold", fontSize: 15 }}>
                        Size S
                      </th>
                      <th></th>
                      <th></th>
                      <th
                        style={{
                          fontWeight: "bold",
                          fontSize: 15,
                          paddingLeft: 20
                        }}
                      >
                        Size M
                      </th>
                      <th></th>
                      <th></th>
                      <th
                        style={{
                          fontWeight: "bold",
                          fontSize: 15,
                          paddingLeft: 20
                        }}
                      >
                        Size L
                      </th>
                      <th></th>
                      <th></th>
                    </tr>
                    <tr>
                      <th></th>
                      <th style={{ paddingLeft: 20 }}>Total</th>
                      <th style={{ paddingLeft: 10 }}>Price</th>
                      <th></th>
                      <th style={{ paddingLeft: 20 }}>Total</th>
                      <th style={{ paddingLeft: 10 }}>Price</th>
                      <th></th>
                      <th style={{ paddingLeft: 20 }}>Total</th>
                      <th style={{ paddingLeft: 10 }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* wash car */}
                    <tr>
                      <td style={{ paddingBottom: 30 }}>
                        {" "}
                        <Form inline>
                          <FormGroup>
                            <Label
                              style={{
                                fontWeight: "bold"
                              }}
                              for="Wash Car"
                            >
                              Wash Car :{" "}
                            </Label>
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 20 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={
                                addNewDataDetail.carcare_size_s_washcar_total
                              }
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "carcare_size_s_washcar_total"
                                )
                              }
                              disabled={readOnly}
                              style={{
                                width: 80
                              }}
                              type="number"
                              name="total10"
                              id="Total10"
                              placeholder="Total"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 10 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={
                                addNewDataDetail.carcare_size_s_washcar_price
                              }
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "carcare_size_s_washcar_price"
                                )
                              }
                              disabled={readOnly}
                              style={{
                                width: 120
                              }}
                              type="number"
                              name="price10"
                              id="price10"
                              placeholder="Price"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingBottom: 30, paddingLeft: 20 }}>
                        {" "}
                        <Form inline>
                          <FormGroup>
                            <Label
                              style={{
                                fontWeight: "bold"
                              }}
                              for="Wash Car"
                            >
                              Wash Car :{" "}
                            </Label>
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 20 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={
                                addNewDataDetail.carcare_size_m_washcar_total
                              }
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "carcare_size_m_washcar_total"
                                )
                              }
                              disabled={readOnly}
                              style={{
                                width: 80
                              }}
                              type="number"
                              name="total12"
                              id="Total12"
                              placeholder="Total"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 10 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={
                                addNewDataDetail.carcare_size_m_washcar_price
                              }
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "carcare_size_m_washcar_price"
                                )
                              }
                              disabled={readOnly}
                              style={{
                                width: 120
                              }}
                              type="number"
                              name="price12"
                              id="price12"
                              placeholder="Price"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingBottom: 30, paddingLeft: 20 }}>
                        {" "}
                        <Form inline>
                          <FormGroup>
                            <Label
                              style={{
                                fontWeight: "bold"
                              }}
                              for="Wash Car"
                            >
                              Wash Car :{" "}
                            </Label>
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 20 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={
                                addNewDataDetail.carcare_size_l_washcar_total
                              }
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "carcare_size_l_washcar_total"
                                )
                              }
                              disabled={readOnly}
                              style={{
                                width: 80
                              }}
                              type="number"
                              name="total13"
                              id="Total13"
                              placeholder="Total"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 10 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={
                                addNewDataDetail.carcare_size_l_washcar_price
                              }
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "carcare_size_l_washcar_price"
                                )
                              }
                              disabled={readOnly}
                              style={{
                                width: 120
                              }}
                              type="number"
                              name="price13"
                              id="price13"
                              placeholder="Price"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                    </tr>
                    {/* wax */}
                    <tr>
                      <td style={{ paddingBottom: 30 }}>
                        {" "}
                        <Form inline>
                          <FormGroup>
                            <Label
                              style={{
                                fontWeight: "bold"
                              }}
                              for="Wax"
                            >
                              Wax :{" "}
                            </Label>
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 20 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.carcare_size_s_wax_total}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "carcare_size_s_wax_total"
                                )
                              }
                              disabled={readOnly}
                              style={{
                                width: 80
                              }}
                              type="number"
                              name="total14"
                              id="Total14"
                              placeholder="Total"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 10 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.carcare_size_s_wax_price}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "carcare_size_s_wax_price"
                                )
                              }
                              disabled={readOnly}
                              style={{
                                width: 120
                              }}
                              type="number"
                              name="price14"
                              id="price14"
                              placeholder="Price"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingBottom: 30, paddingLeft: 20 }}>
                        {" "}
                        <Form inline>
                          <FormGroup>
                            <Label
                              style={{
                                fontWeight: "bold"
                              }}
                              for="Wax"
                            >
                              Wax :{" "}
                            </Label>
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 20 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.carcare_size_m_wax_total}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "carcare_size_m_wax_total"
                                )
                              }
                              disabled={readOnly}
                              style={{
                                width: 80
                              }}
                              type="number"
                              name="total15"
                              id="Total15"
                              placeholder="Total"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 10 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.carcare_size_m_wax_price}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "carcare_size_m_wax_price"
                                )
                              }
                              disabled={readOnly}
                              style={{
                                width: 120
                              }}
                              type="number"
                              name="price15"
                              id="price15"
                              placeholder="Price"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingBottom: 30, paddingLeft: 20 }}>
                        {" "}
                        <Form inline>
                          <FormGroup>
                            <Label
                              style={{
                                fontWeight: "bold"
                              }}
                              for="Wax"
                            >
                              Wax :{" "}
                            </Label>
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 20 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.carcare_size_l_wax_total}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "carcare_size_l_wax_total"
                                )
                              }
                              disabled={readOnly}
                              style={{
                                width: 80
                              }}
                              type="number"
                              name="total16"
                              id="Total16"
                              placeholder="Total"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 10 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.carcare_size_l_wax_price}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "carcare_size_l_wax_price"
                                )
                              }
                              disabled={readOnly}
                              style={{
                                width: 120
                              }}
                              type="number"
                              name="price16"
                              id="price16"
                              placeholder="Price"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* attach file or show file */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <input
                  onChange={e => this.onAttachFile(e, "Car Care")}
                  accept="image/png, image/jpeg"
                  style={{ display: "none" }}
                  id="contained-button-file-carcare"
                  type="file"
                />
                {readOnly ? (
                  <label
                    style={{
                      visibility:
                        addNewDataDetail.carcare_attach === ""
                          ? "hidden"
                          : "visible"
                    }}
                  >
                    <Button
                      onClick={() =>
                        this.showAttactImage(addNewDataDetail.carcare_attach)
                      }
                      variant="contained"
                      color="primary"
                      component="span"
                    >
                      <i
                        style={{ paddingRight: 7 }}
                        className="zmdi zmdi-attachment-alt zmdi-hc-lg"
                      ></i>
                      Show Attach
                    </Button>
                  </label>
                ) : (
                  <label htmlFor="contained-button-file-carcare">
                    {addNewDataDetail.carcare_attach ? (
                      <p>
                        <span className="material-icons mr-10">attachment</span>
                        <a
                          href="#"
                          onClick={() =>
                            this.showAttactImage(
                              addNewDataDetail.carcare_attach.base64
                            )
                          }
                        >
                          {addNewDataDetail.carcare_attach &&
                            addNewDataDetail.carcare_attach.name}
                        </a>
                      </p>
                    ) : (
                      ""
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                    >
                      <i
                        style={{ paddingRight: 7 }}
                        className="zmdi zmdi-attachment zmdi-hc-lg"
                      ></i>
                      Attach Document
                    </Button>
                  </label>
                )}
              </div>
            </RctCollapsibleCard>
            <RctCollapsibleCard heading="Product Type : Convenience store">
              <div
                style={{ display: "flex", justifyContent: "center" }}
                className="table-responsive"
              >
                <table>
                  <thead style={{ backgroundColor: "#FFF" }}>
                    <tr>
                      <th></th>
                      <th style={{ paddingLeft: 30 }}>Total</th>
                      <th style={{ paddingLeft: 30 }}>Price</th>
                      <th style={{ paddingLeft: 30, visibility: "hidden" }}>
                        Quantity
                      </th>
                      <th style={{ paddingLeft: 30, visibility: "hidden" }}>
                        Payment Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* food */}
                    <tr>
                      <td style={{ paddingBottom: 30 }}>
                        {" "}
                        <Form inline>
                          <FormGroup>
                            <Label
                              style={{
                                fontWeight: "bold"
                              }}
                              for="Food"
                            >
                              Food :{" "}
                            </Label>
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={
                                addNewDataDetail.conveniencestore_food_total
                              }
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "conveniencestore_food_total"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="total17"
                              id="Total17"
                              placeholder="Total"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={
                                addNewDataDetail.conveniencestore_food_price
                              }
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "conveniencestore_food_price"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="price17"
                              id="price17"
                              placeholder="Price"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30, visibility: "hidden" }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              disabled={readOnly}
                              type="number"
                              name="hidden17"
                              id="hidden17"
                              placeholder="Hidden"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30, visibility: "hidden" }}>
                        <Form>
                          <FormGroup>
                            <Input
                              disabled={readOnly}
                              type="select"
                              name="paymentType17"
                              id="paymentType17"
                            >
                              {paymentType &&
                                paymentType.map((value, key) => (
                                  <option key={key} value={value.Id}>
                                    {value.Name}
                                  </option>
                                ))}
                            </Input>
                          </FormGroup>
                        </Form>
                      </td>
                    </tr>
                    {/* non-food */}
                    <tr>
                      <td style={{ paddingBottom: 30 }}>
                        {" "}
                        <Form inline>
                          <FormGroup>
                            <Label
                              style={{
                                fontWeight: "bold"
                              }}
                              for="Non-Food"
                            >
                              Non-Food :{" "}
                            </Label>
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={
                                addNewDataDetail.conveniencestore_nonfood_total
                              }
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "conveniencestore_nonfood_total"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="total18"
                              id="Total18"
                              placeholder="Total"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={
                                addNewDataDetail.conveniencestore_nonfood_price
                              }
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "conveniencestore_nonfood_price"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="price18"
                              id="price18"
                              placeholder="Price"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30, visibility: "hidden" }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              disabled={readOnly}
                              type="number"
                              name="hidden18"
                              id="hidden18"
                              placeholder="Hidden"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30, visibility: "hidden" }}>
                        <Form>
                          <FormGroup>
                            <Input
                              disabled={readOnly}
                              type="select"
                              name="paymentType18"
                              id="paymentType18"
                            >
                              {paymentType &&
                                paymentType.map((value, key) => (
                                  <option key={key} value={value.Id}>
                                    {value.Name}
                                  </option>
                                ))}
                            </Input>
                          </FormGroup>
                        </Form>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* attact file or show file */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <input
                  onChange={e => this.onAttachFile(e, "Convenience Store")}
                  accept="image/png, image/jpeg"
                  style={{ display: "none" }}
                  id="contained-button-file-conveniencestore"
                  type="file"
                />
                {readOnly ? (
                  <label
                    style={{
                      visibility:
                        addNewDataDetail.conveniencestore_attach === ""
                          ? "hidden"
                          : "visible"
                    }}
                  >
                    <Button
                      onClick={() =>
                        this.showAttactImage(
                          addNewDataDetail.conveniencestore_attach
                        )
                      }
                      variant="contained"
                      color="primary"
                      component="span"
                    >
                      <i
                        style={{ paddingRight: 7 }}
                        className="zmdi zmdi-attachment-alt zmdi-hc-lg"
                      ></i>
                      Show Attach
                    </Button>
                  </label>
                ) : (
                  <label htmlFor="contained-button-file-conveniencestore">
                    {addNewDataDetail.conveniencestore_attach ? (
                      <p>
                        <span className="material-icons mr-10">attachment</span>
                        <a
                          href="#"
                          onClick={() =>
                            this.showAttactImage(
                              addNewDataDetail.conveniencestore_attach.base64
                            )
                          }
                        >
                          {addNewDataDetail.conveniencestore_attach &&
                            addNewDataDetail.conveniencestore_attach.name}
                        </a>
                      </p>
                    ) : (
                      ""
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                    >
                      <i
                        style={{ paddingRight: 7 }}
                        className="zmdi zmdi-attachment zmdi-hc-lg"
                      ></i>
                      Attach Document
                    </Button>
                  </label>
                )}
              </div>
            </RctCollapsibleCard>
            <RctCollapsibleCard heading="Product Type : Cafe">
              <div
                style={{ display: "flex", justifyContent: "center" }}
                className="table-responsive"
              >
                <table>
                  <thead style={{ backgroundColor: "#FFF" }}>
                    <tr>
                      <th></th>
                      <th style={{ paddingLeft: 30 }}>Total</th>
                      <th style={{ paddingLeft: 30 }}>Price</th>
                      <th style={{ paddingLeft: 30, visibility: "hidden" }}>
                        Quantity
                      </th>
                      <th style={{ paddingLeft: 30, visibility: "hidden" }}>
                        Payment Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ paddingBottom: 30 }}>
                        {" "}
                        <Form inline>
                          <FormGroup>
                            <Label
                              style={{
                                fontWeight: "bold"
                              }}
                              for="Food"
                            >
                              Revenue Cafe :{" "}
                            </Label>
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.cafe_revenuecafe_total}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "cafe_revenuecafe_total"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="total19"
                              id="Total19"
                              placeholder="Total"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30 }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              value={addNewDataDetail.cafe_revenuecafe_price}
                              onChange={e =>
                                this.onChangeDataInForm(
                                  e,
                                  "cafe_revenuecafe_price"
                                )
                              }
                              disabled={readOnly}
                              type="number"
                              name="price19"
                              id="price19"
                              placeholder="Price"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30, visibility: "hidden" }}>
                        {" "}
                        <Form>
                          <FormGroup>
                            <Input
                              disabled={readOnly}
                              type="number"
                              name="hidden19"
                              id="hidden19"
                              placeholder="Hidden"
                            />
                          </FormGroup>
                        </Form>
                      </td>
                      <td style={{ paddingLeft: 30, visibility: "hidden" }}>
                        <Form>
                          <FormGroup>
                            <Input
                              disabled={readOnly}
                              type="select"
                              name="paymentType19"
                              id="paymentType19"
                            >
                              {paymentType &&
                                paymentType.map((value, key) => (
                                  <option key={key} value={value.Id}>
                                    {value.Name}
                                  </option>
                                ))}
                            </Input>
                          </FormGroup>
                        </Form>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* attach file or show file */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <input
                  onChange={e => this.onAttachFile(e, "Cafe")}
                  accept="image/png, image/jpeg"
                  style={{ display: "none" }}
                  id="contained-button-file-cafe"
                  type="file"
                />
                {readOnly ? (
                  <label
                    style={{
                      visibility:
                        addNewDataDetail.cafe_attach == ""
                          ? "hidden"
                          : "visible"
                    }}
                  >
                    <Button
                      onClick={() =>
                        this.showAttactImage(addNewDataDetail.cafe_attach)
                      }
                      variant="contained"
                      color="primary"
                      component="span"
                    >
                      <i
                        style={{ paddingRight: 7 }}
                        className="zmdi zmdi-attachment-alt zmdi-hc-lg"
                      ></i>
                      Show Attach
                    </Button>
                  </label>
                ) : (
                  <label htmlFor="contained-button-file-cafe">
                    {addNewDataDetail.cafe_attach ? (
                      <p>
                        <span className="material-icons mr-10">attachment</span>
                        <a
                          href="#"
                          onClick={() =>
                            this.showAttactImage(
                              addNewDataDetail.cafe_attach.base64
                            )
                          }
                        >
                          {addNewDataDetail.cafe_attach &&
                            addNewDataDetail.cafe_attach.name}
                        </a>
                      </p>
                    ) : (
                      ""
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                    >
                      <i
                        style={{ paddingRight: 7 }}
                        className="zmdi zmdi-attachment zmdi-hc-lg"
                      ></i>
                      Attach Document
                    </Button>
                  </label>
                )}
              </div>
            </RctCollapsibleCard>
            {this.dialogInfo(this.props.switchMode)}
          </div>
        </div>
        {this.alertDialog()}
        <div>
          {this.state.showAttach ? (
            <Dialog
              fullWidth={true}
              maxWidth={"md"}
              open={this.state.showAttach}
              TransitionComponent={this.Transition}
              keepMounted
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogContent>
                <DialogContentText
                  id="alert-dialog-slide-description"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  {(this.props.switchMode === "Add") |
                  (this.props.switchMode === "Update") ? (
                    <img src={this.state.imageUrl}></img>
                  ) : (
                    <img
                      src={require("../../../assets/data/revenue/" +
                        this.state.imageUrl)}
                    ></img>
                  )}
                </DialogContentText>
              </DialogContent>
            </Dialog>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

// // map state to props
const mapStateToProps = state => {
  const { masterReducer, authUser } = state;
  return { masterReducer, authUser };
};

export default connect(mapStateToProps, {
  addDataRevenue,
  sendRevenue,
  activeSession,
  updateDataRevenue,
  approveRevenue,
  disapproveRevenue
})(RevenueCardForm);
