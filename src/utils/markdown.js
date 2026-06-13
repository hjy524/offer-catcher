/**
 * 通用 Markdown 转 HTML 格式化工具
 * 支持：标题、粗体、斜体、代码块、行内代码、列表、链接
 */

export function formatMarkdown(content) {
  if (!content) return ''

  // 归一化换行符
  let html = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // 1. 处理代码块（先处理，避免内部被转义）
  const codeBlocks = []
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`
    codeBlocks.push(`<pre style="background:#f8fafc;color:#334155;padding:16px;border-radius:8px;overflow-x:auto;font-family:'Consolas','Monaco',monospace;font-size:13px;margin:12px 0;line-height:1.5;border:1px solid #e2e8f0;"><code>${escapeHtml(code.trim())}</code></pre>`)
    return placeholder
  })

  // 2. 处理行内代码
  html = html.replace(/`([^`\n]+)`/g, '<code style="background:#f8fafc;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:13px;color:#334155;border:1px solid #e2e8f0;">$1</code>')

  // 3. 按行处理
  const lines = html.split('\n')
  const processed = []
  let inUl = false
  let inOl = false

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // 跳过代码块占位符
    if (line.includes('__CODE_BLOCK_')) {
      if (inUl) { processed.push('</ul>'); inUl = false }
      if (inOl) { processed.push('</ol>'); inOl = false }
      processed.push(line)
      continue
    }

    // 有序列表
    if (/^\s*\d+\.\s+/.test(line)) {
      if (!inOl) { processed.push('<ol style="margin:8px 0;padding-left:24px;">'); inOl = true }
      processed.push(`<li style="margin:4px 0;line-height:1.7;">${line.replace(/^\s*\d+\.\s+/, '')}</li>`)
      continue
    }

    // 无序列表
    if (/^\s*[-*+]\s+/.test(line)) {
      if (inOl) { processed.push('</ol>'); inOl = false }
      if (!inUl) { processed.push('<ul style="margin:8px 0;padding-left:24px;">'); inUl = true }
      processed.push(`<li style="margin:4px 0;line-height:1.7;">${line.replace(/^\s*[-*+]\s+/, '')}</li>`)
      continue
    }

    // 非列表行，关闭列表
    if (inUl) { processed.push('</ul>'); inUl = false }
    if (inOl) { processed.push('</ol>'); inOl = false }

    // 处理标题（从高到低匹配：#### → ### → ## → #）
    line = line.replace(/^#{4}\s*(.+)$/gm, '<h4 style="font-size:15px;font-weight:600;color:#334155;margin:12px 0 4px;">$1</h4>')
    line = line.replace(/^#{3}\s*(.+)$/gm, '<h3 style="font-size:16px;font-weight:600;color:#1e40af;margin:14px 0 6px;">$1</h3>')
    line = line.replace(/^#{2}\s*(.+)$/gm, '<h2 style="font-size:18px;font-weight:600;color:#1e293b;margin:16px 0 8px;">$1</h2>')
    line = line.replace(/^#{1}\s*(.+)$/gm, '<h1 style="font-size:22px;font-weight:700;color:#1e293b;margin:20px 0 10px;border-bottom:2px solid #3b82f6;padding-bottom:6px;">$1</h1>')

    processed.push(line)
  }

  if (inUl) processed.push('</ul>')
  if (inOl) processed.push('</ol>')

  html = processed.join('\n')

  // 4. 处理粗体和斜体
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:600;color:#1e293b;">$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // 5. 处理链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:#2563eb;text-decoration:underline;">$1</a>')

  // 6. 恢复代码块
  codeBlocks.forEach((block, idx) => {
    html = html.replace(`__CODE_BLOCK_${idx}__`, block)
  })

  // 7. 处理换行和段落
  // 按块级元素分段
  const blockElements = ['<h1', '<h2', '<h3', '<h4', '<pre', '<ul', '<ol', '</h1>', '</h2>', '</h3>', '</h4>', '</pre>', '</ul>', '</ol>']
  const segments = html.split('\n')
  const result = []
  let currentParagraph = []

  for (const seg of segments) {
    const isBlockStart = blockElements.some(b => seg.trimStart().startsWith(b))
    const isBlockEnd = blockElements.some(b => seg.trimEnd().endsWith(b))

    if (isBlockStart || isBlockEnd) {
      // 刷出当前段落
      if (currentParagraph.length) {
        const text = currentParagraph.join('<br>').trim()
        if (text) result.push(`<p style="margin:6px 0;line-height:1.7;">${text}</p>`)
        currentParagraph = []
      }
      result.push(seg)
    } else if (seg.trim() === '') {
      // 空行 = 段落分隔
      if (currentParagraph.length) {
        const text = currentParagraph.join('<br>').trim()
        if (text) result.push(`<p style="margin:6px 0;line-height:1.7;">${text}</p>`)
        currentParagraph = []
      }
    } else {
      currentParagraph.push(seg)
    }
  }
  if (currentParagraph.length) {
    const text = currentParagraph.join('<br>').trim()
    if (text) result.push(`<p style="margin:6px 0;line-height:1.7;">${text}</p>`)
  }

  html = result.join('')

  return html
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
