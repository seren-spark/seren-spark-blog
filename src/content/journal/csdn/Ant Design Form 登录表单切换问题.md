---
title: "Ant Design Form 登录表单切换问题"
description: "分析条件渲染导致表单实例丢失的问题，并给出更稳定的切换方式。"
type: journal
occurredAt: 2025-08-16
publishedAt: 2025-08-16
tags:
  - React
sourceUrl: https://blog.csdn.net/HBR666_/article/details/150442168
sourceName: CSDN
relatedDocs: []
---

在写登录表单时，使用的是密码登录和验证码登录两种  那么我本来是想使用一个isPassword 变量  使用三元运算符进行表单的切换 如图

```typescript
 {isPassword ? (
              <>
                <div style={{ marginBottom: '20px' }}>密码登录</div>
                <Form name="passwordLogin" size="large" form={passwordForm}>
                  <Form.Item
                    name="email"
                    // className="userName"
                    rules={[{ required: true, message: '请输入用户名!' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="用户名" />
                  </Form.Item>
                  <Form.Item
                    name="pwd"
                    rules={[
                      { required: true, message: '请输入密码!' },
                      { min: 6, message: '密码至少6位字符!' },
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined />}
                      type="password"
                      placeholder="密码"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Flex justify="space-between" align="center">
                      <Form.Item
                        name="remember"
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>记住密码</Checkbox>
                      </Form.Item>
                      <Button type="link" onClick={handleForgotPassword}>
                        忘记密码
                      </Button>
                    </Flex>
                  </Form.Item>

                  <Form.Item>
                    <Button block type="primary" onClick={handlePasswordLogin}>
                      登录/注册
                    </Button>
                  </Form.Item>
                </Form>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '20px' }}>验证码登录</div>
                <Form
                  name="codeLogin"
                  size="large"
                  form={codeForm}
                  autoComplete="off"
                >
                  <Form.Item
                    name="email"
                    className="email"
                    rules={[
                      { required: true, message: '邮箱不能为空' },
                      { type: 'email', message: '请输入正确的邮箱格式!' },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="邮箱地址"
                      autoComplete="off"
                    />
                  </Form.Item>
                  <Form.Item
                    name="code"
                    rules={[
                      { required: true, message: '请输入验证码!' },
                      { len: 6, message: '验证码应为6位数字!' },
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined />}
                      type="text"
                      placeholder="6位验证码"
                      autoComplete="off"
                      maxLength={6}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Flex justify="space-between" align="center">
                      <Form.Item
                        name="remember"
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>记住登录状态</Checkbox>
                      </Form.Item>
                      <Button
                        type="link"
                        onClick={handleSendCode}
                        disabled={countdown > 0}
                      >
                        {countdown > 0 ? `${countdown}s后重发` : '发送验证码'}
                      </Button>
                    </Flex>
                  </Form.Item>

                  <Form.Item>
                    <Button block type="primary" onClick={handleCodeLogin}>
                      登录/注册
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}
```

但是会遇到一个问题，那就是单独写验证码登录的时候没有问题 但是一旦使用条件 渲染密码登录和验证码登录 使用验证码登录时 发送验证码获取不到表单信息 并且还会报错`Warning: Instance created by useForm is not connected to any Form element. Forget to pass form prop?`

**敲重点**：***这个问题的根本原因是条件渲染导致的表单实例重新创建和DOM元素的销毁/重建。***

> 当使用条件渲染在两个登录之间切换时
>1. DOM 元素完全重新创建， 整个表单组件都会被销毁重建
>2. 表单实例状态丢失
>3. 字段注册失效

解决方法很简单 就是使用样式进行控制，这样可以保持DOM结构稳定，表单元素始终存在，且避免了频繁的DOM创建和销毁

**时机分析**
当isPassword 从true 变为false 时
   1.React 销毁密码登录的`<Form>`组件
   2. codeForm 实例失去DOM的连接（触发警告）
   3. React 创建验证码登录的`<Form>`组件
   4. codeForm重新连接到新的`<Form>` DOM

*为什么会出现 "not connected" 警告*
在步骤2和步骤4之间存在一个时间窗口，此时 codeForm 暂时失去连接。

---

[查看 CSDN 原文](https://blog.csdn.net/HBR666_/article/details/150442168)
