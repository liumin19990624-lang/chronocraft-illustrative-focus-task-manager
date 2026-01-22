import { Book, Zap, FileText, Brain, Headphones, PenTool, Sparkles, Target, Trophy, Flame } from 'lucide-react';
export const PAPER_DATA = {
  title: "Attention Is All You Need: Transformer Architectures in Modern NLP",
  authors: "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, et al. (Google Brain)",
  abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.",
  introduction: [
    "Recurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art approaches in sequence modeling.",
    "Recurrent models typically factor computation along the symbol positions of the input and output sequences. Aligning the positions to steps in computation time, they generate a sequence of hidden states.",
    "Attention mechanisms have become an integral part of compelling sequence modeling and transduction models in various tasks, allowing modeling of dependencies without regard to their distance in the input or output sequences."
  ],
  aiAnalysis: {
    keyPoints: [
      "提出了完全基于注意力机制的 Transformer 架构。",
      "摒弃了传统的 RNN 和 CNN 并行化计算受限的问题。",
      "引入了多头注意力 (Multi-Head Attention) 机制，提升了模型对全局信息的捕捉能力。",
      "在 WMT 2014 英德翻���任务上刷新了 BLEU 得分记录。"
    ],
    terminology: [
      { word: "Self-Attention", definition: "一种允许模型在处理序列时关注序列内不同位置的机制。" },
      { word: "Multi-Head", definition: "通过多个并行投影��间同时进行注意力计算，捕获多维特征。" },
      { word: "Positional Encoding", definition: "由于缺���循环结构，需要引入位置编码来记录序列的相对位置。" }
    ]
  }
};
export const WRITING_SUGGESTIONS = [
  {
    type: 'tone',
    original: "I think this model is very good for many things.",
    refined: "The proposed model demonstrates superior performance across diverse benchmarks.",
    explanation: "使用正式的学术动词如 'demonstrates' 替代弱势短语 'I think'，增强客观性。"
  },
  {
    type: 'grammar',
    original: "The data shows that the result was affected from the noise.",
    refined: "The results indicate that noise significantly impacted the data integrity.",
    explanation: "调整主被动关系，使论点更加简��有力。"
  },
  {
    type: 'word-choice',
    original: "The experiment was done quickly.",
    refined: "The experiment was executed with optimal efficiency.",
    explanation: "学术写作倾向于描��过程的‘效率’而非单纯的‘速度’。"
  }
];
export const ACHIEVEMENT_LIST = [
  { id: 'a1', name: '学术晨星', description: '连续 7 天在 8:00 前开始修行', icon: Flame, requirement: '7日早起' },
  { id: 'a2', name: '藏���阁阁长', description: '累计研读论文超�� 50 篇', icon: Book, requirement: '50篇论文' },
  { id: 'a3', name: '神识通达', description: '听力对战相似度达到 95% 以上', icon: Brain, requirement: '听力 95%+' },
  { id: 'a4', name: '妙笔生花', description: '单次写作字数突破 5000 字', icon: PenTool, requirement: '5000字创作' },
  { id: 'a5', name: '番茄大师', description: '单日完成 12 个番茄钟专��', icon: Zap, requirement: '12番茄/日' },
  { id: 'a6', name: '境界稳固', description: '总修行天数达到 100 天', icon: Trophy, requirement: '100日达成' },
  { id: 'a7', name: '社交达人', description: '在论道场获得 50 个点赞', icon: Sparkles, requirement: '50个赞' },
  { id: 'a8', name: '快手修行者', description: '10 分钟内完成所有每日法诀', icon: Target, requirement: '10分钟速成' },
];
export const RADAR_DATA = [
  { subject: '词汇', A: 120, fullMark: 150 },
  { subject: '听力', A: 98, fullMark: 150 },
  { subject: '语法', A: 86, fullMark: 150 },
  { subject: '逻辑', A: 99, fullMark: 150 },
  { subject: '速度', A: 85, fullMark: 150 },
  { subject: '专注', A: 140, fullMark: 150 },
];
export const LEADERBOARD_DATA = [
  { id: 's1', name: '墨池居士', level: 42, xp: 42500 },
  { id: 's2', name: '云端学者', level: 38, xp: 38200 },
  { id: 's3', name: '炼语书生', level: 35, xp: 35900 },
  { id: 's4', name: '翰林院巡查', level: 32, xp: 32100 },
  { id: 's5', name: '代码仙人', level: 30, xp: 30500 },
];
export const DAILY_INSIGHTS = [
  "“书山有路勤为径，今日你已攀过一处险峰。”",
  "“神识清明，专注有力。今日修为精进三���，大善。”",
  "“字斟句酌，笔墨如神。写作一道，��在持之以恒。”",
  "“耳听八方，心如止水。听力突破指日��待。”",
  "“读万卷书，行万里路。今日论文研读深得三昧。”"
];
export const VOCAB_DATA = [
  {
    id: "v1",
    word: "Pragmatic",
    phonetic: "/præɡˈmætɪk/",
    definition: "务��的，注重实效的",
    mnemonic: "记忆术：Prag (Play/Practice) + matic (Auto). 经常实践的人很务实。",
    example: "A pragmatic approach to management is sometimes necessary."
  },
  {
    id: "v2",
    word: "Paradigm",
    phonetic: "/ˈpærədaɪm/",
    definition: "范式，典范",
    mnemonic: "记忆术：Para (Side) + digm (Example). 摆在旁边的标准例子。",
    example: "The shift in the social paradigm changed how people communicate."
  }
];
export const LISTENING_DATA = [
  {
    id: "l1",
    text: "The rapid development of artificial intelligence has revolutionized modern research.",
    startTime: 0,
    endTime: 4.5,
    amplitude: [20, 45, 80, 50, 90, 30, 60, 40, 70, 20]
  }
];
export const ACADEMIC_QUOTES = [
  "“知识的边界，是���断拓宽的荒原。” — 无名氏",
  "“怀疑是科学发现的源头。” — 笛卡尔"
];