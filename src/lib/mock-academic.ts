import { Book, Zap, FileText, Brain, Headphones, PenTool, Sparkles, Target, Trophy, Flame, Moon, Sun, Ghost, Library, Search } from 'lucide-react';
import { AcademicPaper, AiAssistantResult } from '@shared/types';
export const ACHIEVEMENT_LIST = [
  { id: 'a1', name: '学术晨星', description: '连续 7 天早起修行', icon: Sun, requirement: '7日早起' },
  { id: 'a2', name: '筑基五重', description: '��到修行境界 Level 5', icon: Target, requirement: 'Level 5' },
  { id: 'a3', name: '勤勉学��', description: '累计完成 10 个学术��图', icon: Book, requirement: '10个任务' },
  { id: 'a4', name: '暗夜灵光', description: '在��晨 1 点后完成一次深度专注', icon: Moon, requirement: '午夜修行' },
  { id: 'a5', name: '千机变', description: '累计专注时间���过 1500 分钟', icon: Zap, requirement: '1500m专注' },
  { id: 'a6', name: '藏经阁��', description: '阅读并关联 5 ��以上学术论文', icon: Library, requirement: '5篇论文' },
  { id: 'a7', name: '笔灵契约', description: '使用 AI 润色功能超过 20 次', icon: PenTool, requirement: '20次AI' },
  { id: 'a8', name: '道心稳固', description: '专注元气值从未低于 50% 完成番茄', icon: Sparkles, requirement: '高元气完成' },
  { id: 'a9', name: '宗门魁首', description: '在排行��进入前 10 名', icon: Trophy, requirement: '排行前10' },
  { id: 'a10', name: '驱魔圣���', description: '成功处理 10 次“入魔���分心状态', icon: Ghost, requirement: '10次防分心' },
  { id: 'a11', name: '博采众��', description: '在社区发布 5 条以上学术动态', icon: FileText, requirement: '5条动态' }
];
export const DYNAMIC_INSIGHTS = {
  low_activity: "道友今日似乎神识略显疲惫，‘��积跬步，无以至千里’，不若先从五个单词开始？",
  high_focus: "今日已运转神识超过 100 分钟！元气充盈，神识清明，乃���破瓶颈之良机。",
  streak_master: "连胜之火已燃，当前这种势头，纵是 Transformer 论文也难不倒你。",
  default: "书山有路勤为径，学海无涯苦作舟。每一份专注都是对未来的加冕。"
};
export const MOCK_SEARCH_RESULTS: AcademicPaper[] = [
  { id: "arxiv-2305.16291", title: "Voyager: An Open-Ended Embodied Agent with Large Language Models", authors: "Guanzhi Wang, et al.", year: 2023, abstract: "We introduce Voyager, the first LLM-powered embodied lifelong learning agent in Minecraft...", pdfUrl: "#", citations: 450, tags: ["LLM", "Agents"], source: 'arXiv', isOA: true },
  { id: "nature-s41586-023", title: "Global warming acceleration since 1970", authors: "James Hansen, et al.", year: 2023, abstract: "Evidence shows that the rate of global warming has increased significantly...", pdfUrl: "#", citations: 1200, tags: ["Climate", "Science"], source: 'Nature', isOA: true }
];
export const MOCK_AI_RESPONSES: Record<string, string> = {
  interpret: "这段文字的核心逻辑���于阐述‘自注意力机制’如何通过计算序列内部相互依赖关系来捕捉全局特征。",
  modify: "本研究通过���入多头注意力机制，显著提升了模型对长距离依赖关系的捕捉效率。",
  translate: "注意力机制已���为序列建模及转换模型中不可或缺的组成部分。",
  evaluate: "评分：语法(92), 逻辑(95), 原创度(98)。当前论述逻辑严密，原创度极高。"
};
export const DAILY_INSIGHTS = ["书山有路勤为径。", "知识即力量。", "非淡泊无以明志，非宁静无以致远。"];
export const ACADEMIC_QUOTES = ["博学之，审问之，慎思之，明辨之，笃行之。", "纸上得来终觉浅，绝知此事要躬行。"];
export const VOCAB_DATA = [{ id: "v1", word: "Pragmatic", phonetic: "/præɡˈmætɪk/", definition: "务实的", mnemonic: "Pract + matic", example: "A pragmatic approach to solving complex problems." }];
export const LISTENING_DATA = [{ id: "l1", text: "Artificial Intelligence is fundamentally changing the way research is conducted.", startTime: 0, endTime: 5, amplitude: [10, 30, 80, 50, 20, 40, 60] }];