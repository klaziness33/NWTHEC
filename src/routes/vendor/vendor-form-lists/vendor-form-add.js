/**
 * Add New User Form
 */
import React from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";

const VendorFormAdd = ({ addNewDataDetails, onChangeaddNewDataDetails }) => (
  <Form>
    <FormGroup>
      <Label for="description">Description</Label>
      <Input
        type="text"
        name="description"
        id="description"
        placeholder="Enter Description"
        value={addNewDataDetails.description}
        onChange={e => onChangeaddNewDataDetails("description", e.target.value)}
      />
    </FormGroup>
    <FormGroup>
      <Label for="invoiceNo">Invoice No.</Label>
      <Input
        type="text"
        name="invoiceNo"
        id="invoiceNo"
        placeholder="Enter Invoice No."
        value={addNewDataDetails.invoiceNo}
        onChange={e => onChangeaddNewDataDetails("invoiceNo", e.target.value)}
      />
    </FormGroup>
    <FormGroup>
      <Label for="createDate">Create Date</Label>
      <Input
        type="text"
        name="createDate"
        id="createDate"
        placeholder="Enter Create Date"
        value={addNewDataDetails.createDate}
        onChange={e => onChangeaddNewDataDetails("createDate", e.target.value)}
      />
    </FormGroup>
    <FormGroup>
      <Label for="total">Total</Label>
      <Input
        type="text"
        name="total"
        id="total"
        placeholder="Enter Total"
        value={addNewDataDetails.total}
        onChange={e => onChangeaddNewDataDetails("total", e.target.value)}
      />
    </FormGroup>
  </Form>
);

export default VendorFormAdd;
