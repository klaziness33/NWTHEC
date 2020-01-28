/**
 * Add New User Form
 */
import React from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";

import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

import {
  parseDateInt,
  parseDateString,
  convertDateToWebservice
} from "../../../helpers/helpers";

const ExpenseFormAdd = ({ addNewDataDetails, onChangeAddNewDataDetails }) => (
  <Form>
    <FormGroup>
      <Label for="Description">Description</Label>
      <Input
        style={{ borderColor: "#CBCBCB", height: 56 }}
        type="text"
        name="Description"
        id="Description"
        placeholder="Enter Description"
        value={addNewDataDetails.Description}
        onChange={e => onChangeAddNewDataDetails("Description", e.target.value)}
      />
    </FormGroup>
    <FormGroup>
      <Label for="Invoice_No">Invoice No.</Label>
      <Input
        style={{ borderColor: "#CBCBCB", height: 56 }}
        type="text"
        name="Invoice_No"
        id="Invoice_No"
        placeholder="Enter Invoice No."
        value={addNewDataDetails.Invoice_No}
        onChange={e => onChangeAddNewDataDetails("Invoice_No", e.target.value)}
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
            value={parseDateInt(Date.now())}
            onChange={e => this.onUpdateDataDetails("CreateDate", e)}
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
        style={{ borderColor: "#CBCBCB", height: 56 }}
        type="text"
        name="Total"
        id="Total"
        placeholder="Enter Total"
        value={addNewDataDetails.Total}
        onChange={e => onChangeAddNewDataDetails("Total", e.target.value)}
      />
    </FormGroup>
  </Form>
);

export default ExpenseFormAdd;
