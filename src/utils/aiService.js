import axios from 'axios'

// ===========================================
// AI 大模型配置
// ===========================================
const aiApiKey = import.meta.env.VITE_AI_API_KEY || ''
const aiApiUrl = import.meta.env.VITE_AI_API_URL || 'https://api.siliconflow.cn/v1/chat/completions'
const aiModel = import.meta.env.VITE_AI_MODEL || 'deepseek-ai/DeepSeek-V3'

const isConfigured = !!aiApiKey && aiApiKey !== 'your-siliconflow-api-key'

console.log('AI服务配置:', { model: aiModel, configured: isConfigured })

export const aiService = {
  /** 基础对话（非流式） */
  async chat(messages) {
    if (!isConfigured) return this.mockResponse(messages)
    try {
      const response = await axios.post(aiApiUrl, {
        model: aiModel, messages, max_tokens: 2048, temperature: 0.7, stream: false
      }, {
        headers: { 'Authorization': `Bearer ${aiApiKey}`, 'Content-Type': 'application/json' },
        timeout: 60000
      })
      return response.data.choices[0].message.content
    } catch (error) {
      console.error('AI API调用失败:', error.message)
      return this.mockResponse(messages)
    }
  },

  /** 流式对话 - 使用 fetch + SSE 解析 */
  async chatStream(messages, onChunk) {
    if (!isConfigured) {
      const mockText = this.mockResponse(messages)
      // 模拟流式输出
      for (let i = 0; i < mockText.length; i += 3) {
        onChunk(mockText.slice(i, i + 3))
        await new Promise(r => setTimeout(r, 30))
      }
      return mockText
    }

    try {
      const response = await fetch(aiApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${aiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: aiModel,
          messages,
          max_tokens: 2048,
          temperature: 0.7,
          stream: true
        })
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue
            try {
              const json = JSON.parse(data)
              const delta = json.choices?.[0]?.delta?.content
              if (delta) {
                fullText += delta
                onChunk(delta)
              }
            } catch { /* skip malformed JSON */ }
          }
        }
      }
      return fullText
    } catch (error) {
      console.error('流式AI调用失败:', error.message)
      return this.chat(messages) // fallback to non-streaming
    }
  },

  mockResponse(messages) {
    const lastMessage = messages[messages.length - 1]
    const content = lastMessage?.content || ''

    if (content.includes('简历') || content.includes('resume')) {
      return JSON.stringify({
        name: '示例用户', education: '本科', major: '计算机科学与技术',
        experience: ['前端开发实习'], projects: ['校园管理系统'],
        skills: ['Vue', 'JavaScript', 'Python'], intent: '前端开发工程师'
      })
    }
    if (content.includes('匹配') || content.includes('match')) {
      return JSON.stringify({
        matches: [
          { job_id: '1', score: 85, highlights: ['技能匹配', '专业对口'], weaknesses: ['经验不足'] },
          { job_id: '2', score: 72, highlights: ['基础扎实'], weaknesses: ['缺少项目经验'] }
        ]
      })
    }
    if (content.includes('诊断') || content.includes('diagnose')) {
      return JSON.stringify({
        score: 78, meetItems: ['学历符合', '技能匹配'], missingItems: ['缺少大厂实习', '项目描述不详细'],
        redundantItems: ['个人爱好过长'], suggestions: ['用STAR法则描述项目', '突出技术栈', '量化成果']
      })
    }
    return '感谢您的咨询！作为AI职业规划顾问，我建议：\n\n1. 明确职业兴趣和优势\n2. 根据目标岗位提升技能\n3. 积累项目经验并优化简历\n4. 多参与面试积累经验\n\n请问您对哪个方向比较感兴趣？'
  },

  async analyzeResume(text) {
    const prompt = `分析以下简历提取结构化信息（JSON格式）：\n${text}\n\n输出JSON：{"name":"姓名","education":"学历","major":"专业","experience":["实习经历"],"projects":["项目"],"skills":["技能"],"intent":"求职意向","summary":"简介"}`
    return this.chat([{ role: 'user', content: prompt }])
  },

  async matchJobs(resumeData, jobs) {
    const prompt = `根据简历从岗位列表智能匹配（0-100分），输出JSON：\n简历：${JSON.stringify(resumeData)}\n岗位：${JSON.stringify(jobs)}\n\n输出格式：{"matches":[{"job_id":"ID","score":85,"highlights":["亮点"],"weaknesses":["短板"]}]}`
    return this.chat([{ role: 'user', content: prompt }])
  },

  async diagnoseResume(resumeText, jdText) {
    const prompt = `请对标JD对简历进行诊断分析：\n\nJD内容：\n${jdText}\n\n简历内容：\n${resumeText}\n\n请输出JSON格式：{"score":80,"meetItems":["达标项"],"missingItems":["缺失项"],"redundantItems":["冗余项"],"suggestions":["建议1","建议2"]}\n注意：score必须真实反映两者匹配度，乱码/不相关内容得分应<20`
    return this.chat([{ role: 'user', content: prompt }])
  },

  async optimizeResume(resumeText, jdText) {
    const prompt = `请根据JD优化简历内容，按STAR法则重写经历部分：\n\nJD：${jdText}\n\n原始简历：${resumeText}\n\n输出优化后的完整简历文本（Markdown格式）。`
    return this.chat([{ role: 'user', content: prompt }])
  },

  async careerConsultation(history, userInput) {
    const systemPrompt = {
      role: 'system',
      content: '你是专业的职业规划咨询师，擅长帮应届生梳理方向、解答求职疑惑。请用友好专业的语气回答，适当使用表情符号。'
    }
    const messages = [systemPrompt, ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content })), { role: 'user', content: userInput }]
    return this.chat(messages)
  },

  getConfigStatus() {
    return { configured: isConfigured, model: aiModel }
  }
}
