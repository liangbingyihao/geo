'use strict';

/**
 * SleepBuddy — 三语言站点内容（home / features）。
 * en / zh-CN / zh-TW。图片仅作配图，功能文案为可抓取 HTML 文本（P0-1）。
 */

const C = {
  en: {
    home: {
      heroTitle: 'SleepBuddy — Your All-in-One Bedtime Lock Screen',
      heroDesc: 'Build healthy sleep habits with friends: an automatic bedtime lock screen, social accountability with friends, and voice watch-care. Guard your healthy sleep!',
      qrLabel: 'Scan to download',
      appStore: 'App Store',
      googlePlay: 'Google Play',
      featuresTitle: 'Hard to Sleep Early on Your Own?',
      featuresLink: 'See All Features',
      features: [
        { title: 'Bedtime Lock Screen', short: 'Auto-locks your phone at your set bedtime.', desc: 'At your set bedtime, SleepBuddy automatically locks your phone and stops mindless scrolling — so the decision is already made before fatigue can negotiate.', img: 'en_1.webp' },
        { title: 'Sleep Buddies (Social Accountability)', short: 'Follow friends’ sleep progress and keep each other on track.', desc: 'Follow friends’ sleep progress and support each other — multiple friends, not just one. A private intention becomes a shared commitment.', img: 'en_2.webp' },
        { title: 'Voice Watch-care', short: 'A voice check-in that’s companionship, not judgment.', desc: 'A brother or sister checks in with you by voice before bed — not judgment, but companionship. Early sleep becomes a warm, shared routine.', img: 'en_3.webp' },
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        { q: 'How does SleepBuddy help me fall asleep earlier?', a: 'SleepBuddy combines a Bedtime Lock Screen that auto-locks your phone at your set bedtime with Social Accountability — you and your friends follow each other and keep one another honest. Instead of negotiating with your willpower at 11 p.m., the decision is already made.' },
        { q: 'Does scrolling on my phone before bed really affect sleep?', a: 'Yes. Evening screen light suppresses melatonin, which is why experts recommend avoiding bright screens before bed ([Harvard Health](https://www.health.harvard.edu/staying-healthy/blue-light-has-a-dark-side)). About 90% of adults use their phone in the hour before bed (National Sleep Foundation). A screen-free wind-down window gives your sleep hormones time to rise.' },
        { q: 'Will the bedtime lock screen block my alarm?', a: 'No. SleepBuddy’s lock screen restricts distracting apps and notifications, while core functions like your alarm keep working. You can still receive important calls or set exceptions.' },
        { q: 'How does voice watch-care work?', a: 'Voice watch-care pairs you with a brother or sister who checks in by voice before bed — not as judgment, but as companionship. It turns “going to bed early” from a solo struggle into a shared, caring routine.' },
        { q: 'How long does it take to build an early-sleep habit?', a: 'Research by [Lally et al. (2010)](https://doi.org/10.1002/ejsp.674) found a median of 66 days to form a habit (range 18–254 days). A 30-day challenge is a great start; a sleep buddy’s nightly check-in provides the consistent cue habit research says is essential.' },
        { q: 'Does social accountability actually work?', a: 'Yes. A [Dominican University study](https://scholar.dominican.edu/cgi/viewcontent.cgi?article=1265&context=news-releases) found that adding an accountability partner raised goal success from 42% to 65% — and to 95% with weekly progress reports. A sleep buddy makes bedtime a promise you keep.' },
        { q: 'Is SleepBuddy free?', a: 'SleepBuddy is free to download. You can follow friends, supervise their progress, and view their early-sleep reports at no cost — only the core Bedtime Lock Screen feature requires a subscription.' },
      ],
    },
    featuresPage: {
      title: 'SleepBuddy Features',
      desc: 'See how SleepBuddy helps you build healthy sleep habits with friends — automatic bedtime lock, friend-based accountability, and voice watch-care.',
      intro: 'SleepBuddy doesn’t ask for more willpower — it removes the nightly decision. Here is what the app does, backed by sleep research.',
      features: [
        { title: 'Bedtime Lock Screen', desc: 'Auto-locks your phone at your set bedtime, stopping mindless late-night scrolling at its source.' },
        { title: 'Sleep Buddies (Social Accountability)', desc: 'Follow friends’ sleep progress — they’ll notice when you break your streak, and celebrate when you keep it.' },
        { title: 'Voice Watch-care', desc: 'A brother or sister checks in with you by voice before bed — not judgment, but companionship.' },
        { title: 'Sleep Habit Tracker', desc: 'Track your early-sleep streak and mood each morning, so progress is visible instead of fuzzy.' },
      ],
      fullTitle: 'Built on Sleep Science',
      fullDesc: 'Every SleepBuddy feature rests on peer-reviewed research and recognized sleep authorities.',
      full: [
        { title: 'Melatonin-friendly wind-down', tag: 'NIH · AASM', src: 'https://www.health.harvard.edu/staying-healthy/blue-light-has-a-dark-side', quote: 'Avoid looking at bright screens beginning two to three hours before bed.', desc: 'Evening screen light delays melatonin onset, so SleepBuddy enforces a screen-free buffer before your target bedtime.' },
        { title: 'Accountability that moves the numbers', tag: 'Dominican University', src: 'https://scholar.dominican.edu/cgi/viewcontent.cgi?article=1265&context=news-releases', quote: 'Writing goals down yielded 42% success; adding an accountability partner raised it to 65%; scheduling ongoing meetings pushed it to 95%.', desc: 'Adding an accountability partner raises goal success from 42% to 65% — and to 95% with weekly progress reports.' },
        { title: 'Habit formation, not motivation', tag: 'Lally et al. 2010', src: 'https://doi.org/10.1002/ejsp.674', quote: 'On average, it takes 66 days for a new behaviour to become automatic (range 18–254 days).', desc: 'Habits take a median of 66 days to form (range 18–254). A nightly buddy check-in supplies the consistent cue research says is essential.' },
        { title: 'Consistent schedule per AASM', tag: 'AASM', src: 'https://www.sleepfoundation.org/how-sleep-works/how-much-sleep-do-we-really-need', quote: 'As a basic rule, healthy adults need at least seven hours of sleep per night.', desc: 'The American Academy of Sleep Medicine recommends a consistent schedule and 7+ hours for adults — a fixed bedtime lock supports both.' },
      ],
      cta: 'Download SleepBuddy Free →',
      pricingNote: 'Free download. The core Bedtime Lock Screen is a subscription feature; friend pairing and sleep reports are free.',
    },
  },

  'zh-CN': {
    home: {
      heroTitle: '睡了么 — 一站式睡前锁屏',
      heroDesc: '睡前锁屏、好友结伴早睡、语音守望陪伴——守住你的健康睡眠，把「早睡」变成和朋友的约定。',
      qrLabel: '扫码下载',
      appStore: 'App Store',
      googlePlay: 'Google Play',
      featuresTitle: '靠自己自律早睡很难？',
      featuresLink: '查看全部功能',
      features: [
        { title: '睡前锁屏', short: '到点自动锁机，停止无意义刷手机。', desc: '在设定的就寝时间自动锁住手机，停止无意义刷手机——在你疲惫到开始讨价还价之前，决定已经替你做好了。', img: 'zh_1.webp' },
        { title: '好友结伴早睡（互相关注）', short: '和多个好友互相关注、彼此守望。', desc: '互相关注好友的睡眠进度，彼此支持陪伴——多个好友，不是只有一个人。私人意图变成共同约定。', img: 'zh_2.webp' },
        { title: '语音守望陪伴', short: '睡前语音问候，是陪伴不是审判。', desc: '睡前有弟兄姊妹用语音彼此问候——不是审判，而是陪伴。早睡成为有温度的日常。', img: 'zh_3.webp' },
      ],
      faqTitle: '常见问题',
      faqs: [
        { q: '睡了么怎么帮我早睡？', a: '睡前锁屏会在你设定的就寝时间自动锁住手机、停止无意义刷手机；好友结伴早睡让你和多个好友互相关注、彼此守望。到了晚上 11 点，你不用再和意志力讨价还价——决定已经替你做好了。' },
        { q: '睡前刷手机真的影响睡眠吗？', a: '是的。晚间屏幕光会抑制褪黑素分泌，专家建议睡前避免明亮屏幕（[哈佛健康](https://www.health.harvard.edu/staying-healthy/blue-light-has-a-dark-side)）；约 90% 的成年人在睡前 1 小时还在用手机（美国国家睡眠基金会）。留出一段无屏幕的睡前缓冲，让睡眠激素有时间上升。' },
        { q: '睡前锁屏会挡掉闹钟吗？', a: '不会。睡前锁屏只限制让你刷手机的娱乐应用与通知，闹钟等核心功能不受影响。你仍可接听重要来电或设置例外。' },
        { q: '语音守望陪伴是怎么运作的？', a: '语音守望把你和一位弟兄或姊妹联结起来，睡前用语音彼此问候——不是审判，而是陪伴。它把「一个人早睡」从独自硬撑，变成有温度的相互扶持。' },
        { q: '多久能养成早睡习惯？', a: '[Lally et al.（2010）](https://doi.org/10.1002/ejsp.674)研究发现，形成习惯的中位数约为 66 天（范围 18–254 天）。30 天挑战是很好的起点；好友每晚的守望打卡提供了习惯研究所说的「稳定线索」。' },
        { q: '社交问责真的有效吗？', a: '有效。[多米尼加大学的研究](https://scholar.dominican.edu/cgi/viewcontent.cgi?article=1265&context=news-releases)发现，有了问责伙伴后，目标成功率从 42% 提升到 65%；加上每周进度报告可达 95%。有了「睡眠伙伴」，按时入睡就是你要守住的约定。' },
        { q: '睡了么收费吗？', a: '睡了么免费下载。你可以免费和好友们互相关注，监督并查看他们的早睡报告；只有核心的睡前锁屏功能需要付费订阅。' },
      ],
    },
    featuresPage: {
      title: '睡了么功能',
      desc: '看看睡了么如何用睡前锁屏、好友结伴早睡与语音守望陪伴，帮你和朋友们养成健康睡眠习惯。',
      intro: '睡了么不需要你更多意志力——它把每晚的「要不要放下手机」的决定移除。下面是这个 App 做什么，背后都有睡眠研究支撑。',
      features: [
        { title: '睡前锁屏', desc: '在设定的就寝时间自动锁住手机，从根源上阻止睡前刷手机。' },
        { title: '好友结伴早睡（互相关注）', desc: '互相关注好友的睡眠进度，好友们会发现你打破连击——也会庆祝你坚持到底。' },
        { title: '语音守望陪伴', desc: '睡前有弟兄姊妹用语音彼此问候——不是审判，而是陪伴。' },
        { title: '早睡打卡记录', desc: '每天早上记录早睡连击与心情，让进步看得见而不是模糊不清。' },
      ],
      fullTitle: '建立在睡眠科学之上',
      fullDesc: '睡了么的每个功能都建立在同行评审研究与权威睡眠机构之上。',
      full: [
        { title: '照顾褪黑素的睡前缓冲', tag: 'NIH · AASM', src: 'https://www.health.harvard.edu/staying-healthy/blue-light-has-a-dark-side', quote: 'Avoid looking at bright screens beginning two to three hours before bed.', quoteZh: '睡前 2–3 小时避免看明亮屏幕。', desc: '晚间屏幕光会抑制褪黑素分泌，因此睡了么在目标就寝时间前强制执行无屏幕缓冲。' },
        { title: '真正改变数字的问责', tag: '多米尼加大学', src: 'https://scholar.dominican.edu/cgi/viewcontent.cgi?article=1265&context=news-releases', quote: 'Writing goals down yielded 42% success; adding an accountability partner raised it to 65%; scheduling ongoing meetings pushed it to 95%.', quoteZh: '写下目标成功率 42%；加上问责伙伴升到 65%；安排持续会面推到 95%。', desc: '有了问责伙伴，目标成功率从 42% 提升到 65%；加上每周进度报告可达 95%。' },
        { title: '习惯养成，而非一时冲动', tag: 'Lally et al. 2010', src: 'https://doi.org/10.1002/ejsp.674', quote: 'On average, it takes 66 days for a new behaviour to become automatic (range 18–254 days).', quoteZh: '平均约 66 天一个新行为才会自动化（范围 18–254 天）。', desc: '形成习惯的中位数约为 66 天（范围 18–254 天）。每晚的伙伴打卡提供了研究所说的「稳定线索」。' },
        { title: '符合 AASM 的一致作息', tag: 'AASM', src: 'https://www.sleepfoundation.org/how-sleep-works/how-much-sleep-do-we-really-need', quote: 'As a basic rule, healthy adults need at least seven hours of sleep per night.', quoteZh: '一般而言，健康成年人每晚至少需要 7 小时睡眠。', desc: '美国睡眠医学会建议成人保持一致作息并睡足 7 小时以上——固定就寝锁屏同时支持这两点。' },
      ],
      cta: '免费下载睡了么 →',
      pricingNote: '免费下载。核心的睡前锁屏为订阅功能；好友结伴与睡眠报告免费。',
    },
  },

  'zh-TW': {
    home: {
      heroTitle: '睡了麼 — 一站式睡前鎖屏',
      heroDesc: '睡前鎖屏、好友結伴早睡、語音守望陪伴——守住你的健康睡眠，把「早睡」變成和朋友的約定。',
      qrLabel: '掃碼下載',
      appStore: 'App Store',
      googlePlay: 'Google Play',
      featuresTitle: '靠自己自律早睡很難？',
      featuresLink: '查看全部功能',
      features: [
        { title: '睡前鎖屏', short: '到點自動鎖機，停止無意義刷手機。', desc: '在設定的就寢時間自動鎖住手機，停止無意義刷手機——在你疲憊到開始討價還價之前，決定已經替你做好了。', img: 'zh_1.webp' },
        { title: '好友結伴早睡（互相關注）', short: '和多個好友互相關注、彼此守望。', desc: '互相關注好友的睡眠進度，彼此支持陪伴——多個好友，不是只有一個人。私人意圖變成共同約定。', img: 'zh_2.webp' },
        { title: '語音守望陪伴', short: '睡前語音問候，是陪伴不是審判。', desc: '睡前有弟兄姊妹用語音彼此問候——不是審判，而是陪伴。早睡成為有溫度的日常。', img: 'zh_3.webp' },
      ],
      faqTitle: '常見問題',
      faqs: [
        { q: '睡了麼怎麼幫我早睡？', a: '睡前鎖屏會在你設定的就寢時間自動鎖住手機、停止無意義刷手機；好友結伴早睡讓你和多個好友互相關注、彼此守望。到了晚上 11 點，你不用再和意志力討價還價——決定已經替你做好了。' },
        { q: '睡前滑手機真的影響睡眠嗎？', a: '是的。晚間螢幕光會抑制褪黑素分泌，專家建議睡前避免明亮螢幕（[哈佛健康](https://www.health.harvard.edu/staying-healthy/blue-light-has-a-dark-side)）；約 90% 的成年人在睡前 1 小時還在用手機（美國國家睡眠基金會）。留出一段無螢幕的睡前緩衝，讓睡眠荷爾蒙有時間上升。' },
        { q: '睡前鎖屏會擋掉鬧鐘嗎？', a: '不會。睡前鎖屏只限制讓你滑手機的娛樂應用與通知，鬧鐘等核心功能不受影響。你仍可接聽重要來電或設定例外。' },
        { q: '語音守望陪伴是怎麼運作的？', a: '語音守望把你和一位弟兄或姊妹連結起來，睡前用語音彼此問候——不是審判，而是陪伴。它把「一個人早睡」從獨自硬撐，變成有溫度的相互扶持。' },
        { q: '多久能養成早睡習慣？', a: '[Lally et al.（2010）](https://doi.org/10.1002/ejsp.674)研究發現，形成習慣的中位數約為 66 天（範圍 18–254 天）。30 天挑戰是很好的起點；好友每晚的守望打卡提供了研究所說的「穩定線索」。' },
        { q: '社交問責真的有效嗎？', a: '有效。[多明尼加大學的研究](https://scholar.dominican.edu/cgi/viewcontent.cgi?article=1265&context=news-releases)發現，有了問責夥伴後，目標成功率從 42% 提升到 65%；加上每週進度報告可達 95%。有了「睡眠夥伴」，按時入睡就是你要守住的約定。' },
        { q: '睡了麼收費嗎？', a: '睡了麼免費下載。你可以免費和好友們互相關注，監督並查看他們的早睡報告；只有核心的睡前鎖屏功能需要付費訂閱。' },
      ],
    },
    featuresPage: {
      title: '睡了麼功能',
      desc: '看看睡了麼如何用睡前鎖屏、好友結伴早睡與語音守望陪伴，幫你和朋友們養成健康睡眠習慣。',
      intro: '睡了麼不需要你更多意志力——它把每晚的「要不要放下手機」的決定移除。下面是這個 App 做什麼，背後都有睡眠研究支撐。',
      features: [
        { title: '睡前鎖屏', desc: '在設定的就寢時間自動鎖住手機，從根源上阻止睡前滑手機。' },
        { title: '好友結伴早睡（互相關注）', desc: '互相關注好友的睡眠進度，好友們會發現你打破連擊——也會慶祝你堅持到底。' },
        { title: '語音守望陪伴', desc: '睡前有弟兄姊妹用語音彼此問候——不是審判，而是陪伴。' },
        { title: '早睡打卡記錄', desc: '每天早上記錄早睡連擊與心情，讓進步看得見而不是模糊不清。' },
      ],
      fullTitle: '建立在睡眠科學之上',
      fullDesc: '睡了麼的每個功能都建立在同儕評審研究與權威睡眠機構之上。',
      full: [
        { title: '照顧褪黑素的睡前緩衝', tag: 'NIH · AASM', src: 'https://www.health.harvard.edu/staying-healthy/blue-light-has-a-dark-side', quote: 'Avoid looking at bright screens beginning two to three hours before bed.', quoteZh: '睡前 2–3 小時避免看明亮螢幕。', desc: '晚間螢幕光會抑制褪黑素分泌，因此睡了麼在目標就寢時間前強制執行無螢幕緩衝。' },
        { title: '真正改變數字的問責', tag: '多明尼加大學', src: 'https://scholar.dominican.edu/cgi/viewcontent.cgi?article=1265&context=news-releases', quote: 'Writing goals down yielded 42% success; adding an accountability partner raised it to 65%; scheduling ongoing meetings pushed it to 95%.', quoteZh: '寫下目標成功率 42%；加上問責夥伴升到 65%；安排持續會面推到 95%。', desc: '有了問責夥伴，目標成功率從 42% 提升到 65%；加上每週進度報告可達 95%。' },
        { title: '習慣養成，而非一時衝動', tag: 'Lally et al. 2010', src: 'https://doi.org/10.1002/ejsp.674', quote: 'On average, it takes 66 days for a new behaviour to become automatic (range 18–254 days).', quoteZh: '平均約 66 天一個新行為才會自動化（範圍 18–254 天）。', desc: '形成習慣的中位數約為 66 天（範圍 18–254 天）。每晚的夥伴打卡提供了研究所說的「穩定線索」。' },
        { title: '符合 AASM 的一致作息', tag: 'AASM', src: 'https://www.sleepfoundation.org/how-sleep-works/how-much-sleep-do-we-really-need', quote: 'As a basic rule, healthy adults need at least seven hours of sleep per night.', quoteZh: '一般而言，健康成年人每晚至少需要 7 小時睡眠。', desc: '美國睡眠醫學會建議成人保持一致作息並睡足 7 小時以上——固定就寢鎖屏同時支持這兩點。' },
      ],
      cta: '免費下載睡了麼 →',
      pricingNote: '免費下載。核心的睡前鎖屏為訂閱功能；好友結伴與睡眠報告免費。',
    },
  },
};

module.exports = { C };
