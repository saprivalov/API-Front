import { Button, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  RocketOutlined,
  CodeOutlined,
  BranchesOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

const features = [
  {
    icon: <ThunderboltOutlined className="text-3xl text-purple-500" />,
    title: 'Describe, not code',
    description: 'Write a task in plain language. AI agents handle the implementation.',
  },
  {
    icon: <BranchesOutlined className="text-3xl text-purple-500" />,
    title: 'Automatic pull requests',
    description: 'Every task becomes a branch, a commit, and a PR — ready for review.',
  },
  {
    icon: <CodeOutlined className="text-3xl text-purple-500" />,
    title: 'Real code, real stack',
    description: 'Agents work inside your actual repo using your linters, tests, and CI.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-100 dark:border-gray-800">
        <Text strong className="text-lg !text-purple-600">
          Vibe Coding
        </Text>
        <Button type="primary" onClick={() => navigate('/app')}>
          Launch App
        </Button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-24">
        <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <RocketOutlined />
          AI-powered development
        </div>

        <Title className="!text-5xl !font-bold !mb-4 !leading-tight dark:!text-white">
          Ship features with
          <br />
          <span className="text-purple-600">AI agents, not keyboards</span>
        </Title>

        <Paragraph className="text-lg !text-gray-500 dark:!text-gray-400 max-w-xl mb-10">
          Assign tasks to specialized AI agents. They write the code, run the tests, open pull
          requests — and notify you when it's done.
        </Paragraph>

        <div className="flex gap-3">
          <Button type="primary" size="large" onClick={() => navigate('/app')}>
            Get started
          </Button>
          <Button size="large" href="https://github.com/saprivalov/API-Front" target="_blank">
            View on GitHub
          </Button>
        </div>
      </main>

      {/* Features */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 flex flex-col gap-3"
            >
              {f.icon}
              <Text strong className="text-base dark:!text-white">
                {f.title}
              </Text>
              <Text type="secondary" className="text-sm">
                {f.description}
              </Text>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-gray-100 dark:border-gray-800">
        <Text type="secondary" className="text-sm">
          Built with Claude · The Orchestra of Agents
        </Text>
      </footer>
    </div>
  )
}
