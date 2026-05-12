import { useState } from 'react'
import {
  Table, Button, Modal, Form, Select, Tag,
  Space, Alert, Typography, InputNumber,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useGetSubmissionsQuery, useCreateSubmissionMutation } from '../api/submissions.api'
import { useGetInterviewTasksQuery } from '../api/interview-tasks.api'
import type { Submission, CreateSubmissionBody } from '../schemas/submission.schemas'
import { useAuth } from '../hooks/useAuth'

const { Text } = Typography

const statusColors: Record<string, string> = {
  pending: 'orange',
  reviewed: 'green',
}

const levelColors: Record<string, string> = {
  junior: 'green',
  middle: 'orange',
  senior: 'red',
}

export default function SubmissionsTab() {
  const auth = useAuth()
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm<CreateSubmissionBody>()

  const { data, isLoading, error } = useGetSubmissionsQuery()
  const { data: tasksData } = useGetInterviewTasksQuery({ page: 1, limit: 100 })
  const [createSubmission, { isLoading: creating }] = useCreateSubmissionMutation()

  const onSubmit = async (values: CreateSubmissionBody) => {
    const result = await createSubmission({
      ...values,
      userId: auth?.userId ?? '',
    })
    if ('data' in result) {
      form.resetFields()
      setOpen(false)
    }
  }

  const columns: ColumnsType<Submission> = [
    {
      title: 'Task',
      key: 'task',
      render: (_, record) =>
        record.task
          ? <Text strong>{record.task.title}</Text>
          : <Text code className="text-xs">{record.taskId.slice(0, 8)}…</Text>,
    },
    {
      title: 'Level',
      key: 'level',
      width: 90,
      render: (_, record) =>
        record.task
          ? <Tag color={levelColors[record.task.level]}>{record.task.level}</Tag>
          : null,
    },
    {
      title: 'Candidate',
      key: 'user',
      render: (_, record) =>
        record.user
          ? (
            <Space direction="vertical" size={0}>
              <Text>{record.user.name}</Text>
              <Text type="secondary" className="text-xs">{record.user.email}</Text>
            </Space>
          )
          : <Text code className="text-xs">{record.userId.slice(0, 8)}…</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      width: 90,
      render: (score) =>
        score !== null && score !== undefined
          ? <Text strong>{score}<Text type="secondary">/100</Text></Text>
          : <Text type="secondary">—</Text>,
    },
    {
      title: 'Submitted',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ]

  const taskOptions = tasksData?.data.map((t) => ({
    value: t.id,
    label: t.title,
  })) ?? []

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
          <Form.Item label="Task" name="taskId" rules={[{ required: true, message: 'Select a task' }]}>
            <Select
              showSearch
              placeholder="Select a task"
              optionFilterProp="label"
              options={taskOptions}
            />
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
