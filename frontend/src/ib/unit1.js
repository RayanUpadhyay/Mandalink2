// IB Chinese B — Theme 1 Identities, Unit 1 生活方式 Lifestyle.
// Structure, section order, question formats and word counts follow the iChinese 3
// coursebook formula. All passages, scripts and questions are original to Mandalink.
//
// Question types:
//   short  — free answer, auto-checked against `accept` keywords (any one match).
//            Optional `parts` for (i)/(ii) answers. Unmatched answers go to self-review.
//   table  — rows of short answers shown as a table.
//   gap    — word bank → numbered gaps {{n}} in the passage (exact match).
//   match  — choose the best sentence ending (letter).
//   tf     — 对/错 + 理由 (both needed to score, like the IB paper).

export const UNIT1 = {
  id: 'u1',
  themeNo: 1,
  themeZh: '身份认同',
  themeEn: 'Identities',
  no: 1,
  zh: '生活方式',
  en: 'Lifestyle',
  intro: '我们每天怎么吃、怎么睡、怎么用手机、怎么花钱，都在悄悄地塑造我们是谁。本单元探讨现代年轻人的生活方式和选择。',
  sections: [
    // ---------------------------------------------------------------- Text 1
    {
      id: 'text1', kind: 'text', level: 'SL',
      label: '课文一', labelEn: 'Text 1',
      title: '一周不上网，我还活着！',
      textType: '邮件 Email',
      meta: [['发件人', '林小雨'], ['收件人', '陈佳'], ['标题', '一周不上网，我还活着！']],
      paragraphs: [
        '佳佳：你好！上个月你问我能不能一个星期不用手机上网，我当时笑着说"不可能"。没想到，学校"健康生活周"的时候，我真的试了一次。今天我想跟你分享这七天的经历。',
        '第一天最难受。早上一睁开眼，我就习惯性地去找手机，想看看有没有新消息。上课的时候，我总觉得自己错过了什么重要的事情，心里很不安。晚上没有短视频可以看，我只好早早地上床睡觉。',
        '第三天开始，情况慢慢{{6}}了。我发现自己有了很多空闲时间，{{7}}把这些时间用在以前没时间做的事情上：我读完了一本小说，还跟妈妈学会了包饺子。最让我意外的是，不上网{{8}}，我的睡眠质量提高了不少，白天上课{{9}}更集中了。原来手机{{10}}占用了我那么多时间！',
        '当然，这次实验也带来了一些麻烦。小组作业的通知都在网上，我差点儿错过交作业的时间；和朋友约见面也变得很不方便，必须提前打电话。这让我明白，完全离开网络在现代社会几乎是不可能的。',
        '实验结束以后，我给自己定了一个新规矩：每天晚上九点以后不碰手机，周末至少有半天"断网"。你要不要也试一试？期待你的回信！小雨'
      ],
      words: [
        ['实验', 'shíyàn', 'experiment'], ['分享', 'fēnxiǎng', 'to share'], ['经历', 'jīnglì', 'experience'],
        ['习惯性', 'xíguànxìng', 'habitual'], ['错过', 'cuòguò', 'to miss (a chance)'], ['不安', 'bù\'ān', 'uneasy'],
        ['好转', 'hǎozhuǎn', 'to take a turn for the better'], ['空闲', 'kòngxián', 'free, idle'],
        ['意外', 'yìwài', 'unexpected'], ['睡眠', 'shuìmián', 'sleep'], ['质量', 'zhìliàng', 'quality'],
        ['集中', 'jízhōng', 'to concentrate'], ['占用', 'zhànyòng', 'to take up (time/space)'], ['规矩', 'guīju', 'rule']
      ],
      groups: [
        { instr: '根据①，填写下面的表格。', instrEn: 'Using paragraph 1, complete the table.',
          questions: [{ id: 't1q1', type: 'table', rows: [
            { label: '1. 写邮件的人', accept: ['林小雨', '小雨'], model: '林小雨' },
            { label: '2. 实验一共进行了多久', accept: ['七天', '一个星期', '一周', '7天'], model: '七天（一个星期）' },
            { label: '3. 实验是在什么活动期间做的', accept: ['健康生活周'], model: '学校的"健康生活周"' }
          ] }] },
        { instr: '根据②，回答下面的问题。', instrEn: 'Using paragraph 2, answer the questions.',
          questions: [
            { id: 't1q4', type: 'short', q: '4. 第一天早上，小雨一睁开眼就做什么？', accept: ['找手机', '看手机', '新消息'], model: '习惯性地去找手机，看看有没有新消息。' },
            { id: 't1q5', type: 'short', q: '5. 上课的时候，她有什么感觉？', accept: ['不安', '错过'], model: '总觉得错过了重要的事情，心里很不安。' }
          ] },
        { instr: '根据③，从下面提供的词汇中选出合适的词填空。', instrEn: 'Using paragraph 3, fill each numbered gap with a word from the box.',
          questions: [{ id: 't1gap', type: 'gap',
            bank: ['好转', '于是', '以后', '注意力', '竟然', '因此', '而且', '突然'],
            gaps: [{ n: 6, answer: '好转' }, { n: 7, answer: '于是' }, { n: 8, answer: '以后' }, { n: 9, answer: '注意力' }, { n: 10, answer: '竟然' }] }] },
        { instr: '根据④和⑤，选出最合适左边句子的结尾。', instrEn: 'Using paragraphs 4–5, choose the best ending for each sentence.',
          questions: [{ id: 't1match', type: 'match',
            options: { A: '每天晚上九点以后不碰手机。', B: '她差点儿错过交作业的时间。', C: '她每天都在网上看小说。', D: '她必须提前打电话。', E: '周末完全不出门。' },
            items: [
              { n: 11, stem: '小组作业的通知都在网上，所以……', answer: 'B' },
              { n: 12, stem: '和朋友约见面的时候，……', answer: 'D' },
              { n: 13, stem: '小雨给自己定的新规矩是……', answer: 'A' }
            ] }] },
        { instr: '根据④，回答下面的问题。', instrEn: 'Using paragraph 4, answer the question.',
          questions: [{ id: 't1q14', type: 'short', q: '14. 这次实验让小雨明白了什么？', accept: ['不可能', '离开网络'], model: '完全离开网络在现代社会几乎是不可能的。' }] }
      ],
      post: { title: '好词好句', titleEn: 'Good words & phrases',
        task: '从课文中找出下面词句，并写出对应的英文意思。',
        items: [['习惯性地去找手机', 'habitually reached for my phone'], ['睡眠质量提高了不少', 'my sleep quality improved quite a bit'], ['几乎是不可能的', 'is almost impossible']] }
    },

    // ---------------------------------------------------------------- Text 2
    {
      id: 'text2', kind: 'text', level: 'SL',
      label: '课文二', labelEn: 'Text 2',
      title: '加入"早起族"的第一个月',
      textType: '博客 Blog',
      meta: [['博主', '王浩'], ['发布时间', '3月28日']],
      paragraphs: [
        '我叫王浩，今年十七岁。以前我是一个典型的"夜猫子"，常常玩游戏玩到半夜，第二天上课总是没精神。上个月，我在网上看到一个"早起打卡"活动：参加的人每天早上五点半起床，然后在群里发一张照片，证明自己已经起来了。我决定挑战一下自己。',
        '刚开始的一个星期非常痛苦。闹钟响的时候，我恨不得把它扔出窗外。不过，看到群里的其他人都按时打卡，我也不好意思放弃。',
        '坚持了两个星期以后，我的身体逐渐适应了新的作息。早上的时间特别安静，我可以跑步、背单词，还能吃一顿像样的早饭。我的成绩也有了进步，老师说我上课的状态比以前好多了。',
        '不过，我也想提醒大家：早起不等于少睡。如果晚上还是很晚才睡，早起只会让人更累。对我来说，最重要的不是几点起床，而是找到适合自己的生活节奏。'
      ],
      words: [
        ['典型', 'diǎnxíng', 'typical'], ['夜猫子', 'yèmāozi', 'night owl'], ['打卡', 'dǎkǎ', 'to check in'],
        ['证明', 'zhèngmíng', 'to prove'], ['挑战', 'tiǎozhàn', 'challenge'], ['痛苦', 'tòngkǔ', 'painful'],
        ['闹钟', 'nàozhōng', 'alarm clock'], ['放弃', 'fàngqì', 'to give up'], ['坚持', 'jiānchí', 'to persist'],
        ['逐渐', 'zhújiàn', 'gradually'], ['适应', 'shìyìng', 'to adapt'], ['作息', 'zuòxī', 'daily routine'],
        ['状态', 'zhuàngtài', 'condition, state'], ['节奏', 'jiézòu', 'rhythm, pace']
      ],
      groups: [
        { instr: '根据①，回答下面的问题。', instrEn: 'Using paragraph 1, answer the questions.',
          questions: [
            { id: 't2q1', type: 'short', q: '1. 王浩以前是一个什么样的人？', accept: ['夜猫子', '很晚', '半夜'], model: '典型的"夜猫子"，常常玩游戏玩到半夜。' },
            { id: 't2q2', type: 'short', q: '2. 文中哪个词的意思是"每天在网上报到，证明自己完成了任务"？', accept: ['打卡'], model: '打卡' }
          ] },
        { instr: '根据②，回答下面的问题。', instrEn: 'Using paragraph 2, answer the question.',
          questions: [{ id: 't2q3', type: 'short', q: '3. 刚开始很痛苦，王浩为什么没有放弃？', accept: ['不好意思', '按时打卡', '其他人'], model: '看到群里的其他人都按时打卡，他不好意思放弃。' }] },
        { instr: '根据③，填写下面的表格。', instrEn: 'Using paragraph 3, complete the table.',
          questions: [{ id: 't2q4', type: 'table', rows: [
            { label: '4. 早上可以做的事（写出两件）', accept: ['跑步', '背单词', '早饭'], model: '跑步、背单词、吃一顿像样的早饭（任意两件）' },
            { label: '5. 学习上的变化', accept: ['进步', '状态'], model: '成绩有了进步，上课状态比以前好多了。' }
          ] }] },
        { instr: '根据③和④，回答下面的问题。', instrEn: 'Using paragraphs 3–4, answer the questions.',
          questions: [
            { id: 't2q6', type: 'short', q: '6. 文中哪个词的意思是"慢慢地"？', accept: ['逐渐'], model: '逐渐' },
            { id: 't2q7', type: 'short', q: '7. 王浩认为，最重要的是什么？', accept: ['节奏', '适合自己'], model: '找到适合自己的生活节奏。' }
          ] }
      ],
      post: { title: '好词好句', titleEn: 'Good words & phrases',
        task: '从课文中找出下面词句，并写出对应的英文意思。',
        items: [['我恨不得把它扔出窗外', 'I was dying to throw it out of the window'], ['早起不等于少睡', 'getting up early doesn\'t mean sleeping less'], ['适合自己的生活节奏', 'a pace of life that suits you']] }
    },

    // ---------------------------------------------------------------- Text 3
    {
      id: 'text3', kind: 'text', level: 'SL',
      label: '课文三', labelEn: 'Text 3',
      title: '外卖：方便的代价',
      textType: '文章 Article',
      meta: [['来源', '《青年生活》杂志']],
      paragraphs: [
        '打开手机，点几下，半小时后热饭就送到门口。在中国的大城市里，叫外卖已经成为很多年轻人的生活方式。一项调查显示，超过一半的大学生每周至少点三次外卖。',
        '外卖的好处显而易见。对于工作忙碌的上班族来说，外卖节省了买菜、做饭和洗碗的时间；对于不会做饭的年轻人来说，外卖让他们每天都能吃到不同口味的饭菜。',
        '然而，外卖也带来了不少问题。首先，很多外卖食物油多、盐多，长期吃对健康不利。其次，外卖使用了大量的塑料盒和塑料袋，给环境造成了很大的压力。此外，有人担心，会做饭的人越来越少，家人一起吃饭的传统也可能慢慢消失。',
        '专家建议，年轻人可以把外卖当作"偶尔的方便"，而不是"每天的习惯"。比如，周末和家人一起做饭，或者点外卖时选择不要一次性餐具。生活方式的小改变，也许就能带来大不同。'
      ],
      words: [
        ['外卖', 'wàimài', 'takeaway, food delivery'], ['调查', 'diàochá', 'survey'], ['显示', 'xiǎnshì', 'to show'],
        ['显而易见', 'xiǎn\'éryìjiàn', 'obvious'], ['忙碌', 'mánglù', 'busy'], ['上班族', 'shàngbānzú', 'office workers'],
        ['节省', 'jiéshěng', 'to save'], ['口味', 'kǒuwèi', 'flavour, taste'], ['然而', 'rán\'ér', 'however'],
        ['塑料', 'sùliào', 'plastic'], ['造成', 'zàochéng', 'to cause'], ['传统', 'chuántǒng', 'tradition'],
        ['消失', 'xiāoshī', 'to disappear'], ['偶尔', 'ǒu\'ěr', 'occasionally'], ['一次性', 'yícìxìng', 'disposable'], ['餐具', 'cānjù', 'tableware']
      ],
      groups: [
        { instr: '根据①，完成下面的句子。', instrEn: 'Using paragraph 1, complete the sentence.',
          questions: [{ id: 't3q1', type: 'short', q: '1. 调查显示，超过一半的大学生______。', accept: ['三次'], model: '每周至少点三次外卖' }] },
        { instr: '根据②，填写下面的表格。', instrEn: 'Using paragraph 2, complete the table.',
          questions: [{ id: 't3q2', type: 'table', rows: [
            { label: '2. 外卖对上班族的好处', accept: ['节省', '时间'], model: '节省了买菜、做饭和洗碗的时间。' },
            { label: '3. 外卖对不会做饭的年轻人的好处', accept: ['口味', '不同'], model: '每天都能吃到不同口味的饭菜。' }
          ] }] },
        { instr: '根据③，回答下面的问题。', instrEn: 'Using paragraph 3, answer the question.',
          questions: [{ id: 't3q4', type: 'short', q: '4. 外卖带来了哪三个方面的问题？', parts: [
            { label: '(i)', accept: ['健康', '油多', '盐多'], model: '健康：油多、盐多，长期吃对健康不利' },
            { label: '(ii)', accept: ['环境', '塑料'], model: '环境：大量塑料盒和塑料袋' },
            { label: '(iii)', accept: ['传统', '做饭', '一起吃饭'], model: '传统：家人一起吃饭的传统可能消失' }
          ] }] },
        { instr: '根据全文，回答下面的问题。', instrEn: 'Using the whole text, answer the questions.',
          questions: [
            { id: 't3q5', type: 'short', q: '5. 文中哪个词语的意思是"很明显，很容易看出来"？', accept: ['显而易见'], model: '显而易见' },
            { id: 't3q6', type: 'short', q: '6. 专家给了哪两个具体建议？', parts: [
              { label: '(i)', accept: ['和家人', '一起做饭', '做饭'], model: '周末和家人一起做饭' },
              { label: '(ii)', accept: ['一次性', '餐具'], model: '点外卖时不要一次性餐具' }
            ] }
          ] }
      ],
      post: { title: '好词好句', titleEn: 'Good words & phrases',
        task: '从课文中找出下面词句，并写出对应的英文意思。',
        items: [['对健康不利', 'bad for your health'], ['给环境造成了很大的压力', 'put great pressure on the environment'], ['小改变，大不同', 'small changes, big difference']] }
    },

    // ---------------------------------------------------------------- HL Text
    {
      id: 'texthl', kind: 'text', level: 'HL',
      label: '高级课文', labelEn: 'HL Text',
      title: '奶奶的菜园',
      textType: '散文 Personal essay',
      meta: [['作者', '陈默']],
      paragraphs: [
        '小时候，我每年暑假都回乡下看奶奶。奶奶家的后院有一块小小的菜园，种着青菜、豆角和西红柿。天刚亮，奶奶就提着水桶去浇水，那"哗哗"的水声，是我童年最熟悉的闹钟。',
        '我曾经问奶奶："超市里什么都能买到，您为什么还要这么辛苦？"奶奶笑了笑，说："自己种的菜，吃着放心；再说，看着它们一天天长大，心里踏实。"那时的我并不明白，"踏实"到底是一种什么感觉。',
        '后来，我搬到了大城市，过上了快节奏的生活。每天挤地铁、赶时间，吃饭靠外卖，周末也在加班。我拥有的东西越来越多，心里却越来越空。',
        '去年，奶奶走了。整理她的遗物时，我在抽屉里发现了一包菜籽，袋子上用歪歪扭扭的字写着："给孙子，有空种种看。"',
        '今年春天，我在阳台上放了几个花盆，种下了那些种子。每天下班回家，我都会先去看看它们。看着嫩绿的小芽慢慢长高，我终于懂得了奶奶说的"踏实"。原来，生活不只是向前跑；有时候，也需要停下来，等一棵菜慢慢长大。'
      ],
      words: [
        ['乡下', 'xiāngxia', 'countryside'], ['菜园', 'càiyuán', 'vegetable garden'], ['浇水', 'jiāoshuǐ', 'to water (plants)'],
        ['童年', 'tóngnián', 'childhood'], ['熟悉', 'shúxī', 'familiar'], ['曾经', 'céngjīng', 'once, at one time'],
        ['辛苦', 'xīnkǔ', 'hard, toilsome'], ['踏实', 'tāshi', 'at peace, steady'], ['拥有', 'yōngyǒu', 'to own'],
        ['遗物', 'yíwù', 'belongings left by the deceased'], ['抽屉', 'chōuti', 'drawer'], ['种子', 'zhǒngzi', 'seed'],
        ['阳台', 'yángtái', 'balcony'], ['嫩绿', 'nènlǜ', 'tender green'], ['懂得', 'dǒngde', 'to understand']
      ],
      groups: [
        { instr: '根据①和②，回答下面的问题。', instrEn: 'Using paragraphs 1–2, answer the questions.',
          questions: [
            { id: 'thq1', type: 'short', q: '1. 作者童年"最熟悉的闹钟"指的是什么？', accept: ['水声', '浇水'], model: '奶奶早上浇水时"哗哗"的水声。' },
            { id: 'thq2', type: 'short', q: '2. 奶奶为什么坚持自己种菜？写出两个原因。', parts: [
              { label: '(i)', accept: ['放心'], model: '自己种的菜吃着放心' },
              { label: '(ii)', accept: ['踏实', '长大'], model: '看着菜一天天长大，心里踏实' }
            ] }
          ] },
        { instr: '根据③至⑤，回答下面的问题。', instrEn: 'Using paragraphs 3–5, answer the questions.',
          questions: [
            { id: 'thq3', type: 'short', q: '3. "我拥有的东西越来越多，心里却越来越空"表达了作者怎样的感受？', accept: ['空虚', '不快乐', '不幸福', '空'], model: '物质生活越来越丰富，内心却越来越空虚、不满足。' },
            { id: 'thq4', type: 'short', q: '4. 第⑤段中的"它们"指的是什么？', accept: ['种子', '菜籽', '小芽', '花盆'], model: '作者在阳台花盆里种下的菜籽（长出的小芽）。' },
            { id: 'thq5', type: 'short', q: '5. 作者最后明白了什么道理？', accept: ['停下来', '慢', '不只是向前跑'], model: '生活不只是向前跑，有时候也需要停下来，放慢脚步。' }
          ] },
        { instr: '判断下面叙述的对错，并以文章内容说明理由。两个部分都答对才能得分。', instrEn: 'True or false? Justify with words from the text. Both parts are needed to score.',
          questions: [{ id: 'thtf', type: 'tf', items: [
            { n: 6, stem: '作者小时候就明白了"踏实"的意思。', answer: false, accept: ['并不明白'], model: '那时的我并不明白，"踏实"到底是一种什么感觉。' },
            { n: 7, stem: '奶奶给作者留下了一包菜籽。', answer: true, accept: ['菜籽', '给孙子'], model: '我在抽屉里发现了一包菜籽，袋子上写着："给孙子，有空种种看。"' }
          ] }] }
      ],
      post: { title: '好词好句', titleEn: 'Good words & phrases',
        task: '从课文中找出下面词句，并写出对应的英文意思。',
        items: [['心里踏实', 'at peace inside'], ['歪歪扭扭的字', 'shaky, crooked handwriting'], ['生活不只是向前跑', 'life isn\'t only about running forward']] }
    },

    // ---------------------------------------------------------------- Listening SL
    {
      id: 'listen-sl', kind: 'listening', level: 'SL',
      label: '听力', labelEn: 'Listening (SL)',
      title: '极简生活：少即是多',
      textType: '电台访谈 Radio interview',
      instructions: '你即将听到一个听力片段。请先阅读题目。你可以自由重复听力片段，在播放的过程中可以随时回答问题或记下讯息。请用中文回答问题。注意自己掌握时间，听力练习时间总共为20分钟。',
      speakers: { '主持人': { pitch: 1.15 }, '李明': { pitch: 0.85 } },
      script: [
        ['主持人', '欢迎收听《生活零距离》。今天我们请到了"极简生活"的实践者李明。李明，你好！'],
        ['李明', '主持人好，大家好！'],
        ['主持人', '你是从什么时候开始过极简生活的？'],
        ['李明', '三年前。那时候我搬家，整理东西花了整整两个星期。我发现很多衣服买了以后一次都没穿过。从那以后，我决定只留下真正需要的东西。'],
        ['主持人', '现在你有多少件衣服？'],
        ['李明', '一共三十件，包括鞋子。每次买一件新的，我就会送掉一件旧的。'],
        ['主持人', '极简生活给你带来了什么变化？'],
        ['李明', '第一，我省了很多钱，去年存的钱够我去日本旅行了。第二，房间整齐了，我的心情也更平静。第三，我每天早上不用再花时间想穿什么。'],
        ['主持人', '有没有遇到什么困难？'],
        ['李明', '有。家人一开始不理解，觉得我太奇怪了。还有，朋友送的礼物，我不知道该怎么处理。我的办法是：能用的就好好用，用不上的就送给需要的人。'],
        ['主持人', '最后，你想对听众说什么？'],
        ['李明', '极简不是什么都不要，而是知道自己真正需要什么。']
      ],
      groups: [
        { instr: '根据听力片段的内容，回答下面的问题。', instrEn: 'Answer the questions based on the recording.',
          questions: [
            { id: 'lsq1', type: 'short', q: '1. 李明是从什么时候开始过极简生活的？', accept: ['三年前', '搬家'], model: '三年前（搬家的时候）。' },
            { id: 'lsq2', type: 'short', q: '2. 完成句子：搬家时，李明发现很多衣服______。', accept: ['没穿过', '一次都没穿'], model: '买了以后一次都没穿过' },
            { id: 'lsq3', type: 'short', q: '3. 李明现在一共有多少件衣服？', accept: ['三十', '30'], model: '三十件（包括鞋子）。' },
            { id: 'lsq4', type: 'short', q: '4. 每次买一件新衣服，李明会怎么做？', accept: ['送掉', '旧的'], model: '送掉一件旧的。' }
          ] },
        { instr: '根据听力片段的内容，填写下面的表格。', instrEn: 'Complete the table.',
          questions: [{ id: 'lsq5', type: 'table', rows: [
            { label: '5. 金钱方面的变化', accept: ['省', '存', '日本'], model: '省了很多钱，存的钱够去日本旅行。' },
            { label: '6. 心情方面的变化', accept: ['平静'], model: '心情更平静。' },
            { label: '7. 早上的变化', accept: ['穿什么', '不用'], model: '不用再花时间想穿什么。' }
          ] }] },
        { instr: '根据听力片段的内容，回答下面的问题。', instrEn: 'Answer the question.',
          questions: [{ id: 'lsq8', type: 'short', q: '8. 李明遇到了哪两个困难？', parts: [
            { label: '(i)', accept: ['家人', '不理解', '奇怪'], model: '家人一开始不理解，觉得他很奇怪' },
            { label: '(ii)', accept: ['礼物'], model: '不知道怎么处理朋友送的礼物' }
          ] }] },
        { instr: '根据听力片段的内容，选出最合适左边句子的结尾。', instrEn: 'Choose the best ending for each sentence.',
          questions: [{ id: 'lsmatch', type: 'match',
            options: { A: '就好好用。', B: '就送给需要的人。', C: '什么都不要。', D: '就卖给朋友。', E: '知道自己真正需要什么。' },
            items: [
              { n: 9, stem: '能用的礼物……', answer: 'A' },
              { n: 10, stem: '用不上的礼物……', answer: 'B' },
              { n: 11, stem: '李明认为，极简就是……', answer: 'E' }
            ] }] }
      ]
    },

    // ---------------------------------------------------------------- Listening HL
    {
      id: 'listen-hl', kind: 'listening', level: 'HL',
      label: '听力', labelEn: 'Listening (HL)',
      title: '在家办公：是自由还是陷阱？',
      textType: '播客 Podcast',
      instructions: '你即将听到一个听力片段。请先阅读题目。你可以自由重复听力片段，在播放的过程中可以随时回答问题或记下讯息。请用中文回答问题。注意自己掌握时间，听力练习时间总共为20分钟。',
      speakers: { '小周': { pitch: 1.05 } },
      script: [
        ['小周', '大家好，欢迎收听《职场新观察》，我是小周。这几年，越来越多的公司允许员工在家办公。根据一项二零二三年的调查，百分之四十的上班族每周至少在家工作两天。'],
        ['小周', '在家办公最大的好处是节省通勤时间。以北京为例，很多人每天上下班要花将近三个小时。在家工作，这些时间可以用来运动、陪孩子，或者多睡一会儿。另外，在家办公也让一些住在小城市的人有机会为大公司工作。'],
        ['小周', '但是，在家办公也有它的"陷阱"。第一，工作和生活的界限变得模糊，很多人晚上十点还在回复邮件。第二，长期一个人工作容易感到孤独，缺少和同事面对面交流的机会。第三，家里的干扰很多，比如孩子、宠物，还有那张舒服的沙发。'],
        ['小周', '那么，怎样才能在家高效工作呢？专家给了三个建议：一是固定上下班时间；二是在家里划出一个专门的工作区域；三是每周至少和同事见一次面。今天的节目就到这里，我们下期再见！']
      ],
      groups: [
        { instr: '根据听力片段的内容，回答下面的问题。', instrEn: 'Answer the questions based on the recording.',
          questions: [
            { id: 'lhq1', type: 'short', q: '1. 根据调查，有多少上班族每周至少在家工作两天？', accept: ['百分之四十', '40%', '40'], model: '百分之四十（40%）。' },
            { id: 'lhq2', type: 'short', q: '2. 以北京为例，很多人每天上下班要花多长时间？', accept: ['三个小时', '3个小时', '三小时'], model: '将近三个小时。' },
            { id: 'lhq3', type: 'short', q: '3. 节省下来的时间可以用来做什么？写出两件事。', parts: [
              { label: '(i)', accept: ['运动', '孩子', '睡'], model: '运动' },
              { label: '(ii)', accept: ['运动', '孩子', '睡'], model: '陪孩子 / 多睡一会儿' }
            ] },
            { id: 'lhq4', type: 'short', q: '4. 在家办公给住在小城市的人带来了什么机会？', accept: ['大公司'], model: '有机会为大公司工作。' }
          ] },
        { instr: '根据听力片段的内容，填写下面的表格。', instrEn: 'Complete the table: the three "traps" of working from home.',
          questions: [{ id: 'lhq5', type: 'table', rows: [
            { label: '5. 第一个陷阱', accept: ['界限', '模糊', '邮件'], model: '工作和生活的界限变得模糊。' },
            { label: '6. 第二个陷阱', accept: ['孤独', '交流'], model: '容易感到孤独，缺少面对面交流。' },
            { label: '7. 第三个陷阱', accept: ['干扰', '宠物', '沙发', '孩子'], model: '家里的干扰很多（孩子、宠物、沙发）。' }
          ] }] },
        { instr: '根据听力片段的内容，完成下面的句子。', instrEn: 'Complete the sentences.',
          questions: [
            { id: 'lhq8', type: 'short', q: '8. 专家建议在家里划出______。', accept: ['工作区域', '区域'], model: '一个专门的工作区域' },
            { id: 'lhq9', type: 'short', q: '9. 专家建议每周至少______。', accept: ['见一次面', '见面'], model: '和同事见一次面' }
          ] }
      ]
    },

    // ---------------------------------------------------------------- Exam reading SL
    {
      id: 'read-sl', kind: 'exam', level: 'SL',
      label: '阅读', labelEn: 'Reading (SL)',
      title: '共享单车：城市里的"绿色"出行',
      textType: '新闻报道 News report',
      lines: [
        '早上七点，北京的地铁站门口停满了五颜六色的共享',
        '单车。上班族扫一下二维码，就能骑车去公司，十分方便。',
        '共享单车出现以前，从地铁站到公司的"最后一公里"',
        '常常让人头疼：走路太远，打车又太贵。如今，这个问题',
        '基本上得到了解决。据统计，全国每天有超过三千万人次',
        '使用共享单车。',
        '骑车不但方便，而且有益于健康。医生指出，每天骑车',
        '三十分钟，可以有效降低患心脏病的风险。此外，骑车不',
        '排放废气，对改善城市的空气质量也有帮助。',
        '然而，共享单车也给城市管理带来了新的难题。有些人骑完',
        '车后随意乱停，单车堵住了人行道，有的甚至被扔进河里。',
        '为此，许多城市划出了专门的停车区域，对乱停车的用户',
        '进行罚款。专家认为，共享单车能否长期发展，关键在于每',
        '个使用者是否都能遵守规则。'
      ],
      groups: [
        { instr: '根据第1–6行，回答下面的问题。', instrEn: 'Using lines 1–6, answer the questions.',
          questions: [
            { id: 'rsq1', type: 'short', q: '1. 完成句子：上班族扫一下______，就能骑车去公司。', accept: ['二维码'], model: '二维码' },
            { id: 'rsq2', type: 'short', q: '2. "最后一公里"的问题为什么让人头疼？', accept: ['太远', '太贵'], model: '走路太远，打车又太贵。' },
            { id: 'rsq3', type: 'short', q: '3. 解释"据"（第5行）的意思。', accept: ['根据', 'according'], model: '根据（according to）' },
            { id: 'rsq4', type: 'short', q: '4. 第4行中哪个词是"现在"的意思？', accept: ['如今'], model: '如今' }
          ] },
        { instr: '根据第7–9行，填写下面的表格。', instrEn: 'Using lines 7–9, complete the table.',
          questions: [{ id: 'rsq5', type: 'table', rows: [
            { label: '5. 骑车对健康的好处', accept: ['心脏病'], model: '降低患心脏病的风险。' },
            { label: '6. 骑车对环境的好处', accept: ['废气', '空气'], model: '不排放废气，改善空气质量。' }
          ] }] },
        { instr: '根据第10–14行，判断下面叙述的对错，并以文章内容说明理由。两个部分都答对才能得分。', instrEn: 'Lines 10–14: true or false? Justify. Both parts are needed to score.',
          questions: [{ id: 'rstf', type: 'tf', items: [
            { n: 7, stem: '乱停车的用户不会受到任何处罚。', answer: false, accept: ['罚款'], model: '对乱停车的用户进行罚款。' },
            { n: 8, stem: '专家认为，共享单车的发展取决于使用者是否遵守规则。', answer: true, accept: ['遵守规则', '关键在于'], model: '关键在于每个使用者是否都能遵守规则。' }
          ] }] }
      ]
    },

    // ---------------------------------------------------------------- Exam reading HL
    {
      id: 'read-hl', kind: 'exam', level: 'HL',
      label: '阅读', labelEn: 'Reading (HL)',
      title: '"断舍离"：年轻人的新消费观',
      textType: '杂志文章 Magazine feature',
      lines: [
        '"双十一"购物节刚过，二十四岁的周婷却在网上发了一条',
        '让人意外的帖子："今年我一样东西都没买。"她说，过去',
        '她一年要花两万多元在网购上，可买回来的东西大多堆在',
        '角落里，有的连包装都没拆。',
        '周婷的转变源于一本关于"断舍离"的书。所谓"断舍离"，',
        '就是断绝不需要的东西，舍弃多余的废物，脱离对物品的',
        '执着。读完这本书，她花了一个月整理房间，把三百多件',
        '物品捐给了慈善机构，或者在二手平台上卖掉。',
        '像周婷这样的年轻人并不少见。社交媒体上，"极简"、',
        '"断舍离"等话题的阅读量已超过十亿。有学者指出，这一',
        '现象反映了年轻人消费观念的变化：从"拥有更多"转向',
        '"活得更好"。',
        '不过，也有人对此持保留态度。批评者认为，部分人所谓的',
        '"断舍离"，只是把旧东西扔掉，再买新的"极简"产品，其',
        '本质仍然是消费。由此可见，真正的改变不在于扔掉多少',
        '东西，而在于是否改变了购买的习惯。'
      ],
      groups: [
        { instr: '根据第1–8行，回答下面的问题。', instrEn: 'Using lines 1–8, answer the questions.',
          questions: [
            { id: 'rhq1', type: 'short', q: '1. 完成句子：过去，周婷一年要花______在网购上。', accept: ['两万多', '两万'], model: '两万多元' },
            { id: 'rhq2', type: 'short', q: '2. 周婷买回来的东西有什么问题？写出一点。', accept: ['角落', '包装', '没拆'], model: '大多堆在角落里 / 有的连包装都没拆' },
            { id: 'rhq3', type: 'short', q: '3. 周婷的转变是因为什么？', accept: ['书'], model: '一本关于"断舍离"的书。' }
          ] },
        { instr: '根据第5–7行，填写下面的表格。', instrEn: 'Using lines 5–7, complete the table.',
          questions: [{ id: 'rhq4', type: 'table', rows: [
            { label: '4. "断"指的是', accept: ['断绝', '不需要'], model: '断绝不需要的东西' },
            { label: '5. "舍"指的是', accept: ['舍弃', '多余'], model: '舍弃多余的废物' },
            { label: '6. "离"指的是', accept: ['脱离', '执着'], model: '脱离对物品的执着' }
          ] }] },
        { instr: '根据第9–16行，回答下面的问题。', instrEn: 'Using lines 9–16, answer the questions.',
          questions: [
            { id: 'rhq7', type: 'short', q: '7. 文中哪个短语的意思是"不完全同意，有所保留"？', accept: ['持保留态度', '保留态度'], model: '持保留态度' },
            { id: 'rhq8', type: 'short', q: '8. "其"（第14行）指的是什么？', accept: ['断舍离', '扔掉', '极简产品'], model: '部分人所谓的"断舍离"（扔掉旧东西、再买新的"极简"产品的做法）。' }
          ] },
        { instr: '判断下面叙述的对错，并以文章内容说明理由。两个部分都答对才能得分。', instrEn: 'True or false? Justify. Both parts are needed to score.',
          questions: [{ id: 'rhtf', type: 'tf', items: [
            { n: 9, stem: '社交媒体上"断舍离"等话题的阅读量已超过十亿。', answer: true, accept: ['十亿'], model: '"极简"、"断舍离"等话题的阅读量已超过十亿。' },
            { n: 10, stem: '所有人都认为"断舍离"是一种积极的生活方式。', answer: false, accept: ['保留态度', '批评者'], model: '也有人对此持保留态度。' },
            { n: 11, stem: '作者认为扔掉的东西越多，改变就越大。', answer: false, accept: ['不在于扔掉多少', '购买的习惯'], model: '真正的改变不在于扔掉多少东西，而在于是否改变了购买的习惯。' }
          ] }] }
      ]
    },

    // ---------------------------------------------------------------- Writing
    {
      id: 'writing', kind: 'writing', level: 'SL/HL',
      label: '写作', labelEn: 'Writing',
      title: '写作 Writing',
      sl: {
        range: [300, 480],
        instr: '从下面的题目中任选一题作答。字数为300–480之间。',
        prompts: [
          { id: 'w-sl-1', text: '学校正在举办"健康生活周"。请从下面的文本类型中选择一个，向同学介绍一种你认为健康的生活习惯，并说明理由。', types: ['演讲', '博客', '帖子'] },
          { id: 'w-sl-2', text: '你的好朋友整天玩手机，晚上很晚才睡，上课总是没精神。请从下面的文本类型中选择一个，跟他/她谈谈你的担心，并提出建议。', types: ['信', '邮件', '帖子'] },
          { id: 'w-sl-3', text: '你尝试了一个星期的"断网"生活。请从下面的文本类型中选择一个，记录你的经历和感受。', types: ['日记', '博客', '邮件'] }
        ]
      },
      hl: {
        range: [540, 720],
        instr: '从下面的题目中任选一题作答。字数为540–720之间。',
        prompts: [
          { id: 'w-hl-1', text: '有人说："年轻人的生活节奏越来越快，幸福感却越来越低。"请从下面的文本类型中选择一个，发表你对这个观点的看法。', types: ['专栏', '演讲', '辩论'] },
          { id: 'w-hl-2', text: '你的学校打算允许学生在校园里点外卖。请从下面的文本类型中选择一个，向校长表达你的看法，并提出建议。', types: ['信', '邮件', '演讲'] },
          { id: 'w-hl-3', text: '你采访了一位实践"极简生活"的人。请从下面的文本类型中选择一个，介绍他/她的生活方式，并谈谈你的看法。', types: ['采访', '专栏', '博客'] }
        ]
      }
    },

    // ---------------------------------------------------------------- New characters
    { id: 'characters', kind: 'characters', level: 'SL/HL', label: '生字', labelEn: 'New characters', title: '生字 New characters' }
  ]
}

