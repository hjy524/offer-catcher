export const mockJobs = [
  // === 互联网/科技 ===
  { id: '1', name: '前端开发工程师', company: '腾讯', location: '深圳', salary: '18-35K', type: '校招', companyType: '互联网', description: '负责腾讯社交产品前端开发，使用React/Vue技术栈，参与大前端架构演进', requirements: ['本科及以上','计算机相关专业','精通React/Vue','熟悉TypeScript'], responsibilities: ['负责Web前端产品开发与维护','参与前端架构设计','优化页面性能','与后端协作完成接口联调'], benefits: ['六险一金','免费班车食堂','年终奖金','弹性工作','股票激励'] },
  { id: '2', name: 'Java后端开发', company: '阿里巴巴', location: '杭州', salary: '20-40K', type: '校招', companyType: '互联网', description: '参与电商平台核心系统开发，处理高并发场景，涉及分布式架构', requirements: ['硕士优先','Java基础扎实','熟悉Spring Boot','了解分布式系统'], responsibilities: ['负责电商平台后端系统开发','设计高并发架构','优化系统性能','参与技术方案评审'], benefits: ['15薪','租房补贴','免费三餐','健身房','技术分享会'] },
  { id: '3', name: '产品经理', company: '美团', location: '北京', salary: '15-28K', type: '校招', companyType: '互联网', description: '负责美团到店业务产品规划，从需求分析到上线全流程管理', requirements: ['本科及以上','逻辑思维强','有实习经验优先','良好的表达能力'], responsibilities: ['负责产品功能规划与迭代','收集用户反馈分析需求','推动产品落地与上线','制定产品运营策略'], benefits: ['六险一金','内部优惠','节日礼品','年度体检','团建活动'] },
  { id: '4', name: '数据分析师', company: '字节跳动', location: '上海', salary: '18-32K', type: '校招', companyType: '互联网', description: '负责抖音/TikTok业务数据分析，通过数据驱动产品增长和运营决策', requirements: ['本科及以上','统计学/数学背景','熟练SQL/Python','有数据分析项目经验'], responsibilities: ['搭建业务数据看板','深入分析用户行为','产出数据洞察报告','支持产品策略优化'], benefits: ['六险一金','免费三餐','租房补贴','健身房','技术书籍'] },
  { id: '5', name: '算法工程师', company: '快手', location: '北京', salary: '25-50K', type: '社招', companyType: '互联网', description: '从事推荐算法研发，优化短视频推荐效果，提升用户留存', requirements: ['硕士及以上','机器学习基础扎实','Python/C++','发表顶会论文优先'], responsibilities: ['设计和优化推荐算法','构建算法效果评估体系','跟踪前沿技术动态','指导初级工程师'], benefits: ['高薪+股票','人才公寓','年度旅游','健康管理','创新奖励'] },
  { id: '6', name: '测试开发工程师', company: '京东', location: '北京', salary: '14-25K', type: '校招', companyType: '互联网', description: '负责京东电商系统的质量保障，建设自动化测试平台', requirements: ['本科及以上','熟悉测试流程','了解自动化框架','编程基础好'], responsibilities: ['设计测试方案','搭建自动化测试平台','参与CI/CD流程','质量数据分析'], benefits: ['六险一金','京东内购优惠','带薪年假','年度体检','晋升通道清晰'] },
  { id: '7', name: 'UI/UX设计师', company: '网易', location: '广州', salary: '12-24K', type: '校招', companyType: '互联网', description: '负责网易游戏/音乐产品界面设计，打造优秀用户体验', requirements: ['本科及以上','设计相关专业','熟练Figma/PS','有完整作品集'], responsibilities: ['负责产品界面设计','制定设计规范','跟进设计还原度','参与用户研究'], benefits: ['五险一金','免费三餐','健身房','游戏内购优惠','创意开放氛围'] },
  { id: '8', name: 'DevOps工程师', company: '小米', location: '北京', salary: '18-35K', type: '社招', companyType: '消费电子', description: '负责小米云服务基础设施运维，建设自动化运维体系', requirements: ['本科及以上','熟悉Linux系统','掌握Docker/K8s','有CI/CD经验'], responsibilities: ['保障线上服务稳定','建设自动化运维平台','优化部署流程','故障排查与预防'], benefits: ['六险一金','小米产品优惠','带薪年假','年度体检','员工俱乐部'] },
  { id: '9', name: '安全工程师', company: '华为', location: '深圳', salary: '20-40K', type: '社招', companyType: '通信', description: '负责鸿蒙系统安全架构设计与安全漏洞挖掘', requirements: ['本科及以上','信息安全背景','熟悉渗透测试','了解安全协议'], responsibilities: ['安全漏洞挖掘与修复','安全架构方案设计','安全代码审计','应急响应'], benefits: ['五险一金','年终奖金','股票分红','免费班车','技术晋升双通道'] },
  { id: '10', name: '运营专员', company: '小红书', location: '上海', salary: '10-20K', type: '校招', companyType: '互联网', description: '负责社区内容运营与用户增长，策划线上活动提升DAU', requirements: ['本科及以上','对新媒体运营有热情','文案功底好','数据分析能力'], responsibilities: ['策划社区运营活动','分析用户增长数据','管理KOL合作关系','优化内容推荐策略'], benefits: ['五险一金','下午茶','团建旅行','弹性工作','年轻化团队'] },

  // === 金融/银行 ===
  { id: '11', name: '金融科技工程师', company: '蚂蚁集团', location: '杭州', salary: '22-40K', type: '校招', companyType: '金融科技', description: '负责支付宝核心支付系统开发，涉及高可用分布式架构', requirements: ['硕士优先','Java/Go','分布式系统经验','了解金融业务'], responsibilities: ['支付系统架构设计','保障交易安全稳定','优化系统性能','参与技术选型'], benefits: ['16薪','期权激励','补充公积金','免费三餐','技术氛围好'] },
  { id: '12', name: '量化研究员', company: '招商银行', location: '深圳', salary: '25-45K', type: '社招', companyType: '银行/证券', description: '负责量化交易策略研发，运用机器学习模型预测市场走势', requirements: ['硕士及以上','金融/数学/计算机背景','Python熟练','有实盘经验优先'], responsibilities: ['研发量化交易策略','回测和优化模型','监控策略运行','撰写策略报告'], benefits: ['六险二金','年终奖丰厚','职业发展通道','培训体系完善','工作稳定'] },
  { id: '13', name: '风控分析师', company: '中国平安', location: '深圳', salary: '18-30K', type: '校招', companyType: '银行/证券', description: '负责信贷风控模型搭建，利用大数据和AI技术识别风险', requirements: ['本科及以上','统计学/数学背景','熟悉SQL/Python','有风控建模经验'], responsibilities: ['搭建风控评分模型','监控风险指标','优化风控策略','产出分析报告'], benefits: ['六险二金','企业年金','带薪年假','年度体检','培训机会多'] },

  // === 人工智能 ===
  { id: '14', name: '大模型算法工程师', company: '百度', location: '北京', salary: '30-60K', type: '社招', companyType: '人工智能', description: '参与文心大模型预训练与微调，优化模型效果与推理效率', requirements: ['硕士及以上','NLP/CV背景','熟悉Transformer','有大模型经验优先'], responsibilities: ['大模型训练与优化','设计模型评估方案','跟踪前沿研究','论文发表与专利申请'], benefits: ['高薪+股票','免费三餐','健身房','学术氛围','顶会参会机会'] },
  { id: '15', name: 'AI产品经理', company: '商汤科技', location: '上海', salary: '20-35K', type: '社招', companyType: '人工智能', description: '负责AI视觉产品的规划与落地，对接B端客户需求', requirements: ['本科及以上','了解AI技术原理','B端产品经验','沟通能力强'], responsibilities: ['AI产品规划与设计','客户需求调研分析','协调研发团队','制定产品路线图'], benefits: ['五险一金','期权激励','弹性工作','技术会议','成长空间大'] },

  // === 游戏娱乐 ===
  { id: '16', name: '游戏客户端开发', company: '腾讯游戏', location: '深圳', salary: '20-38K', type: '校招', companyType: '游戏', description: '参与王者荣耀/和平精英客户端开发，负责核心玩法实现', requirements: ['本科及以上','C++/C#熟练','了解Unity/Unreal','热爱游戏'], responsibilities: ['游戏功能开发','性能优化','跨平台适配','与策划美术协作'], benefits: ['六险一金','免费班车食堂','年终奖金','弹性工作','游戏内购福利'] },
  { id: '17', name: '游戏策划', company: '米哈游', location: '上海', salary: '15-28K', type: '校招', companyType: '游戏', description: '负责开放世界游戏系统策划，设计核心玩法与经济系统', requirements: ['本科及以上','热爱游戏','逻辑思维强','有作品/项目加分'], responsibilities: ['设计游戏系统与玩法','撰写策划文档','跟进功能开发','数据分析和调优'], benefits: ['16薪','项目分红','免费三餐','团建旅行','二次元文化氛围'] },

  // === 汽车/新能源 ===
  { id: '18', name: '自动驾驶算法工程师', company: '小鹏汽车', location: '广州', salary: '25-50K', type: '社招', companyType: '汽车/出行', description: '负责自动驾驶感知/规划/控制算法研发，推动量产落地', requirements: ['硕士及以上','计算机视觉/规划控制背景','C++/Python','有自动驾驶经验'], responsibilities: ['自动驾驶算法研发','仿真与路测','算法性能优化','技术文档撰写'], benefits: ['六险一金','股票期权','购车优惠','弹性工作','前沿技术'] },

  // === 教育培训 ===
  { id: '19', name: '在线教育产品经理', company: '好未来', location: '北京', salary: '14-25K', type: '校招', companyType: '教育培训', description: '负责学而思在线教育产品设计，提升学习体验和完课率', requirements: ['本科及以上','教育/计算机背景','逻辑清晰','对教育有热情'], responsibilities: ['在线教育产品设计','分析学习数据','优化课程体验','教师端功能迭代'], benefits: ['五险一金','子女教育优惠','带薪寒暑假','培训体系完善','社会价值感'] },
  { id: '20', name: 'VR教育开发工程师', company: '网易有道', location: '杭州', salary: '18-32K', type: '社招', companyType: '教育培训', description: '负责VR/AR教育应用开发，打造沉浸式学习体验', requirements: ['本科及以上','Unity/Unreal引擎','3D渲染基础','对教育科技感兴趣'], responsibilities: ['VR应用功能开发','3D场景搭建','性能优化','教育内容虚拟化'], benefits: ['五险一金','技术氛围好','弹性工作','学习资源丰富','创新项目'] },

  // === 医疗健康 ===
  { id: '21', name: '医疗AI工程师', company: '联影医疗', location: '上海', salary: '20-38K', type: '校招', companyType: '医疗健康', description: '利用深度学习技术辅助医学影像诊断，提升阅片效率', requirements: ['硕士及以上','CV/医学图像处理','Python/PyTorch','有医学影像经验优先'], responsibilities: ['医学影像AI算法研发','模型训练与部署','临床验证评估','论文与专利撰写'], benefits: ['六险一金','人才落户','股票期权','科研氛围','社会价值高'] },

  // === 物流/供应链 ===
  { id: '22', name: '供应链数据分析师', company: '顺丰科技', location: '深圳', salary: '14-26K', type: '校招', companyType: '物流/供应链', description: '负责快递物流数据分析，优化配送路线和仓储效率', requirements: ['本科及以上','运筹学/统计背景','熟练SQL/Python','供应链知识加分'], responsibilities: ['物流数据建模分析','优化配送路径','仓储效率评估','数据看板搭建'], benefits: ['五险一金','年终奖金','员工寄件优惠','晋升空间','技术驱动'] },

  // === 咨询/专业服务 ===
  { id: '23', name: '数字化咨询顾问', company: '德勤', location: '上海', salary: '18-30K', type: '校招', companyType: '咨询/专业服务', description: '为企业客户提供数字化转型咨询服务，涉及IT战略与系统实施', requirements: ['硕士优先','经管/IT背景','逻辑表达能力强','英语流利','能接受出差'], responsibilities: ['客户需求调研','数字化方案设计','项目交付管理','阶段性汇报'], benefits: ['五险一金','差旅补贴','专业培训','晋升机制清晰','国际化平台'] },

  // === 国企 ===
  { id: '24', name: '信息化管理岗', company: '中国移动', location: '北京', salary: '12-20K', type: '校招', companyType: '国企/央企', description: '负责中国移动信息化系统建设与运营维护', requirements: ['本科及以上','计算机/通信背景','党员优先','良好沟通能力'], responsibilities: ['信息化系统规划建设','系统运维管理','网络安全保障','项目实施管理'], benefits: ['六险二金','企业年金','住房补贴','工作稳定','职业发展双通道'] },

  // === 传统制造 ===
  { id: '25', name: '工业互联网工程师', company: '三一重工', location: '长沙', salary: '15-28K', type: '社招', companyType: '传统制造', description: '负责工程机械物联网平台建设，实现设备远程监控与智能运维', requirements: ['本科及以上','物联网/计算机背景','熟悉边缘计算','有工业项目经验'], responsibilities: ['物联网平台架构设计','设备数据采集与分析','故障预测模型搭建','系统运维'], benefits: ['五险一金','年终奖金','员工公寓','食堂优惠','科技转型机遇'] },
  { id: '26', name: '嵌入式软件开发', company: '大疆创新', location: '深圳', salary: '22-40K', type: '校招', companyType: '消费电子', description: '负责无人机飞控系统和云台控制嵌入式软件开发', requirements: ['本科及以上','C/C++精通','RTOS经验','了解飞控算法优先'], responsibilities: ['飞控嵌入式软件开发','驱动开发','性能优化','硬件联调测试'], benefits: ['六险一金','员工宿舍','购机优惠','创新文化','技术挑战'] },

  // === 更多互联网 ===
  { id: '27', name: 'Golang后端开发', company: '哔哩哔哩', location: '上海', salary: '18-33K', type: '校招', companyType: '互联网', description: '负责B站社区后端服务开发，承载千万级用户请求', requirements: ['本科及以上','Go/Java熟练','熟悉微服务架构','了解缓存/消息队列'], responsibilities: ['后端API服务开发','系统架构优化','保障服务高可用','技术方案设计'], benefits: ['六险一金','免费午餐','二次元文化','社团活动','技术氛围好'] },
  { id: '28', name: '客户端开发工程师', company: '拼多多', location: '上海', salary: '22-40K', type: '校招', companyType: '电子商务', description: '负责拼多多App客户端开发，持续优化购物体验', requirements: ['本科及以上','熟悉Android/iOS开发','了解性能优化','有上架App经验'], responsibilities: ['App功能模块开发','性能优化与Crash治理','客户端架构演进','跨团队协作'], benefits: ['16薪','疯狂奖金','免费三餐','快速成长','技术大牛多'] },
  { id: '29', name: '网络工程师', company: '深信服', location: '深圳', salary: '15-28K', type: '社招', companyType: '企业服务', description: '负责企业网络安全产品研发，涉及下一代防火墙和零信任架构', requirements: ['本科及以上','网络/安全背景','熟悉TCP/IP协议栈','C/Go开发经验'], responsibilities: ['网络安全产品研发','漏洞分析与修复','性能优化','客户问题排查'], benefits: ['六险一金','股票激励','技术培训','弹性工作','行业领先'] },
  { id: '30', name: '全栈开发工程师', company: '滴滴', location: '北京', salary: '20-36K', type: '社招', companyType: '汽车/出行', description: '负责滴滴出行中台系统开发，从前端到后端全链路', requirements: ['本科及以上','全栈经验3年+','Vue/React+Node.js','数据库设计能力'], responsibilities: ['全栈开发','系统架构设计','技术方案评审','指导新人成长'], benefits: ['六险一金','15薪','弹性工作','免费班车','出行补贴'] },
  { id: '31', name: '市场营销经理', company: '元气森林', location: '北京', salary: '15-25K', type: '社招', companyType: '消费电子', description: '负责饮料品牌的市场营销策划，打造年轻化品牌形象', requirements: ['本科及以上','市场营销经验','有创意策划能力','擅长社交媒体运营'], responsibilities: ['品牌营销策略制定','策划线上线下活动','管理KOL/KOC合作','数据分析与复盘'], benefits: ['五险一金','产品内购','年轻团队','创意发挥空间','快速成长'] },
  { id: '32', name: '新能源项目经理', company: '比亚迪', location: '深圳', salary: '18-30K', type: '社招', companyType: '新能源', description: '负责新能源汽车项目管理工作，协调研发、生产、供应链', requirements: ['本科及以上','工科背景','PMP认证优先','有项目管理经验'], responsibilities: ['制定项目计划','协调跨部门资源','进度跟踪与风险管理','项目复盘与优化'], benefits: ['六险一金','员工购车优惠','餐补班车','技术氛围','快速成长'] },
  { id: '33', name: '人力资源专员', company: '猎聘', location: '北京', salary: '10-18K', type: '校招', companyType: '企业服务', description: '负责招聘平台的人才运营与企业客户服务', requirements: ['本科及以上','人力资源相关专业','沟通能力强','有招聘实习经验'], responsibilities: ['企业客户服务','人才库运营维护','招聘数据分析','活动策划执行'], benefits: ['五险一金','带薪年假','培训体系完善','晋升通道','办公环境好'] },
  { id: '34', name: '媒体编辑', company: '澎湃新闻', location: '上海', salary: '10-18K', type: '社招', companyType: '媒体/内容', description: '负责澎湃新闻深度报道采编与新媒体内容策划', requirements: ['本科及以上','新闻传播相关','文字功底好','有新媒体运营经验'], responsibilities: ['新闻选题策划','深度报道采写','新媒体平台运营','数据分析与优化'], benefits: ['五险一金','媒体影响力','深入学习机会','采访资源丰富','专业成长'] },
  { id: '35', name: '物业运营管培生', company: '万科', location: '深圳', salary: '10-18K', type: '校招', companyType: '房地产', description: '万科万物云管培生项目，培养未来社区运营管理人才', requirements: ['本科及以上','专业不限','沟通协调能力强','有学生会干部经历优先'], responsibilities: ['社区运营管理','客户关系维护','物业品质提升','团队管理'], benefits: ['五险一金','带薪培训','晋升快','项目分红','管培生专属发展通道'] },
]

