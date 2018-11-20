
// 播出平台
const platforms = [
  {'name': '腾讯视频', 'logo': './static/img/v.qq.png'},
  {'name': '爱奇艺', 'logo': './static/img/iqiyi.png'},
  {'name': '优酷', 'logo': './static/img/youku.png'},
  {'name': '芒果TV', 'logo': './static/img/mgtv.png'},
  {'name': '搜狐视频', 'logo': './static/img/souhushipin.png'},
  {'name': '湖南卫视', 'logo': './static/img/hunanweishi.png'},
  {'name': '江苏卫视', 'logo': './static/img/jiangsuweishi.png'},
  {'name': '浙江卫视', 'logo': './static/img/zhejiangweishi.png'}
];
// 配合权益
const rights = [
  {'title': '长期代言', 'valid': 0, 'key': 'long'},
  {'title': '短期代言', 'valid': 0, 'key': 'short'},
  {'title': '商业站台活动', 'valid': 0, 'key': 'activity'},
  {'title': 'ID录制', 'valid': 0, 'key': 'record'},
  {'title': '小红书', 'valid': 0, 'key': 'book'},
  {'title': '商业微博', 'valid': 0, 'key': 'bus'},
  {'title': '肖像权', 'valid': 0, 'key': 'portrait'}
];


// vue 实例
var app = new Vue({
  el: '#app',
  filters:  {
    formatNumber: function (value) {
      return formatNumber(value)
    },
    matchPlatform: function (value) {
      for (let i = 0; i < platforms.length; i ++) {
        if (platforms[i].name == value) {
          return platforms[i].logo
        }
      }
    }
  },
  data: {
    platforms: platforms,
    right1: null,
    rights: [],
    hasRights: true,
    name: '',
    render: false,
    key: '',
    loaded: false,
    star: {},
    rank: [],
    maxRank: 1,
    list: [],
    last: '',
    showUpButton: false,
    brand_open: false,
    timmer: null,
    scrollStart: 0,
    scrollEnd: 0
  },
  methods: {
    initData () {
      var params = getQueryString(window.location.href)
      var name = this.key = params.name || ''

      axios.get('http://39.106.254.132:8087/api/search_star/', {params: {star_name: name}})
      .then(response => {
        if (response.data && response.data.name) {
          this.star = response.data
          initChartsLine(response.data.index_date, response.data.index_num)
          initChartsBar(response.data.age, response.data.age_num)

          initChartMal(response.data.male_num, response.data.female_num)
          initChartFemaleMal(response.data.male_num, response.data.female_num)

          this.provinceRank(response.data.provinces, response.data.province_num)
          initChartsMap(response.data.provinces, response.data.province_num)
          // initChartsPosition(response.data.provinces, response.data.province_num)

          // 权益数据
          this.initRights(response.data);
        }
        this.loaded = true
      })
      .catch (error => {
        this.loaded = true
        return Promise.reject(error)
      })
    },
    // 权益数据
    initRights (data) {
      let newRights = []

      rights.map(function(right){

        let key = right.key
        let minKey = right.key + 'Min'
        let maxKey = right.key + 'Max'

        let valid = data[key]
        let min = data[minKey]
        let max = data[maxKey]

        let desc = ''

        if (valid) {
          if (min && max) {
            desc = min + '-' + max + '万'
          } else if (min && !max) {
            desc = min + '万起'
          } else if (!min && max) {
            desc = '最高' + max + '万'
          } else {
            desc = '待定'
          }
          let r = {
            'title': right.title,
            'desc': desc,
            'valid': valid
          }
          newRights.push(r)
        } else {
          //
        }
      })

      this.hasRights = newRights.length > 0

      // 根据奇偶数展示权益
      let odd = newRights.length % 2 !== 0

      if (odd) {
        this.right1 = newRights.splice(0, 1)[0]
      }

      this.rights = newRights
    },
    provinceRank (provinces, province_num) {

      var data = provinces.map(function(value, index) {
        return {name: provinces[index], value: 34 - province_num[index]}
      })

      data.sort(function(o1, o2) {
          if (isNaN(o1.value) || o1.value == null) return -1;
          if (isNaN(o2.value) || o2.value == null) return 1;
          return o1.value - o2.value;
      });

      this.maxRank = data[data.length - 1].value

      for (var i = data.length; i > data.length - 10; i --) {
        this.rank.push(data[i - 1])
      }
    },
    // 搜索
    onSearch (e) {
      e.preventDefault()
      if (this.key) {
        window.location.href = "?name=" + this.key
      }
    },
    handleScroll () {
      var self = this

      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.showUpButton = false

      clearTimeout(this.timer)

      this.scrollEnd = scrollTop

      this.timer = setTimeout(function() {
         self.scrollStart = scrollTop
         self.showUpButton = (scrollTop > 800)
       }, 400)
    },
    scrollTop (e) {
      e.preventDefault()
      var d = document,
        dd = document.documentElement,
        db = document.body,
        top = dd.scrollTop || db.scrollTop,
        step = Math.floor(top / 20);
       (function() {
           top -= step
           if (top > -step) {
               dd.scrollTop == 0 ? db.scrollTop = top: dd.scrollTop = top
               setTimeout(arguments.callee, 20)
           }
       })()
    }
  },
  mounted () {
    this.render = true
    window.addEventListener('scroll', this.handleScroll)
    var params = getQueryString(window.location.href)
    if (params && params.name) {
      this.initData()
    } else {
      // this.getList()
    }
  }
})

