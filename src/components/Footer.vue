<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo">
            <span class="logo-icon">🎯</span>
            <span class="logo-text">Offer捕手</span>
          </div>
          <p class="footer-desc">AI驱动的求职成长平台，让每一位求职者都能找到理想工作</p>
          <p class="footer-desc-sub">由腾讯HR团队倾力打造，赋能校园招聘全流程</p>
        </div>

        <div class="footer-links">
          <div class="link-group">
            <h4>快速链接</h4>
            <ul>
              <li><router-link to="/">首页</router-link></li>
              <li><router-link to="/resume">简历创建</router-link></li>
              <li><router-link to="/job-match">岗位匹配</router-link></li>
              <li><router-link to="/ai-consult">AI咨询</router-link></li>
            </ul>
          </div>
          <div class="link-group">
            <h4>帮助支持</h4>
            <ul>
              <li><a @click.prevent="showGuide = true">使用指南</a></li>
              <li><a @click.prevent="showFAQ = true">常见问题</a></li>
              <li><a @click.prevent="showContact = true">联系我们</a></li>
            </ul>
          </div>
          <div class="link-group">
            <h4>关于我们</h4>
            <ul>
              <li><a @click.prevent="showAbout = true">产品介绍</a></li>
              <li><a @click.prevent="showPrivacy = true">隐私政策</a></li>
              <li><a @click.prevent="showTerms = true">服务条款</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2026 Offer捕手 版权所有 | 基于AI大模型技术构建 | 仅供学习参考使用</p>
      </div>
    </div>

    <!-- 使用指南弹窗 -->
    <el-dialog v-model="showGuide" title="📖 使用指南" width="650px">
      <div class="guide-content">
        <h4>🎯 快速开始</h4>
        <ol>
          <li><strong>注册登录</strong>：点击右上角"登录/注册"，输入用户名和密码即可。首次使用请先在"注册"标签页创建账户，已有账户请在"登录"标签页登录</li>
          <li><strong>创建简历</strong>：在"简历创建"页面，上传简历文件让AI自动解析，或使用在线表单制作简历</li>
          <li><strong>岗位匹配</strong>：在"岗位匹配"页面，根据城市、企业类型、岗位类型筛选合适的岗位</li>
          <li><strong>简历诊断</strong>：粘贴目标岗位的JD和你的简历，AI会进行智能对比并给出优化建议</li>
          <li><strong>AI咨询</strong>：有任何求职疑问，都可以在AI咨询板块与AI职业顾问对话</li>
          <li><strong>心路日志</strong>：用Flomo式的轻量记录方式，随时记录求职心得和心情</li>
          <li><strong>笔记社区</strong>：浏览和分享面试经验、简历技巧等求职笔记，与同行交流</li>
        </ol>

        <h4>💡 实用技巧</h4>
        <ul>
          <li>完善个人资料和职业标签，帮助AI更精准地理解你的需求</li>
          <li>使用简历诊断功能时，尽量粘贴完整的JD描述，诊断结果会更准确</li>
          <li>定期记录求职心得，通过日历看板回顾你的成长轨迹</li>
          <li>在AI咨询中，可以详细描述你的背景和困惑，AI会给出更有针对性的建议</li>
          <li>利用职业测评工具（MBTI、霍兰德、DISC）了解自己的职业倾向</li>
          <li>积极参与社区互动，分享你的经验也能帮助到其他求职者</li>
        </ul>

        <h4>🔄 功能特色</h4>
        <ul>
          <li><strong>安全认证</strong>：用户名+密码登录，密码采用SHA-256哈希加密存储，保护数据安全</li>
          <li><strong>AI驱动</strong>：所有智能功能均由大语言模型提供支持，7×24小时在线</li>
          <li><strong>数据安全</strong>：所有数据存储在本地浏览器，不会上传至第三方服务器</li>
          <li><strong>完全免费</strong>：全部功能免费使用，零门槛开启求职之旅</li>
        </ul>
      </div>
    </el-dialog>

    <!-- 常见问题弹窗 -->
    <el-dialog v-model="showFAQ" title="❓ 常见问题" width="650px">
      <div class="faq-content">
        <div class="faq-item">
          <h4>Q: 如何使用AI咨询功能？</h4>
          <p>A: 在AI咨询页面直接输入您的问题，AI助手会为您提供专业的求职建议。您还可以编辑右侧的"职业标签看板"，添加您的求职意向、技能方向和关注行业，帮助AI更好地理解您的需求并提供个性化建议。</p>
        </div>
        <div class="faq-item">
          <h4>Q: 简历诊断的原理是什么？</h4>
          <p>A: 系统使用AI大模型将您的简历与目标岗位JD进行深度对比分析，从技能匹配度、经验相关性、关键词覆盖率、表达规范性等多个维度给出诊断建议，并生成综合匹配评分。乱填内容的简历会得到较低的评分。</p>
        </div>
        <div class="faq-item">
          <h4>Q: 我的数据安全吗？</h4>
          <p>A: 所有个人数据（简历、日志、笔记、对话记录等）均存储在您浏览器的本地存储中，不会上传至任何服务器。AI对话仅在使用时发送必要的文本内容给AI服务，不会存储您的个人数据。您可以随时通过"导出数据"功能备份，或清除浏览器数据来删除。</p>
        </div>
        <div class="faq-item">
          <h4>Q: 如何获得更好的岗位匹配结果？</h4>
          <p>A: 建议您：1）完善简历信息，尤其是技能和求职意向；2）在AI咨询页面编辑职业标签；3）使用筛选功能缩小范围；4）收藏感兴趣的岗位以便后续跟进。</p>
        </div>
        <div class="faq-item">
          <h4>Q: 上传简历支持什么格式？</h4>
          <p>A: 目前支持纯文本（.txt）格式的简历上传和文本粘贴。PDF和Word文件由于浏览器限制可能无法直接解析，建议将简历内容复制粘贴到文本框中进行AI解析。</p>
        </div>
        <div class="faq-item">
          <h4>Q: 心路日志和社区笔记有什么区别？</h4>
          <p>A: 心路日志是您的私密记录，仅自己可见，适合记录个人心情和求职感悟；社区笔记是公开的，所有用户都可以浏览、点赞和评论，适合分享面经、技巧等有价值的内容。</p>
        </div>
        <div class="faq-item">
          <h4>Q: 为什么有时候AI回复比较慢？</h4>
          <p>A: AI服务由云端大模型提供支持，响应速度可能受网络状况和服务负载影响。如果长时间无响应，请检查网络连接后重试。</p>
        </div>
        <div class="faq-item">
          <h4>Q: 忘记密码怎么办？注册后能改密码吗？</h4>
          <p>A: 目前版本密码存储在本地浏览器中，暂不支持找回密码和修改密码功能。请在注册时牢记密码，建议使用容易记住但不易被猜测的密码组合。后续版本将支持邮箱找回功能。</p>
        </div>
        <div class="faq-item">
          <h4>Q: 换了浏览器或清除了缓存，数据还在吗？</h4>
          <p>A: 数据存储在浏览器本地存储中，换浏览器或清除缓存后数据会丢失。建议定期使用个人中心的"导出数据"功能进行备份。后续版本将接入云端数据库实现跨设备数据同步。</p>
        </div>
      </div>
    </el-dialog>

    <!-- 联系我们弹窗 -->
    <el-dialog v-model="showContact" title="📞 联系我们" width="550px">
      <div class="contact-content">
        <div class="contact-item">
          <span class="contact-icon">📧</span>
          <div>
            <h4>邮箱</h4>
            <p>support@offercatcher.cn</p>
          </div>
        </div>
        <div class="contact-item">
          <span class="contact-icon">💬</span>
          <div>
            <h4>微信公众号</h4>
            <p>Offer捕手（关注获取求职干货推送）</p>
          </div>
        </div>
        <div class="contact-item">
          <span class="contact-icon">🐦</span>
          <div>
            <h4>问题反馈</h4>
            <p>通过平台内AI咨询发送"我想反馈问题"即可</p>
          </div>
        </div>
        <div class="contact-item">
          <span class="contact-icon">📍</span>
          <div>
            <h4>团队地址</h4>
            <p>广东省深圳市南山区科技园腾讯大厦</p>
          </div>
        </div>
        <div class="contact-item">
          <span class="contact-icon">🕐</span>
          <div>
            <h4>服务时间</h4>
            <p>AI服务7×24小时在线 | 人工客服工作日 9:00-18:00</p>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 产品介绍弹窗 -->
    <el-dialog v-model="showAbout" title="🏢 产品介绍" width="650px">
      <div class="about-content">
        <div class="about-intro">
          <h3>关于 Offer捕手</h3>
          <p>Offer捕手是由腾讯HR团队孵化的AI求职智能匹配平台，专注于为在校大学生和应届毕业生提供一站式求职成长服务。我们运用前沿的大语言模型技术，将AI能力深度融入求职全流程，帮助求职者从职业规划到拿到Offer的每一步都更高效、更智能。</p>
        </div>
        <div class="about-features">
          <h4>🎯 核心功能</h4>
          <ul>
            <li>📄 <strong>智能简历</strong>：上传简历AI自动解析，或在线制作简历，支持多版本管理</li>
            <li>🎯 <strong>岗位匹配</strong>：基于职业画像的AI智能岗位推荐，多维度精准匹配</li>
            <li>📊 <strong>简历诊断</strong>：对标JD进行AI体检，从技能、经验、关键词等维度给出优化建议</li>
            <li>🤖 <strong>AI咨询</strong>：7×24小时AI职业顾问，配合MBTI/霍兰德/DISC测评辅助定位</li>
            <li>📝 <strong>心路日志</strong>：Flomo式轻量私密记录，日历看板回顾成长轨迹</li>
            <li>👥 <strong>社区笔记</strong>：小红书式公开笔记社区，面经分享、经验交流、互助成长</li>
          </ul>
        </div>
        <div class="about-tech">
          <h4>🔬 技术架构</h4>
          <p>前端基于 Vue 3 + Element Plus 构建，AI能力由硅基流动API（DeepSeek大模型）提供支持，数据层采用浏览器本地存储 + Supabase云端备份方案，部署于Cloudflare Pages全球CDN。所有AI功能均通过真实大模型API调用实现，确保诊断和咨询质量。</p>
        </div>
        <div class="about-vision">
          <h4>🚀 产品愿景</h4>
          <p>我们相信，AI技术能够打破求职信息差，让每一位求职者都能获得专业、精准的求职指导。Offer捕手致力于成为最懂求职者的AI伙伴，让找工作不再迷茫。</p>
        </div>
      </div>
    </el-dialog>

    <!-- 隐私政策弹窗 -->
    <el-dialog v-model="showPrivacy" title="🔒 隐私政策" width="650px">
      <div class="privacy-content">
        <p class="update-date">最后更新日期：2026年6月</p>

        <h4>一、数据收集与使用</h4>
        <p>我们高度重视您的个人隐私保护。当您使用Offer捕手时：</p>
        <ul>
          <li>所有个人数据（简历、日志、笔记、对话记录等）均存储在您浏览器的本地存储（localStorage）中</li>
          <li>我们不会将您的简历、日志、笔记等个人信息上传至任何服务器存储</li>
          <li>AI对话功能在使用时会将您输入的问题发送至AI服务接口，但对话内容不会被用于训练或改进AI模型</li>
          <li>我们不会收集您的手机号、邮箱等敏感个人信息</li>
          <li>登录仅需用户名，不关联任何真实身份信息</li>
        </ul>

        <h4>二、本地存储说明</h4>
        <p>我们使用浏览器的localStorage存储以下数据，以便为您提供持续的服务体验：</p>
        <ul>
          <li>用户登录状态和偏好设置</li>
          <li>简历数据、心路日志、社区笔记等用户生成内容</li>
          <li>收藏、点赞等交互状态</li>
          <li>AI对话历史记录</li>
        </ul>
        <p>您可以随时通过浏览器设置清除本地存储数据，或使用平台提供的"导出数据"功能进行备份。</p>

        <h4>三、AI服务数据处理</h4>
        <p>本平台的AI功能由第三方AI服务提供商（硅基流动）提供支持：</p>
        <ul>
          <li>AI对话和诊断功能会将您输入的文本发送至AI服务接口进行处理</li>
          <li>发送的数据仅用于生成AI回复，不会被存储或用于其他目的</li>
          <li>我们不会将您的个人信息与AI服务数据进行关联</li>
        </ul>

        <h4>四、第三方链接</h4>
        <p>本平台包含指向第三方职业测评网站的链接（MBTI、霍兰德、DISC等），这些链接仅为方便您使用而提供。我们不对第三方网站的内容和隐私政策负责，建议您在使用前阅读其隐私政策。</p>

        <h4>五、数据安全</h4>
        <p>我们采取合理的技术措施保护您的数据安全，包括但不限于：</p>
        <ul>
          <li>所有数据传输使用HTTPS加密</li>
          <li>不存储用户密码等敏感信息</li>
          <li>数据隔离确保不同用户的数据互不可见</li>
        </ul>

        <h4>六、联系我们</h4>
        <p>如您对本隐私政策有任何疑问或建议，请通过"联系我们"页面与我们取得联系。我们将尽快回复您的问题。</p>
      </div>
    </el-dialog>

    <!-- 服务条款弹窗 -->
    <el-dialog v-model="showTerms" title="📜 服务条款" width="650px">
      <div class="terms-content">
        <p class="update-date">最后更新日期：2026年6月</p>

        <h4>一、服务说明</h4>
        <p>Offer捕手是一款AI求职辅助工具，旨在帮助用户进行求职准备、简历优化和职业规划。本平台提供的所有岗位信息仅供参考，不代表实际招聘需求，我们不对求职结果做任何承诺。AI生成的内容（包括诊断建议、咨询回复等）仅供参考，不构成专业建议。</p>

        <h4>二、用户注册与使用</h4>
        <p>在使用本平台时，您同意：</p>
        <ul>
          <li>采用极简注册方式，仅需用户名即可使用</li>
          <li>不对本平台进行逆向工程、反编译或其他破坏性行为</li>
          <li>不在社区发布虚假、误导性、违法或侵权的信息</li>
          <li>尊重其他用户的权益和隐私</li>
          <li>不利用自动化工具批量访问或攻击本平台</li>
        </ul>

        <h4>三、知识产权</h4>
        <p>本平台的界面设计、代码实现、文案内容等均受知识产权法保护。用户在社区发布的原创内容，其知识产权归原作者所有。我们有权对社区内容进行审核和管理，对违规内容进行删除处理。</p>

        <h4>四、免责声明</h4>
        <p>Offer捕手不对以下情况承担责任：</p>
        <ul>
          <li>岗位信息的真实性和时效性（岗位数据为模拟参考数据）</li>
          <li>AI诊断建议和咨询回复的适用性和准确性</li>
          <li>用户因使用本平台而产生的任何直接或间接损失</li>
          <li>第三方职业测评网站的内容和服务质量</li>
          <li>因网络故障、服务器维护等原因导致的服务中断</li>
          <li>用户本地数据因浏览器清除、设备更换等原因造成的丢失</li>
        </ul>

        <h4>五、服务变更与终止</h4>
        <p>我们保留随时修改、暂停或终止部分或全部服务的权利。重大变更将提前通知用户。本条款的解释和执行适用中华人民共和国法律。</p>

        <h4>六、争议解决</h4>
        <p>因使用本平台产生的争议，双方应友好协商解决。协商不成的，任何一方均可向我们所在地有管辖权的人民法院提起诉讼。</p>
      </div>
    </el-dialog>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const showGuide = ref(false)
