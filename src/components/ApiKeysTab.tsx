import { useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Alert,
  Typography,
  Popconfirm,
  Tooltip,
  message,
} from 'antd'
import { PlusOutlined, DeleteOutlined, CopyOutlined, KeyOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  useGetApiKeysQuery,
  useCreateApiKeyMutation,
  useDeleteApiKeyMutation,
} from '../api/api-keys.api'
import type { ApiKey, CreateApiKeyBody } from '../schemas/api-key.schemas'

const { Text, Paragraph } = Typography

export default function ApiKeysTab() {
  const [createOpen, setCreateOpen] = useState(false)
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [form] = Form.useForm<CreateApiKeyBody>()
  const [messageApi, contextHolder] = message.useMessage()

  const { data, isLoading, error } = useGetApiKeysQuery()
  const [createKey, { isLoading: creating }] = useCreateApiKeyMutation()
  const [deleteKey] = useDeleteApiKeyMutation()

  const onCreateSubmit = async (values: CreateApiKeyBody) => {
    const result = await createKey(values)
    const rawKey = 'data' in result ? result.data?.data.key : undefined
    if (rawKey) {
      form.resetFields()
      setCreateOpen(false)
      setCreatedKey(rawKey)
    }
  }

  const copyKey = async () => {
    if (!createdKey) return
    await navigator.clipboard.writeText(createdKey)
    void messageApi.success('Copied to clipboard')
  }

  const columns: ColumnsType<ApiKey> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Agent ID',
      dataIndex: 'agentId',
      key: 'agentId',
      render: (agentId) => <Text code>{agentId}</Text>,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 130,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (_, record) => (
        <Popconfirm
          title="Revoke this API key?"
          description="The agent using it will lose access immediately."
          onConfirm={() => deleteKey(record.id)}
          okText="Revoke"
          okButtonProps={{ danger: true }}
        >
          <Tooltip title="Revoke">
            <Button size="small" icon={<DeleteOutlined />} danger />
          </Tooltip>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      {contextHolder}
      <div className="flex mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="ml-auto"
          onClick={() => setCreateOpen(true)}
        >
          Generate Key
        </Button>
      </div>

      {error && <Alert type="error" message="Failed to load API keys" className="mb-4" showIcon />}

      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="id"
        loading={isLoading}
        size="middle"
        pagination={false}
      />

      {/* Create Modal */}
      <Modal
        title={
          <Space>
            <KeyOutlined />
            Generate API Key
          </Space>
        }
        open={createOpen}
        onCancel={() => {
          setCreateOpen(false)
          form.resetFields()
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onCreateSubmit} className="pt-2">
          <Form.Item label="Key name" name="name" rules={[{ required: true, min: 1, max: 100 }]}>
            <Input placeholder="production-agent-1" />
          </Form.Item>
          <Form.Item
            label="Agent ID"
            name="agentId"
            rules={[{ required: true, min: 1, max: 100 }]}
            help="Identifier that will appear in task logs (e.g. gpt-4o, claude-agent)"
          >
            <Input placeholder="gpt-4o" />
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
                Generate
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Show raw key ONCE */}
      <Modal
        title={
          <Space>
            <KeyOutlined />
            <Text strong>Save your API key</Text>
          </Space>
        }
        open={!!createdKey}
        onCancel={() => setCreatedKey(null)}
        footer={
          <Button type="primary" onClick={() => setCreatedKey(null)}>
            Done
          </Button>
        }
        closable={false}
        maskClosable={false}
      >
        <Alert
          type="warning"
          message="This key will not be shown again. Copy and store it securely."
          className="mb-4"
          showIcon
        />
        <div className="bg-gray-50 border border-gray-200 rounded p-3 flex items-center gap-2">
          <Paragraph copyable={false} className="!mb-0 font-mono text-sm flex-1 break-all">
            {createdKey}
          </Paragraph>
          <Tooltip title="Copy">
            <Button icon={<CopyOutlined />} onClick={copyKey} size="small" />
          </Tooltip>
        </div>
        <Text type="secondary" className="text-xs mt-2 block">
          Use this key as the <Text code>X-API-Key</Text> header in agent requests.
        </Text>
      </Modal>
    </div>
  )
}
