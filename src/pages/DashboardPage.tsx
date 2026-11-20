import { useState } from 'react'
import {
  Layout,
  Tabs,
  Button,
  Tag,
  Typography,
  Space,
  Avatar,
  Spin,
  Select,
  Modal,
  Empty,
} from 'antd'
import {
  LogoutOutlined,
  UserOutlined,
  EditOutlined,
  MoonOutlined,
  SunOutlined,
  ProjectOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { clearTokens } from '../store/auth.slice'
import { toggleTheme } from '../store/theme.slice'
import { setSelectedProject } from '../store/project.slice'
import type { RootState } from '../store'
import { useAuth } from '../hooks/useAuth'
import { useGetMeQuery } from '../api/users.api'
import { useGetProjectsQuery } from '../api/projects.api'
import ProfileModal from '../components/ProfileModal'
import UsersTab from '../components/UsersTab'
import AgentTasksTab from '../components/AgentTasksTab'
import ApiKeysTab from '../components/ApiKeysTab'
import ProjectsTab from '../components/ProjectsTab'
import DcTrainingTab from '../components/DcTrainingTab'

const { Header, Content } = Layout
const { Text } = Typography

const roleTagColor: Record<string, string> = {
  admin: 'red',
  mentor: 'purple',
  candidate: 'green',
  robot: 'cyan',
}

export default function DashboardPage() {
  const dispatch = useDispatch()
  const isDark = useSelector((state: RootState) => state.theme.isDark)
  const selectedProjectId = useSelector((state: RootState) => state.project.selectedProjectId)
  const auth = useAuth()
  const isMentor = auth?.role === 'mentor'
  const isAdmin = auth?.role === 'admin'
  const [profileOpen, setProfileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { data: meData, isLoading: meLoading, isError: meError } = useGetMeQuery()
  const { data: projectsData } = useGetProjectsQuery()
  const me = meData?.data

  const projectOptions = [
    { value: '', label: 'All projects' },
    ...(projectsData?.data ?? []).map((p) => ({ value: p.id, label: p.name })),
  ]

  const tabs = [
    {
      key: 'agent-tasks',
      label: 'Agent Tasks',
      children: <AgentTasksTab />,
    },
    {
      key: 'dc-training',
      label: 'DC Training',
      children: <DcTrainingTab />,
    },
    ...(isMentor || isAdmin
      ? [
          {
            key: 'users',
            label: 'Users',
            children: <UsersTab />,
          },
          {
            key: 'api-keys',
            label: 'API Keys',
            children: <ApiKeysTab />,
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            key: 'projects',
            label: 'Projects',
            children: <ProjectsTab />,
          },
        ]
      : []),
  ]

  return (
    <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header className="flex items-center justify-between px-6 !bg-white dark:!bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <Text strong className="text-lg !text-purple-600 shrink-0">
          The Orchestra of Agents
        </Text>
        <Space align="center" size="middle" wrap>
          <Space size={6}>
            <ProjectOutlined className="text-gray-400" />
            <Select
              size="small"
              value={selectedProjectId ?? ''}
              options={projectOptions}
              onChange={(value) => dispatch(setSelectedProject(value || null))}
              className="w-40"
              variant="borderless"
            />
          </Space>
          {meLoading ? (
            <Spin size="small" />
          ) : meError ? (
            <>
              <UserOutlined className="text-gray-500" />
              <Text type="secondary" className="text-sm">
                {auth?.userId?.slice(0, 8)}
              </Text>
              <Text type="danger" className="text-xs">
                Profile unavailable
              </Text>
            </>
          ) : (
            <>
              <Avatar
                src={me?.avatar ?? undefined}
                size={36}
                className="bg-purple-100 text-purple-700 shrink-0"
              >
                {(me?.name ?? '').trim().slice(0, 1).toUpperCase() || <UserOutlined />}
              </Avatar>
              <div className="flex flex-col items-start min-w-0 max-w-[200px]">
                <Text strong className="text-sm truncate w-full">
                  {me?.name}
                </Text>
                <Text type="secondary" className="text-xs truncate w-full">
                  {me?.email}
                </Text>
              </div>
              <Button
                type="default"
                size="small"
                icon={<EditOutlined />}
                onClick={() => setProfileOpen(true)}
              >
                Edit
              </Button>
            </>
          )}
          <Tag color={auth?.role ? (roleTagColor[auth.role] ?? 'default') : 'default'}>
            {auth?.role}
          </Tag>
          <Button
            icon={<SettingOutlined />}
            onClick={() => setSettingsOpen(true)}
            size="small"
            aria-label="Settings"
          />
          <Button
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={() => dispatch(toggleTheme())}
            size="small"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          />
          <Button icon={<LogoutOutlined />} onClick={() => dispatch(clearTokens())} size="small">
            Logout
          </Button>
        </Space>
      </Header>

      <Content className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <Tabs defaultActiveKey="agent-tasks" items={tabs} />
        </div>
      </Content>

      {me && <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} user={me} />}

      <Modal
        title="Settings"
        open={settingsOpen}
        onCancel={() => setSettingsOpen(false)}
        footer={null}
      >
        <Empty description="Coming soon" />
      </Modal>
    </Layout>
  )
}
