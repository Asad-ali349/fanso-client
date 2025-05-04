/* eslint-disable react/require-default-props */
import { InboxOutlined } from '@ant-design/icons';
import PhotoUploadList from '@components/file/photos-upload-list';
import {
  Button, Divider,
  Form, Input, InputNumber, Select, Switch, Upload,
  message
} from 'antd';
import Router from 'next/router';
import { useState } from 'react';
import { IGallery } from 'src/interfaces';
import classNames from 'classnames';
import style from './form-upload.module.scss';

interface IProps {
  gallery?: IGallery;
  onFinish: Function;
  submitting: boolean;
  filesList?: any[];
  handleBeforeUpload?: Function;
  removePhoto?: Function;
  setCover?: Function;
}

const { Dragger } = Upload;

function FormGallery({
  onFinish,
  submitting,
  filesList,
  handleBeforeUpload,
  removePhoto,
  setCover,
  gallery = null
}: IProps) {
  const [form] = Form.useForm();
  const [isSale, setSale] = useState(gallery?.isSale || false);
  return (
    <div className={classNames(style['feed-form'])}>
      <Form
        form={form}
        name="galleryForm"
        onFinish={(values) => {
          if (values.isSale && !(values.price || values.price > 0)) {
            message.error('Price must be greater than 0');
            return;
          }

          onFinish(values);
        }}
        initialValues={
          gallery || {
            title: '', status: 'active', description: '', price: 4.99, isSale: false
          }
        }
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        className="account-form"
        scrollToFirstError
      >
        <Form.Item
          name="title"
          rules={[{ required: true, message: 'Please input gallery title!' }]}
          label="Title"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          name="isSale"
          label="For sale?"
        >
          <Switch checkedChildren="Pay per view" unCheckedChildren="Subscribe to view" checked={isSale} onChange={(val) => setSale(val)} />
        </Form.Item>
        {isSale && (
          <Form.Item
            name="price"
            rules={[{ required: true, message: 'Please input the price' }]}
            label="Price"
          >
            <InputNumber />
          </Form.Item>
        )}
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status!' }]}
        >
          <Select>
            <Select.Option key="active" value="active">
              Active
            </Select.Option>
            <Select.Option key="inactive" value="inactive">
              Inactive
            </Select.Option>
          </Select>
        </Form.Item>
        {gallery && <Divider>Upload Photos</Divider>}
        {gallery && (
          <Dragger
            accept="image/*"
            multiple
            showUploadList={false}
            listType="picture"
            disabled={submitting}
            beforeUpload={handleBeforeUpload && handleBeforeUpload.bind(this)}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Drag and drop your photos to this area, or browse your computer to upload
            </p>
          </Dragger>
        )}
        {filesList && filesList.length > 0 && (
          <PhotoUploadList
            files={filesList}
            setCover={setCover && setCover.bind(this)}
            remove={removePhoto && removePhoto.bind(this)}
          />
        )}
        <Form.Item className={style['button-form']} style={{ padding: '0' }}>
          <Button
            className="primary"
            htmlType="submit"
            loading={submitting}
            disabled={submitting}
            style={{ marginRight: '20px' }}
          >
            Submit
          </Button>
          <Button
            className="secondary"
            onClick={() => Router.push('/creator/my-gallery')}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default FormGallery;
