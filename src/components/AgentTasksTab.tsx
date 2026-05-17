import { useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  Alert,
  Typography,
  Popconfirm,
  Tooltip,
  Descriptions,
  Badge,
} from 'antd'
import { PlusOutlined, DeleteOutlined, EyeOutlined, RobotOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  useGetAgentTasksQuery,
  useCreateAgentTaskMutation,
  useDeleteAgentTaskMutation,
} from '../api/agent-tasks.api'
import type {
  AgentTask,
  AgentTaskStatus,
  GetAgentTasksQuery,
  CreateAgentTaskBody,
} from '../schemas/agent-task.schemas'
import { useAuth } from '../hooks/useAuth'

const { Text } = Typography
const { TextArea } = Input

const STATUS_COLOR: Record<AgentTaskStatus, string> = {
  pending: '#166534',
  in_progress: 'orange',
  completed: 'green',
  failed: 'red',
}

const STATUS_BADGE: Record<AgentTaskStatus, 'default' | 'processing' | 'success' | 'error'> = {
  pending: 'default',
  in_progress: 'processing',
  completed: 'success',
  failed: 'error',
}

export default function AgentTasksTab() {
  const auth = useAuth()
  const isMentor = auth?.role === 'mentor'

  const [filters, setFilters] = useState<GetAgentTasksQuery>({ page: 1, limit: 10 })
  const [createOpen, setCreateOpen] = useState(false)
  const [detailTask, setDetailTask] = useState<AgentTask | null>(null)
  const [form] = Form.useForm<CreateAgentTaskBody>()

  const { data, isLoading, error } = useGetAgentTasksQuery(filters)
  const [createTask, { isLoading: creating }] = useCreateAgentTaskMutation()
  const [deleteTask] = useDeleteAgentTaskMutation()

  const onCreateSubmit = async (values: CreateAgentTaskBody & { assignTo?: string }) => {
    const { assignTo, ...rest } = values
    const payload: CreateAgentTaskBody = {
      ...rest,
      ...(assignTo ? { metadata: { agent: assignTo } } : {}),
    }
    const result = await createTask(payload)
    if ('data' in result) {
      form.resetFields()
      setCreateOpen(false)
    }
  }

  const columns: ColumnsType<AgentTask> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title) => <Text strong>{title}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: AgentTaskStatus) => (
        <Badge
          status={STATUS_BADGE[status]}
          text={
            <Tag color={STATUS_COLOR[status]} className="!m-0">
              {status.replace('_', ' ')}
            </Tag>
          }
        />
      ),
    },
    {
      title: 'Agent',
      key: 'agentId',
      render: (_, record) => {
        const active = record.agentId
        const assigned = record.metadata?.agent as string | undefined
        if (active)
          return (
            <Text code className="text-xs">
              {active}
            </Text>
          )
        if (assigned)
          return (
            <Tooltip title="Assigned — waiting to be picked up">
              <Tag icon={<RobotOutlined />} color="purple" className="!m-0">
                {assigned}
              </Tag>
            </Tooltip>
          )
        return <Text type="secondary">—</Text>
      },
    },
    {
      title: 'Created by',
      key: 'creator',
      render: (_, record) =>
        record.creator ? (
          <Text>{record.creator.name}</Text>
        ) : (
          <Text code className="text-xs">
            {record.createdByUserId.slice(0, 8)}…
          </Text>
        ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Space>
          <Tooltip title="Details">
            <Button size="small" icon={<EyeOutlined />} onClick={() => setDetailTask(record)} />
          </Tooltip>
          {isMentor && (
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
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <Select
          placeholder="Filter by status"
          allowClear
          className="w-44"
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'in_progress', label: 'In progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'failed', label: 'Failed' },
          ]}
          onChange={(value) => setFilters((f) => ({ ...f, status: value, page: 1 }))}
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

      {error && (
        <Alert type="error" message="Failed to load agent tasks" className="mb-4" showIcon />
      )}

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
          onChange: (page, pageSize) => setFilters((f) => ({ ...f, page, limit: pageSize })),
        }}
      />

      {/* Create Modal */}
      <Modal
        title="Create Agent Task"
        open={createOpen}
        onCancel={() => {
          setCreateOpen(false)
          form.resetFields()
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onCreateSubmit} className="pt-2">
          <Form.Item label="Title" name="title" rules={[{ required: true, min: 3, max: 200 }]}>
            <Input placeholder="Summarize user feedback from last week" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea rows={3} placeholder="Optional detailed instructions for the agent" />
          </Form.Item>
          <Form.Item label="Assign to agent" name="assignTo">
            <Select
              allowClear
              placeholder="Auto-assign to a Claude agent"
              options={[
                { value: 'JohnFrontendMcClane', label: '🤖 JohnFrontendMcClane (Frontend)' },
                { value: 'JohnBackendMcClane', label: '⚙️ JohnBackendMcClane (Backend)' },
                { value: 'JohnTesterMcClane', label: '🧪 JohnTesterMcClane (Tester)' },
              ]}
            />
          </Form.Item>
          <Form.Item className="!mb-0">
            <Space className="w-full justify-end">
              <Button
                onClick={() => {
                  setCreateOpen(false)
                  form.resetFields()
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={creating}>
                Create
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title={detailTask?.title}
        open={!!detailTask}
        onCancel={() => setDetailTask(null)}
        footer={<Button onClick={() => setDetailTask(null)}>Close</Button>}
        width={600}
      >
        {detailTask && (
          <Descriptions column={1} size="small" bordered className="mt-3">
            <Descriptions.Item label="ID">
              <Text code copyable>
                {detailTask.id}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={STATUS_COLOR[detailTask.status]}>
                {detailTask.status.replace('_', ' ')}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Agent">
              {detailTask.agentId ? (
                <Text code>{detailTask.agentId}</Text>
              ) : (
                <Text type="secondary">unassigned</Text>
              )}
            </Descriptions.Item>
            {detailTask.description && (
              <Descriptions.Item label="Description">{detailTask.description}</Descriptions.Item>
            )}
            {detailTask.result && (
              <Descriptions.Item label="Result">
                {(detailTask.result as Record<string, unknown>).pr_url ? (
                  <Space direction="vertical" size={4}>
                    <a
                      href={String((detailTask.result as Record<string, unknown>).pr_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🔗 Open Pull Request
                    </a>
                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-36">
                      {JSON.stringify(detailTask.result, null, 2)}
                    </pre>
                  </Space>
                ) : (
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-48">
                    {JSON.stringify(detailTask.result, null, 2)}
                  </pre>
                )}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Created">
              {new Date(detailTask.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}
