/* ============================================================
 * data.js —— 图表数据与全局配置
 * 所有数据均来自公开权威报告，来源详见页面底部"数据来源"。
 * ============================================================ */

// 全局配色（与暗色主题一致）
const COLORS = {
  cyan: '#22d3ee',
  blue: '#3b82f6',
  indigo: '#6366f1',
  purple: '#a855f7',
  pink: '#f472b6',
  green: '#34d399',
  amber: '#fbbf24',
  red: '#f87171',
  violet: '#818cf8',
};

const SERIES_COLORS = [
  COLORS.cyan, COLORS.blue, COLORS.purple, COLORS.pink,
  COLORS.green, COLORS.amber, COLORS.violet, COLORS.red,
];

// 渐变填充（用于面积图）
function areaGradient(echarts, color) {
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: hexToRgba(color, 0.55) },
    { offset: 1, color: hexToRgba(color, 0.02) },
  ]);
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ---------- 图2：全球 AI 市场规模（亿美元） ----------
// 数据来源：Grand View Research《Artificial Intelligence Market Size, Share & Trends
//   Analysis Report》，2026-04 版（预测期 2026–2033）：
//   2025 年市场规模 390.91 亿美元（实际值），预计 2033 年达 3,497.26 亿美元，
//   2026–2033 年复合年增长率 30.6%；2023（196.63）、2024（279.22）沿用其上一版公布的实际值。
//   说明：2026–2032 年为依据该机构公布的 CAGR（30.6%）与 2033 年终值推算的预测值。
const MARKET = {
  years: ['2023', '2024', '2025', '2026E', '2027E', '2028E', '2029E', '2030E', '2031E', '2032E', '2033E'],
  values: [1966, 2792, 3909, 5397, 7048, 9205, 12021, 15700, 20504, 26778, 34972],
};

// ---------- 图2b：Gartner 全球 AI 支出预测（万亿美元） ----------
// 数据来源：Gartner（2026-09-16）。2026 年全球 AI 支出预测年内三度上调：
//   1 月 2.52 万亿美元（同比 +44%）→ 5 月 2.59 万亿（+47%）→ 9 月 2.70 万亿（+49.5%）；
//   Gartner 预计 2030 年全球 AI 支出将达 5.95 万亿美元。
const GARTNER = {
  labels: ['2026年1月', '2026年5月', '2026年9月'],
  values: [2.52, 2.59, 2.70],
  growth: [44, 47, 49.5],
};

// ---------- 图3：AI 经济贡献 vs 经济体 GDP ----------
const ECONOMY = {
  categories: ['AI 经济贡献\n(2030 预测)', '中国\nGDP(2023)', '美国\nGDP(2023)', '德国\nGDP(2023)', '日本\nGDP(2023)', '印度\nGDP(2023)'],
  values: [15.7, 17.79, 27.36, 4.46, 4.21, 3.55],
  aiIndex: 0,
};

// 经济贡献结构（PwC 拆解）
const ECONOMY_PIE = [
  { name: '生产率提升', value: 6.6 },
  { name: '消费端拉动', value: 9.1 },
];

// ---------- 图4：中国 AI 核心产业规模（亿元） ----------
// 2025 年为实际值：中国信通院 2026-08-03 发布，2025 年规模超 1.2 万亿元，同比增长 40%
const CHINA = {
  years: ['2020', '2021', '2022', '2023', '2024', '2025'],
  values: [3031, 4090, 5080, 5784, 9000, 12600],
  growth: [null, 33.3, 18.0, 13.9, 24.0, 40.0],
};

// 大模型应用场景占比变化
const CHINA_PIE = [
  { name: '生产制造', value: 25.9 },
  { name: '其他应用场景', value: 74.1 },
];

