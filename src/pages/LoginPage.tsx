import { Form, Input, Button, Card, Alert, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '../api/auth.api'
import { setTokens } from '../store/auth.slice'
import type { LoginBody } from '../schemas/auth.schemas'

const { Title, Text } = Typography

export default function LoginPage() {
  const dispatch = useDispatch()
  const [login, { isLoading, error }] = useLoginMutation()

  const onFinish = async (values: LoginBody) => {
    const result = await login(values)
    if ('data' in result && result.data) {
      dispatch(setTokens(result.data.data))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <Title level={2} className="!mb-1">Interview Platform</Title>
          <Text type="secondary">Enter your email to sign in</Text>
        </div>

        <Card className="shadow-md">
          {error && (
            <Alert
              type="error"
              message="Invalid credentials"
              showIcon
              className="mb-4"
            />
          )}
          <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Invalid email format' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="you@example.com"
                size="large"
              />
            </Form.Item>
            <Form.Item className="!mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="large"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  )
}
