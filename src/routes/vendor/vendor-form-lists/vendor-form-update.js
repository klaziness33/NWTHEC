/**
 * Update Data Details Form
 */
import React from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";

const VendorFormUpdate = ({ data, onUpdateDataDetail }) => (
  <Form>
    <FormGroup>
      <Label for="description">Description</Label>
      <Input
        type="text"
        name="description"
        id="description"
        placeholder="Enter Description"
        value={data.description}
        onChange={e => onUpdateDataDetail("description", e.target.value)}
      />
    </FormGroup>
    <FormGroup>
      <Label for="invoiceNo">Invoice No.</Label>
      <Input
        type="text"
        name="invoiceNo"
        id="invoiceNo"
        placeholder="Enter invoice No."
        value={data.invoiceNo}
        onChange={e => onUpdateDataDetail("invoiceNo", e.target.value)}
      />
    </FormGroup>
    <FormGroup>
      <Label for="createDate">Create Date</Label>
      <Input
        type="text"
        name="createDate"
        id="createDate"
        placeholder="Enter Create Date"
        value={data.createDate}
        onChange={e => onUpdateDataDetail("createDate", e.target.value)}
      />
    </FormGroup>
    <FormGroup>
      <Label for="total">Total</Label>
      <Input
        type="text"
        name="total"
        id="total"
        placeholder="Enter Total"
        value={data.total}
        onChange={e => onUpdateDataDetail("total", e.target.value)}
      />
    </FormGroup>
  </Form>
);

export default VendorFormUpdate;
