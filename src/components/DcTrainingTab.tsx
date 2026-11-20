import { useState } from 'react'
import { Card, Checkbox, Progress, Space, Tag, Typography } from 'antd'

import { STORAGE_KEY, trainingModules } from './dcTraining.data'

const { Title, Text } = Typography

function loadCompleted(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []
  } catch {
    return []
  }
}

function saveCompleted(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // storage unavailable — progress just won't persist
  }
}

export default function DcTrainingTab() {
  const [completed, setCompleted] = useState<string[]>(loadCompleted)

  const total = trainingModules.reduce((sum, m) => sum + m.tasks.length, 0)
  const percent = total ? Math.round((completed.length / total) * 100) : 0

  const toggle = (id: string, checked: boolean) => {
    const next = checked ? [...completed, id] : completed.filter((c) => c !== id)
    setCompleted(next)
    saveCompleted(next)
  }

  return (
    <Space direction="vertical" size="large" className="w-full">
      <div>
        <Title level={4} className="!mb-1">
          Data center training course
        </Title>
        <Text type="secondary">
          {completed.length} of {total} tasks done
        </Text>
        <Progress percent={percent} aria-label="Course progress" />
      </div>

      {trainingModules.map((module) => {
        const done = module.tasks.filter((t) => completed.includes(t.id)).length
        return (
          <Card
            key={module.id}
            size="small"
            title={module.title}
            extra={
              <Tag color={done === module.tasks.length ? 'green' : 'default'}>
                {done}/{module.tasks.length}
              </Tag>
            }
          >
            <Space direction="vertical">
              {module.tasks.map((task) => (
                <Checkbox
                  key={task.id}
                  checked={completed.includes(task.id)}
                  onChange={(e) => toggle(task.id, e.target.checked)}
                >
                  {task.title}
                </Checkbox>
              ))}
            </Space>
          </Card>
        )
      })}
    </Space>
  )
}
