import { Book, Zap, FileText, Brain, Headphones, PenTool, Sparkles, Target, Trophy, Flame } from 'lucide-react';
import { AcademicPaper, AiAssistantResult } from '@shared/types';
export const MOCK_SEARCH_RESULTS: AcademicPaper[] = [
  {
    id: "arxiv-2305.16291",
    title: "Voyager: An Open-Ended Embodied Agent with Large Language Models",
    authors: "Guanzhi Wang, Yuqi Xie, et al.",
    year: 2023,
    abstract: "We introduce Voyager, the first LLM-powered embodied lifelong learning agent in Minecraft...",
    pdfUrl: "https://arxiv.org/pdf/2305.16291.pdf",
    citations: 450,
    tags: ["LLM", "Agents"],
    source: 'arXiv',
    isOA: true
  },
  {
    id: "cnki-10234567",
    title: "基于深度强化学习的自动驾驶路径规划研究",
    authors: "张伟, 李华",
    year: 2024,
    abstract: "本文针对复杂交通环境下自动驾驶车辆的路径规划问题，提出了一种改进的深度强化学习算法...",
    pdfUrl: "#",
    citations: 12,
    tags: ["自动驾驶", "强化学习"],
    source: 'CNKI',
    isOA: false,
    journal: "计算��学报"
  },
  {
    id: "pubmed-38123456",
    title: "CRISPR-Cas9 Gene Editing in Cardiovascular Medicine",
    authors: "Sarah Miller, John Doe",
    year: 2023,
    abstract: "This review summarizes the clinical potential and ethical challenges of gene editing in treating hereditary heart diseases...",
    pdfUrl: "#",
    citations: 88,
    tags: ["Genetics", "Medicine"],
    source: 'PubMed',
    isOA: true
  },
  {
    id: "nature-s41586-023",
    title: "Global warming acceleration since 1970",
    authors: "James Hansen, et al.",
    year: 2023,
    abstract: "Evidence shows that the rate of global warming has increased significantly due to rising greenhouse gas emissions...",
    pdfUrl: "#",
    citations: 1200,
    tags: ["Climate", "Science"],
    source: 'Nature',
    isOA: true
  },
  {
    id: "ieee-9876543",
    title: "6G Communication: Vision and Key Technologies",
    authors: "Wang Qiang, et al.",
    year: 2024,
    abstract: "We provide an overview of the potential technologies for 6G, including THz communications and AI-native networks...",
    pdfUrl: "#",
    citations: 34,
    tags: ["6G", "Network"],
    source: 'IEEE',
    isOA: false
  }
];
export const AI_PROMPT_TEMPLATES = {
  interpret: "请解读这段文字的学术逻辑和核心术语：",
  modify: "请将这段文字改写为更加正式、精炼的学术风格：",
  translate: "请将这段文字精准翻译为中文学术语境：",
  evaluate: "请评估这段文字的语法、逻辑和原创度："
};
export const MOCK_AI_RESPONSES: Record<string, string> = {
  interpret: "这段文字的核心逻辑在于阐述���‘自注意力机制’（Self-Attention）如何通过计算序列��部相互依赖关系来捕捉全局特征。其创新点在于摒弃了循环结构，从而实现了高度的并行化计算。关键术语：Multi-Head (多头)、Positional Encoding (位置编码)。",
  modify: "本研究通过引入多头注意力机制，显著提升了模型对长距离依赖关系的捕捉效率。相较于传统架构，���方案在维持计算精度的同时，大幅优化了推理速度。",
  translate: "注意力机制已成为序列建模及��换模型中不可或缺的组成部分，它允许在不考虑输入或输出序列距离的���况下进行依赖关系建模。",
  evaluate: "评分：语法(92), 逻辑(95), 原创度(98)。建议：当前论述逻辑严密，但在实验数据的描述上可以更���象化。原创度极高，未发现明显学术雷同。"
};
export const PAPER_DATA = {
  title: "Attention Is All You Need",
  authors: "Ashish Vaswani, Google Brain",
  abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms.",
  introduction: [
    "Recurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art approaches in sequence modeling.",
    "Recurrent models typically factor computation along the symbol positions of the input and output sequences. Aligning the positions to steps in computation time, they generate a sequence of hidden states.",
    "Attention mechanisms have become an integral part of compelling sequence modeling and transduction models in various tasks."
  ],
  aiAnalysis: {
    keyPoints: ["完全基于注意力机制", "���行化计算优势", "多头注意力机制"],
    terminology: [
      { word: "Self-Attention", definition: "允许模型关注序列不同位置的机制。" },
      { word: "Positional Encoding", definition: "引入位置信息的方法。" }
    ]
  }
};
export const WRITING_SUGGESTIONS = [
  { type: 'tone', original: "I think this is good.", refined: "The proposed model demonstrates superior efficiency.", explanation: "增强学术客观性。" }
];
export const ACHIEVEMENT_LIST = [
  { id: 'a1', name: '学术晨星', description: '连续 7 天早起修行', icon: Flame, requirement: '7日早起' }
];
export const RADAR_DATA = [
  { subject: '词汇', A: 120, fullMark: 150 },
  { subject: '听力', A: 98, fullMark: 150 },
  { subject: '语法', A: 86, fullMark: 150 },
  { subject: '逻辑', A: 99, fullMark: 150 },
  { subject: '速度', A: 85, fullMark: 150 },
  { subject: '专注', A: 140, fullMark: 150 },
];
export const DAILY_INSIGHTS = ["书山有路���为径。"];
export const VOCAB_DATA = [{ id: "v1", word: "Pragmatic", phonetic: "/præɡˈmætɪk/", definition: "务实的", mnemonic: "Pract + matic", example: "A pragmatic approach." }];
export const LISTENING_DATA = [{ id: "l1", text: "AI is revolutionizing research.", startTime: 0, endTime: 4, amplitude: [20, 50, 80, 40] }];
export const LEADERBOARD_DATA = [{ id: "s1", name: "��池居士", level: 42, xp: 45000 }];
export const ACADEMIC_QUOTES = ["知识即力量"];