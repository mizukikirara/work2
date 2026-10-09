/* ============================================================
 * charts.js —— 所有 ECharts 可视化图表初始化
 * 依赖：echarts（CDN 加载）、data.js
 * ============================================================ */

// 全局图表实例注册表（用于自适应 resize）
const CHART_INSTANCES = [];

const AXIS_LABEL = { color: '#9aa7bd', fontSize: 12 };
const SPLIT_LINE = { lineStyle: { color: 'rgba(255,255,255,0.06)' } };

function tooltipStyle() {
  return {
    backgroundColor: 'rgba(13,18,38,0.92)',
    borderColor: 'rgba(99,102,241,0.4)',
    borderWidth: 1,
    textStyle: { color: '#e6edf7', fontSize: 13 },
    extraCssText: 'border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.5);backdrop-filter:blur(8px);',
  };
}

// 统一数字千分位格式（固定 en-US，避免不同浏览器区域设置出现 "37,808" / "37.808" 不一致）
function fmtInt(v) {
  return Number(v).toLocaleString('en-US');
}

function register(domId, option) {
  const dom = document.getElementById(domId);
  if (!dom) return null;
  const chart = echarts.init(dom, null, { renderer: 'canvas' });
  chart.setOption(option);
  CHART_INSTANCES.push(chart);
  return chart;
}

/* ---------------- 图2：全球 AI 市场规模（面积图） ---------------- */
function initChartMarket() {
  register('chartMarket', {
    grid: { left: 64, right: 88, top: 52, bottom: 40 },
    tooltip: Object.assign(tooltipStyle(), {
      trigger: 'axis',
      valueFormatter: (v) => v + ' 亿美元',
    }),
    xAxis: {
      type: 'category',
      data: MARKET.years,
      axisLabel: AXIS_LABEL,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      name: '亿美元',
      nameTextStyle: { color: '#9aa7bd' },
      axisLabel: AXIS_LABEL,
      splitLine: SPLIT_LINE,
    },
    series: [{
      name: '全球 AI 市场规模',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      data: MARKET.values,
      lineStyle: { width: 3.5, color: COLORS.cyan },
      itemStyle: { color: COLORS.cyan, borderColor: '#fff', borderWidth: 1.5 },
      areaStyle: { color: areaGradient(echarts, COLORS.cyan) },
      markPoint: {
        symbolSize: 52,
        label: { fontSize: 11, color: '#fff' },
        data: [
          { coord: ['2033E', 34972], value: '3.50 万亿', name: '2033 预测' },
        ],
        itemStyle: { color: COLORS.purple, shadowBlur: 16, shadowColor: 'rgba(168,85,247,.7)' },
      },
    }],
    animationDuration: 1200,
    animationEasing: 'cubicOut',
  });
}

/* ---------------- 图2b：Gartner 2026 全球 AI 支出预测年内三度上调 ---------------- */
function initChartGartner() {
  register('chartGartner', {
    grid: { left: 64, right: 30, top: 30, bottom: 40 },
    tooltip: Object.assign(tooltipStyle(), {
      trigger: 'axis',
      valueFormatter: (v) => v + ' 万亿美元',
    }),
    xAxis: {
      type: 'category',
      data: GARTNER.labels,
      axisLabel: AXIS_LABEL,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value', name: '万亿美元', max: 3.2,
      nameTextStyle: { color: '#9aa7bd' },
      axisLabel: AXIS_LABEL, splitLine: SPLIT_LINE,
    },
    series: [{
      name: '2026 年全球 AI 支出预测',
      type: 'bar',
      barWidth: '42%',
      data: GARTNER.values,
      itemStyle: {
        borderRadius: [8, 8, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#34d399' }, { offset: 1, color: '#22d3ee' },
        ]),
      },
      label: {
        show: true, position: 'top', lineHeight: 17,
        rich: {
          a: { color: '#e6edf7', fontSize: 12, fontWeight: 'bold' },
          b: { color: '#fbbf24', fontSize: 11 },
        },
        formatter: (p) => '{a|' + p.value.toFixed(2) + ' 万亿}\n{b|同比 +' + GARTNER.growth[p.dataIndex] + '%}',
      },
    }],
    graphic: [
      {
        type: 'text', right: 14, top: 2,
        style: { text: '2030 年预计 5.95 万亿美元', fill: '#c084fc', fontSize: 12, fontWeight: 'bold' },
      },
    ],
    animationDuration: 1200,
    animationEasing: 'cubicOut',
  });
}

