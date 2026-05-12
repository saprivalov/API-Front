import { useState } from 'react'
import {
  Table, Button, Modal, Form, Input, Select, Tag, Space,
  Alert, Typography, Popconfirm, Tooltip,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  useGetInterviewTasksQuery,
  useCreateInterviewTaskMutation,
  useUpdateInterviewTaskMutation,
  useDeleteInterviewTaskMutation,
} from '../api/interview-tasks.api'
import type {
  InterviewTask,
  GetTasksQuery,
  CreateInterviewTaskBody,
  UpdateInterviewTaskBody,
} from '../schemas/interview-task.schemas'
import { useAuth } from '../hooks/useAuth'

const { Text } = Typography
const { Search } = Input

const levelColors: Record<string, string> = {
  junior: 'green',
  middle: 'orange',
  senior: 'red',
}

const tagColors = ['blue', 'geekblue', 'purple', 'cyan', 'teal']

export default function InterviewTasksTab() {
  const auth = useAuth()
  const isMentor = auth?.role === 'mentor'

  const [filters, setFilters] = useState<GetTasksQuery>({ page: 1, limit: 10 })
  const [createOpen, setCreateOpen] = useState(false)
  const [editTask, setEditTask] = useState<InterviewTask | null>(null)
  const [createForm] = Form.useForm<CreateInterviewTaskBody>()
  const [editForm] = Form.useForm<UpdateInterviewTaskBody>()

  const { data, isLoading, error } = useGetInterviewTasksQuery(filters)
  const [createTask, { isLoading: creating }] = useCreateInterviewTaskMutation()
  const [updateTask, { isLoading: updating }] = useUpdateInterviewTaskMutation()
  const [deleteTask] = useDeleteInterviewTaskMutation()

  const onCreateSubmit = async (values: CreateInterviewTaskBody) => {
    const result = await createTask({ ...values, createdByUserId: auth?.userId ?? '' })
    if ('data' in result) {
      createForm.resetFields()
      setCreateOpen(false)
    }
  }

  const onEditSubmit = async (values: UpdateInterviewTaskBody) => {
    if (!editTask) return
    const result = await updateTask({ id: editTask.id, ...values })
    if ('data' in result) setEditTask(null)
  }

  const columns: ColumnsType<InterviewTask> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title) => <Text strong>{title}</Text>,
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 90,
      render: (level) => <Tag color={levelColors[level]}>{level}</Tag>,
    },
    {
      title: 'Tags',
      key: 'tags',
      render: (_, record) => (
        <Space size={4} wrap>
          {record.taskTags?.map(({ tag }, i) => (
            <Tag key={tag.id} color={tagColors[i % tagColors.length]} className="!m-0">
              {tag.name}
            </Tag>
          )) ?? <Text type="secondary">—</Text>}
        </Space>
      ),
    },
    {
      title: 'Created by',
      key: 'creator',
      render: (_, record) =>
        record.creator
          ? <Text>{record.creator.name}</Text>
          : <Text code className="text-xs">{record.createdByUserId.slice(0, 8)}…</Text>,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    ...(isMentor ? [{
      title: '',
      key: 'actions',
      width: 80,
      render: (_: unknown, record: InterviewTask) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditTask(record)
                editForm.setFieldsValue({ title: record.title, level: record.level })
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this task?"
            onConfirm={() => deleteTask(record.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button size="small" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    }] : []),
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <Search
          placeholder="Search tasks…"
          className="w-56"
          allowClear
          onSearch={(value) =>
            setFilters((f) => ({ ...f, search: value || undefined, page: 1 }))
          }
        />
        <Select
          placeholder="Level"
          allowClear
          className="w-32"
          options={[
            { value: 'junior', label: 'Junior' },
            { value: 'middle', label: 'Middle' },
            { value: 'senior', label: 'Senior' },
          ]}
          onChange={(value) => setFilters((f) => ({ ...f, level: value, page: 1 }))}
        />
        <Select
          className="w-36"
          value={filters.sortBy ?? 'createdAt'}
          options={[
            { value: 'createdAt', label: 'By date' },
            { value: 'title', label: 'By title' },
          ]}
          onChange={(value) => setFilters((f) => ({ ...f, sortBy: value }))}
        />
        <Select
          className="w-28"
          value={filters.sortOrder ?? 'desc'}
          options={[
            { value: 'desc', label: 'Desc' },
            { value: 'asc', label: 'Asc' },
          ]}
          onChange={(value) => setFilters((f) => ({ ...f, sortOrder: value }))}
        />
        {isMentor && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="ml-auto"
            onClick={() => setCreateOpen(true)}
          >
            Create Task
          </Button>
        )}
      </div>

      {error && <Alert type="error" message="Failed to load tasks" className="mb-4" showIcon />}

      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="id"
        loading={isLoading}
        size="middle"
        pagination={{
          current: filters.page,
          pageSize: filters.limit,
          total: data?.meta.total,
          showTotal: (total) => `${total} tasks`,
          onChange: (page, pageSize) =>
            setFilters((f) => ({ ...f, page, limit: pageSize })),
        }}
      />

      {/* Create Modal */}
      <Modal
        title="Create Interview Task"
        open={createOpen}
        onCancel={() => { setCreateOpen(false); createForm.resetFields() }}
        footer={null}
        destroyOnClose
      >
        <Form form={createForm} layout="vertical" onFinish={onCreateSubmit} className="pt-2">
          <Form.Item label="Title" name="title" rules={[{ required: true, min: 5, max: 150 }]}>
            <Input placeholder="Explain event loop in JavaScript" />
          </Form.Item>
          <Form.Item label="Level" name="level" rules={[{ required: true }]}>
            <Select options={[
              { value: 'junior', label: 'Junior' },
              { value: 'middle', label: 'Middle' },
              { value: 'senior', label: 'Senior' },
            ]} />
          </Form.Item>
          <Form.Item className="!mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => { setCreateOpen(false); createForm.resetFields() }}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={creating}>Create</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Interview Task"
        open={!!editTask}
        onCancel={() => setEditTask(null)}
        footer={null}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" onFinish={onEditSubmit} className="pt-2">
          <Form.Item label="Title" name="title" rules={[{ min: 5, max: 150 }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Level" name="level">
            <Select options={[
              { value: 'junior', label: 'Junior' },
              { value: 'middle', label: 'Middle' },
              { value: 'senior', label: 'Senior' },
            ]} />
          </Form.Item>
          <Form.Item className="!mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setEditTask(null)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={updating}>Save</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