export const mockArticles = [
  { id: '1', title: '2026届校招时间线全攻略', category: '面试技巧', summary: '详细梳理各大互联网公司校招时间节点，助你提前规划', views: 12580 },
  { id: '2', title: '简历写作黄金法则', category: '简历攻略', summary: 'HR教你如何写出一份让面试官眼前一亮的简历', views: 9860 },
  { id: '3', title: '前端面试高频题汇总', category: '面试技巧', summary: '整理近百道前端面试真题，附详细解答', views: 15420 },
  { id: '4', title: '产品经理入门指南', category: '职业规划', summary: '从零开始了解产品经理的工作内容与技能要求', views: 8230 },
  { id: '5', title: '算法面试必备知识点', category: '面试技巧', summary: '数据结构与算法面试高频考点详解', views: 11050 },
  { id: '6', title: '各大厂薪资待遇揭秘', category: '行业分析', summary: '2026届校招薪资大盘点，看看你心仪的公司开多少', views: 23680 },
  { id: '7', title: '简历模板免费下载', category: '简历攻略', summary: '精选10套高质量简历模板，直接套用', views: 35200 },
  { id: '8', title: '秋招心态调整指南', category: '职业规划', summary: '面对求职压力，如何保持良好心态', views: 6780 }
]

export const mockCommunityNotes = [
  { id: '1', title: '字节跳动前端面经分享', author: '前端小白', content: '刚刚面完字节的前端岗位，分享一下面试经验...', cover: 'https://picsum.photos/400/300?random=1', likes: 256, comments: [{ id: 1, author: '新人', content: '感谢分享！', time: '2026-05-20 14:30' }], category: '面试经验', createdAt: '2026-05-20' },
  { id: '2', title: '简历这样写通过率提升50%', author: 'HR小姐姐', content: '作为HR分享筛选简历时最看重的几点...', cover: 'https://picsum.photos/400/300?random=2', likes: 512, comments: [], category: '简历技巧', createdAt: '2026-05-18' },
  { id: '3', title: '拿到3个大厂offer的经验', author: '校招赢家', content: '秋招拿到了阿里、腾讯、字节的offer，分享准备过程...', cover: 'https://picsum.photos/400/300?random=3', likes: 892, comments: [], category: '面试经验', createdAt: '2026-05-15' },
  { id: '4', title: '产品经理面试常见问题', author: 'PM之路', content: '整理了产品经理面试中常见的问题及回答思路...', cover: 'https://picsum.photos/400/300?random=4', likes: 342, comments: [], category: '面试经验', createdAt: '2026-05-12' },
  { id: '5', title: '应届生求职避坑指南', author: '过来人', content: '分享一些求职过程中遇到的坑，希望大家能避开...', cover: 'https://picsum.photos/400/300?random=5', likes: 678, comments: [], category: '职场心得', createdAt: '2026-05-10' },
  { id: '6', title: '数据分析师技能树', author: '数据达人', content: '想做数据分析师？这些技能必须掌握...', cover: 'https://picsum.photos/400/300?random=6', likes: 423, comments: [], category: '岗位分析', createdAt: '2026-05-08' }
]

export const mockResumeTemplate = {
  name: '', education: '', major: '', graduationYear: '',
  experience: [], projects: [], skills: [], certificates: [], intent: '', summary: ''
}

export const mockTestLinks = [
  { name: 'MBTI职业性格测试', url: 'https://www.16personalities.com/ch', description: '了解你的性格类型，探索适合的职业方向' },
  { name: '霍兰德职业兴趣测试', url: 'https://www.apesk.com/holland/index.html', description: '发现你的职业兴趣，匹配理想职业' },
  { name: 'DISC性格测试', url: 'https://www.apesk.com/disc/index.asp', description: '评估你的行为风格，找到适合的工作方式' }
]