/* ---------------- 图3：AI 经济贡献对比（柱状图） ---------------- */
function initChartEconomy() {
  const data = ECONOMY.categories.map((c, i) => ({
    value: ECONOMY.values[i],
    itemStyle: i === ECONOMY.aiIndex
      ? { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#22d3ee' }, { offset: 1, color: '#a855f7' },
        ]), borderRadius: [8, 8, 0, 0] }
      : { color: 'rgba(99,102,241,0.35)', borderRadius: [8, 8, 0, 0] },
  }));
  register('chartEconomy', {
    grid: { left: 60, right: 30, top: 50, bottom: 50 },
    tooltip: Object.assign(tooltipStyle(), {
      trigger: 'axis',
      valueFormatter: (v) => v + ' 万亿美元',
    }),
    xAxis: {
      type: 'category',
      data: ECONOMY.categories,
      axisLabel: Object.assign({}, AXIS_LABEL, { interval: 0, lineHeight: 16 }),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      name: '万亿美元',
      nameTextStyle: { color: '#9aa7bd' },
      axisLabel: AXIS_LABEL,
      splitLine: SPLIT_LINE,
    },
    series: [{
      name: '规模',
      type: 'bar',
      barWidth: '46%',
      data: data,
      label: {
        show: true, position: 'top', color: '#e6edf7', fontSize: 12,
        formatter: (p) => p.value + 'T',
      },
      markLine: {
        silent: true, symbol: 'none',
        lineStyle: { color: '#f472b6', type: 'dashed' },
        label: { formatter: 'AI 贡献 ≈ 15.7 万亿', color: '#f472b6', fontSize: 11 },
        data: [{ yAxis: 15.7 }],
      },
    }],
    animationDuration: 1200,
    animationEasing: 'cubicOut',
  });
}

/* ---------------- 图3b：经济贡献结构（环形图） ---------------- */
function initChartEconomyPie() {
  register('chartEconomyPie', {
    tooltip: Object.assign(tooltipStyle(), { trigger: 'item', valueFormatter: (v) => v + ' 万亿美元' }),
    legend: { bottom: 0, textStyle: { color: '#9aa7bd' }, itemWidth: 12, itemHeight: 12 },
    series: [{
      type: 'pie',
      radius: ['52%', '74%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: true,
      itemStyle: { borderColor: '#0a0e1c', borderWidth: 3, borderRadius: 6 },
      label: { show: true, color: '#e6edf7', fontSize: 12, formatter: (p) => p.name + '\n' + Math.round(p.percent) + '%' },
      labelLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } },
      data: ECONOMY_PIE.map((d, i) => ({ ...d, itemStyle: { color: SERIES_COLORS[i] } })),
      emphasis: { scaleSize: 8, itemStyle: { shadowBlur: 20, shadowColor: 'rgba(0,0,0,.5)' } },
    }],
  });
}

/* ---------------- 图4：中国 AI 核心产业（柱+折线组合） ---------------- */
function initChartChina() {
  register('chartChina', {
    grid: { left: 60, right: 55, top: 40, bottom: 40 },
    tooltip: Object.assign(tooltipStyle(), { trigger: 'axis' }),
    legend: { top: 0, right: 10, textStyle: { color: '#9aa7bd' }, itemWidth: 14, itemHeight: 10 },
    xAxis: {
      type: 'category',
      data: CHINA.years,
      axisLabel: AXIS_LABEL,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
      axisTick: { show: false },
    },
    yAxis: [
      {
        type: 'value', name: '规模（亿元）',
        nameTextStyle: { color: '#9aa7bd' },
        axisLabel: AXIS_LABEL, splitLine: SPLIT_LINE,
      },
      {
        type: 'value', name: '增速（%）', max: 40,
        nameTextStyle: { color: '#9aa7bd' },
        axisLabel: AXIS_LABEL, splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '核心产业规模',
        type: 'bar',
        barWidth: '44%',
        data: CHINA.values,
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#6366f1' }, { offset: 1, color: '#22d3ee' },
          ]),
        },
        label: { show: true, position: 'top', color: '#e6edf7', fontSize: 11, formatter: '{c}' },
      },
      {
        name: '同比增速',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: CHINA.growth,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { width: 3, color: COLORS.amber },
        itemStyle: { color: COLORS.amber, borderColor: '#fff', borderWidth: 1 },
        label: { show: true, position: 'top', color: '#fbbf24', fontSize: 11, formatter: (p) => (p.value != null ? p.value + '%' : '') },
      },
    ],
    animationDuration: 1200,
  });
}

