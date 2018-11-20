
// 百度指数
option1 = {
  // 提示框
  tooltip : {
      trigger: 'axis',
      axisPointer: { // 中间提示线
        type: 'line',
        lineStyle: {
          color: 'rgba(17, 138,248, 1)'
        }
      },
      backgroundColor: 'rgba(15,139,245,1)',
      color: '#fff'
  },
  toolbox: {
      show : true,
      feature : {
          mark : {show: true}
      }
  },
  calculable : true,
  xAxis : {
          type : 'category',
          // 分隔线
          splitNumber: 4, // 分隔段数, category 类目中无效
          // 网格线
          splitLine:{
            show: true,
            lineStyle:{
               color: 'rgba(12,62,120)',
               width: 1,
               type: 'solid'
            }
          },
          // 标尺文字
          axisLabel: {
              show: true,
              textStyle: {
                  color: '#fff'
              }
          },
          // 标尺线
          axisLine: {
            lineStyle:{
               color: 'rgba(12,62,120)',
               width: 1,
               type: 'solid'
            }
          },
          boundaryGap : false,
          data :
          // ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
          [
            '7月01日',
            '7月02日',
            '7月03日',
            '7月04日',
            '7月05日',
            '7月06日',
            '7月07日',
            '7月08日',
            '7月09日',
            '7月10日',
            '7月11日',
            '7月12日',
            '7月13日',
            '7月14日',
            '7月15日',
            '7月16日',
            '7月17日',
            '7月18日',
            '7月19日',
            '7月20日',
            '7月21日',
            '7月22日',
          ]
      },
      yAxis : {
          type : 'value',
          splitNumber: 6,
          // 网格线
          splitLine:{
            show: true,
            lineStyle:{
               color: 'rgba(12,62,120)',
               width: 1,
               type: 'solid'
            }
          },
          // 标尺文字
          axisLabel: {
              show: true,
              textStyle: {
                  color: '#fff'
              }
          },
          // 标尺线
          axisLine: {
            lineStyle:{
               color: 'rgba(12,62,120)',
               width: 1,
               type: 'solid'
            }
          }
      },
      series : {
          // 曲线
          name:'指数',
          smooth:true,
          type:'line',
          stack: '总量',
          itemStyle : {
            normal : {
              color:'rgba(0, 150, 247, 1)',
              lineStyle:{
                color: "rgba(0, 166, 255, 1)",
                width: 4,
                type: 'solid'
              }
            }
          },
          data:[120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210, 230]
      }
};
