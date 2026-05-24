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
} from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from '../api/projects.api'
import type { Project, CreateProjectBody } from '../schemas/project.schemas'

const { Text } = Typography

type FormValues = CreateProjectBody

export default function ProjectsTab() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [form] = Form.useForm<FormValues>()

  const { data, isLoading, error } = useGetProjectsQuery()
  const [createProject, { isLoading: creating }] = useCreateProjectMutation()
  const [updateProject, { isLoading: updating }] = useUpdateProjectMutation()
  const [deleteProject] = useDeleteProjectMutation()

  const openCreate = () => {
    form.resetFields()
    form.setFieldValue('baseBranch', 'main')
    setCreateOpen(true)
  }

  const openEdit = (project: Project) => {
    form.setFieldsValue({
      name: project.name,
      description: project.description ?? undefined,
      repoPath: project.repoPath,
      baseBranch: project.baseBranch,
    })
    setEditProject(project)
  }

  const closeModal = () => {
    setCreateOpen(false)
    setEditProject(null)
    form.resetFields()
  }

  const onSubmit = async (values: FormValues) => {
    if (editProject) {
      const result = await updateProject({ id: editProject.id, ...values })
      if ('data' in result) closeModal()
    } else {
      const result = await createProject(values)
      if ('data' in result) closeModal()
    }
  }

  const columns: ColumnsType<Project> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (desc) =>
        desc ? <Text type="secondary">{desc}</Text> : <Text type="secondary">—</Text>,
    },
    {
      title: 'Repo path',
      dataIndex: 'repoPath',
      key: 'repoPath',
      render: (path) => (
        <Text code className="text-xs">
          {path}
        </Text>
      ),
    },
    {
      title: 'Base branch',
      dataIndex: 'baseBranch',
      key: 'baseBranch',
      width: 120,
      render: (branch) => (
        <Text code className="text-xs">
          {branch}
        </Text>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: '',
      key: 'actions',
      width: 90,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Delete this project?"
            description="Existing tasks will keep their data but lose the project link."
            onConfirm={() => deleteProject(record.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button size="small" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          New Project
        </Button>
      </div>

      {error && <Alert type="error" message="Failed to load projects" className="mb-4" showIcon />}

      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="id"
        loading={isLoading}
        size="middle"
        pagination={false}
      />

      <Modal
        title={editProject ? 'Edit Project' : 'New Project'}
        open={createOpen || !!editProject}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onSubmit} className="pt-2">
          <Form.Item label="Name" name="name" rules={[{ required: true, min: 1, max: 100 }]}>
            <Input placeholder="saas-app" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input placeholder="Optional short description" />
          </Form.Item>
          <Form.Item label="Repo path" name="repoPath" rules={[{ required: true }]}>
            <Input placeholder="/Users/johnmcclane/projects/saas-app" />
          </Form.Item>
          <Form.Item label="Base branch" name="baseBranch" rules={[{ required: true }]}>
            <Input placeholder="main" />
          </Form.Item>
          <Form.Item className="!mb-0">
            <Space className="w-full justify-end">
              <Button onClick={closeModal}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={creating || updating}>
                {editProject ? 'Save' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