/* ---------------- 图4b：大模型应用场景（环形图） ---------------- */
function initChartChinaPie() {
  register('chartChinaPie', {
    tooltip: Object.assign(tooltipStyle(), { trigger: 'item', valueFormatter: (v) => v + '%' }),
    graphic: {
      type: 'text', left: 'center', top: '42%',
      style: { text: CHINA_PIE[0].value + '%\n生产制造', textAlign: 'center', fill: '#22d3ee', fontSize: 18, fontWeight: 'bold', lineHeight: 26 },
    },
    series: [{
      type: 'pie',
      radius: ['55%', '75%'],
      center: ['50%', '50%'],
      itemStyle: { borderColor: '#0a0e1c', borderWidth: 3, borderRadius: 6 },
      label: { show: true, color: '#e6edf7', fontSize: 12, formatter: (p) => p.name + '\n' + Math.round(p.percent) + '%' },
      labelLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } },
      data: [
        { name: '生产制造环节大模型应用', value: CHINA_PIE[0].value, itemStyle: { color: COLORS.cyan } },
        { name: '其他应用场景', value: CHINA_PIE[1].value, itemStyle: { color: 'rgba(99,102,241,0.35)' } },
      ],
    }],
  });
}

/* ---------------- 图6：桑基图（作用机理） ---------------- */
function initChartSankey() {
  register('chartSankey', {
    tooltip: Object.assign(tooltipStyle(), { trigger: 'item', triggerOn: 'mousemove' }),
    series: [{
      type: 'sankey',
      left: 96, right: 116, top: 24, bottom: 24,
      nodeWidth: 16,
      nodeGap: 14,
      layoutIterations: 32,
      emphasis: { focus: 'adjacency' },
      label: { color: '#e6edf7', fontSize: 12, position: 'right' },
      lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.28 },
      nodeAlign: 'justify',
      data: SANKEY.nodes.map((n) => ({
        name: n.name,
        depth: n.depth,
        // 首列标签放左侧、其余放右侧，避免文字压在流线上或超出画布被裁切
        label: { position: n.depth === 0 ? 'left' : 'right' },
        itemStyle: { color: SERIES_COLORS[n.depth], borderColor: 'rgba(0,0,0,0.3)' },
      })),
      links: SANKEY.links,
    }],
  });
}

/* ---------------- 图7：各行业生产率提升（横向柱状图） ---------------- */
function initChartProductivity() {
  const sorted = PRODUCTIVITY.categories
    .map((c, i) => ({ name: c, value: PRODUCTIVITY.values[i] }))
    .sort((a, b) => a.value - b.value);
  register('chartProductivity', {
    grid: { left: 90, right: 60, top: 20, bottom: 30 },
    tooltip: Object.assign(tooltipStyle(), { trigger: 'axis', valueFormatter: (v) => '+' + v + '%' }),
    xAxis: {
      type: 'value', max: 50, name: '%',
      axisLabel: AXIS_LABEL, splitLine: SPLIT_LINE,
    },
    yAxis: {
      type: 'category',
      data: sorted.map((d) => d.name),
      axisLabel: Object.assign({}, AXIS_LABEL, { fontSize: 13 }),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
      axisTick: { show: false },
    },
    series: [{
      type: 'bar',
      barWidth: '55%',
      data: sorted.map((d, i) => ({
        value: d.value,
        itemStyle: {
          borderRadius: [0, 8, 8, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: SERIES_COLORS[0] },
            { offset: 1, color: SERIES_COLORS[(i + 1) % SERIES_COLORS.length] },
          ]),
        },
      })),
      label: { show: true, position: 'right', color: '#e6edf7', fontSize: 12, formatter: '+{c}%' },
    }],
    animationDuration: 1200,
  });
}