// Format guides for each text type (shown beside the essay editor).
export const TEXT_TYPES = {
  信: { en: 'Letter', tips: ['左上角写称呼，后加冒号（如"亲爱的小明："）', '开头问候，说明写信目的', '正文分段，一段一个要点', '结尾祝福语（如"祝好！""此致 敬礼"）', '右下角署名和日期'] },
  邮件: { en: 'Email', tips: ['写清楚收件人、发件人和标题', '称呼 + 问候', '正文简洁，分段说明', '结尾期待回复', '署名'] },
  博客: { en: 'Blog post', tips: ['有吸引人的标题', '写上发布日期', '第一人称，语气亲切自然', '分享个人经历和感受', '结尾可以向读者提问、邀请留言'] },
  帖子: { en: 'Forum post', tips: ['标题点明话题', '开门见山说明想讨论的问题', '口语化，可以用问句和读者互动', '结尾邀请大家回复'] },
  日记: { en: 'Diary', tips: ['写上日期和天气', '第一人称', '按时间顺序记录事件', '重点写自己的感受和反思'] },
  演讲: { en: 'Speech', tips: ['称呼听众（如"各位老师、同学们："）', '开头点题，说明演讲目的', '论点清楚，有例子', '多用呼吁性的语言', '结尾总结并致谢（"谢谢大家！"）'] },
  采访: { en: 'Interview', tips: ['标题 + 简短的介绍（采访对象、时间、地点）', '问答形式（问：/答：）', '问题由浅入深', '结尾感谢受访者，可加简短评论'] },
  专栏: { en: 'Column', tips: ['标题和作者名', '开头引出社会现象或观点', '有清楚的个人立场', '论证有理有据', '结尾总结观点、引发思考'] },
  辩论: { en: 'Debate speech', tips: ['称呼主席、评委和对方辩友', '表明立场（正方/反方）', '提出两三个论点并举例', '可以反驳对方观点', '结尾重申立场'] }
}