// ---------- 图6：桑基图 —— 新质生产力要素流动 ----------
const SANKEY = {
  nodes: [
    // 第 0 层：要素投入
    { name: '数据要素', depth: 0 },
    { name: '算力底座', depth: 0 },
    { name: '算法模型', depth: 0 },
    // 第 1 层：核心技术
    { name: '机器学习', depth: 1 },
    { name: '深度学习', depth: 1 },
    { name: '大语言模型', depth: 1 },
    { name: '计算机视觉', depth: 1 },
    { name: '自然语言处理', depth: 1 },
    // 第 2 层：应用场景
    { name: '智能制造', depth: 2 },
    { name: '智慧医疗', depth: 2 },
    { name: '智慧金融', depth: 2 },
    { name: '智能交通', depth: 2 },
    { name: '智慧城市', depth: 2 },
    // 第 3 层：价值产出
    { name: '效率提升', depth: 3 },
    { name: '成本降低', depth: 3 },
    { name: '创新加速', depth: 3 },
    { name: '产业升级', depth: 3 },
  ],
  links: [
    // 要素 → 技术
    { source: '数据要素', target: '机器学习', value: 42 },
    { source: '数据要素', target: '深度学习', value: 46 },
    { source: '数据要素', target: '大语言模型', value: 38 },
    { source: '算力底座', target: '深度学习', value: 44 },
    { source: '算力底座', target: '大语言模型', value: 48 },
    { source: '算力底座', target: '计算机视觉', value: 30 },
    { source: '算法模型', target: '机器学习', value: 34 },
    { source: '算法模型', target: '自然语言处理', value: 30 },
    { source: '算法模型', target: '计算机视觉', value: 26 },
    // 技术 → 场景
    { source: '机器学习', target: '智慧金融', value: 40 },
    { source: '机器学习', target: '智慧医疗', value: 24 },
    { source: '深度学习', target: '智能制造', value: 42 },
    { source: '深度学习', target: '智慧医疗', value: 30 },
    { source: '大语言模型', target: '智慧金融', value: 36 },
    { source: '大语言模型', target: '智慧城市', value: 26 },
    { source: '计算机视觉', target: '智能制造', value: 30 },
    { source: '计算机视觉', target: '智能交通', value: 34 },
    { source: '自然语言处理', target: '智慧金融', value: 22 },
    { source: '自然语言处理', target: '智慧城市', value: 20 },
    // 场景 → 价值
    { source: '智能制造', target: '效率提升', value: 44 },
    { source: '智能制造', target: '成本降低', value: 30 },
    { source: '智慧医疗', target: '创新加速', value: 34 },
    { source: '智慧医疗', target: '效率提升', value: 22 },
    { source: '智慧金融', target: '效率提升', value: 36 },
    { source: '智慧金融', target: '成本降低', value: 28 },
    { source: '智能交通', target: '效率提升', value: 24 },
    { source: '智能交通', target: '成本降低', value: 16 },
    { source: '智慧城市', target: '产业升级', value: 30 },
    { source: '智慧城市', target: '效率提升', value: 18 },
  ],
};

// ---------- 图7：各行业 AI 生产率提升 ----------
const PRODUCTIVITY = {
  categories: ['软件开发', '客服中心', '金融', '制造', '医疗', '零售', '物流'],
  values: [40, 35, 32, 28, 25, 22, 20],
};

// ---------- 图7b：从使用到价值——AI 落地漏斗 ----------
// 数据来源：麦肯锡《The State of AI 2026: On the road to ROI》
//   调查时间 2026-05-04 ~ 06-08，1,719 名受访者，覆盖 97 个国家。
//   关键结论：采用率已很高，但转化为经营回报的比例仍然偏低。
const MCKINSEY_FUNNEL = [
  { name: '已在至少一个职能使用 AI', value: 89 },
  { name: '认为 AI 提升了生产率', value: 80 },
  { name: '已在组织内规模化部署', value: 44 },
  { name: '对营业利润有正向贡献', value: 37 },
  { name: '从 AI 获得显著价值', value: 6 },
];

// ---------- 图8：全球生成式 AI 专利（WIPO 数据） ----------
// 数据来源①：WIPO《Patent Landscape Report: Generative AI》(2024-07-03)
//   2014–2023 年全球共 54,000 项生成式 AI 发明专利家族，中国 38,210 项（约 70.8%），
//   美国 6,276 项，韩国 4,155 项，日本 3,409 项，印度 1,350 项。
// 数据来源②：WIPO《SPARK: Patent Trends Update in GenAI》(2026-07-14)，数据延伸至 2025 年。
//   全球年度公开量 2023 年约 14,000 → 2024 年 18,862 → 2025 年 37,808（件）；
//   2024–2025 两年新增合计超过 56,000 件，超过此前十年总和；
//   中国两年新增超 43,000 件，为全球最大来源地（约占新增总量四分之三）。

// 全球生成式 AI 专利家族年度公开量（件）
const PATENT_GLOBAL = {
  years: ['2023', '2024', '2025'],
  values: [14000, 18862, 37808],
};

// 2024–2025 年新增生成式 AI 专利家族：中国 vs 其他经济体（件，约）
const PATENT_SHARE = [
  { name: '中国', value: 43000 },
  { name: '其他经济体', value: 13000 },
];

// 主要来源国：累计公开量（2014–2023，件）+ 2023→2025 年均复合增长率（%）
// 数量来源：WIPO《Patent Landscape Report: Generative AI》(2024-07-03)，前五大发明人所在地
// 增速来源：WIPO《SPARK: Patent Trends Update in GenAI》(2026-07-14)
// 注：德国 85%、加拿大 109%、瑞士 124%、英国 69% 等增速更快，但 WIPO 未公布其绝对数量
const PATENT_COUNTRY = {
  names: ['中国', '美国', '韩国', '日本', '印度'],
  counts: [38210, 6276, 4155, 3409, 1350],
  cagr: [64, 92, 21, 210, 63],
};

// ---------- 图9：各行业 AI 采用率 ----------
const ADOPTION = {
  categories: ['科技/媒体/电信', '金融服务', '零售', '医疗', '制造', '能源', '政府', '教育', '农业'],
  values: [65, 50, 40, 38, 35, 30, 28, 25, 18],
};

// 全球 AI 市场按行业构成（矩形树图）
const TREEMAP = [
  { name: '金融', value: 19 },
  { name: '零售', value: 18 },
  { name: '医疗', value: 15 },
  { name: '制造', value: 14 },
  { name: '汽车/交通', value: 10 },
  { name: '电信', value: 9 },
  { name: '能源', value: 7 },
  { name: '其他', value: 8 },
];