/* ---------------- 图7b：从使用到价值——AI 落地漏斗（麦肯锡 2026） ---------------- */
function initChartFunnel() {
  register('chartFunnel', {
    tooltip: Object.assign(tooltipStyle(), {
      trigger: 'item',
      formatter: (p) => p.name + '<br/>占比：' + p.value + '%',
    }),
    series: [{
      type: 'funnel',
      left: '2%', width: '52%', top: 16, bottom: 16,
      minSize: '36%',
      maxSize: '100%',
      sort: 'descending',
      gap: 5,
      label: {
        show: true, position: 'right', color: '#e6edf7', fontSize: 12, lineHeight: 16,
        formatter: (p) => p.name + '\n' + p.value + '%',
      },
      labelLine: { length: 12, lineStyle: { color: 'rgba(255,255,255,0.28)' } },
      itemStyle: { borderColor: 'rgba(10,14,28,0.9)', borderWidth: 2 },
      emphasis: { label: { fontSize: 13, fontWeight: 'bold' } },
      data: MCKINSEY_FUNNEL.map((d, i) => ({
        name: d.name,
        value: d.value,
        itemStyle: { color: SERIES_COLORS[i] },
      })),
    }],
  });
}

/* ---------------- 图8a：全球生成式 AI 专利年度公开量（柱状图） ---------------- */
function initChartPatentGlobal() {
  register('chartPatentGlobal', {
    grid: { left: 74, right: 30, top: 46, bottom: 40 },
    tooltip: Object.assign(tooltipStyle(), {
      trigger: 'axis',
      valueFormatter: (v) => fmtInt(v) + ' 件',
    }),
    xAxis: {
      type: 'category',
      data: PATENT_GLOBAL.years,
      axisLabel: Object.assign({}, AXIS_LABEL, { fontSize: 13 }),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value', name: '专利家族（件）',
      nameTextStyle: { color: '#9aa7bd' },
      axisLabel: Object.assign({}, AXIS_LABEL, { formatter: (v) => v / 1000 + 'k' }),
      splitLine: SPLIT_LINE,
    },
    series: [{
      name: '全球生成式 AI 专利家族',
      type: 'bar',
      barWidth: '46%',
      data: PATENT_GLOBAL.values,
      itemStyle: {
        borderRadius: [8, 8, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#ec4899' }, { offset: 1, color: '#a855f7' },
        ]),
      },
      label: {
        show: true, position: 'top', color: '#e6edf7', fontSize: 12,
        formatter: (p) => fmtInt(p.value),
      },
    }],
    animationDuration: 1200,
    animationEasing: 'cubicOut',
  });
}

/* ---------------- 图8b：2024–2025 新增量中的中国份额（环形图） ---------------- */
function initChartPatentShare() {
  const china = PATENT_SHARE[0].value;
  const total = PATENT_SHARE.reduce((s, d) => s + d.value, 0);
  const pct = Math.round((china / total) * 100);
  register('chartPatentShare', {
    tooltip: Object.assign(tooltipStyle(), {
      trigger: 'item',
      valueFormatter: (v) => fmtInt(v) + ' 件',
    }),
    legend: { bottom: 0, textStyle: { color: '#9aa7bd' }, itemWidth: 12, itemHeight: 12 },
    graphic: {
      type: 'text', left: 'center', top: '38%',
      style: {
        text: pct + '%\n中国', textAlign: 'center',
        fill: '#22d3ee', fontSize: 22, fontWeight: 'bold', lineHeight: 30,
      },
    },
    series: [{
      type: 'pie',
      radius: ['54%', '76%'],
      center: ['50%', '46%'],
      itemStyle: { borderColor: '#0a0e1c', borderWidth: 3, borderRadius: 6 },
      label: { show: true, color: '#e6edf7', fontSize: 12, formatter: (p) => p.name + '\n' + Math.round(p.percent) + '%' },
      labelLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } },
      data: [
        { name: '中国', value: china, itemStyle: { color: COLORS.cyan } },
        { name: '其他经济体', value: PATENT_SHARE[1].value, itemStyle: { color: 'rgba(99,102,241,0.4)' } },
      ],
    }],
  });
}