// 转换数字
function formatNumber (n) {
  return !n ? '无' : n < 10000 ? n
   : ( n < 100000000) ? Math.floor (n / 1000) / 10 + "万"
   : Math.floor (n / 10000000) / 10 + "亿"
}

//曲线图
function initChartsLine(date, data) {

    var start = (data.length)>10 ? 100-(7/(date.length)*100) : 0;

    option = {
        tooltip : {
            trigger: 'axis',
            axisPointer: { // 中间提示线
              type: 'line',
              lineStyle: {
                color: 'rgba(17, 138,248, 1)'
              }
            },
            backgroundColor: 'rgba(15,139,245,1)',
            color: '#fff',
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        title: {
            left: 'center',
            text: '',
        },

        xAxis: {
            type: 'category',
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
                height: '20px',
                lineHeight: '3em',
                fontSize: 10,
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
            // 刻度
            axisTick: {
              show: true,
              lineStyle: {
                color: '#00c1fa'
              }
            },
            boundaryGap: false,
            data: date
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
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
        // dataZoom: [{
        //     type: 'inside',
        //     start: start,
        //     end: 100,
        //     disabled:true,
        //     backgroundColor: 'rgba(247,250,253,.11)',
        // }, {
        //     start: start,
        //     end: 100,
        //     handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        //     handleSize: '80%',
        //     handleStyle: {
        //         color: '#fff',
        //         shadowBlur: 3,
        //         shadowColor: 'rgba(0, 0, 0, 0.6)',
        //         shadowOffsetX: 2,
        //         shadowOffsetY: 2
        //     }
        // }],
        dataZoom:{
            start: 85,
            end: 100,
            backgroundColor: 'rgba(255,255,255, .1)',
            borderColor: 'rgba(38, 78, 172, .5)',
            fillerColor: 'rgba(4, 24, 61, 0.5)',
            dataBackground: {
                areaStyle: {
                    color: 'rgba(0, 151,253, .5)'
                }
            },
            bottom: 0,
            // handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleIcon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHYAAACHCAYAAADDaa2tAAADnUlEQVR4nO3dS7LTMBBGYSXAHMbsAhbDjlgLm4GtXKoYXiAMwBfH8VNqSd2/z5nAIFU4/dHCeVD38v7zj3SSbv9+vXS9ikZde18A1ekssLeF38t2Btg5SHncM8CeMnXYtc2U3lpl2D1wsrjKsKdOFfbIJkpurSJsDpQcrhpsCZAUrhKsBYwMrgqsJYgErgJsDYjwuNFhawKExn3d+wIyazX0sB/1RYPttUXhgKPAejkWwwB7h/UCOs09sEdYr5hzja/VFbIn2Eigc7naYg+w0UGnuQDuCasGOq0rcK83KNRRx3V5rq039kyg45pvb8uNPSvquGYzaLGxgN7XZHtrbyyoy1WdTU1YULerNqNasKDur8qsasCCejzzmVnDgpqf6eysYJ8SqBaZzbAY9tXv9Cml9NbgWuhvJrjFsL+u6YvFhdBdxbilsBy/9SqabQksqPXLnnEuLKjtypp1DuxTzh9ERR2eeQ4sd8DtOzzzo7Acwf06NPsjsKD2b7dB9P+7QwvthWVb/bTLYg/sc+GFkH2bJntgPXz3mO7bNNmC5Qj226oNN0+ircGyrf5bNGJjRVuCZVvjNGvFxoo2B/u1+VVQaQ+va+dgPzS4ELLt4XUtR7FoU1humuJ2Z8fGigasaGNYjuH4vRiysaIBKxqwog2w/Puq0y0lNlY2YEUDVjRgRQNWtGvijlixGxsrGrCiASsasKIBKxqwogErGrCiASsasKIBKxqwogErGrCiASvaNTn5eadk2oWNFQ1Y0YAVDVjRBthvXa+CLLuk9B/2Y8cLoQpxFIsGrGhjWN6oiN+LIRsrGrCiTWE5juN2Z8fGigasaHOwHMfxejBjY0VbgmVr4zRrxcaKtgbL1vpv0YiNFW0Llq3126oNGxuzn1sP2APL1vrrzdYD9m4suH7aZcFRHKvvex94BJat7d+7vQ88urHg9uvQ7HOOYr6q2r7DC5UDy1dVA5R788SR3K6sWZfcFYNbv+wZl77cAbdeRbO1eB0Lrn3FM7V6gwJcu0xmafnOE7jlmc3Q+i1FcPMznV2N94rBPZ75zB5+aLtRw4XyE0LWq7YEtT/dYXuXqzqbFh/bgXvfJTWYSavPY5s8mQA1m0HrD9rPitv8L3aPb1CcbXu7PNdad8V7Ur9z7vqXtyfskBqwi9PIA+xQZGAXmOM8wQ6Nh+Qd2R3okEfYcR6R3WKO8w47bjrQVtAhIKdFgp02N/DnlPecQuKt9Qdp1G+y99r5jQAAAABJRU5ErkJggg==',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            },
            textStyle: {
              color: '#fff'
            }
        },
        series: [
            {
                name:'指数 ',
                type:'line',
                smooth:true,
                symbol: 'none',
                sampling: 'average',
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
                data: data
            }
        ]
    };

    //百度指数
    var dom = document.getElementById("baiduzhishu");
    var myChart = echarts.init(dom);

    // 小图
    var dom2 = document.getElementById("baiduzhishu-small");
    var myChart2 = echarts.init(dom2);


    if (option && typeof option === "object") {
        myChart.setOption(option, true);
        myChart2.setOption(option, true);
    }
}


//年龄柱状图
function initChartsBar(age,age_num) {
    var dom = document.getElementById("age");
    var myChart = echarts.init(dom);
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}:\n{c}%'
        },
        xAxis: {
            type: 'category',
            data: age,
            // 网格线
            splitLine:{
              show: true,
              lineStyle:{
                 color: 'rgba(12,62,120)',
                 width: 1,
                 type: 'solid'
              }
            },
            // 刻度
            axisTick: {
              show: false
            },
            // 标尺文字
            axisLabel: {
                show: true,
                fontSize: 12,
                height: 100,
                color: '#fff',
                padding: [5, -5, 5, -5]
            },
            // 标尺线
            axisLine: {
              lineStyle:{
                 color: 'rgba(12,62,120)',
                 width: 1,
                 type: 'solid'
              }
            },
        },
        yAxis: {
            type: 'value',
            // 网格线
            position: 'right',
            max: 100,
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
                formatter: '{value} %',
                fontSize: 14,
                show: true,
                textStyle: {
                    color: '#fff'
                }
            },
            // 标尺线
            axisLine: {
              show: false,
              lineStyle:{
                 color: 'rgba(12,62,120)',
                 width: 1,
                 type: 'solid'
              }
            }
        },
        series: [{
            data: age_num,
            type: 'bar',
            itemStyle:{
                normal: {
                    color:'#30a3f4'
                }
            }

        }]
    };

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

