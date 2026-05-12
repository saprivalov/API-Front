import { useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, Tag, Space, Alert, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useGetUsersQuery, useCreateUserMutation } from '../api/users.api'
import type { User, CreateUserBody } from '../schemas/user.schemas'

const { Text } = Typography

const roleColors: Record<string, string> = {
  mentor: 'purple',
  candidate: 'blue',
}

export default function UsersTab() {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm<CreateUserBody>()
  const { data, isLoading, error } = useGetUsersQuery()
  const [createUser, { isLoading: creating }] = useCreateUserMutation()

  const onSubmit = async (values: CreateUserBody) => {
    const result = await createUser(values)
    if ('data' in result) {
      form.resetFields()
      setOpen(false)
    }
  }

  const columns: ColumnsType<User> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => <Text type="secondary">{email}</Text>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color={roleColors[role]}>{role}</Tag>,
    },
    {
      title: 'Tasks',
      key: 'tasks',
      width: 80,
      align: 'center' as const,
      render: (_: unknown, record: User) => <Text strong>{record._count?.createdTasks ?? 0}</Text>,
    },
    {
      title: 'Submissions',
      key: 'submissions',
      width: 110,
      align: 'center' as const,
      render: (_: unknown, record: User) => <Text>{record._count?.submissions ?? 0}</Text>,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Text type="secondary">{data?.data.length ?? 0} users total</Text>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Create User
        </Button>
      </div>

      {error && <Alert type="error" message="Failed to load users" className="mb-4" showIcon />}

      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="id"
        loading={isLoading}
        pagination={false}
        size="middle"
      />

      <Modal
        title="Create User"
        open={open}
        onCancel={() => {
          setOpen(false)
          form.resetFields()
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onSubmit} className="pt-2">
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="user@example.com" />
          </Form.Item>
          <Form.Item label="Name" name="name" rules={[{ required: true, min: 2, max: 100 }]}>
            <Input placeholder="Full Name" />
          </Form.Item>
          <Form.Item label="Role" name="role" initialValue="candidate">
            <Select
              options={[
                { value: 'candidate', label: 'Candidate' },
                { value: 'mentor', label: 'Mentor' },
              ]}
            />
          </Form.Item>
          <Form.Item className="!mb-0">
            <Space className="w-full justify-end">
              <Button
                onClick={() => {
                  setOpen(false)
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
    </div>
  )
}
