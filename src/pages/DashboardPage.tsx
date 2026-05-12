import { Layout, Tabs, Button, Tag, Typography, Space } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { clearTokens } from '../store/auth.slice'
import { useAuth } from '../hooks/useAuth'
import InterviewTasksTab from '../components/InterviewTasksTab'
import UsersTab from '../components/UsersTab'
import SubmissionsTab from '../components/SubmissionsTab'

const { Header, Content } = Layout
const { Text } = Typography

export default function DashboardPage() {
  const dispatch = useDispatch()
  const auth = useAuth()
  const isMentor = auth?.role === 'mentor'

  const tabs = [
    {
      key: 'tasks',
      label: 'Interview Tasks',
      children: <InterviewTasksTab />,
    },
    {
      key: 'submissions',
      label: 'Submissions',
      children: <SubmissionsTab />,
    },
    ...(isMentor ? [{
      key: 'users',
      label: 'Users',
      children: <UsersTab />,
    }] : []),
  ]

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Header className="flex items-center justify-between px-6 !bg-white border-b border-gray-200 shadow-sm">
        <Text strong className="text-lg">Interview Platform</Text>
        <Space>
          <UserOutlined className="text-gray-500" />
          <Text type="secondary" className="text-sm">{auth?.userId?.slice(0, 8)}</Text>
          <Tag color={isMentor ? 'purple' : 'blue'}>{auth?.role}</Tag>
          <Button
            icon={<LogoutOutlined />}
            onClick={() => dispatch(clearTokens())}
            size="small"
          >
            Logout
          </Button>
        </Space>
      </Header>

      <Content className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Tabs defaultActiveKey="tasks" items={tabs} />
        </div>
      </Content>
    </Layout>
  )
}