// 男性
function initChartMal(male_num, female_num) {
  option = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    graphic: {
        type: 'text',
        top: 'center',
        left: 'center',
        z: 2,
        zlevel: 100,
        style: {
            text: male_num + '%',
            textAlign: 'center',
            fill: '#fff',
            font: '20px "STHeiti", sans-serif'
        }
    },
    series: [
        {
            name:'性别分布',
            type:'pie',
            radius: ['75%', '80%'],
            avoidLabelOverlap: false,
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:male_num, name: '男性', itemStyle: {color: '#00fef2'}},
                {value:female_num, name: '女性', itemStyle: {color: 'rgba(38, 78, 172, .35)'}}
            ]
        }
    ]
};
var dom = document.getElementById("male");
var myChart = echarts.init(dom);
myChart.setOption(option, true);
}
// 女性
function initChartFemaleMal(male_num, female_num) {
  option = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    graphic: {
        type: 'text',
        top: 'center',
        left: 'center',
        z: 2,
        zlevel: 100,
        style: {
            text: female_num + '%',
            textAlign: 'center',
            fill: '#fff',
            font: '20px "STHeiti", sans-serif'
        }
    },
    series: [
        {
            name:'性别分布',
            type:'pie',
            radius: ['75%', '80%'],
            avoidLabelOverlap: false,
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
              {value:female_num, name: '女性', itemStyle: {color: '#fe006c'}},
              {value:male_num, name: '男性', itemStyle: {color: 'rgba(38, 78, 172, .35)'}}
            ]
        }
    ]
};
var dom = document.getElementById("female");
var myChart = echarts.init(dom);
myChart.setOption(option, true);
}


