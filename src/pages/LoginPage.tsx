import { useState } from 'react'
import { Form, Input, Button, Card, Alert, Typography, Select, Divider } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { useLoginMutation, useRegisterMutation } from '../api/auth.api'
import { setTokens } from '../store/auth.slice'
import type { LoginBody, RegisterBody } from '../schemas/auth.schemas'

const { Title, Text } = Typography

type Mode = 'login' | 'register'

export default function LoginPage() {
  const dispatch = useDispatch()
  const [mode, setMode] = useState<Mode>('login')
  const [loginForm] = Form.useForm<LoginBody>()
  const [registerForm] = Form.useForm<RegisterBody>()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [login, { isLoading: isLoginLoading }] = useLoginMutation()
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation()

  const isLoading = isLoginLoading || isRegisterLoading

  const switchMode = (next: Mode) => {
    setMode(next)
    setErrorMsg(null)
    loginForm.resetFields()
    registerForm.resetFields()
  }

  const extractErrorMessage = (err: unknown): string => {
    if (err && typeof err === 'object' && 'data' in err) {
      const data = (err as { data?: { message?: string } }).data
      if (data?.message) return data.message
    }
    return 'Something went wrong. Please try again.'
  }

  const onLogin = async (values: LoginBody) => {
    setErrorMsg(null)
    const result = await login(values)
    if ('error' in result) {
      setErrorMsg(extractErrorMessage(result.error))
      return
    }
    dispatch(setTokens(result.data.data))
  }

  const onRegister = async (values: RegisterBody) => {
    setErrorMsg(null)
    const result = await register(values)
    if ('error' in result) {
      setErrorMsg(extractErrorMessage(result.error))
      return
    }
    dispatch(setTokens(result.data.data))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <Title level={2} className="!mb-1">Interview Platform</Title>
          <Text type="secondary">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </Text>
        </div>

        <Card className="shadow-md">
          {errorMsg && (
            <Alert
              type="error"
              message={errorMsg}
              showIcon
              className="mb-4"
              closable
              onClose={() => setErrorMsg(null)}
            />
          )}

          {mode === 'login' ? (
            <Form form={loginForm} layout="vertical" onFinish={onLogin} requiredMark={false}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Invalid email format' },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="you@example.com"
                  size="large"
                  autoComplete="email"
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Password"
                  size="large"
                  autoComplete="current-password"
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
          ) : (
            <Form form={registerForm} layout="vertical" onFinish={onRegister} requiredMark={false}>
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: 'Please enter your name' },
                  { min: 2, message: 'At least 2 characters' },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Your full name"
                  size="large"
                  autoComplete="name"
                />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Invalid email format' },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="you@example.com"
                  size="large"
                  autoComplete="email"
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please enter a password' },
                  { min: 8, message: 'At least 8 characters' },
                  {
                    pattern: /[A-Za-z]/,
                    message: 'Must include a letter',
                  },
                  {
                    pattern: /[0-9]/,
                    message: 'Must include a digit',
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Min 8 chars, 1 letter, 1 digit"
                  size="large"
                  autoComplete="new-password"
                />
              </Form.Item>
              <Form.Item
                label="Role"
                name="role"
                initialValue="candidate"
                rules={[{ required: true }]}
              >
                <Select size="large">
                  <Select.Option value="candidate">Candidate</Select.Option>
                  <Select.Option value="mentor">Mentor</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item className="!mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  block
                  size="large"
                >
                  Create Account
                </Button>
              </Form.Item>
            </Form>
          )}

          <Divider className="!my-4" />

          {mode === 'login' ? (
            <div className="text-center">
              <Text type="secondary">Don't have an account? </Text>
              <Button type="link" className="!p-0" onClick={() => switchMode('register')}>
                Create one
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Text type="secondary">Already have an account? </Text>
              <Button type="link" className="!p-0" onClick={() => switchMode('login')}>
                Sign in
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
