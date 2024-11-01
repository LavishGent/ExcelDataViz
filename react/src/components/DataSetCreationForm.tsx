import React from "react";
import type { FormProps } from "antd";
import { Button, DatePicker, Form, Input, InputNumber } from "antd";

type FieldType = {
  itemName?: string;
  date?: string;
  price?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  const entry = Object.values(values).join(", ");
  // Example update function
  fetch("http://localhost:3000/data/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key: "items", value: entry }),
  }).then((response) => {
    if (!response.ok) {
      alert("Failed to submit data");
    }
  });
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const DataSetCreationForm: React.FC = () => (
  <Form
    name="dataCreationForm"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 400 }}
    initialValues={{}}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
  >
    <Form.Item<FieldType>
      label="Item Name"
      name="itemName"
      rules={[{ required: true, message: "Please input the item name" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item<FieldType>
      label="Date"
      name="date"
      rules={[{ required: true, message: "Please input a valid date" }]}
    >
      <DatePicker />
    </Form.Item>

    <Form.Item<FieldType>
      label="Price"
      name="price"
      rules={[{ required: true, message: "Please input the items price" }]}
    >
      <InputNumber<number>
        defaultValue={0}
        formatter={(value) =>
          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }
        parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, ""))}
      />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
);

export default DataSetCreationForm;
