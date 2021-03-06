http://39.106.254.132:8087/starEyes_starInfo?star_name=%E9%B9%BF%E6%99%97

【2018-09-10更新说明】

- 地图数据颜色反向处理

- 自动匹配播出平台

- 补充商业权益数据

- 商业授权数据 将按照 奇偶数自动排版显示

【需要确认】

1. 播出平台名字需确认
请确定每个名字是否跟服务端返回的完全相同，例如 “芒果TV” 而不是 “芒果卫视”

```
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
```


2. 商业站台活动 字段需确认
“商业站台活动”的字段需要确认，目前用的是 "activity", 可以根据具体服务端定义修改

```
const rights = [
  {'title': '商业站台活动', 'valid': 0, 'key': 'activity'}
  ...
];
```

注: 前端将自动取出值, 如 `longMax` `longMin`

3. 配合权益描述 确认
配合权益目前有一下几种描述，请确认是否需要:

长期权益 `100-200万``
短期权益 `10万起``
商业站台活动 `最高20万`
商业微博 `待定`

规则可再商议


【更新说明】2018-09-06

- 首页搜索框缩小

- 修正星指数错位

- 互动数等居中对其, 适配时也是分组对其

- 品牌文字缩小

- 品牌列表只显示1行， 增加展开按钮

- 品牌图片去掉旋转效果

- 上线作品类型

- 趋势图的刻度线颜色修正 00c1fa

- 正在滚动时“返回顶部按钮”不出现

- 整体比例缩小
  缩小了区块标题大小、区块间距、整体页面宽度

- 移动适配趋势图只显示7天数据

- 移动适配 排名

- 移动适配 全国分配图适配

- 全页面适配调整


品牌名字过长

【更新说明】2018-09-05

年龄分布刻度线已去掉

配合权益：目前已知权益只有longMax,longMin2个字段，其它字段没有或未知, 所以都不显示。

地图去掉省份的黑色线边框

地图鼠标移动上去颜色“黄山” 换成 “白色”

地图图例上移至底部跟海南岛齐平

调整“地域分布”标题位置

调整“省份排名”投影方向

品牌logo从 192 缩小至 150

品牌logo去除移动效果, 改为鼠标移动后放大旋转效果

logo品牌点击后跳转至百度搜索品牌

没有品牌时显示品牌第一个字

品牌图片垂直居中显示

配合权益后面没数字时 显示的是文字“待定”

增加“回到顶部”按钮，点击按钮时平滑滚动到顶部

修正百度指数手柄文字颜色看不到的问题，显示为白色

百度指数默认显示数据修正为 85%-100%; 默认范文是按百分比展示, 根据给回数据的条目数显示结果，按现在返回数据的数量计算2周时间是25%，如果以后返回的时间条目数有变动则显示数据会有变动。


【需要反馈】

短期代言、商业站台活动、商业微博、肖像权的字段名是什么？

回到顶部按钮看上去有点像个“不”字

艺人印象 移动适配整体缩小后文字会看不见，考虑设计适合移动显示的排版


【更新说明】 2018-09-04
修正省份排名倒叙问题；

即将上线作品，配合权益，如果没有数据的话，整块就不用出现。

“已代言品牌，我记得设计稿是，左右有按钮来左右移动，不是自动的滚动” -> 可跟设计确定是怎么做，我的设计稿不是左右按钮，是罗列的。

星指数日期已修正为“昨天”， 如:"截止时间:9月2日"

数字转换, 为空时显示"无"

调整首页列表鼠标移动上去的投影效果

信息页头像与名字内容居中显示

低声明大写调整

查看规则提示框向上显示

【需要反馈】:

1. 首页是否显示 "第n期" ？ 如果显示则背景框长度无法适应字数
2. 配合权益那里的数据目前只能拿到2个，更多数据不确定怎么给。
3. !! 图表调整目前已是极限，第三方控件并不支持目前的所有改动,或者需要花费更多的时间去调整。 需要决定图表的调整是否继续。




1. 代言品牌数据
brand 和 brand_url 目前是2个无序数组，且数量不一样，例如brand是10个, brand_url是5个。无法正确匹配品牌
建议结构
```
brand: [
  {"name": "汰渍", "logo": "logo-image.jpg"},
  {"name": "匡威", "logo": "logo-image.jpg"}
]
```

2. longMax 字段
目前并不是所有数据都有longMax字段，需要确定如何处理。

3.

1. 品牌结构列表需要优化, 目前结构无法正确对应品牌名称和LOGO

brand:[
  {"name": "肯德基", "logo": "101.jpg"},
  {"name": "海飞丝", "logo": "102.jpg"}
]

2. 品牌图片输出正方形, 或 宽度 < 高度 的图，不然会显示不正常。

3. “超话数量”有12位， 按设计稿无法在一行呈现。目前处理是换行显示

4. 查看百科是跳转到“百度百科”吗？

5. 权益缺少，短期代言、商业站台活动、商业微博、肖像权等数据

6. 结构需要优化，目前缺少类型，例如电视剧、电影

建议结构

works: [
  {
    "name": "甜蜜暴击",
    "type": "电视剧"
    "publish": "2018.07.23 ~ 08.23",
    "role": "男一号",
    "actors": "关晓彤 / 关晓彤 / 关晓彤",
    "platforms": [
      "logo.jpg",
      "logo.jpg"
    ]
  }
]
