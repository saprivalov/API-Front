import { useState } from 'react'
import { Layout, Tabs, Button, Tag, Typography, Space, Avatar, Spin } from 'antd'
import { LogoutOutlined, UserOutlined, EditOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { clearTokens } from '../store/auth.slice'
import { useAuth } from '../hooks/useAuth'
import { useGetMeQuery } from '../api/users.api'
import ProfileModal from '../components/ProfileModal'
// import InterviewTasksTab from '../components/InterviewTasksTab' // temporarily hidden
import UsersTab from '../components/UsersTab'
// import SubmissionsTab from '../components/SubmissionsTab' // temporarily hidden
import AgentTasksTab from '../components/AgentTasksTab'
import ApiKeysTab from '../components/ApiKeysTab'

const { Header, Content } = Layout
const { Text } = Typography

const roleTagColor: Record<string, string> = {
  mentor: 'purple',
  candidate: 'blue',
  robot: 'cyan',
}

export default function DashboardPage() {
  const dispatch = useDispatch()
  const auth = useAuth()
  const isMentor = auth?.role === 'mentor'
  const [profileOpen, setProfileOpen] = useState(false)
  const { data: meData, isLoading: meLoading, isError: meError } = useGetMeQuery()
  const me = meData?.data

  const tabs = [
    // temporarily hidden — see task "Скрыть Interview Tasks и Submitions блоки"
    // {
    //   key: 'tasks',
    //   label: 'Interview Tasks',
    //   children: <InterviewTasksTab />,
    // },
    // {
    //   key: 'submissions',
    //   label: 'Submissions',
    //   children: <SubmissionsTab />,
    // },
    {
      key: 'agent-tasks',
      label: 'Agent Tasks',
      children: <AgentTasksTab />,
    },
    ...(isMentor
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
  ]

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Header className="flex items-center justify-between px-6 !bg-white border-b border-gray-200 shadow-sm">
        <Text strong className="text-lg !text-purple-600">
          The Orchestra of Agents
        </Text>
        <Space align="center" size="middle" wrap>
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
          <Button icon={<LogoutOutlined />} onClick={() => dispatch(clearTokens())} size="small">
            Logout
          </Button>
        </Space>
      </Header>

      <Content className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Tabs defaultActiveKey="agent-tasks" items={tabs} />
        </div>
      </Content>

      {me && <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} user={me} />}
    </Layout>
  )
}
