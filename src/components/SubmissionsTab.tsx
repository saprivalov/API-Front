import { useState } from 'react'
import {
  Table, Button, Modal, Form, Input, Select, Tag,
  Space, Alert, Typography, InputNumber,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useGetSubmissionsQuery, useCreateSubmissionMutation } from '../api/submissions.api'
import type { Submission, CreateSubmissionBody } from '../schemas/submission.schemas'

const { Text } = Typography

const statusColors: Record<string, string> = {
  pending: 'orange',
  reviewed: 'green',
}

export default function SubmissionsTab() {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm<CreateSubmissionBody>()
  const { data, isLoading, error } = useGetSubmissionsQuery()
  const [createSubmission, { isLoading: creating }] = useCreateSubmissionMutation()

  const onSubmit = async (values: CreateSubmissionBody) => {
    const result = await createSubmission(values)
    if ('data' in result) {
      form.resetFields()
      setOpen(false)
    }
  }

  const columns: ColumnsType<Submission> = [
    {
      title: 'Task ID',
      dataIndex: 'taskId',
      key: 'taskId',
      render: (id) => <Text code className="text-xs">{id.slice(0, 8)}…</Text>,
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      render: (id) => <Text code className="text-xs">{id.slice(0, 8)}…</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score) =>
        score !== null
          ? <Text strong>{score}<Text type="secondary">/100</Text></Text>
          : <Text type="secondary">—</Text>,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Text type="secondary">{data?.data.length ?? 0} submissions total</Text>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Submit
        </Button>
      </div>

      {error && <Alert type="error" message="Failed to load submissions" className="mb-4" showIcon />}

      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10, showTotal: (t) => `${t} submissions` }}
        size="middle"
      />

      <Modal
        title="Create Submission"
        open={open}
        onCancel={() => { setOpen(false); form.resetFields() }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onSubmit} className="pt-2">
          <Form.Item label="Task ID" name="taskId" rules={[{ required: true }]}>
            <Input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
          </Form.Item>
          <Form.Item label="User ID" name="userId" rules={[{ required: true }]}>
            <Input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
          </Form.Item>
          <Form.Item label="Status" name="status" initialValue="pending">
            <Select options={[
              { value: 'pending', label: 'Pending' },
              { value: 'reviewed', label: 'Reviewed' },
            ]} />
          </Form.Item>
          <Form.Item label="Score (optional)" name="score">
            <InputNumber min={0} max={100} className="w-full" placeholder="0–100" />
          </Form.Item>
          <Form.Item className="!mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => { setOpen(false); form.resetFields() }}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={creating}>Submit</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
