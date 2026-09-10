# 总任务
使用RawAsset里面的素材,生成一个前端页面，达到c这样的效果

# 细节要求
1. 支持多语言切换:中文、繁体中文、英文
2. 主页兼容pc和移动终端打开
3. 主页大致分成7块（不计头部和底部），对用的素材在RawAsset里,约定素材文件或文件夹名前缀的数字代表第几块用到的素材。

头部：logo,app名称，Features ,BibleTi Quiz, Contact US,切换多语言。
点击对应菜单自动滑倒对应位置

自上向下7块依次为：
第1块： 顶部（1-1.webp背景图，app介绍、下载二维码、应用商店跳转..）
Features: 
第2块，可左右滑动查看图片
第3块 两行、两列图片+文本(包括图片下方有对应小logo、title、desc)
第4块 What They Say 用户反馈。三个信纸样式的卡片，选中的卡片突出显示
第5块 BibleTi Quiz 对应。 一个测试，Which Biblical Character Are You? 有多张人物卡片,素材对应 5-人物 文件夹,可以左右滑动查看所有人物
以及 Take the Quiz 按键跳出到另一个活动页
第6块 Frequently Asked Questions.样式见截图。
第7块 Contact US 对应。7-1.webp背景图.靠左边从上到下：
Start Your Daily Journey with God
apple入口， google play入口
Stay Connected Follow us for daily inspiration
instagran,facebook,yutube三个logo，跳转到自定义网址
Get in touch: support@grace-word.com

底部：© 2026 Grace Word,Privacy Policy,Terms of Use 可跳转到对应的链接

# 其他
根据dst.png只需要大概分析出网页结构，和背景颜色，等主要样式。文本可随意生成，不用精确分析出来。
处理过程中把原始素材经合理的重命名，统一放到另以assets文件夹。网页链接方式引用这些素材。最后上架图片素材会上传到cdn，方便灵活替换链接。
要求支持多语言切换,2-banner 图片命名也和多语言有关。其他文案也要求可方便配置
缓存中间处理的结果，方便重新执行可以结束处理