// 地图
function initChartsMap (provinces, province_num) {
var defaultData = [{
        name: '北京',
        value: 0
    },
    {
        name: '天津',
        value: 0
    },
    {
        name: '上海',
        value: 0
    },
    {
        name: '重庆',
        value: 0
    },
    {
        name: '河北',
        value: 0
    },
    {
        name: '河南',
        value: 0
    },
    {
        name: '云南',
        value: 0
    },
    {
        name: '辽宁',
        value: 0
    },
    {
        name: '黑龙江',
        value: 0
    },
    {
        name: '湖南',
        value: 0
    },
    {
        name: '安徽',
        value: 0
    },
    {
        name: '山东',
        value: 0
    },
    {
        name: '新疆',
        value: 0
    },
    {
        name: '江苏',
        value: 0
    },
    {
        name: '浙江',
        value: 0
    },
    {
        name: '江西',
        value: 0
    },
    {
        name: '湖北',
        value: 0
    },
    {
        name: '广西',
        value: 0
    },
    {
        name: '甘肃',
        value: 0
    },
    {
        name: '山西',
        value: 0
    },
    {
        name: '内蒙古',
        value: 0
    },
    {
        name: '陕西',
        value: 0
    },
    {
        name: '吉林',
        value: 0
    },
    {
        name: '福建',
        value: 0
    },
    {
        name: '贵州',
        value: 0
    },
    {
        name: '广东',
        value: 0
    },
    {
        name: '青海',
        value: 0
    },
    {
        name: '西藏',
        value: 0
    },
    {
        name: '四川',
        value: 0
    },
    {
        name: '宁夏',
        value: 0
    },
    {
        name: '海南',
        value: 0
    },
    {
        name: '台湾',
        value: 0
    },
    {
        name: '香港',
        value: 0
    },
    {
        name: '澳门',
        value: 0
    }
];

// var data2 = provinces.map(function(value, index) {
//   return {name: provinces[index], value: province_num[index]}
// })

var data = defaultData.map(function (val, ind) {
  var index = provinces.indexOf(val.name);
  val.value = (index > -1) ? parseInt(province_num[index]) : 0
  return val
})

var yData = [];

data.sort(function(o1, o2) {
    if (isNaN(o1.value) || o1.value == null) return -1;
    if (isNaN(o2.value) || o2.value == null) return 1;
    return o1.value - o2.value;
});

var option = {
    tooltip: {
        show: true,
        formatter: function(params) {
            return params.name + '：' + params.data['value']
        },
    },
    visualMap: {
        type: 'piecewise',
        // text: ['', ''],
        // showLabel: true,
        // seriesIndex: [0],
        // min: 0,
        // max: 7,
        // inRange: {
        //     color: ['#edfbfb', '#b7d6f3', '#40a9ed', '#3598c1', '#215096', ]
        // },
        textStyle: {
            color: '#fff'
        },
        left: 'left',
        bottom: 100,
        show : true,
        inverse:true,
        pieces: [
            {start: 1, end: 6, label: '1 - 6', color: '#2296f8', symbol: 'rect'},
            {start: 7, end: 13, label: '7 - 13', color: '#22a1fb', symbol: 'rect'},
            {start: 14, end: 20, label: '14 - 20', color: '#23b1fc', symbol: 'rect'},
            {start: 21, end: 27, label: '21 - 27', color: '#5ad2ff', symbol: 'rect'},
            {start: 28, end: 34, label: '28 - 34', color: '#5de0ff', symbol: 'rect'}
        ]
    },
    grid: {
        right: 10,
        top: 80,
        bottom: 30,
        width: '0%'
    },
    xAxis: {
        type: 'value',
        show: false,
        scale: true,
        position: 'top',
        splitNumber: 10,
        boundaryGap: false,
        splitLine: {
            show: false
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            show:false,
            margin: 2,
            textStyle: {
                color: '#fff'
            }
        }
    },
    yAxis: {
        type: 'category',
        nameGap: 10,
        axisLine: {
            show: false,
            lineStyle: {
                color: '#ddd'
            }
        },
        axisTick: {
            show: false,
            lineStyle: {
                color: '#ddd'
            }
        },
        axisLabel: {
            interval: 0,
            textStyle: {
                color: '#fff'
            }
        },
        data: yData
    },
    geo: {
        roam: false,
        map: 'china',
        left: 'left',
        right:'300',
        layoutSize: '80%',
        label: {
            emphasis: {
                show: false
            }
        },
        itemStyle: {
            borderColor: 'none',
            emphasis: {
                areaColor: '#23b1fc'
            }
        },
        regions: [{
            name: '南海诸岛',
            value: 0,
            itemStyle: {
                normal: {
                    opacity: 0,
                    label: {
                        show: false
                    }
                }
            }
        }],
    },
    series: [{

        name: 'mapSer',
        type: 'map',
        roam: false,
        geoIndex: 0,
        label: {
            show: false,
        },
        data: data
    }, {
        name: 'barSer',
        type: 'bar',
        roam: false,
        visualMap: false,
        zlevel: 2,
        barMaxWidth: 20,
        itemStyle: {
            normal: {
                color: '#40a9ed'
            },
            emphasis: {
                color: "#3596c0"
            }
        },
        label: {
            normal: {
                show: false,
                position: 'right',
                offset: [0, 10]
            },
            emphasis: {
                show: true,
                position: 'right',
                offset: [10, 0]
            }
        },
        data: data
    }]
};

var myChart = echarts.init(document.getElementById("map"));
var myChart2 = echarts.init(document.getElementById("map-small"));
myChart.setOption(option);
myChart2.setOption(option);
}

