// IB Chinese B — Theme 1 Identities, Unit 3 信念和价值观 Beliefs and Values.
// Same structure, section order, question formats and word counts as Units 1 and 2 (the iChinese 3
// coursebook formula). All passages, scripts and questions are original to Mandalink.
// Question types are documented at the top of unit1.js; TEXT_TYPES (the writing format guides) live there too.

export const UNIT3 = {
  id: 'u3',
  themeNo: 1,
  themeZh: '身份认同',
  themeEn: 'Identities',
  no: 3,
  zh: '信念和价值观',
  en: 'Beliefs and Values',
  intro: '什么是对的？什么值得坚持？本单元通过诚信、志愿服务、成功和孝顺等话题，探讨年轻人的信念和价值观。',
  sections: [
    // ---------------------------------------------------------------- Text 1
    {
      id: 'text1', kind: 'text', level: 'SL',
      label: '课文一', labelEn: 'Text 1',
      title: '捡到钱包以后',
      textType: '信 Letter',
      meta: [['收信人', '爷爷'], ['写信人', '晨晨'], ['日期', '4月12日']],
      paragraphs: [
        '亲爱的爷爷：您好！好久没给您写信了，您的身体还好吗？今天我想告诉您一件上周发生的事，因为它让我想起了您常说的一句话。',
        '上周五放学，我在公交车站的长椅上发现了一个黑色的钱包。打开一看，里面有一千多块钱、一张身份证和几张银行卡。我的心一下子跳得很快：这么多钱，可以买我想了很久的那双球鞋了！',
        '可是，我马上想到，丢钱包的人现在一定很着急。{{6}}，我还是决定把钱包交给警察。到了派出所，警察{{7}}身份证上的信息，很快就联系上了失主。{{8}}是一位六十多岁的老奶奶，钱包里的钱是她准备给孙子交学费的。她拉着我的手，{{9}}地说了好几遍"谢谢"，还要给我两百块钱当作感谢，{{10}}我没有收。',
        '回家的路上，我心里特别踏实。我想起您以前教我的话："不是自己的东西，再好也不能要。"以前我只是把它当成一句普通的话，现在才真正明白了它的意思。',
        '爷爷，等暑假我回老家，再给您讲细节。祝您身体健康！您的孙子，晨晨'
      ],
      words: [
        ['长椅', 'chángyǐ', 'bench'], ['身份证', 'shēnfènzhèng', 'ID card'], ['银行卡', 'yínhángkǎ', 'bank card'],
        ['球鞋', 'qiúxié', 'sneakers'], ['着急', 'zháojí', 'anxious, worried'], ['犹豫', 'yóuyù', 'to hesitate'],
        ['派出所', 'pàichūsuǒ', 'local police station'], ['失主', 'shīzhǔ', 'owner of lost property'], ['学费', 'xuéfèi', 'tuition fees'],
        ['激动', 'jīdòng', 'moved, emotional'], ['当作', 'dàngzuò', 'to treat as'], ['踏实', 'tāshi', 'at ease, at peace'],
        ['普通', 'pǔtōng', 'ordinary'], ['细节', 'xìjié', 'details']
      ],
      groups: [
        { instr: '根据①，填写下面的表格。', instrEn: 'Using paragraph 1, complete the table.',
          questions: [{ id: 'u3t1q1', type: 'table', rows: [
            { label: '1. 写信人', accept: ['晨晨'], model: '晨晨' },
            { label: '2. 收信人', accept: ['爷爷'], model: '爷爷' },
            { label: '3. 写信的目的', accept: ['一件事', '上周', '告诉'], model: '告诉爷爷上周发生的一件事' }
          ] }] },
        { instr: '根据②，回答下面的问题。', instrEn: 'Using paragraph 2, answer the questions.',
          questions: [
            { id: 'u3t1q4', type: 'short', q: '4. 晨晨在哪里发现了钱包？', accept: ['公交车站', '长椅'], model: '在公交车站的长椅上。' },
            { id: 'u3t1q5', type: 'short', q: '5. 钱包里有什么？写出两样。', parts: [
              { label: '(i)', accept: ['钱', '一千', '身份证', '银行卡'], model: '一千多块钱' },
              { label: '(ii)', accept: ['钱', '一千', '身份证', '银行卡'], model: '一张身份证 / 几张银行卡' }
            ] }
          ] },
        { instr: '根据③，从下面提供的词汇中选出合适的词填空。', instrEn: 'Using paragraph 3, fill each numbered gap with a word from the box.',
          questions: [{ id: 'u3t1gap', type: 'gap',
            bank: ['犹豫了一会儿', '根据', '失主', '激动', '但是', '突然', '所以', '偷偷'],
            gaps: [{ n: 6, answer: '犹豫了一会儿' }, { n: 7, answer: '根据' }, { n: 8, answer: '失主' }, { n: 9, answer: '激动' }, { n: 10, answer: '但是' }] }] },
        { instr: '根据③和④，选出最合适左边句子的结尾。', instrEn: 'Using paragraphs 3–4, choose the best ending for each sentence.',
          questions: [{ id: 'u3t1match', type: 'match',
            options: { A: '是准备给孙子交学费的。', B: '晨晨收下了两百块钱。', C: '晨晨心里特别踏实。', D: '不是自己的东西，再好也不能要。', E: '晨晨买了一双球鞋。' },
            items: [
              { n: 11, stem: '钱包里的钱……', answer: 'A' },
              { n: 12, stem: '回家的路上，……', answer: 'C' },
              { n: 13, stem: '爷爷以前教晨晨：……', answer: 'D' }
            ] }] },
        { instr: '根据④，回答下面的问题。', instrEn: 'Using paragraph 4, answer the question.',
          questions: [{ id: 'u3t1q14', type: 'short', q: '14. 现在，晨晨对爷爷的话有什么新的认识？', accept: ['真正明白', '明白'], model: '以前只把它当成一句普通的话，现在才真正明白了它的意思。' }] }
      ],
      post: { title: '好词好句', titleEn: 'Good words & phrases',
        task: '从课文中找出下面词句，并写出对应的英文意思。',
        items: [['我的心一下子跳得很快', 'my heart suddenly started racing'], ['心里特别踏实', 'felt completely at ease'], ['再好也不能要', 'however good it is, you must not take it']] }
    },

    // ---------------------------------------------------------------- Text 2
    {
      id: 'text2', kind: 'text', level: 'SL',
      label: '课文二', labelEn: 'Text 2',
      title: '周末，我在养老院当志愿者',
      textType: '采访 Interview',
      meta: [['栏目', '校园人物'], ['采访对象', '高二学生 陈一凡']],
      paragraphs: [
        '记者：一凡，听说你已经在社区养老院当了一年的志愿者，你是怎么开始的？\n一凡：去年学校要求每个学生完成二十个小时的社会服务。我本来只想完成任务，没想到第一次去就喜欢上了那里。',
        '记者：你在养老院一般做些什么？\n一凡：主要是陪老人聊天、读报纸，有时候也教他们用智能手机。很多老人的孩子在外地工作，他们最想学的是怎么跟家人视频聊天。',
        '记者：有没有让你印象特别深的事？\n一凡：有一位张爷爷，八十多岁了，记性不太好，每次都问我叫什么名字。有一天，我刚进门，他就笑着叫出了我的名字。护士说，他为了记住我，把我的名字写在纸上，每天看好几遍。那一刻，我差点儿哭了。',
        '记者：当志愿者给你带来了什么改变？\n一凡：以前我觉得帮助别人是"付出"，现在我发现，我得到的比付出的更多。我变得更有耐心了，也更懂得珍惜跟家人在一起的时间。',
        '记者：你对想当志愿者的同学有什么建议？\n一凡：别只把它当成任务。哪怕每周只去一个小时，只要真心去做，就会有收获。'
      ],
      words: [
        ['养老院', 'yǎnglǎoyuàn', 'care home for the elderly'], ['志愿者', 'zhìyuànzhě', 'volunteer'], ['社会服务', 'shèhuì fúwù', 'community service'],
        ['任务', 'rènwu', 'task'], ['智能手机', 'zhìnéng shǒujī', 'smartphone'], ['外地', 'wàidì', 'another city or region'],
        ['视频', 'shìpín', 'video'], ['印象', 'yìnxiàng', 'impression'], ['记性', 'jìxing', 'memory (ability to remember)'],
        ['护士', 'hùshi', 'nurse'], ['付出', 'fùchū', 'to give (time, effort)'], ['耐心', 'nàixīn', 'patience'],
        ['珍惜', 'zhēnxī', 'to cherish'], ['收获', 'shōuhuò', 'gains, rewards']
      ],
      groups: [
        { instr: '根据①和②，回答下面的问题。', instrEn: 'Using paragraphs 1–2, answer the questions.',
          questions: [
            { id: 'u3t2q1', type: 'short', q: '1. 一凡一开始为什么去养老院？', accept: ['二十个小时', '社会服务', '任务', '学校要求'], model: '学校要求每个学生完成二十个小时的社会服务。' },
            { id: 'u3t2q2', type: 'short', q: '2. 一凡在养老院做哪些事？写出两件。', parts: [
              { label: '(i)', accept: ['聊天', '报纸', '手机'], model: '陪老人聊天' },
              { label: '(ii)', accept: ['聊天', '报纸', '手机'], model: '读报纸 / 教他们用智能手机' }
            ] },
            { id: 'u3t2q3', type: 'short', q: '3. 为什么很多老人最想学视频聊天？', accept: ['外地', '家人', '孩子'], model: '他们的孩子在外地工作，他们想跟家人视频聊天。' }
          ] },
        { instr: '根据③，回答下面的问题。', instrEn: 'Using paragraph 3, answer the questions.',
          questions: [
            { id: 'u3t2q4', type: 'short', q: '4. 张爷爷为了记住一凡的名字，做了什么？', accept: ['写在纸上', '看好几遍'], model: '把一凡的名字写在纸上，每天看好几遍。' },
            { id: 'u3t2q5', type: 'short', q: '5. 文中哪个词的意思是"记住东西的能力"？', accept: ['记性'], model: '记性' }
          ] },
        { instr: '根据④和⑤，填写下面的表格。', instrEn: 'Using paragraphs 4–5, complete the table.',
          questions: [{ id: 'u3t2q6', type: 'table', rows: [
            { label: '6. 一凡以前对帮助别人的看法', accept: ['付出'], model: '帮助别人是"付出"。' },
            { label: '7. 一凡现在的看法', accept: ['得到'], model: '得到的比付出的更多。' },
            { label: '8. 一凡给其他同学的建议', accept: ['任务', '真心'], model: '别只把它当成任务，只要真心去做，就会有收获。' }
          ] }] }
      ],
      post: { title: '好词好句', titleEn: 'Good words & phrases',
        task: '从课文中找出下面词句，并写出对应的英文意思。',
        items: [['没想到第一次去就喜欢上了那里', 'never expected to love it from the very first visit'], ['我得到的比付出的更多', 'I get back more than I give'], ['哪怕每周只去一个小时', 'even if it is only one hour a week']] }
    },

    // ---------------------------------------------------------------- Text 3
    {
      id: 'text3', kind: 'text', level: 'SL',
      label: '课文三', labelEn: 'Text 3',
      title: '作弊换来的分数，值得吗？',
      textType: '演讲 Speech',
      meta: [['场合', '周一晨会'], ['演讲人', '学生会主席 林可']],
      paragraphs: [
        '各位老师、同学们：大家早上好！今天我想和大家聊一个有点儿敏感的话题——考试作弊。',
        '上个月期末考试，我们年级有三位同学因为作弊被取消了成绩。我相信，他们一开始并不是坏学生，只是太害怕考不好，想"走一次捷径"。可是，作弊真的能解决问题吗？',
        '首先，作弊骗不了自己。分数也许好看了，可是不会的知识还是不会，下一次考试只会更紧张。其次，作弊对认真复习的同学不公平。最后，也是最重要的一点：诚信一旦失去，就很难再找回来。一个人今天在小考试中作弊，明天就可能在更重要的事情上撒谎。',
        '我知道，大家的压力都很大。但是，与其冒险作弊，不如早一点儿向老师和同学求助。考不好并不可怕，可怕的是失去了面对失败的勇气。',
        '同学们，分数只能代表一时，诚信却会陪伴我们一生。让我们一起做一个诚实的人，用真实的努力换来真实的成绩。谢谢大家！'
      ],
      words: [
        ['敏感', 'mǐngǎn', 'sensitive'], ['作弊', 'zuòbì', 'to cheat (in an exam)'], ['取消', 'qǔxiāo', 'to cancel'],
        ['捷径', 'jiéjìng', 'shortcut'], ['骗', 'piàn', 'to deceive, to fool'], ['公平', 'gōngpíng', 'fair'],
        ['诚信', 'chéngxìn', 'integrity, honesty'], ['一旦', 'yídàn', 'once (something happens)'], ['撒谎', 'sāhuǎng', 'to lie'],
        ['冒险', 'màoxiǎn', 'to take a risk'], ['求助', 'qiúzhù', 'to ask for help'], ['失败', 'shībài', 'failure'],
        ['勇气', 'yǒngqì', 'courage'], ['陪伴', 'péibàn', 'to accompany, to stay with']
      ],
      groups: [
        { instr: '根据①和②，回答下面的问题。', instrEn: 'Using paragraphs 1–2, answer the questions.',
          questions: [
            { id: 'u3t3q1', type: 'short', q: '1. 这次演讲的话题是什么？', accept: ['作弊'], model: '考试作弊' },
            { id: 'u3t3q2', type: 'short', q: '2. 演讲人认为，那三位同学为什么会作弊？', accept: ['害怕', '考不好', '捷径'], model: '他们太害怕考不好，想"走一次捷径"。' },
            { id: 'u3t3q3', type: 'short', q: '3. 文中哪个词的意思是"更快、更容易的办法"？', accept: ['捷径'], model: '捷径' }
          ] },
        { instr: '根据③，回答下面的问题。', instrEn: 'Using paragraph 3, answer the question.',
          questions: [{ id: 'u3t3q4', type: 'short', q: '4. 演讲人认为作弊有哪三个问题？', parts: [
            { label: '(i)', accept: ['骗不了自己', '还是不会', '知识'], model: '骗不了自己：不会的知识还是不会' },
            { label: '(ii)', accept: ['不公平'], model: '对认真复习的同学不公平' },
            { label: '(iii)', accept: ['诚信', '撒谎', '找回'], model: '诚信一旦失去，就很难再找回来' }
          ] }] },
        { instr: '根据④和⑤，回答下面的问题。', instrEn: 'Using paragraphs 4–5, answer the questions.',
          questions: [
            { id: 'u3t3q5', type: 'short', q: '5. 演讲人建议压力大的同学怎么做？', accept: ['求助', '老师'], model: '早一点儿向老师和同学求助。' },
            { id: 'u3t3q6', type: 'short', q: '6. 演讲人认为，什么才是可怕的？', accept: ['勇气', '面对失败'], model: '失去了面对失败的勇气。' },
            { id: 'u3t3q7', type: 'short', q: '7. 完成句子：分数只能代表一时，______。', accept: ['诚信', '一生'], model: '诚信却会陪伴我们一生' }
          ] }
      ],
      post: { title: '好词好句', titleEn: 'Good words & phrases',
        task: '从课文中找出下面词句，并写出对应的英文意思。',
        items: [['走一次捷径', 'take a shortcut just this once'], ['与其冒险作弊，不如早一点儿向老师和同学求助', 'rather than risk cheating, ask teachers and classmates for help early'], ['用真实的努力换来真实的成绩', 'earn real results through real effort']] }
    },

    // ---------------------------------------------------------------- HL Text
    {
      id: 'texthl', kind: 'text', level: 'HL',
      label: '高级课文', labelEn: 'HL Text',
      title: '爸爸的"笨"办法',
      textType: '散文 Personal essay',
      meta: [['作者', '何远']],
      paragraphs: [
        '我家楼下有一家小面馆，是爸爸开的。二十年来，面馆的招牌换过一次，桌椅换过两次，唯一没变的，是那锅骨头汤。',
        '每天凌晨四点，爸爸就起床熬汤。猪骨要先用冷水泡两个小时，再用小火慢慢熬上六个小时。邻居家的面馆早就改用了汤料包，十分钟就能做好一锅"浓汤"，成本还不到爸爸的一半。',
        '上高中以后，我开始觉得爸爸太"笨"了。有一次，我忍不住说："现在谁还喝得出区别？您这样做，累死也赚不了几个钱。"爸爸没有生气，只是把一碗汤推到我面前："你喝喝看。"',
        '那天晚上，一位老顾客来店里吃面。他说，他早就搬到城市的另一头了，可每个月还是会坐一个多小时的地铁过来，"就为了这一口汤"。临走时，他对爸爸说："您家的味道，二十年都没变。"',
        '我突然明白，爸爸卖的不只是一碗面。顾客愿意一次次回来，是因为他们相信，这碗汤里没有骗人的东西。这份信任，比汤料包省下来的钱值钱多了。',
        '如今，我也开始在周末帮爸爸熬汤了。看着锅里慢慢翻滚的汤，我常想：在一个什么都追求"快"的时代，愿意花时间把一件小事做好，也许正是一种了不起的"聪明"。'
      ],
      words: [
        ['面馆', 'miànguǎn', 'noodle shop'], ['招牌', 'zhāopai', 'shop sign'], ['唯一', 'wéiyī', 'only, sole'],
        ['凌晨', 'língchén', 'small hours of the morning'], ['熬', 'áo', 'to simmer for a long time'], ['泡', 'pào', 'to soak'],
        ['汤料包', 'tāngliàobāo', 'soup-base packet'], ['成本', 'chéngběn', 'cost'], ['忍不住', 'rěnbuzhù', 'cannot help (doing)'],
        ['区别', 'qūbié', 'difference'], ['赚', 'zhuàn', 'to earn'], ['顾客', 'gùkè', 'customer'],
        ['临走', 'línzǒu', 'just before leaving'], ['信任', 'xìnrèn', 'trust'], ['翻滚', 'fāngǔn', 'to bubble, to roll'],
        ['追求', 'zhuīqiú', 'to pursue'], ['了不起', 'liǎobuqǐ', 'remarkable']
      ],
      groups: [
        { instr: '根据①和②，回答下面的问题。', instrEn: 'Using paragraphs 1–2, answer the questions.',
          questions: [
            { id: 'u3thq1', type: 'short', q: '1. 二十年来，面馆里唯一没变的是什么？', accept: ['骨头汤', '汤'], model: '那锅骨头汤。' },
            { id: 'u3thq2', type: 'short', q: '2. 爸爸做一锅汤，从泡猪骨到熬好，一共要花多长时间？', accept: ['八个小时', '8个小时', '八小时', '8小时'], model: '八个小时（先泡两个小时，再熬六个小时）。' },
            { id: 'u3thq3', type: 'short', q: '3. 邻居家的面馆是怎么做汤的？', accept: ['汤料包'], model: '用汤料包，十分钟就能做好。' }
          ] },
        { instr: '根据③和④，回答下面的问题。', instrEn: 'Using paragraphs 3–4, answer the questions.',
          questions: [
            { id: 'u3thq4', type: 'short', q: '4. 作者当时为什么觉得爸爸"笨"？', accept: ['区别', '赚不了', '累'], model: '现在没人喝得出区别，这样做很累，也赚不了几个钱。' },
            { id: 'u3thq5', type: 'short', q: '5. 文中哪个词的意思是"控制不了自己，一定要做某事"？', accept: ['忍不住'], model: '忍不住' },
            { id: 'u3thq6', type: 'short', q: '6. 那位老顾客为什么每个月都来？', accept: ['一口汤', '汤', '味道'], model: '就为了这一口汤（这里的味道二十年都没变）。' }
          ] },
        { instr: '根据⑤和⑥，回答下面的问题。', instrEn: 'Using paragraphs 5–6, answer the questions.',
          questions: [
            { id: 'u3thq7', type: 'short', q: '7. 根据作者，顾客愿意一次次回来的原因是什么？', accept: ['相信', '信任', '没有骗人'], model: '他们相信这碗汤里没有骗人的东西。' },
            { id: 'u3thq8', type: 'short', q: '8. 作者认为，什么才是一种"了不起的聪明"？', accept: ['小事做好', '花时间', '做好'], model: '在什么都追求"快"的时代，愿意花时间把一件小事做好。' }
          ] },
        { instr: '判断下面叙述的对错，并以文章内容说明理由。两个部分都答对才能得分。', instrEn: 'True or false? Justify with words from the text. Both parts are needed to score.',
          questions: [{ id: 'u3thtf', type: 'tf', items: [
            { n: 9, stem: '爸爸听了作者的话以后很生气。', answer: false, accept: ['没有生气'], model: '爸爸没有生气，只是把一碗汤推到我面前。' },
            { n: 10, stem: '那位老顾客现在住得离面馆很近。', answer: false, accept: ['另一头', '一个多小时'], model: '他早就搬到城市的另一头了，每个月要坐一个多小时的地铁过来。' },
            { n: 11, stem: '作者现在周末会帮爸爸熬汤。', answer: true, accept: ['周末', '帮爸爸'], model: '如今，我也开始在周末帮爸爸熬汤了。' }
          ] }] }
      ],
      post: { title: '好词好句', titleEn: 'Good words & phrases',
        task: '从课文中找出下面词句，并写出对应的英文意思。',
        items: [['唯一没变的', 'the only thing that has not changed'], ['就为了这一口汤', 'just for a taste of this soup'], ['把一件小事做好', 'to do one small thing well']] }
    },

    // ---------------------------------------------------------------- Listening SL
    {
      id: 'listen-sl', kind: 'listening', level: 'SL',
      label: '听力', labelEn: 'Listening (SL)',
      title: '"光盘行动"，从我做起',
      textType: '校园广播 School radio',
      instructions: '你即将听到一个听力片段。请先阅读题目。你可以自由重复听力片段，在播放的过程中可以随时回答问题或记下讯息。请用中文回答问题。注意自己掌握好时间。',
      speakers: { '主持人': { pitch: 1.2 }, '张老师': { pitch: 0.9 } },
      script: [
        ['主持人', '同学们好，欢迎收听今天的校园广播。最近，学校开展了"光盘行动"。今天我们请来了负责学校食堂的张老师。张老师好！'],
        ['张老师', '主持人好，同学们好！'],
        ['主持人', '为什么学校要开展"光盘行动"？'],
        ['张老师', '我们统计过，以前食堂每天中午要倒掉八十多公斤的剩饭剩菜，差不多是两百个学生一顿饭的量。看到这么多粮食被浪费，我们都很心疼。'],
        ['主持人', '现在情况怎么样？'],
        ['张老师', '活动开始一个月，剩饭剩菜减少了一半，效果还不错。'],
        ['主持人', '食堂做了哪些改变？'],
        ['张老师', '第一，我们推出了"小份菜"，吃得少的同学可以只要半份。第二，同学们可以先少打一点儿，不够再免费添饭。第三，吃得干干净净的同学，可以在餐盘回收处领一张"光盘卡"，集满十张能换一个水果。'],
        ['主持人', '听说有些同学觉得食堂的菜不好吃，所以才剩下。'],
        ['张老师', '这个意见我们收到了。从下个星期开始，我们每个月会请学生投票，选出大家最喜欢的五道菜，也会把不受欢迎的菜换掉。'],
        ['主持人', '最后，您想对同学们说什么？'],
        ['张老师', '吃多少，打多少。珍惜粮食，不只是节约，也是对农民和厨师的尊重。'],
        ['主持人', '谢谢张老师！']
      ],
      groups: [
        { instr: '根据听力片段的内容，回答下面的问题。', instrEn: 'Answer the questions based on the recording.',
          questions: [
            { id: 'u3lsq1', type: 'short', q: '1. 张老师在学校负责什么？', accept: ['食堂'], model: '学校食堂' },
            { id: 'u3lsq2', type: 'short', q: '2. 以前食堂每天中午要倒掉多少剩饭剩菜？', accept: ['八十多', '80'], model: '八十多公斤' },
            { id: 'u3lsq3', type: 'short', q: '3. 这些剩饭剩菜差不多是多少个学生一顿饭的量？', accept: ['两百', '200', '二百'], model: '两百个学生' },
            { id: 'u3lsq4', type: 'short', q: '4. 活动开始一个月后，剩饭剩菜有什么变化？', accept: ['一半', '减少'], model: '减少了一半。' }
          ] },
        { instr: '根据听力片段的内容，填写下面的表格。', instrEn: 'Complete the table.',
          questions: [{ id: 'u3lsq5', type: 'table', rows: [
            { label: '5. 食堂的第一个改变', accept: ['小份', '半份'], model: '推出"小份菜"，可以只要半份。' },
            { label: '6. 食堂的第二个改变', accept: ['添饭', '少打'], model: '先少打一点儿，不够再免费添饭。' },
            { label: '7. 食堂的第三个改变', accept: ['光盘卡', '水果'], model: '吃干净的同学可以领"光盘卡"，集满十张换一个水果。' }
          ] }] },
        { instr: '根据听力片段的内容，选出最合适左边句子的结尾。', instrEn: 'Choose the best ending for each sentence.',
          questions: [{ id: 'u3lsmatch', type: 'match',
            options: { A: '可以换一个水果。', B: '请学生投票选出最喜欢的菜。', C: '只给吃得干净的同学添饭。', D: '也是对农民和厨师的尊重。', E: '每天都换新菜。' },
            items: [
              { n: 8, stem: '集满十张"光盘卡"……', answer: 'A' },
              { n: 9, stem: '从下个星期开始，食堂每个月会……', answer: 'B' },
              { n: 10, stem: '张老师认为，珍惜粮食……', answer: 'D' }
            ] }] }
      ]
    },

    // ---------------------------------------------------------------- Listening HL
    {
      id: 'listen-hl', kind: 'listening', level: 'HL',
      label: '听力', labelEn: 'Listening (HL)',
      title: '什么才算成功？',
      textType: '课堂讨论 Class discussion',
      instructions: '你即将听到一个听力片段。请先阅读题目。你可以自由重复听力片段，在播放的过程中可以随时回答问题或记下讯息。请用中文回答问题。注意自己掌握好时间。',
      speakers: { '李老师': { pitch: 1.0 }, '张明': { pitch: 0.8 }, '陈思': { pitch: 1.3 } },
      script: [
        ['李老师', '今天的讨论课，我们来聊一个问题：什么样的人才算成功？张明，你先说说。'],
        ['张明', '我觉得，成功最直接的标准就是收入。现在买房、看病、养孩子，哪一样不要钱？赚得多，才能让家人过上好日子。'],
        ['陈思', '我不太同意。我表姐在一家大公司工作，工资很高，可是她每天加班到半夜，去年还因为太累住了院。她自己都说，不知道这样拼命是为了什么。'],
        ['张明', '可是如果没有钱，连基本的生活都保证不了，还谈什么幸福？'],
        ['陈思', '我没说钱不重要。我的意思是，钱只是工具，不是目的。我觉得成功应该是做自己喜欢、也擅长的事，并且对别人有用。'],
        ['李老师', '你能举个例子吗？'],
        ['陈思', '比如我们小区的王阿姨，她开了一家很小的修鞋店，收入不高，可是附近的人都离不开她。她每天都很开心，我觉得她就是成功的人。'],
        ['张明', '这么说也有道理。也许成功的标准因人而异吧。不过我还是觉得，年轻的时候多努力赚钱，以后才有选择的自由。'],
        ['李老师', '你们两位其实说到了同一个关键词：选择。有人选择财富，有人选择兴趣，也有人选择家庭。重要的是，这个选择是你自己做的，而不是因为别人觉得你应该这样。下节课，请大家写一篇文章，谈谈你心中的成功。']
      ],
      groups: [
        { instr: '根据听力片段的内容，回答下面的问题。', instrEn: 'Answer the questions based on the recording.',
          questions: [
            { id: 'u3lhq1', type: 'short', q: '1. 张明认为，成功最直接的标准是什么？', accept: ['收入', '钱', '赚'], model: '收入' },
            { id: 'u3lhq2', type: 'short', q: '2. 张明举了哪些需要钱的例子？写出两个。', parts: [
              { label: '(i)', accept: ['买房', '看病', '养孩子'], model: '买房' },
              { label: '(ii)', accept: ['买房', '看病', '养孩子'], model: '看病 / 养孩子' }
            ] },
            { id: 'u3lhq3', type: 'short', q: '3. 陈思的表姐遇到了什么问题？', accept: ['加班', '住院', '住了院', '太累'], model: '每天加班到半夜，去年还因为太累住了院。' },
            { id: 'u3lhq4', type: 'short', q: '4. 陈思认为钱是什么？', accept: ['工具'], model: '钱只是工具，不是目的。' },
            { id: 'u3lhq5', type: 'short', q: '5. 陈思心中的成功是什么？', accept: ['喜欢', '擅长', '有用'], model: '做自己喜欢、也擅长的事，并且对别人有用。' }
          ] },
        { instr: '根据听力片段的内容，填写下面的表格。', instrEn: 'Complete the table.',
          questions: [{ id: 'u3lhq6', type: 'table', rows: [
            { label: '6. 王阿姨的工作', accept: ['修鞋'], model: '开修鞋店' },
            { label: '7. 陈思认为王阿姨成功的原因', accept: ['离不开', '开心'], model: '附近的人都离不开她，她每天都很开心。' }
          ] }] },
        { instr: '根据听力片段的内容，回答下面的问题。', instrEn: 'Answer the questions.',
          questions: [
            { id: 'u3lhq8', type: 'short', q: '8. 讨论到最后，张明的看法有什么变化？', accept: ['因人而异', '有道理'], model: '他觉得陈思也有道理，成功的标准可能因人而异（但仍认为年轻时应多赚钱）。' },
            { id: 'u3lhq9', type: 'short', q: '9. 李老师总结的关键词是什么？', accept: ['选择'], model: '选择' },
            { id: 'u3lhq10', type: 'short', q: '10. 下节课的作业是什么？', accept: ['文章', '成功'], model: '写一篇文章，谈谈心中的成功。' }
          ] }
      ]
    },

    // ---------------------------------------------------------------- Exam reading SL
    {
      id: 'read-sl', kind: 'exam', level: 'SL',
      label: '阅读', labelEn: 'Reading (SL)',
      title: '山村里的"无人小店"',
      textType: '新闻报道 News report',
      lines: [
        '在浙江的一个小山村里，路边有一间特别的小店：店里没有',
        '老板，也没有收银员，只有几排货架和一个写着"请自觉付款"',
        '的木盒子。顾客拿了东西，自己把钱放进盒子里，或者扫码付',
        '款。',
        '小店的主人是村民老周。三年前，他因为腿受伤，没办法再',
        '下地干活，就想出了这个办法：把自家种的蔬菜、鸡蛋和村里',
        '人做的手工艺品放在店里卖。"一开始，家人都担心东西会被',
        '拿走不给钱。"老周笑着说，"可三年下来，账基本上都对得上。"',
        '渐渐地，这家小店出了名。不少游客专门开车来"打卡"，有',
        '人多付了钱，还在留言本上写下"谢谢您对我们的信任"。',
        '当然，也发生过不愉快的事。去年夏天，盒子里的钱被人拿',
        '走了一次。村民们知道后，不但没有责怪老周，还主动在店门',
        '口装了一个摄像头。老周说："小店能开下去，靠的不是摄像头，',
        '而是大家心里的那份诚信。"'
      ],
      groups: [
        { instr: '根据第1–4行，回答下面的问题。', instrEn: 'Using lines 1–4, answer the questions.',
          questions: [
            { id: 'u3rsq1', type: 'short', q: '1. 这家小店有什么特别的地方？', accept: ['没有老板', '收银员', '自觉付款'], model: '店里没有老板，也没有收银员。' },
            { id: 'u3rsq2', type: 'short', q: '2. 顾客怎么付款？写出一种方法。', accept: ['盒子', '扫码'], model: '把钱放进木盒子里 / 扫码付款' },
            { id: 'u3rsq3', type: 'short', q: '3. 第2行中哪个词的意思是"自己主动去做，不用别人要求"？', accept: ['自觉'], model: '自觉' }
          ] },
        { instr: '根据第5–10行，回答下面的问题。', instrEn: 'Using lines 5–10, answer the questions.',
          questions: [
            { id: 'u3rsq4', type: 'table', rows: [
              { label: '4. 老周开小店的原因', accept: ['腿', '受伤', '下地'], model: '他的腿受伤了，没办法再下地干活。' },
              { label: '5. 店里卖的东西（写出一种）', accept: ['蔬菜', '鸡蛋', '手工艺品'], model: '蔬菜 / 鸡蛋 / 手工艺品' }
            ] },
            { id: 'u3rsq6', type: 'short', q: '6. 第8行"账基本上都对得上"是什么意思？', accept: ['没少', '一样', '付钱', '对'], model: '卖出的东西和收到的钱基本一样，很少有人拿东西不给钱。' }
          ] },
        { instr: '根据第11–14行，判断下面叙述的对错，并以文章内容说明理由。两个部分都答对才能得分。', instrEn: 'Lines 11–14: true or false? Justify. Both parts are needed to score.',
          questions: [{ id: 'u3rstf', type: 'tf', items: [
            { n: 7, stem: '盒子里的钱从来没有被人拿走过。', answer: false, accept: ['拿走了一次', '被人拿'], model: '去年夏天，盒子里的钱被人拿走了一次。' },
            { n: 8, stem: '村民们知道后，责怪了老周。', answer: false, accept: ['没有责怪'], model: '村民们知道后，不但没有责怪老周，还主动装了一个摄像头。' },
            { n: 9, stem: '老周认为，小店能开下去主要靠大家的诚信。', answer: true, accept: ['诚信'], model: '靠的不是摄像头，而是大家心里的那份诚信。' }
          ] }] }
      ]
    },

    // ---------------------------------------------------------------- Exam reading HL
    {
      id: 'read-hl', kind: 'exam', level: 'HL',
      label: '阅读', labelEn: 'Reading (HL)',
      title: '孝顺，在今天意味着什么？',
      textType: '专栏 Column',
      lines: [
        '春节刚过，三十岁的程序员小高又回到了深圳。他的父母住在',
        '两千公里外的一个小县城。"一年只回家一次，每次走的时候，',
        '妈妈都站在门口不肯进屋。"说起这些，他的声音有些哽咽。',
        '在中国传统文化中，"孝"一直被看作最重要的美德之一。古人',
        '说"父母在，不远游"，意思是子女应该留在父母身边照顾他们。',
        '然而，在城市化的今天，越来越多的年轻人离开家乡去大城市',
        '工作，"守在父母身边"对很多人来说已经不太现实。',
        '那么，不能常回家的年轻人，还能做到孝顺吗？不少人给出了',
        '自己的答案：每天给父母发一条消息，每周视频一次；教父母',
        '在网上挂号，帮他们识别网络诈骗；把父母接到身边短住，',
        '或者带他们出去旅行。在他们看来，孝顺的核心是关心和陪伴，',
        '而不在于距离的远近。',
        '也有学者提醒，孝顺不应该等同于"听话"。有些父母以"孝"',
        '为理由，干涉子女的婚姻和职业选择，反而让两代人都很痛苦。',
        '真正的孝顺，应该建立在相互理解和尊重的基础上。',
        '或许，孝顺从来没有一个标准答案。重要的不是你离父母有多',
        '远，而是你是否愿意花时间去了解他们，也让他们了解你。'
      ],
      groups: [
        { instr: '根据第1–3行，回答下面的问题。', instrEn: 'Using lines 1–3, answer the questions.',
          questions: [
            { id: 'u3rhq1', type: 'short', q: '1. 小高的父母住在哪里？', accept: ['县城', '两千公里'], model: '两千公里外的一个小县城。' },
            { id: 'u3rhq2', type: 'short', q: '2. 每次小高离开家的时候，妈妈会怎么样？', accept: ['站在门口', '不肯进屋'], model: '站在门口不肯进屋。' },
            { id: 'u3rhq3', type: 'short', q: '3. 第3行中的"哽咽"最可能是什么意思？', accept: ['哭', '难过', '说不出话'], model: '因为难过，说话的时候快要哭了。' }
          ] },
        { instr: '根据第4–7行，回答下面的问题。', instrEn: 'Using lines 4–7, answer the questions.',
          questions: [
            { id: 'u3rhq4', type: 'short', q: '4. 解释"父母在，不远游"的意思。', accept: ['留在父母身边', '身边', '照顾'], model: '父母还在的时候，子女应该留在父母身边照顾他们，不要去很远的地方。' },
            { id: 'u3rhq5', type: 'short', q: '5. 为什么"守在父母身边"对很多人来说不太现实？', accept: ['大城市', '离开家乡', '工作', '城市化'], model: '越来越多的年轻人离开家乡，去大城市工作。' }
          ] },
        { instr: '根据第8–12行，回答下面的问题。', instrEn: 'Using lines 8–12, answer the questions.',
          questions: [
            { id: 'u3rhq6', type: 'table', rows: [
              { label: '6. 年轻人尽孝的一种做法', accept: ['消息', '视频', '挂号', '诈骗', '接到身边', '旅行'], model: '每天给父母发消息 / 每周视频一次' },
              { label: '7. 年轻人尽孝的另一种做法', accept: ['消息', '视频', '挂号', '诈骗', '接到身边', '旅行'], model: '教父母网上挂号、识别诈骗 / 接父母短住 / 带他们旅行' }
            ] },
            { id: 'u3rhq8', type: 'short', q: '8. 文中哪个词的意思是"最重要、最中心的部分"？', accept: ['核心'], model: '核心' }
          ] },
        { instr: '根据第13–17行，回答下面的问题。', instrEn: 'Using lines 13–17, answer the question.',
          questions: [{ id: 'u3rhq9', type: 'short', q: '9. 有些父母以"孝"为理由，做了什么？', accept: ['干涉', '婚姻', '职业'], model: '干涉子女的婚姻和职业选择。' }] },
        { instr: '判断下面叙述的对错，并以文章内容说明理由。两个部分都答对才能得分。', instrEn: 'True or false? Justify. Both parts are needed to score.',
          questions: [{ id: 'u3rhtf', type: 'tf', items: [
            { n: 10, stem: '学者认为，孝顺就是听父母的话。', answer: false, accept: ['不应该等同于', '不应该'], model: '孝顺不应该等同于"听话"。' },
            { n: 11, stem: '作者认为，孝顺有一个标准答案。', answer: false, accept: ['没有一个标准答案', '从来没有'], model: '孝顺从来没有一个标准答案。' }
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
          { id: 'u3-w-sl-1', text: '你在路上捡到了别人丢的东西，并把它还给了失主。请从下面的文本类型中选择一个，记录这件事和你的感受。', types: ['日记', '博客', '信'] },
          { id: 'u3-w-sl-2', text: '学校想鼓励更多学生参加志愿者活动。请从下面的文本类型中选择一个，介绍你参加过（或想参加）的志愿者活动，并号召同学们参与。', types: ['演讲', '帖子', '博客'] },
          { id: 'u3-w-sl-3', text: '你的好朋友打算在考试中作弊。请从下面的文本类型中选择一个，劝他/她不要这样做。', types: ['邮件', '信', '帖子'] }
        ]
      },
      hl: {
        range: [540, 720],
        instr: '从下面的题目中任选一题作答。字数为540–720之间。',
        prompts: [
          { id: 'u3-w-hl-1', text: '有人说："诚信是人生最宝贵的财富。"请从下面的文本类型中选择一个，谈谈你对这句话的看法。', types: ['演讲', '专栏', '辩论'] },
          { id: 'u3-w-hl-2', text: '你所在的城市打算在社区推广"无人小店"。请从下面的文本类型中选择一个，分析这种小店的利与弊，并发表你的看法。', types: ['专栏', '博客', '帖子'] },
          { id: 'u3-w-hl-3', text: '"在离家很远的地方工作，也能做到孝顺。"你同意吗？请从下面的文本类型中选择一个，表达你的观点。', types: ['辩论', '演讲', '专栏'] }
        ]
      }
    },

    // ---------------------------------------------------------------- New characters
    { id: 'characters', kind: 'characters', level: 'SL/HL', label: '生字', labelEn: 'New characters', title: '生字 New characters' }
  ]
}
