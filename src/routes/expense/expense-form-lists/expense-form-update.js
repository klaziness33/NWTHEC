/**
 * Update Data Details Form
 */
import React, { useState } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";

import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

// const [selectedDate, setSelectedDate] = useState(null);

const handleDateChange = (date, { props }) => {
  console.log(date);
  console.log(props);
  // props.onSelectedDate = date;
};

const ExpenseFormUpdate = ({ data, onUpdateDataDetail }) => (
  <Form>
    <FormGroup>
      <Label for="Description">Description</Label>
      <Input
        style={{ borderColor: "#CBCBCB", height: 56 }}
        type="text"
        name="Description"
        id="Description"
        placeholder="Enter Description"
        value={data.Description}
        onChange={e => onUpdateDataDetail("Description", e.target.value)}
      />
    </FormGroup>
    <FormGroup>
      <Label for="Invoice_No">Invoice No.</Label>
      <Input
        style={{ borderColor: "#CBCBCB", height: 56 }}
        type="text"
        name="Invoice_No"
        id="Invoice_No"
        placeholder="Enter invoice No."
        value={data.Invoice_No}
        onChange={e => onUpdateDataDetail("Invoice_No", e.target.value)}
      />
    </FormGroup>
    <FormGroup>
      <Label for="CreateDate">Create Date</Label>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container>
          <KeyboardDatePicker
            fullWidth
            //   variant="inline"
            inputVariant="outlined"
            margin="normal"
            id="date-picker-dialog"
            // label="Select Date For"
            format="dd/MM/yyyy"
            value={Date.now()}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date"
            }}
          />
        </Grid>
      </MuiPickersUtilsProvider>
      {/* <Input
        type="text"
        name="CreateDate"
        id="CreateDate"
        placeholder="Enter Create Date"
        value={data.CreateDate}
        onChange={e => onUpdateDataDetail("CreateDate", e.target.value)}
      /> */}
    </FormGroup>
    <FormGroup>
      <Label for="Total">Total</Label>
      <Input
        style={{ borderColor: "#CBCBCB", height: 56 }}
        type="text"
        name="Total"
        id="Total"
        placeholder="Enter Total"
        value={data.Total}
        onChange={e => onUpdateDataDetail("Total", e.target.value)}
      />
    </FormGroup>
  </Form>
);

export default ExpenseFormUpdate;
