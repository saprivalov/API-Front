import { Layout, Tabs, Button, Tag, Typography, Space } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { clearTokens } from '../store/auth.slice'
import { useAuth } from '../hooks/useAuth'
// import InterviewTasksTab from '../components/InterviewTasksTab' // temporarily hidden
import UsersTab from '../components/UsersTab'
// import SubmissionsTab from '../components/SubmissionsTab' // temporarily hidden
import AgentTasksTab from '../components/AgentTasksTab'
import ApiKeysTab from '../components/ApiKeysTab'

const { Header, Content } = Layout
const { Text } = Typography

export default function DashboardPage() {
  const dispatch = useDispatch()
  const auth = useAuth()
  const isMentor = auth?.role === 'mentor'

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
        <Space>
          <UserOutlined className="text-gray-500" />
          <Text type="secondary" className="text-sm">
            {auth?.userId?.slice(0, 8)}
          </Text>
          <Tag color={isMentor ? 'purple' : 'blue'}>{auth?.role}</Tag>
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
    </Layout>
  )
}