function initChartsPosition(province,num) {
    var mydata = [
        {name: '北京',value:0 },{name: '天津',value: 0 },
        {name: '上海',value:0 },{name: '重庆',value:0 },
        {name: '河北',value:0 },{name: '河南',value:0 },
        {name: '云南',value:0 },{name: '辽宁',value:0 },
        {name: '黑龙江',value:0 },{name: '湖南',value:0 },
        {name: '安徽',value:0 },{name: '山东',value:0 },
        {name: '新疆',value:0 },{name: '江苏',value:0 },
        {name: '浙江',value:0 },{name: '江西',value:0 },
        {name: '湖北',value:0 },{name: '广西',value:0 },
        {name: '甘肃',value:0 },{name: '山西',value:0 },
        {name: '内蒙古',value:0 },{name: '陕西',value:0 },
        {name: '吉林',value:0 },{name: '福建',value:0 },
        {name: '贵州',value:0 },{name: '广东',value:0 },
        {name: '青海',value:0 },{name: '西藏',value:0 },
        {name: '四川',value:0 },{name: '宁夏',value:0 },
        {name: '海南',value:0 },{name: '台湾',value:0 },
        {name: '香港',value:0 }
    ];

    mydata.forEach(function (arr,index) {
        var ind = province.indexOf(arr.name);
        if(ind>-1){
            mydata[index].value=num[ind];
        }
    })
    var optionMap = {
        backgroundColor: '#fff',
        title: {
            text: '',
            subtext: '',
            x:'left'
        },
        tooltip : {
            trigger: 'item'
        },
        //左侧小导航图标
        visualMap: {
            show : true,
            x: '30px',
            y: '50px',
            inverse:true,
            splitList: [
                {start: 1, end: 6, label: '1 - 6', color: '#30a3f4'},
                {start: 7, end: 13, label: '7 - 13', color: '#39d3ff'},
                {start: 14, end: 20, label: '14 - 20', color: '#a8ecff'},
                {start: 21, end: 27, label: '21 - 27', color: '#d4f6ff'},
                {start: 28, end: 34, label: '28 - 34', color: '#eefbff'}
            ]
            // color: ['#eefbff','#d4f6ff','#a8ecff','#39d3ff', '#30a3f4']
        },
        //配置属性
        series: [{
            name: '排名',
            type: 'map',
            mapType: 'china',
            roam: false,
            label: {
                normal: {
                    show: true  //省份名称
                },
                emphasis: {
                    show: false
                },
                textStyle: {
                    color: "red"
                }
            },
            itemStyle:{
                borderColor: '#fff',
                emphasis:{
                    areaColor: '',
                },
            },

            data:mydata  //数据
        }]
    };
    //初始化echarts实例
    var myChart = echarts.init(document.getElementById('position'));

    //使用制定的配置项和数据显示图表
    myChart.setOption(optionMap);

    /*城市*/
    // var cityDom = '<h3 style="margin-bottom: 20px;">省份排名前十</h3>';
    // for(var i=0;i<10;i++){
    //     var min = Math.min.apply({}, num)+'';
    //     var index = num.indexOf(min);
    //     var long = (33-min*1.5)/33*135;
    //     cityDom += '<div class="city-list"> <span class="city-name">'+province[index]+'</span><span class="city-line" style="width: '+long+'px"></span> </div>';
    //     num.splice(index, 1);
    //     province.splice(index, 1);
    // }
    // $('.tongji-city').html(cityDom)
}
