// IB Chinese B — Theme 1 Identities, Unit 2 健康和幸福 Health and Well-being.
// Same structure, section order, question formats and word counts as Unit 1 (the iChinese 3
// coursebook formula). All passages, scripts and questions are original to Mandalink.
// Question types are documented at the top of unit1.js; TEXT_TYPES (the writing format guides) live there too.

export const UNIT2 = {
  id: 'u2',
  themeNo: 1,
  themeZh: '身份认同',
  themeEn: 'Identities',
  no: 2,
  zh: '健康和幸福',
  en: 'Health and Well-being',
  intro: '身体健康，心情愉快，才谈得上幸福。本单元探讨青少年的身心健康：压力、睡眠和运动，以及幸福感到底从哪里来。',
  sections: [
    // ---------------------------------------------------------------- Text 1
    {
      id: 'text1', kind: 'text', level: 'SL',
      label: '课文一', labelEn: 'Text 1',
      title: '考试周的日记',
      textType: '日记 Diary',
      meta: [['日期', '11月18日 星期二'], ['天气', '阴']],
      paragraphs: [
        '今天是期中考试的第一天。早上六点我就醒了，心跳得特别快，手心里全是汗。吃早饭的时候，妈妈问我紧张不紧张，我只说了一句"还好"，其实心里乱成了一团。',
        '数学考试比我想象的难。看到最后两道大题，我的脑子一下子空白了，越着急越想不出来。交卷以后，我在走廊里听到同学们对答案，发现自己至少错了三道，眼泪差点儿掉下来。',
        '晚上回到家，我一点儿也不想复习，只想躺在床上刷手机。妈妈没有批评我，{{6}}给我泡了一杯热牛奶，陪我出去散了二十分钟的步。走着走着，我把心里的委屈都说了出来，{{7}}感觉轻松了很多。妈妈告诉我，适当的压力能让人进步，{{8}}压力太大的时候，一定要学会休息。她还教了我一个{{9}}的方法：紧张的时候，慢慢地深呼吸十次。我试了一下，{{10}}很管用！',
        '回到房间，我给明天的复习列了一个计划表：先复习最重要的内容，每学习四十五分钟就休息十分钟，十一点以前一定上床睡觉。',
        '我想，考试只是检查学习的一种方式，并不能决定我是一个什么样的人。明天的英语考试，我会尽力，但不再逼自己做到完美。加油，张悦！'
      ],
      words: [
        ['期中考试', 'qīzhōng kǎoshì', 'midterm exam'], ['心跳', 'xīntiào', 'heartbeat'], ['乱成一团', 'luàn chéng yì tuán', 'in a complete mess'],
        ['想象', 'xiǎngxiàng', 'to imagine'], ['空白', 'kòngbái', 'blank'], ['交卷', 'jiāojuàn', 'to hand in an exam paper'],
        ['走廊', 'zǒuláng', 'corridor'], ['委屈', 'wěiqu', 'feeling wronged or upset'], ['适当', 'shìdàng', 'appropriate'],
        ['压力', 'yālì', 'pressure, stress'], ['深呼吸', 'shēn hūxī', 'deep breath'], ['管用', 'guǎnyòng', 'effective, useful'],
        ['计划表', 'jìhuàbiǎo', 'schedule, plan'], ['尽力', 'jìnlì', 'to do one\'s best'], ['完美', 'wánměi', 'perfect']
      ],
      groups: [
        { instr: '根据①，填写下面的表格。', instrEn: 'Using paragraph 1, complete the table.',
          questions: [{ id: 'u2t1q1', type: 'table', rows: [
            { label: '1. 写日记的人', accept: ['张悦'], model: '张悦' },
            { label: '2. 今天是什么考试的第一天', accept: ['期中'], model: '期中考试' },
            { label: '3. 妈妈问她紧张不紧张，她怎么回答', accept: ['还好'], model: '"还好"' }
          ] }] },
        { instr: '根据②，回答下面的问题。', instrEn: 'Using paragraph 2, answer the questions.',
          questions: [
            { id: 'u2t1q4', type: 'short', q: '4. 看到最后两道大题，她怎么了？', accept: ['空白', '想不出来'], model: '脑子一下子空白了，越着急越想不出来。' },
            { id: 'u2t1q5', type: 'short', q: '5. 她为什么眼泪差点儿掉下来？', accept: ['错了', '三道', '对答案'], model: '听同学们对答案，发现自己至少错了三道。' }
          ] },
        { instr: '根据③，从下面提供的词汇中选出合适的词填空。', instrEn: 'Using paragraph 3, fill each numbered gap with a word from the box.',
          questions: [{ id: 'u2t1gap', type: 'gap',
            bank: ['而是', '于是', '但是', '放松', '果然', '因为', '虽然', '紧张'],
            gaps: [{ n: 6, answer: '而是' }, { n: 7, answer: '于是' }, { n: 8, answer: '但是' }, { n: 9, answer: '放松' }, { n: 10, answer: '果然' }] }] },
        { instr: '根据④和⑤，选出最合适左边句子的结尾。', instrEn: 'Using paragraphs 4–5, choose the best ending for each sentence.',
          questions: [{ id: 'u2t1match', type: 'match',
            options: { A: '每学习四十五分钟就休息十分钟。', B: '一定要考满分。', C: '并不能决定她是一个什么样的人。', D: '十一点以前上床睡觉。', E: '她不想再参加考试了。' },
            items: [
              { n: 11, stem: '复习的时候，张悦打算……', answer: 'A' },
              { n: 12, stem: '晚上，她决定……', answer: 'D' },
              { n: 13, stem: '她认为考试……', answer: 'C' }
            ] }] },
        { instr: '根据⑤，回答下面的问题。', instrEn: 'Using paragraph 5, answer the question.',
          questions: [{ id: 'u2t1q14', type: 'short', q: '14. 对明天的英语考试，张悦是什么态度？', accept: ['尽力', '完美'], model: '她会尽力，但不再逼自己做到完美。' }] }
      ],
      post: { title: '好词好句', titleEn: 'Good words & phrases',
        task: '从课文中找出下面词句，并写出对应的英文意思。',
        items: [['心里乱成了一团', 'my mind was in a complete mess'], ['脑子一下子空白了', 'my mind suddenly went blank'], ['不再逼自己做到完美', 'no longer push myself to be perfect']] }
    },

    // ---------------------------------------------------------------- Text 2
    {
      id: 'text2', kind: 'text', level: 'SL',
      label: '课文二', labelEn: 'Text 2',
      title: '跑步让我找回了自己',
      textType: '帖子 Forum post',
      meta: [['论坛', '校园生活'], ['发帖人', '跑过晨光'], ['发布时间', '10月9日']],
      paragraphs: [
        '大家好！我是高三的刘洋。去年这个时候，我因为学习压力大，每天除了上课就是写作业，体重增加了十公斤，晚上常常失眠，心情也越来越差。',
        '有一天，体育老师在课上说："运动是最便宜的药。"这句话让我下定决心改变。我加入了学校的跑步社，社员每周一、三、五早上一起跑三公里。',
        '第一次跑步，我跑了不到一公里就上气不接下气，只好停下来走路。社长没有笑我，而是告诉我："别跟别人比，只跟昨天的自己比。"后来，我每次都比上一次多跑一点儿。',
        '半年以后，我不但瘦了八公斤，而且睡得更好了，白天学习也更有精神。更重要的是，跑步的时候我什么都不用想，烦恼好像都被汗水带走了。我还在跑步社认识了几个好朋友，我们互相鼓励，一起备考。',
        '下个月，我要参加人生中第一个半程马拉松。有没有想一起训练的同学？欢迎在下面留言！'
      ],
      words: [
        ['体重', 'tǐzhòng', 'body weight'], ['公斤', 'gōngjīn', 'kilogram'], ['失眠', 'shīmián', 'insomnia, to be unable to sleep'],
        ['下定决心', 'xiàdìng juéxīn', 'to make up one\'s mind'], ['社员', 'shèyuán', 'club member'], ['上气不接下气', 'shàng qì bù jiē xià qì', 'out of breath'],
        ['社长', 'shèzhǎng', 'club president'], ['精神', 'jīngshen', 'energy, vigour'], ['烦恼', 'fánnǎo', 'worries'],
        ['汗水', 'hànshuǐ', 'sweat'], ['鼓励', 'gǔlì', 'to encourage'], ['备考', 'bèikǎo', 'to prepare for exams'],
        ['半程马拉松', 'bànchéng mǎlāsōng', 'half marathon'], ['训练', 'xùnliàn', 'to train'], ['留言', 'liúyán', 'to leave a comment']
      ],
      groups: [
        { instr: '根据①，回答下面的问题。', instrEn: 'Using paragraph 1, answer the questions.',
          questions: [
            { id: 'u2t2q1', type: 'short', q: '1. 去年，刘洋的生活有哪些问题？写出两个。', parts: [
              { label: '(i)', accept: ['体重', '十公斤', '失眠', '心情'], model: '体重增加了十公斤' },
              { label: '(ii)', accept: ['体重', '十公斤', '失眠', '心情'], model: '晚上常常失眠 / 心情越来越差' }
            ] },
            { id: 'u2t2q2', type: 'short', q: '2. 文中哪个词的意思是"晚上睡不着觉"？', accept: ['失眠'], model: '失眠' }
          ] },
        { instr: '根据②和③，回答下面的问题。', instrEn: 'Using paragraphs 2–3, answer the questions.',
          questions: [
            { id: 'u2t2q3', type: 'short', q: '3. 是什么让刘洋下定决心改变？', accept: ['最便宜的药', '体育老师'], model: '体育老师说："运动是最便宜的药。"' },
            { id: 'u2t2q4', type: 'table', rows: [
              { label: '4. 跑步社什么时候跑步', accept: ['一', '三', '五', '早上'], model: '每周一、三、五早上' },
              { label: '5. 每次跑多远', accept: ['三公里', '3公里'], model: '三公里' }
            ] },
            { id: 'u2t2q6', type: 'short', q: '6. 社长给了刘洋什么建议？', accept: ['昨天的自己', '别跟别人比'], model: '别跟别人比，只跟昨天的自己比。' }
          ] },
        { instr: '根据④和⑤，回答下面的问题。', instrEn: 'Using paragraphs 4–5, answer the questions.',
          questions: [
            { id: 'u2t2q7', type: 'short', q: '7. 跑步给刘洋带来了哪些好处？写出两点。', parts: [
              { label: '(i)', accept: ['瘦', '睡', '精神', '烦恼', '朋友'], model: '瘦了八公斤' },
              { label: '(ii)', accept: ['瘦', '睡', '精神', '烦恼', '朋友'], model: '睡得更好，学习更有精神' }
            ] },
            { id: 'u2t2q8', type: 'short', q: '8. 刘洋为什么发这个帖子？', accept: ['一起训练', '马拉松', '留言'], model: '他下个月要参加半程马拉松，想找一起训练的同学。' }
          ] }
      ],
      post: { title: '好词好句', titleEn: 'Good words & phrases',
        task: '从课文中找出下面词句，并写出对应的英文意思。',
        items: [['下定决心改变', 'made up my mind to change'], ['只跟昨天的自己比', 'only compare yourself with who you were yesterday'], ['烦恼好像都被汗水带走了', 'my worries seemed to be carried away by the sweat']] }
    },

    // ---------------------------------------------------------------- Text 3
    {
      id: 'text3', kind: 'text', level: 'SL',
      label: '课文三', labelEn: 'Text 3',
      title: '睡不够的青少年',
      textType: '文章 Article',
      meta: [['栏目', '健康生活']],
      paragraphs: [
        '晚上十二点，高一学生小杰还在床上看手机。"作业写完已经十一点了，总得给自己留一点儿放松的时间吧。"像小杰这样的青少年并不少见。一项针对中学生的调查显示，超过六成的学生每天睡眠不足八小时。',
        '医生指出，十三到十八岁的青少年每天需要八到十个小时的睡眠。长期睡眠不足，不仅会让人白天注意力不集中、记忆力下降，还可能影响身体发育，使人更容易生病。此外，睡得少的学生情绪更容易波动，也更容易感到焦虑。',
        '为什么青少年睡得越来越晚？专家认为原因主要有三个：一是作业和课外班太多，占用了大量时间；二是睡前使用电子产品，屏幕发出的蓝光会让大脑保持兴奋；三是很多学生习惯在周末"补觉"，结果打乱了生物钟。',
        '怎样才能睡得更好？专家建议，每天尽量在同一时间上床和起床，周末也不例外；睡前一个小时把手机放在卧室外面；下午以后少喝咖啡和奶茶。有些学校也开始推迟早上的上课时间，让学生多睡半个小时。',
        '"睡眠不是浪费时间，而是为了第二天更好地学习。"一位校长这样说。也许，好好睡一觉，就是最简单的健康秘诀。'
      ],
      words: [
        ['少见', 'shǎojiàn', 'rare'], ['针对', 'zhēnduì', 'aimed at'], ['睡眠不足', 'shuìmián bùzú', 'lack of sleep'],
        ['记忆力', 'jìyìlì', 'memory'], ['发育', 'fāyù', 'growth, development'], ['情绪', 'qíngxù', 'mood, emotions'],
        ['波动', 'bōdòng', 'to fluctuate'], ['焦虑', 'jiāolǜ', 'anxious'], ['屏幕', 'píngmù', 'screen'],
        ['兴奋', 'xīngfèn', 'excited, stimulated'], ['补觉', 'bǔjiào', 'to catch up on sleep'], ['生物钟', 'shēngwùzhōng', 'body clock'],
        ['推迟', 'tuīchí', 'to postpone'], ['秘诀', 'mìjué', 'secret (of success)']
      ],
      groups: [
        { instr: '根据①，回答下面的问题。', instrEn: 'Using paragraph 1, answer the question.',
          questions: [{ id: 'u2t3q1', type: 'short', q: '1. 完成句子：调查显示，超过六成的学生每天______。', accept: ['不足八小时', '八小时', '8小时'], model: '睡眠不足八小时' }] },
        { instr: '根据②，填写下面的表格。', instrEn: 'Using paragraph 2, complete the table.',
          questions: [{ id: 'u2t3q2', type: 'table', rows: [
            { label: '2. 青少年每天需要的睡眠时间', accept: ['八到十', '8到10', '八至十', '8-10'], model: '八到十个小时' },
            { label: '3. 长期睡眠不足对学习的影响（写出一点）', accept: ['注意力', '记忆力'], model: '注意力不集中 / 记忆力下降' }
          ] }] },
        { instr: '根据③，回答下面的问题。', instrEn: 'Using paragraph 3, answer the question.',
          questions: [{ id: 'u2t3q4', type: 'short', q: '4. 青少年睡得越来越晚的三个原因是什么？', parts: [
            { label: '(i)', accept: ['作业', '课外班'], model: '作业和课外班太多' },
            { label: '(ii)', accept: ['电子产品', '蓝光', '屏幕', '手机'], model: '睡前使用电子产品，蓝光让大脑兴奋' },
            { label: '(iii)', accept: ['补觉', '生物钟'], model: '周末"补觉"，打乱了生物钟' }
          ] }] },
        { instr: '根据④和⑤，回答下面的问题。', instrEn: 'Using paragraphs 4–5, answer the questions.',
          questions: [
            { id: 'u2t3q5', type: 'short', q: '5. 文中哪个词的意思是"把时间往后改"？', accept: ['推迟'], model: '推迟' },
            { id: 'u2t3q6', type: 'short', q: '6. 专家给了哪两个具体建议？', parts: [
              { label: '(i)', accept: ['同一时间', '上床', '起床'], model: '每天在同一时间上床和起床' },
              { label: '(ii)', accept: ['手机', '卧室', '咖啡', '奶茶'], model: '睡前一小时把手机放在卧室外面 / 下午以后少喝咖啡和奶茶' }
            ] }
          ] }
      ],
      post: { title: '好词好句', titleEn: 'Good words & phrases',
        task: '从课文中找出下面词句，并写出对应的英文意思。',
        items: [['并不少见', 'is far from rare'], ['打乱了生物钟', 'threw off the body clock'], ['最简单的健康秘诀', 'the simplest secret to good health']] }
    },

    // ---------------------------------------------------------------- HL Text
    {
      id: 'texthl', kind: 'text', level: 'HL',
      label: '高级课文', labelEn: 'HL Text',
      title: '那一年，我学会了说"我不太好"',
      textType: '散文 Personal essay',
      meta: [['作者', '苏晴']],
      paragraphs: [
        '在别人眼里，我一直是那个"什么都好"的女孩：成绩名列前茅，当班长，参加辩论队，脸上总是带着笑。只有我自己知道，那个笑容有多累。',
        '高二那年冬天，我开始整夜整夜地睡不着。白天坐在教室里，老师的声音像是从很远的地方传来；明明什么也没做，却觉得浑身没有力气。我对自己说：再坚持一下就好了，别人都能做到，我为什么不能？',
        '直到有一天早上，我站在镜子前，怎么也想不起来上一次真心地笑是什么时候。那一刻，我第一次害怕了。',
        '那天放学，我在心理咨询室门口来回走了三趟，才鼓起勇气敲门。咨询老师没有急着给我建议，只是静静地听我说。我说着说着就哭了，她递给我一张纸巾，说："你已经很努力了。累了，就可以停下来。"',
        '后来，我每周去咨询室聊一次天，也慢慢学会了拒绝：拒绝做不完的事情，也拒绝那个"必须完美"的自己。我辞去了两个社团的职务，把空出来的时间用来散步、画画，或者什么也不做。',
        '如今回头看，那段日子并不光彩，却是我成长中最重要的一课。原来，承认"我不太好"并不是软弱，而是对自己诚实。真正的坚强，不是永远不倒下，而是倒下以后，愿意向别人伸出手。'
      ],
      words: [
        ['名列前茅', 'míngliè qiánmáo', 'among the very top'], ['班长', 'bānzhǎng', 'class monitor'], ['辩论队', 'biànlùnduì', 'debate team'],
        ['笑容', 'xiàoróng', 'smile'], ['浑身', 'húnshēn', 'all over the body'], ['镜子', 'jìngzi', 'mirror'],
        ['心理咨询', 'xīnlǐ zīxún', 'counselling'], ['鼓起勇气', 'gǔqǐ yǒngqì', 'to pluck up courage'], ['递', 'dì', 'to hand over'],
        ['纸巾', 'zhǐjīn', 'tissue'], ['拒绝', 'jùjué', 'to refuse'], ['辞去', 'cíqù', 'to resign from'],
        ['职务', 'zhíwù', 'post, position'], ['光彩', 'guāngcǎi', 'glorious, honourable'], ['承认', 'chéngrèn', 'to admit'],
        ['软弱', 'ruǎnruò', 'weak'], ['诚实', 'chéngshí', 'honest'], ['坚强', 'jiānqiáng', 'strong, resilient']
      ],
      groups: [
        { instr: '根据①和②，回答下面的问题。', instrEn: 'Using paragraphs 1–2, answer the questions.',
          questions: [
            { id: 'u2thq1', type: 'short', q: '1. 在别人眼里，作者是一个什么样的女孩？', accept: ['什么都好', '成绩', '班长', '笑'], model: '"什么都好"：成绩名列前茅，当班长，脸上总是带着笑。' },
            { id: 'u2thq2', type: 'short', q: '2. 高二那年冬天，作者出现了哪两个问题？', parts: [
              { label: '(i)', accept: ['睡不着', '失眠'], model: '整夜整夜地睡不着' },
              { label: '(ii)', accept: ['没有力气', '力气', '很远'], model: '浑身没有力气 / 上课听不进去' }
            ] }
          ] },
        { instr: '根据③和④，回答下面的问题。', instrEn: 'Using paragraphs 3–4, answer the questions.',
          questions: [
            { id: 'u2thq3', type: 'short', q: '3. 是什么让作者"第一次害怕了"？', accept: ['想不起来', '真心'], model: '她怎么也想不起来上一次真心地笑是什么时候。' },
            { id: 'u2thq4', type: 'short', q: '4. 文中哪个短语的意思是"下决心去做一件需要胆量的事"？', accept: ['鼓起勇气'], model: '鼓起勇气' },
            { id: 'u2thq5', type: 'short', q: '5. "她递给我一张纸巾"中的"她"指的是谁？', accept: ['咨询老师', '老师'], model: '心理咨询室的咨询老师' }
          ] },
        { instr: '根据⑤和⑥，回答下面的问题。', instrEn: 'Using paragraphs 5–6, answer the questions.',
          questions: [
            { id: 'u2thq6', type: 'short', q: '6. 作者学会了拒绝什么？写出两点。', parts: [
              { label: '(i)', accept: ['做不完', '完美'], model: '做不完的事情' },
              { label: '(ii)', accept: ['做不完', '完美'], model: '"必须完美"的自己' }
            ] },
            { id: 'u2thq7', type: 'short', q: '7. 作者认为，什么才是真正的坚强？', accept: ['伸出手', '倒下以后'], model: '倒下以后，愿意向别人伸出手。' }
          ] },
        { instr: '判断下面叙述的对错，并以文章内容说明理由。两个部分都答对才能得分。', instrEn: 'True or false? Justify with words from the text. Both parts are needed to score.',
          questions: [{ id: 'u2thtf', type: 'tf', items: [
            { n: 8, stem: '作者第一次去心理咨询室的时候毫不犹豫。', answer: false, accept: ['三趟', '来回走'], model: '我在心理咨询室门口来回走了三趟，才鼓起勇气敲门。' },
            { n: 9, stem: '咨询老师一开始就给了作者很多建议。', answer: false, accept: ['没有急着', '静静地听'], model: '咨询老师没有急着给我建议，只是静静地听我说。' },
            { n: 10, stem: '作者认为，承认"我不太好"是对自己诚实。', answer: true, accept: ['诚实'], model: '承认"我不太好"并不是软弱，而是对自己诚实。' }
          ] }] }
      ],
      post: { title: '好词好句', titleEn: 'Good words & phrases',
        task: '从课文中找出下面词句，并写出对应的英文意思。',
        items: [['成绩名列前茅', 'grades among the very top'], ['鼓起勇气敲门', 'plucked up the courage to knock'], ['真正的坚强，不是永远不倒下', 'true strength is not never falling down']] }
    },

    // ---------------------------------------------------------------- Listening SL
    {
      id: 'listen-sl', kind: 'listening', level: 'SL',
      label: '听力', labelEn: 'Listening (SL)',
      title: '校园里的"解忧"老师',
      textType: '电台访谈 Radio interview',
      instructions: '你即将听到一个听力片段。请先阅读题目。你可以自由重复听力片段，在播放的过程中可以随时回答问题或记下讯息。请用中文回答问题。注意自己掌握好时间。',
      speakers: { '主持人': { pitch: 1.15 }, '王老师': { pitch: 0.9 } },
      script: [
        ['主持人', '欢迎收听《青春加油站》。今天我们请到了阳光中学的心理老师王芳。王老师，您好！'],
        ['王老师', '主持人好，同学们好！'],
        ['主持人', '学生们一般会因为什么事情来找您？'],
        ['王老师', '最多的是学习压力，特别是考试前后。其次是人际关系，比如跟同学吵架、跟父母沟通不好。还有一些同学是因为睡不好觉。'],
        ['主持人', '很多同学觉得去心理咨询室是一件丢人的事。您怎么看？'],
        ['王老师', '这是一个很常见的误会。来咨询室不代表你"有病"。就像身体不舒服要去看医生一样，心里不舒服也需要有人帮忙。去年来找我的学生有两百多人次，比前年多了一倍，这说明大家越来越重视心理健康了。'],
        ['主持人', '对于压力大的同学，您有什么简单的建议？'],
        ['王老师', '我常说"三个一"：每天运动一小时，每天跟一个人聊聊天，每天写一句感谢的话。'],
        ['主持人', '为什么要写感谢的话呢？'],
        ['王老师', '因为压力大的时候，人很容易只看到不好的事情。写下感谢的话，能帮我们发现生活中好的一面。'],
        ['主持人', '如果同学们想找您，应该怎么做？'],
        ['王老师', '咨询室在图书馆三楼，每天中午十二点到两点开放，不用预约。不想当面说的话，也可以先写下来，放进门口的"悄悄话信箱"里。'],
        ['主持人', '谢谢王老师！']
      ],
      groups: [
        { instr: '根据听力片段的内容，回答下面的问题。', instrEn: 'Answer the questions based on the recording.',
          questions: [
            { id: 'u2lsq1', type: 'short', q: '1. 王老师在哪所学校工作？', accept: ['阳光中学', '阳光'], model: '阳光中学' },
            { id: 'u2lsq2', type: 'short', q: '2. 学生来找王老师，最多的原因是什么？', accept: ['学习压力', '压力'], model: '学习压力（特别是考试前后）' },
            { id: 'u2lsq3', type: 'short', q: '3. 除了学习压力，还有哪两个原因？', parts: [
              { label: '(i)', accept: ['人际关系', '吵架', '沟通'], model: '人际关系（跟同学吵架、跟父母沟通不好）' },
              { label: '(ii)', accept: ['睡不好', '睡'], model: '睡不好觉' }
            ] }
          ] },
        { instr: '根据听力片段的内容，填写下面的表格。', instrEn: 'Complete the tables.',
          questions: [
            { id: 'u2lsq4', type: 'table', rows: [
              { label: '4. 去年来咨询的学生人次', accept: ['两百多', '200', '二百多'], model: '两百多人次' },
              { label: '5. 和前年相比', accept: ['一倍', '多了'], model: '多了一倍' }
            ] },
            { id: 'u2lsq6', type: 'table', rows: [
              { label: '6. "三个一"：每天运动……', accept: ['一小时', '一个小时', '1小时'], model: '一小时' },
              { label: '7. "三个一"：每天跟……聊聊天', accept: ['一个人'], model: '一个人' },
              { label: '8. "三个一"：每天写……', accept: ['感谢'], model: '一句感谢的话' }
            ] }
          ] },
        { instr: '根据听力片段的内容，选出最合适左边句子的结尾。', instrEn: 'Choose the best ending for each sentence.',
          questions: [{ id: 'u2lsmatch', type: 'match',
            options: { A: '在图书馆三楼。', B: '需要提前一个星期预约。', C: '每天中午十二点到两点。', D: '可以放进"悄悄话信箱"。', E: '只在考试前开放。' },
            items: [
              { n: 9, stem: '心理咨询室……', answer: 'A' },
              { n: 10, stem: '咨询室的开放时间是……', answer: 'C' },
              { n: 11, stem: '不想当面说的话……', answer: 'D' }
            ] }] }
      ]
    },

    // ---------------------------------------------------------------- Listening HL
    {
      id: 'listen-hl', kind: 'listening', level: 'HL',
      label: '听力', labelEn: 'Listening (HL)',
      title: '幸福感从哪里来？',
      textType: '播客 Podcast',
      instructions: '你即将听到一个听力片段。请先阅读题目。你可以自由重复听力片段，在播放的过程中可以随时回答问题或记下讯息。请用中文回答问题。注意自己掌握好时间。',
      speakers: { '主持人': { pitch: 1.1 }, '赵教授': { pitch: 0.85 } },
      script: [
        ['主持人', '欢迎收听《慢慢说》。很多人觉得，钱越多就越幸福。今天我们请到了研究幸福感的赵教授，跟我们聊聊这个话题。'],
        ['赵教授', '大家好。其实，钱和幸福的关系没有那么简单。研究发现，当收入还不够满足基本生活需要的时候，多一点钱确实能让人更幸福；但是收入达到一定水平以后，钱对幸福感的影响就越来越小了。'],
        ['主持人', '那什么对幸福感影响最大呢？'],
        ['赵教授', '很多长期研究都得出了同一个结论：良好的人际关系。有一项研究跟踪了七百多人，前后长达几十年，发现那些和家人、朋友关系亲密的人，不但更快乐，身体也更健康。'],
        ['主持人', '可是现在大家都很忙，见朋友的时间越来越少。'],
        ['赵教授', '是的，这是现代人的一个陷阱。我们花很多时间在社交媒体上，以为自己和很多人保持着联系，其实这种联系往往很浅。看别人发的照片，还容易拿自己跟别人比较，结果反而更不开心。'],
        ['主持人', '除了人际关系，还有别的吗？'],
        ['赵教授', '还有两点。第一，做自己觉得有意义的事情，比如帮助别人、当志愿者。第二，学会活在当下。很多人吃饭的时候想着工作，工作的时候想着假期，结果哪一刻都没有真正享受。'],
        ['主持人', '能给听众一个今天就能做的小建议吗？'],
        ['赵教授', '今天晚上，放下手机，给一个很久没联系的朋友打个电话吧。'],
        ['主持人', '谢谢赵教授！']
      ],
      groups: [
        { instr: '根据听力片段的内容，回答下面的问题。', instrEn: 'Answer the questions based on the recording.',
          questions: [
            { id: 'u2lhq1', type: 'short', q: '1. 根据赵教授的说法，什么时候多一点钱能让人更幸福？', accept: ['基本生活', '不够'], model: '收入还不够满足基本生活需要的时候。' },
            { id: 'u2lhq2', type: 'short', q: '2. 收入达到一定水平以后，会怎么样？', accept: ['越来越小', '影响'], model: '钱对幸福感的影响越来越小。' },
            { id: 'u2lhq3', type: 'short', q: '3. 对幸福感影响最大的是什么？', accept: ['人际关系'], model: '良好的人际关系' },
            { id: 'u2lhq4', type: 'short', q: '4. 那项长期研究跟踪了多少人？', accept: ['七百多', '700'], model: '七百多人' },
            { id: 'u2lhq5', type: 'short', q: '5. 和家人、朋友关系亲密的人有哪两个好处？', parts: [
              { label: '(i)', accept: ['快乐'], model: '更快乐' },
              { label: '(ii)', accept: ['健康'], model: '身体更健康' }
            ] }
          ] },
        { instr: '根据听力片段的内容，填写下面的表格。', instrEn: 'Complete the table.',
          questions: [{ id: 'u2lhq6', type: 'table', rows: [
            { label: '6. 社交媒体的第一个问题', accept: ['浅'], model: '这种联系往往很浅。' },
            { label: '7. 社交媒体的第二个问题', accept: ['比较', '不开心'], model: '容易拿自己跟别人比较，反而更不开心。' }
          ] }] },
        { instr: '根据听力片段的内容，回答下面的问题。', instrEn: 'Answer the questions.',
          questions: [
            { id: 'u2lhq8', type: 'short', q: '8. 除了人际关系，赵教授还提到了哪两点？', parts: [
              { label: '(i)', accept: ['有意义', '帮助', '志愿者'], model: '做自己觉得有意义的事情（帮助别人、当志愿者）' },
              { label: '(ii)', accept: ['当下', '享受'], model: '学会活在当下' }
            ] },
            { id: 'u2lhq9', type: 'short', q: '9. 赵教授给听众的小建议是什么？', accept: ['打电话', '放下手机', '朋友'], model: '放下手机，给一个很久没联系的朋友打个电话。' }
          ] }
      ]
    },

    // ---------------------------------------------------------------- Exam reading SL
    {
      id: 'read-sl', kind: 'exam', level: 'SL',
      label: '阅读', labelEn: 'Reading (SL)',
      title: '社区里的"十五分钟健身圈"',
      textType: '新闻报道 News report',
      lines: [
        '周六早上七点，家住成都的退休教师李阿姨已经在小区旁边',
        '的健身广场上打完了一套太极拳。"以前想锻炼，要坐半个',
        '小时公交车去体育馆，现在走几分钟就到了。"她笑着说。',
        '近年来，许多城市都在建设"十五分钟健身圈"，也就是说，',
        '居民从家里出发，步行十五分钟以内就能找到运动场地。这',
        '些场地包括篮球场、跑步道、儿童游乐区等，大多免费开放。',
        '健身圈不但方便了老年人，也吸引了不少年轻人。上班族',
        '张先生说，他每天下班后都会去家附近的球场打半个小时篮',
        '球，"比在家里躺着刷手机强多了"。',
        '不过，也有居民提出了意见。有人反映，晚上跳广场舞的音',
        '乐声音太大，影响了附近居民休息；还有人发现，一些健身',
        '器材坏了很久都没有人修。对此，社区工作人员表示，将规',
        '定晚上九点以后不得播放音乐，并每月定期检查器材。',
        '"健身圈建好了，更要管好、用好。"一位居民这样说。'
      ],
      groups: [
        { instr: '根据第1–6行，回答下面的问题。', instrEn: 'Using lines 1–6, answer the questions.',
          questions: [
            { id: 'u2rsq1', type: 'short', q: '1. 以前李阿姨去锻炼，要花多长时间？', accept: ['半个小时', '公交'], model: '坐半个小时公交车去体育馆。' },
            { id: 'u2rsq2', type: 'short', q: '2. 什么是"十五分钟健身圈"？', accept: ['十五分钟', '步行'], model: '居民从家里出发，步行十五分钟以内就能找到运动场地。' },
            { id: 'u2rsq3', type: 'short', q: '3. 第6行中哪个词的意思是"不用付钱"？', accept: ['免费'], model: '免费' },
            { id: 'u2rsq4', type: 'short', q: '4. 第4行中哪个词的意思是"最近几年"？', accept: ['近年来'], model: '近年来' }
          ] },
        { instr: '根据第7–9行，填写下面的表格。', instrEn: 'Using lines 7–9, complete the table.',
          questions: [{ id: 'u2rsq5', type: 'table', rows: [
            { label: '5. 张先生每天什么时候去运动', accept: ['下班'], model: '下班后' },
            { label: '6. 他觉得打篮球比什么强', accept: ['刷手机', '躺着'], model: '在家里躺着刷手机' }
          ] }] },
        { instr: '根据第10–14行，判断下面叙述的对错，并以文章内容说明理由。两个部分都答对才能得分。', instrEn: 'Lines 10–14: true or false? Justify. Both parts are needed to score.',
          questions: [{ id: 'u2rstf', type: 'tf', items: [
            { n: 7, stem: '所有居民都对健身圈很满意。', answer: false, accept: ['意见'], model: '也有居民提出了意见。' },
            { n: 8, stem: '晚上九点以后不能播放音乐。', answer: true, accept: ['九点以后', '不得播放'], model: '规定晚上九点以后不得播放音乐。' },
            { n: 9, stem: '健身器材每个星期检查一次。', answer: false, accept: ['每月'], model: '每月定期检查器材。' }
          ] }] }
      ]
    },

    // ---------------------------------------------------------------- Exam reading HL
    {
      id: 'read-hl', kind: 'exam', level: 'HL',
      label: '阅读', labelEn: 'Reading (HL)',
      title: '正念冥想：是解药还是潮流？',
      textType: '杂志文章 Magazine feature',
      lines: [
        '在北京一家科技公司工作的林悦，每天中午都会关上手机，',
        '在会议室里闭上眼睛坐十分钟。"刚开始觉得很傻，可坚持',
        '了三个月以后，我发现自己没那么容易发脾气了。"她说。',
        '林悦练习的是"正念冥想"。简单来说，就是把注意力放在当',
        '下，观察自己的呼吸和感受，而不去评判它们。近几年，正',
        '念在年轻人中迅速流行：手机上的冥想软件下载量不断上升，',
        '不少公司和学校也开设了相关课程。',
        '支持者认为，正念能帮助人们减轻焦虑、改善睡眠、提高注',
        '意力。一些研究也发现，长期练习的人在面对压力时情绪更',
        '加稳定。对于每天被信息"轰炸"的都市人来说，每天能有几',
        '分钟什么都不做，本身就是一种难得的休息。',
        '然而，也有心理学家对此持谨慎态度。他们指出，正念并非',
        '适合所有人；对于严重焦虑或抑郁的人来说，它不能代替专',
        '业治疗。还有批评者认为，一些商家把正念包装成"快速解决',
        '一切烦恼"的产品，收取高昂的课程费用，反而让人们忽略了',
        '压力的真正来源，比如过长的工作时间。',
        '也许，正念本身无所谓好坏，关键在于我们怎样看待它：它可',
        '以是一把帮助我们安静下来的钥匙，却不是打开所有门的万能钥匙。'
      ],
      groups: [
        { instr: '根据第1–7行，回答下面的问题。', instrEn: 'Using lines 1–7, answer the questions.',
          questions: [
            { id: 'u2rhq1', type: 'short', q: '1. 完成句子：林悦每天中午都会在会议室里______。', accept: ['闭上眼睛', '坐十分钟'], model: '闭上眼睛坐十分钟' },
            { id: 'u2rhq2', type: 'short', q: '2. 坚持了三个月以后，林悦有什么变化？', accept: ['发脾气'], model: '她没那么容易发脾气了。' },
            { id: 'u2rhq3', type: 'short', q: '3. 根据第4–5行，"正念冥想"是什么？', accept: ['当下', '呼吸', '注意力'], model: '把注意力放在当下，观察自己的呼吸和感受，而不去评判它们。' }
          ] },
        { instr: '根据第8–11行，填写下面的表格。', instrEn: 'Using lines 8–11, complete the table.',
          questions: [{ id: 'u2rhq4', type: 'table', rows: [
            { label: '4. 支持者认为正念的好处（写出一点）', accept: ['焦虑', '睡眠', '注意力'], model: '减轻焦虑 / 改善睡眠 / 提高注意力' },
            { label: '5. 第10行"轰炸"在这里是什么意思', accept: ['太多', '大量', '信息'], model: '每天接收的信息太多，好像被轰炸一样。' }
          ] }] },
        { instr: '根据第12–16行，回答下面的问题。', instrEn: 'Using lines 12–16, answer the questions.',
          questions: [
            { id: 'u2rhq6', type: 'short', q: '6. 文中哪个短语的意思是"很小心，不轻易表示支持"？', accept: ['持谨慎态度', '谨慎'], model: '持谨慎态度' },
            { id: 'u2rhq7', type: 'short', q: '7. "它不能代替专业治疗"中的"它"（第13行）指的是什么？', accept: ['正念'], model: '正念（冥想）' },
            { id: 'u2rhq8', type: 'short', q: '8. 批评者认为，商家的做法让人们忽略了什么？', accept: ['真正来源', '来源', '工作时间'], model: '压力的真正来源，比如过长的工作时间。' }
          ] },
        { instr: '判断下面叙述的对错，并以文章内容说明理由。两个部分都答对才能得分。', instrEn: 'True or false? Justify. Both parts are needed to score.',
          questions: [{ id: 'u2rhtf', type: 'tf', items: [
            { n: 9, stem: '林悦一开始就很喜欢正念冥想。', answer: false, accept: ['很傻'], model: '刚开始觉得很傻。' },
            { n: 10, stem: '作者认为，正念可以解决所有问题。', answer: false, accept: ['万能钥匙', '不是'], model: '它却不是打开所有门的万能钥匙。' }
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
          { id: 'u2-w-sl-1', text: '你的学校下个月举办"心理健康周"。请从下面的文本类型中选择一个，向同学们介绍几个减轻压力的方法。', types: ['演讲', '帖子', '博客'] },
          { id: 'u2-w-sl-2', text: '你的好朋友最近因为考试压力很大，常常睡不着。请从下面的文本类型中选择一个，关心他/她，并给出你的建议。', types: ['邮件', '信', '帖子'] },
          { id: 'u2-w-sl-3', text: '你参加了一个运动社团（例如跑步社、游泳队）。请从下面的文本类型中选择一个，记录你的经历和变化。', types: ['日记', '博客', '帖子'] }
        ]
      },
      hl: {
        range: [540, 720],
        instr: '从下面的题目中任选一题作答。字数为540–720之间。',
        prompts: [
          { id: 'u2-w-hl-1', text: '有人说："健康比成绩更重要。"请从下面的文本类型中选择一个，发表你对这个观点的看法。', types: ['演讲', '辩论', '专栏'] },
          { id: 'u2-w-hl-2', text: '你的学校打算把早上的上课时间推迟半个小时，让学生多睡一会儿。请从下面的文本类型中选择一个，向校长表达你的看法。', types: ['信', '邮件', '演讲'] },
          { id: 'u2-w-hl-3', text: '社交媒体让年轻人更快乐，还是更焦虑？请从下面的文本类型中选择一个，谈谈你的看法。', types: ['专栏', '博客', '辩论'] }
        ]
      }
    },

    // ---------------------------------------------------------------- New characters
    { id: 'characters', kind: 'characters', level: 'SL/HL', label: '生字', labelEn: 'New characters', title: '生字 New characters' }
  ]
}
