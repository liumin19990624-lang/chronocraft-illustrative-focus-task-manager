import { Book, Zap, FileText, Brain, Headphones, PenTool, Sparkles, Target, Trophy, Flame } from 'lucide-react';
import { AcademicPaper } from '@shared/types';
export const MOCK_SEARCH_RESULTS: AcademicPaper[] = [
  {
    id: "arxiv-2305.16291",
    title: "Voyager: An Open-Ended Embodied Agent with Large Language Models",
    authors: "Guanzhi Wang, Yuqi Xie, Yunfan Jiang, et al.",
    year: 2023,
    abstract: "We introduce Voyager, the first LLM-powered embodied lifelong learning agent in Minecraft that continually explores the world, acquires diverse skills, and makes novel discoveries without human intervention.",
    pdfUrl: "https://arxiv.org/pdf/2305.16291.pdf",
    citations: 450,
    tags: ["LLM", "Agents", "Reinforcement Learning"]
  },
  {
    id: "arxiv-1706.03762",
    title: "Attention Is All You Need",
    authors: "Ashish Vaswani, Noam Shazeer, Niki Parmar, et al.",
    year: 2017,
    abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms.",
    pdfUrl: "https://arxiv.org/pdf/1706.03762.pdf",
    citations: 95000,
    tags: ["NLP", "Transformers", "Deep Learning"]
  },
  {
    id: "arxiv-2401.00001",
    title: "Quantum Advantage in Noisy Intermediate-Scale Quantum Computers",
    authors: "Li Wei, John Preskill, Sarah Chen",
    year: 2024,
    abstract: "We investigate the boundaries of quantum advantage in NISQ devices, focusing on random circuit sampling and the effects of decoherence on computational complexity.",
    pdfUrl: "https://arxiv.org/pdf/2401.00001.pdf",
    citations: 120,
    tags: ["Quantum", "NISQ", "Physics"]
  },
  {
    id: "arxiv-2310.12345",
    title: "The Human Brain Project: A Decade of Mapping Neuroscience",
    authors: "Katrin Amunts, Thomas Lippert, et al.",
    year: 2023,
    abstract: "A comprehensive review of the Human Brain Project's achievements in creating a digital infrastructure for neuroscience and brain-inspired computing.",
    pdfUrl: "https://arxiv.org/pdf/2310.12345.pdf",
    citations: 890,
    tags: ["Neuroscience", "Brain Mapping", "Simulation"]
  },
  {
    id: "arxiv-2303.08774",
    title: "GPT-4 Technical Report",
    authors: "OpenAI Research Team",
    year: 2023,
    abstract: "We report the development of GPT-4, a large-scale, multimodal model which can accept image and text inputs and produce text outputs. It exhibits human-level performance on various professional benchmarks.",
    pdfUrl: "https://cdn.openai.com/papers/gpt-4.pdf",
    citations: 12400,
    tags: ["LLM", "Multimodal", "AI Safety"]
  },
  {
    id: "arxiv-2212.00012",
    title: "On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?",
    authors: "Emily M. Bender, Timnit Gebru, Angelina McMillan-Major, et al.",
    year: 2021,
    abstract: "We take a critical look at the risks associated with large language models, including environmental costs, financial costs, and the amplification of bias in training data.",
    pdfUrl: "https://dl.acm.org/doi/pdf/10.1145/3442188.3445922",
    citations: 3200,
    tags: ["AI Ethics", "NLP", "Bias"]
  }
];
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
      "摒弃了传统的 RNN 和 CNN 并行化计��受限的问题。",
      "引入了多头注意力 (Multi-Head Attention) 机制，提升了模型对全局信息的捕捉能力。",
      "在 WMT 2014 英德翻译任务上刷新了 BLEU 得分记录。"
    ],
    terminology: [
      { word: "Self-Attention", definition: "一种允许模型在处理序列时关注序列内不同位置的机制。" },
      { word: "Multi-Head", definition: "通过多个并行���影空间同时进行注意力计算，捕获多维特征。" },
      { word: "Positional Encoding", definition: "��于缺乏循环结构，需要引入位置编码来记录序列的相对位置。" }
    ]
  }
};
export const WRITING_SUGGESTIONS = [
  {
    type: 'tone',
    original: "I think this model is very good for many things.",
    refined: "The proposed model demonstrates superior performance across diverse benchmarks.",
    explanation: "使用正式的学术���词如 'demonstrates' 替代弱势短语 'I think'，增强客观性。"
  },
  {
    type: 'grammar',
    original: "The data shows that the result was affected from the noise.",
    refined: "The results indicate that noise significantly impacted the data integrity.",
    explanation: "调整主被动关系，使论点更加简洁有力。"
  },
  {
    type: 'word-choice',
    original: "The experiment was done quickly.",
    refined: "The experiment was executed with optimal efficiency.",
    explanation: "学术写作倾向于描述过程的‘效率’而非单纯的‘速��’。"
  }
];
export const ACHIEVEMENT_LIST = [
  { id: 'a1', name: '学术晨星', description: '连续 7 天在 8:00 前开始修行', icon: Flame, requirement: '7日早起' },
  { id: 'a2', name: '藏经阁阁长', description: '��计研读论文超过 50 篇', icon: Book, requirement: '50篇论文' },
  { id: 'a3', name: '神识通达', description: '听力���战相似度达到 95% 以上', icon: Brain, requirement: '听力 95%+' },
  { id: 'a4', name: '妙笔生花', description: '单次写作���数突破 5000 字', icon: PenTool, requirement: '5000字创作' },
  { id: 'a5', name: '番茄大师', description: '单日完��� 12 个番茄钟专注', icon: Zap, requirement: '12番茄/日' },
  { id: 'a6', name: '境界稳固', description: '总修行天数达到 100 天', icon: Trophy, requirement: '100日达成' },
  { id: 'a7', name: '社交达人', description: '在论道场获得 50 个点赞', icon: Sparkles, requirement: '50个赞' },
  { id: 'a8', name: '快手修行者', description: '10 分钟内完成所有���日法诀', icon: Target, requirement: '10分钟速成' },
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
  "“书山有路勤��径，今日你已攀过一处险峰。”",
  "“神识清明，专注有力。今日��为精进三分，大善。”",
  "“字斟句酌，笔墨如神。写作一道，贵在持之以恒。”",
  "“耳听八方，心如止水。听力突破指日可待。”",
  "“读万卷书，行万里路。今日论文研读深得三昧。”"
];
export const VOCAB_DATA = [
  {
    id: "v1",
    word: "Pragmatic",
    phonetic: "/præɡˈmætɪk/",
    definition: "务实的，注重实效的",
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
  "“知识的边界，是不断拓宽的荒原。” — 无名氏",
  "“怀疑是科学发现的源头。” — 笛卡尔"
];