const showFAQ = ref(false)
const showContact = ref(false)
const showAbout = ref(false)
const showPrivacy = ref(false)
const showTerms = ref(false)
</script>

<style scoped>
.footer {
  background: #0f172a;
  color: #999;
  padding: 40px 0 20px;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.footer-logo {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.logo-icon {
  font-size: 28px;
  margin-right: 8px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.footer-desc {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.footer-desc-sub {
  font-size: 13px;
  color: #64748b;
}

.footer-links {
  display: flex;
  gap: 60px;
}

.link-group h4 {
  font-size: 14px;
  color: #e2e8f0;
  margin-bottom: 16px;
}

.link-group ul {
  list-style: none;
}

.link-group li {
  margin-bottom: 8px;
}

.link-group a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.3s;
  cursor: pointer;
}

.link-group a:hover {
  color: #60a5fa;
  text-decoration: underline;
}

.footer-bottom {
  border-top: 1px solid #1e293b;
  padding-top: 20px;
  text-align: center;
  font-size: 12px;
  color: #475569;
}

/* 弹窗内容样式 */
.guide-content h4,
.faq-content .faq-item h4,
.about-content h4,
.privacy-content h4,
.terms-content h4 {
  color: #1e40af;
  margin-bottom: 12px;
  margin-top: 20px;
  font-size: 15px;
}

.guide-content h4:first-child,
.about-content .about-intro h3 {
  margin-top: 0;
}

.about-content .about-intro h3 {
  color: #1e40af;
  font-size: 18px;
}

.guide-content ol,
.guide-content ul,
.faq-content .faq-item p,
.about-content p,
.privacy-content p,
.terms-content p {
  line-height: 1.8;
  color: #666;
  font-size: 14px;
}

.guide-content li,
.privacy-content li,
.terms-content li {
  margin-bottom: 8px;
  line-height: 1.6;
  font-size: 14px;
  color: #666;
}

.privacy-content ul,
.terms-content ul {
  padding-left: 20px;
}

.faq-item {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-item h4 {
  color: #2563eb;
  margin-bottom: 8px;
}

.update-date {
  font-size: 13px;
  color: #999;
  margin-bottom: 16px;
}

.contact-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.contact-icon {
  font-size: 28px;
}

.contact-item h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #333;
}

.contact-item p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.about-features ul {
  list-style: none;
  padding: 0;
}

.about-features li {
  padding: 8px 0;
  line-height: 1.6;
}

.about-vision {
  margin-top: 16px;
  padding: 16px;
  background: #eff6ff;
  border-radius: 8px;
  border-left: 4px solid #2563eb;
}

.about-vision p {
  color: #1e40af;
}
</style>
