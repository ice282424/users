<template>
  <main class="content">
    <div class="charts-container">
      <div class="chart-item" ref="pieChartRef"></div>
      <div class="chart-item" ref="lineChartRef"></div>
      <div class="chart-item" ref="barChartRef"></div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const pieChartRef = ref(null)
const lineChartRef = ref(null)
const barChartRef = ref(null)

onMounted(() => {
  const pieChart = echarts.init(pieChartRef.value, 'dark')
  const pieOption = {
    backgroundColor: 'rgba(10, 30, 50, 0.9)',
    tooltip: {
      trigger: 'item',
    },
    legend: {
      right: '5%',
      orient: 'vertical',
      top: 'center',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 30,
      formatter: function (name) {
        const match = name.match(/^(\S+)\s+(\S+)\s+\|\s+(\S+)$/)
        if (match) {
          const [, status, value, percent] = match
          const baseSpaces = '\u00A0\u00A0\u00A0\u00A0'
          const extraSpaces = status === '正常' ? '\u00A0\u00A0\u00A0' : ''
          const spaces = baseSpaces + extraSpaces

          return `{status|${status}${spaces}}{value|${value} | ${percent}}`
        }
        return name
      },
      textStyle: {
        rich: {
          status: {
            color: '#C4CBD3',
            fontWeight: 500,
            fontSize: 14,
          },
          value: {
            color: '#EEF3F9',
            fontWeight: 'bold',
            fontSize: 14,
          },
        },
      },
    },
    series: [
      {
        type: 'pie',
        center: ['40%', '50%'],
        radius: ['30%', '26%'],
        avoidLabelOverlap: false,
        padAngle: 1,
        itemStyle: {
          borderRadius: 2,
        },
        label: {
          show: true,
          position: 'center',
          formatter: '{total|总数}\n{num|110}',
          fontSize: 20,
          rich: {
            total: {
              color: 'rgba(148, 163, 182, 1)',
              fontWeight: 500,
              fontSize: 14,
            },
            num: {
              color: 'RGBA(188, 216, 240, 1)',
              fontWeight: 'bold',
              fontSize: 24,
              lineHeight: 30,
              backgroundColor: 'transparent',
              border: '2px solid #5F666C',
            },
          },
        },
        emphasis: {
          label: {
            show: true,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: 25,
            name: '正常 25个 | 32%',
            itemStyle: { color: 'RGBA(255, 65, 65, 1)' },
          },
          {
            value: 25,
            name: '维修中 25个 | 32%',
            itemStyle: { color: 'RGBA(255, 132, 0, 1)' },
          },
          {
            value: 60,
            name: '维护中 60个 | 32%',
            itemStyle: { color: 'RGBA(0, 255, 124, 1)' },
          },
        ],
      },
      {
        type: 'pie',
        center: ['40%', '50%'],
        radius: ['35%', '34%'],
        avoidLabelOverlap: false,
        itemStyle: {
          color: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 0,
        },
        label: { show: false },
        labelLine: { show: false },
        data: [{ value: 1 }],
      },
    ],
  }
  pieChart.setOption(pieOption)

  const lineChart = echarts.init(lineChartRef.value, 'dark')
  const lineOption = {
    backgroundColor: 'rgba(10, 30, 50, 0.9)',
    title: {
      text: '(h)',
      left: '9%',
      top: '7%',
      textStyle: {
        color: '#C4CBD3',
        opacity: 0.6,
        fontSize: 12,
      },
    },
    xAxis: {
      type: 'category',
      data: ['1日', '2日', '3日', '4日', '5日', '6日', '7日'],
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: 'rgba(130, 144, 157, 0.26)',
          type: 'dashed',
        },
      },
      axisLabel: { color: 'rgba(130, 144, 157, 0.6)' },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(130, 144, 157, 1)', opacity: 0.6 } },
      axisLabel: { color: 'rgba(130, 144, 157, 1)', opacity: 0.6 },
      min: 0,
      max: 10,
      interval: 2,
      splitLine: {
        lineStyle: {
          color: 'rgba(130, 144, 157, 1)',
          type: 'dashed',
          opacity: 0.6,
        },
      },
    },
    series: [
      {
        type: 'line',
        data: [4, 8, 6, 4, 5, 3, 8],
        smooth: true,
        showSymbol: false,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#ffffff',
          borderWidth: 4,
          shadowBlur: 2,
          shadowColor: '#fff',
        },
        emphasis: {
          symbolSize: 5,
          itemStyle: {
            color: 'white',
            borderColor: 'RGBA(46, 239, 255, 0.4)',
            borderWidth: 10,
          },
        },
        lineStyle: {
          color: 'rgba(46, 239, 255, 1)',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(46, 239, 255, 0.2)' },
              { offset: 0.8, color: 'rgba(46, 239, 255, 0)' },
              { offset: 1, color: 'rgba(46, 239, 255, 0)' },
            ],
          },
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: 'rgba(255, 255, 255, 1)',
          width: 0.5,
          type: 'solid',
        },
      },
    },
  }
  lineChart.setOption(lineOption)

  const barChart = echarts.init(barChartRef.value, 'dark')

  const dataArr = {
    xdata: ['1日', '2日', '3日', '4日', '5日', '6日', '7日'],
    result: [
      { name: '运行时间', data: [10, 10, 10, 10, 5, 5, 5] },
      { name: '停机时间', data: [8, 8, 8, 8, 4, 4, 4] },
      { name: '维修时间', data: [6, 3, 3, 3, 3, 3, 3] },
      { name: '故障停机时间', data: [4, 2, 2, 2, 2, 2, 2] },
      { name: '维护停机时间', data: [2, 1, 1, 1, 1, 1, 1] },
    ],
  }

  const colorMap = {
    运行时间: 'rgba(205, 107, 19, 1)',
    停机时间: 'rgba(0, 139, 245, 1)',
    维修时间: 'rgba(24, 224, 194, 1)',
    故障停机时间: 'rgba(113, 70, 204, 1)',
    维护停机时间: 'rgba(178, 17, 19, 1)',
  }

  const gradientMap = {
    运行时间: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: colorMap['运行时间'] },
      // { offset: 0.1, color: colorMap['运行时间'] },
      { offset: 1, color: 'rgba(41, 21, 3, 0.2)' },
    ]),
    停机时间: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: colorMap['停机时间'] },
      // { offset: 0.1, color: colorMap['停机时间'] },
      { offset: 1, color: 'rgba(0, 28, 49, 0.2)' },
    ]),
    维修时间: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: colorMap['维修时间'] },
      // { offset: 0.1, color: colorMap['维修时间'] },
      { offset: 1, color: 'rgba(5, 45, 39, 0.2)' },
    ]),
    故障停机时间: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: colorMap['故障停机时间'] },
      // { offset: 0.1, color: colorMap['故障停机时间'] },
      { offset: 1, color: 'rgba(23, 14, 41, 0.2)' },
    ]),
    维护停机时间: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: colorMap['维护停机时间'] },
      // { offset: 0.1, color: colorMap['维护停机时间'] },
      { offset: 1, color: 'rgba(36, 3, 4, 0.2)' },
    ]),
  }

  const barWidth = 13
  const borderRadius = barWidth / 2

  const dailyOrder = dataArr.xdata.map((_day, dayIdx) => {
    const withIndices = dataArr.result.map((type, idx) => ({
      name: type.name,
      duration: type.data[dayIdx],
      originalIdx: idx,
    }))
    return withIndices.sort((a, b) => {
      if (a.duration !== b.duration) return a.duration - b.duration
      return a.originalIdx - b.originalIdx
    })
  })

  const dailyZIndex = dailyOrder.map((sortedDay) => {
    const total = sortedDay.length
    return sortedDay.reduce((zMap, item, rank) => {
      zMap[item.name] = total - rank
      return zMap
    }, {})
  })

  const zValuesMap = {}
  dataArr.result.forEach((type) => {
    const typeName = type.name
    zValuesMap[typeName] = []
    dataArr.xdata.forEach((_, dayIdx) => {
      zValuesMap[typeName].push(dailyZIndex[dayIdx][typeName])
    })
  })

  const series = dataArr.result.map((type) => {
    const typeName = type.name
    return {
      type: 'bar',
      name: typeName,
      data: type.data.map((value, idx) => ({
        value: value,
        itemStyle: {
          z: zValuesMap[typeName][idx],
          opacity: 0.95,
        },
      })),
      barWidth: barWidth,
      barGap: '-100%',
      barCategoryGap: '40%',
      itemStyle: {
        color: gradientMap[typeName],
        borderRadius: [borderRadius, borderRadius, borderRadius, borderRadius],
      },
    }
  })

  const tooltip = {
    trigger: 'axis',
    formatter: function (params) {
      const dayIdx = dataArr.xdata.indexOf(params[0].name)
      const sortedParams = [...params].sort((a, b) => {
        const aRank = dailyOrder[dayIdx].findIndex((item) => item.name === a.seriesName)
        const bRank = dailyOrder[dayIdx].findIndex((item) => item.name === b.seriesName)
        return aRank - bRank
      })

      let html = `<div style="background: rgba(10, 30, 50, 0.9); border: 1px solid rgba(46, 239, 255, 0.5); border-radius: 6px; padding: 10px;">`
      html += `<div style="font-size: 14px; font-weight: bold; color: #fff; margin-bottom: 8px;">${params[0].name}</div>`

      sortedParams.forEach((item) => {
        html += `<div style="display: flex; align-items: center; margin-bottom: 4px;">`
        html += `<span style="display: inline-block; width: 10px; height: 10px; background: ${colorMap[item.seriesName]}; border-radius: 2px; margin-right: 6px;"></span>`
        html += `<span style="color: #fff; opacity: 0.8;">${item.seriesName}：</span>`
        html += `<span style="color: #fff; margin-left: 4px;">${item.value}h</span>`
        html += `</div>`
      })

      html += `</div>`
      return html
    },
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  }

  const legend = {
    right: '2%',
    top: '2%',
    // align: 'right',
    data: dataArr.result.map((item) => ({
      name: item.name,
      itemStyle: {
        color: colorMap[item.name],
      },
    })),
    textStyle: { fontSize: 14, color: '#fff', opacity: 0.6 },
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 20,
    orient: 'horizontal',
    selectedMode: false,
    icon: 'rect',
  }

  const grid = {
    top: '20%',
    left: '8%',
    right: '5%',
    bottom: '15%',
    containLabel: true,
  }

  const xAxis = {
    type: 'category',
    data: dataArr.xdata,
    axisTick: { show: false },
    axisLine: {
      lineStyle: { color: 'rgba(130, 144, 157, 0.26)', type: 'dashed' },
    },
    axisLabel: {
      fontSize: 12,
      color: '#fff',
      opacity: 0.26,
    },
  }

  const yAxis = [
    {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: 'rgba(130, 144, 157, 0.6)',
          type: 'dashed',
          opacity: 0.26,
        },
      },
      axisLine: { show: false },
      axisLabel: {
        fontSize: 12,
        color: '#fff',
        opacity: 0.26,
      },
      min: 0,
      max: 10,
      interval: 2,
    },
  ]

  const barOption = {
    backgroundColor: 'rgba(10, 30, 50, 0.9)',
    tooltip,
    legend,
    grid,
    xAxis,
    yAxis,
    series,
    graphic: [
      {
        type: 'text',
        left: '8%',
        top: '13%',
        style: {
          text: '(h)',
          fill: '#C4CBD3',
          fontSize: 12,
          opacity: 0.26,
        },
      },
    ],
  }

  barChart.setOption(barOption)

  window.addEventListener('resize', () => {
    barChart.resize()
    pieChart && pieChart.resize()
    lineChart && lineChart.resize()
  })
})
</script>

<style scoped>
.content {
  flex: 1;
  background-color: rgb(35, 52, 77);
}
.charts-container {
  background-color: RGBA(23, 45, 74, 1);
  display: flex;
  justify-content: space-around;
  padding: 20px;
}

.chart-item {
  width: 30%;
  height: 400px;
}
</style>