/* ---------------- 图8c：主要来源国——专利数量与增长率（柱+折线） ---------------- */
function initChartPatentCountry() {
  register('chartPatentCountry', {
    grid: { left: 74, right: 70, top: 48, bottom: 44 },
    tooltip: Object.assign(tooltipStyle(), { trigger: 'axis' }),
    legend: { top: 0, right: 8, textStyle: { color: '#9aa7bd' }, itemWidth: 14, itemHeight: 10 },
    xAxis: {
      type: 'category',
      data: PATENT_COUNTRY.names,
      axisLabel: Object.assign({}, AXIS_LABEL, { fontSize: 13 }),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
      axisTick: { show: false },
    },
    yAxis: [
      {
        type: 'value', name: '累计公开量（件）',
        nameTextStyle: { color: '#9aa7bd' },
        axisLabel: Object.assign({}, AXIS_LABEL, { formatter: (v) => v / 1000 + 'k' }),
        splitLine: SPLIT_LINE,
      },
      {
        type: 'value', name: 'CAGR（%）', max: 240,
        nameTextStyle: { color: '#9aa7bd' },
        axisLabel: AXIS_LABEL, splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '累计公开量（2014–2023）',
        type: 'bar',
        barWidth: '42%',
        data: PATENT_COUNTRY.counts,
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#ec4899' }, { offset: 1, color: '#a855f7' },
          ]),
        },
        label: {
          show: true, position: 'top', color: '#e6edf7', fontSize: 11,
          formatter: (p) => fmtInt(p.value),
        },
      },
      {
        name: '2023→2025 年均复合增长率',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: PATENT_COUNTRY.cagr,
        symbol: 'circle', symbolSize: 8,
        lineStyle: { width: 3, color: COLORS.amber },
        itemStyle: { color: COLORS.amber, borderColor: '#fff', borderWidth: 1 },
        // 加描边，避免标签压在柱子上时看不清
        label: {
          show: true, position: 'top', color: '#fbbf24', fontSize: 11, formatter: '{c}%',
          textBorderColor: 'rgba(6,9,20,0.9)', textBorderWidth: 3,
        },
      },
    ],
    animationDuration: 1200,
  });
}

/* ---------------- 图9：各行业 AI 采用率（横向柱状图） ---------------- */
function initChartAdoption() {
  const sorted = ADOPTION.categories
    .map((c, i) => ({ name: c, value: ADOPTION.values[i] }))
    .sort((a, b) => a.value - b.value);
  register('chartAdoption', {
    grid: { left: 130, right: 60, top: 20, bottom: 30 },
    tooltip: Object.assign(tooltipStyle(), { trigger: 'axis', valueFormatter: (v) => v + '%' }),
    xAxis: { type: 'value', max: 80, name: '%', axisLabel: AXIS_LABEL, splitLine: SPLIT_LINE },
    yAxis: {
      type: 'category',
      data: sorted.map((d) => d.name),
      axisLabel: Object.assign({}, AXIS_LABEL, { fontSize: 12 }),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
      axisTick: { show: false },
    },
    series: [{
      type: 'bar',
      barWidth: '58%',
      data: sorted.map((d) => ({
        value: d.value,
        itemStyle: {
          borderRadius: [0, 8, 8, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#3b82f6' }, { offset: 1, color: '#22d3ee' },
          ]),
        },
      })),
      label: { show: true, position: 'right', color: '#e6edf7', fontSize: 12, formatter: '{c}%' },
    }],
    animationDuration: 1200,
  });
}

/* ---------------- 图9b：全球 AI 市场行业构成（矩形树图） ---------------- */
function initChartTreemap() {
  register('chartTreemap', {
    tooltip: Object.assign(tooltipStyle(), { formatter: (p) => `${p.name}<br/>份额：${p.value}%` }),
    series: [{
      type: 'treemap',
      roam: false,
      nodeClick: false,
      breadcrumb: { show: false },
      label: { show: true, formatter: '{b}\n{c}%', fontSize: 13, color: '#fff', lineHeight: 22 },
      upperLabel: { show: false },
      itemStyle: { borderColor: '#0a0e1c', borderWidth: 3, gapWidth: 3, borderRadius: 8 },
      levels: [{ itemStyle: { borderWidth: 0, gapWidth: 4 } }],
      data: TREEMAP.map((d, i) => ({ ...d, itemStyle: { color: SERIES_COLORS[i % SERIES_COLORS.length] } })),
    }],
  });
}

/* ---------------- 初始化全部图表 ---------------- */
function initAllCharts() {
  if (typeof echarts === 'undefined') return false;
  initChartMarket();
  initChartGartner();
  initChartEconomy();
  initChartEconomyPie();
  initChartChina();
  initChartChinaPie();
  initChartSankey();
  initChartProductivity();
  initChartFunnel();
  initChartPatentGlobal();
  initChartPatentShare();
  initChartPatentCountry();
  initChartAdoption();
  initChartTreemap();
  return true;
}

function resizeAllCharts() {
  CHART_INSTANCES.forEach((c) => c && c.resize());
}
