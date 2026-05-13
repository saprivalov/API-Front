import { useEffect } from 'react'
import { Modal, Form, Input, Button, Space, Avatar, Typography, message } from 'antd'
import { useUpdateMeMutation } from '../api/users.api'
import type { MeUser } from '../schemas/user.schemas'

const { Text } = Typography

type ProfileFormValues = {
  name: string
  avatar?: string
}

type ProfileModalProps = {
  open: boolean
  onClose: () => void
  user: MeUser
}

export default function ProfileModal({ open, onClose, user }: ProfileModalProps) {
  const [form] = Form.useForm<ProfileFormValues>()
  const [updateMe, { isLoading }] = useUpdateMeMutation()

  const watchedName = Form.useWatch('name', form)
  const watchedAvatar = Form.useWatch('avatar', form)

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        name: user.name,
        avatar: user.avatar ?? '',
      })
    }
  }, [open, user, form])

  const previewInitial = (watchedName?.trim() || user.name || user.email).slice(0, 1).toUpperCase()
  const previewSrc = watchedAvatar?.trim() || undefined

  const handleSubmit = async (values: ProfileFormValues) => {
    const trimmedAvatar = values.avatar?.trim() ?? ''
    const result = await updateMe({
      name: values.name.trim(),
      avatar: trimmedAvatar.length > 0 ? trimmedAvatar : null,
    })
    if ('data' in result) {
      message.success('Profile saved')
      onClose()
    } else {
      message.error('Could not save profile')
    }
  }

  return (
    <Modal title="Profile" open={open} onCancel={onClose} footer={null} destroyOnClose width={440}>
      <Form form={form} layout="vertical" onFinish={handleSubmit} className="pt-2">
        <div className="flex justify-center mb-2">
          <Avatar
            size={72}
            src={previewSrc}
            className="bg-purple-100 text-purple-700 text-2xl shrink-0"
          >
            {previewInitial}
          </Avatar>
        </div>
        <Form.Item label="Display name" name="name" rules={[{ required: true, min: 2, max: 100 }]}>
          <Input placeholder="Your name" />
        </Form.Item>
        <Form.Item
          label="Avatar URL"
          name="avatar"
          rules={[
            {
              validator: async (_, value: string | undefined) => {
                const v = value?.trim() ?? ''
                if (!v) return
                try {
                  new URL(v)
                } catch {
                  throw new Error('Enter a valid URL')
                }
              },
            },
          ]}
        >
          <Input placeholder="https://…" allowClear />
        </Form.Item>
        <Text type="secondary" className="block mb-4 text-xs">
          Leave avatar URL empty to show initials in the header.
        </Text>
        <Form.Item className="!mb-0">
          <Space className="w-full justify-end">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Save
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}
