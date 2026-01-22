import { Book, Zap, FileText, Brain, Headphones, PenTool, Sparkles, Target, Trophy, Flame, Moon, Sun, Ghost, Library, Globe, Microscope, BarChart } from 'lucide-react';
import { AcademicPaper } from '@shared/types';
export const ACHIEVEMENT_LIST = [
  { id: 'a1', name: '学术晨星', description: '连续 7 天早起修行', icon: Sun, requirement: '7日早起' },
  { id: 'a2', name: '筑��五重', description: '达到修行境界 Level 5', icon: Target, requirement: 'Level 5' },
  { id: 'a3', name: '勤勉学子', description: '累计完成 10 个学术蓝图', icon: Book, requirement: '10个任��' },
  { id: 'a4', name: '暗夜灵光', description: '在凌晨 1 点后完成一次深度专注', icon: Moon, requirement: '午夜修行' },
  { id: 'a5', name: '千机��', description: '累计专注时间超过 1500 分钟', icon: Zap, requirement: '1500m专注' },
  { id: 'a6', name: '藏经阁��', description: '阅读并关联 5 ��以上学术论文', icon: Library, requirement: '5篇论文' },
  { id: 'a7', name: '笔灵契约', description: '使��� AI 润色功能超过 20 次', icon: PenTool, requirement: '20次AI' },
  { id: 'a8', name: '道心稳固', description: '专注元气值从未低于 50% 完成番茄', icon: Sparkles, requirement: '高元气完成' },
  { id: 'a9', name: '宗门魁首', description: '在排行榜进入前 10 名', icon: Trophy, requirement: '排行前10' },
  { id: 'a10', name: '驱魔圣手', description: '成功处理 10 次“入魔”分心状态', icon: Ghost, requirement: '10次防分心' },
  { id: 'a11', name: '博采众长', description: '在社���发布 5 条以上学术动态', icon: FileText, requirement: '5条动态' }
];
export const DYNAMIC_INSIGHTS = {
  low_activity: "道友今日似乎神识略显疲惫，‘不积跬步，无以至千��’，不若先从五个单词开始？",
  high_focus: "今日已运转神识超过 100 分钟！元气充盈，神识清明，乃是突破瓶颈之良机。",
  streak_master: "连胜之火已燃，当前这种势头，纵是 Transformer 论文也难不倒你。",
  offline: "道心归位，当前正处于断网���修状态，蓝图将在出关后同步。",
  default: "书山有路勤为径，���海无涯苦作舟。每一份专注都是对未来的加冕。"
};
export const MOCK_SEARCH_RESULTS: AcademicPaper[] = [
  { id: "arxiv-2305.16291", title: "Voyager: An Open-Ended Embodied Agent with Large Language Models", authors: "Guanzhi Wang, et al.", year: 2023, abstract: "We introduce Voyager, the first LLM-powered embodied lifelong learning agent in Minecraft...", pdfUrl: "#", citations: 450, tags: ["LLM", "Agents"], source: 'arXiv', isOA: true },
  { id: "nature-s41586-023", title: "Global warming acceleration since 1970", authors: "James Hansen, et al.", year: 2023, abstract: "Evidence shows that the rate of global warming has increased significantly...", pdfUrl: "#", citations: 1200, tags: ["Climate", "Science"], source: 'Nature', isOA: true },
  { id: "ieee-98765", title: "Robust Control of Multi-Agent Systems via Reinforcement Learning", authors: "L. Zhang, Q. Chen", year: 2024, abstract: "This paper proposes a decentralized control strategy for complex multi-agent systems...", pdfUrl: "#", citations: 85, tags: ["Control", "RL"], source: 'IEEE', isOA: false },
  { id: "pubmed-3344", title: "CRISPR-Cas9 Gene Editing in Human Therapeutics", authors: "Sarah Jenkins, et al.", year: 2022, abstract: "A comprehensive review of recent clinical trials using CRISPR-Cas9...", pdfUrl: "#", citations: 2100, tags: ["Biology", "Genetics"], source: 'PubMed', isOA: true },
  { id: "cnki-10223", title: "基于深度学习的中文命名实体识别研究", authors: "王伟, 李明", year: 2023, abstract: "本文探讨了��训练模型在中文NLP任务中的应用...", pdfUrl: "#", citations: 320, tags: ["NLP", "Deep Learning"], source: 'CNKI', isOA: true },
  { id: "wanfang-4455", title: "碳中和背景下能源结��的转型路径", authors: "张建国", year: 2024, abstract: "分析了我国在2030碳达峰目标下的能源政策建议...", pdfUrl: "#", citations: 150, tags: ["Economics", "Environment"], source: 'Wanfang', isOA: true },
  { id: "arxiv-2401.0001", title: "DeepSeek-V2: A Strong MoE Language Model", authors: "DeepSeek-AI", year: 2024, abstract: "DeepSeek-V2 achieves state-of-the-art performance with Multi-head Latent Attention...", pdfUrl: "#", citations: 890, tags: ["MoE", "LLM"], source: 'arXiv', isOA: true },
  { id: "nature-2024-05", title: "Superconductivity at Room Temperature in Hydrides", authors: "M. Dasen, et al.", year: 2024, abstract: "Discovery of high-pressure superconducting phases in lanthanum hydrides...", pdfUrl: "#", citations: 45, tags: ["Physics", "Materials"], source: 'Nature', isOA: false }
];
export const PAPER_DATA = {
  title: "Sample Paper",
  authors: "Author et al.",
  year: 2024,
  abstract: "Mock abstract text as requested by the client. This study explores the intersection of academic rigor and gamified productivity frameworks to enhance focus in digital environments.",
  introduction: [
    "Para1 mock content. The digital landscape for researchers is becoming increasingly fragmented, requiring new paradigms for deep work.",
    "Para2 mock content. By leveraging large language models (LLMs), we can synthesize complex information in real-time while maintaining immersion."
  ],
  aiAnalysis: {
    keyPoints: [
      "本文提出了一个名为 Academic Quest 的新框架。",
      "采用双栏研习社模式，显著提升了跨语言阅读效率。",
      "引入笔灵助理���AI Assistant），实现了逻辑自动解构。"
    ]
  }
};
export const VOCAB_DATA = [
  { id: "v1", word: "Pragmatic", phonetic: "/præɡˈmætɪk/", definition: "务实的", mnemonic: "Pract + matic (Practical automatically)", example: "A pragmatic approach to solving complex problems." },
  { id: "v2", word: "Heuristic", phonetic: "/hjuˈrɪstɪk/", definition: "启发式的", mnemonic: "Eureka! -> Heur", example: "Heuristics help in quick decision making." },
  { id: "v3", word: "Obscure", phonetic: "/əbˈskjʊə/", definition: "模糊的，无名的", mnemonic: "Obs (over) + cure (care) -> too many layers cover it", example: "His origins remain obscure." },
  { id: "v4", word: "Mitigate", phonetic: "/ˈmɪtɪɡeɪt/", definition: "减轻，缓和", mnemonic: "Gate keeps things mild", example: "Drainage schemes to mitigate flood risk." },
  { id: "v5", word: "Ambiguous", phonetic: "/æmˈbɪɡju��s/", definition: "模糊不清的", mnemonic: "Ambi (both) -> could be both ways", example: "The law is often ambiguous." },
  { id: "v6", word: "Ephemeral", phonetic: "/ɪˈfemərəl/", definition: "短暂的", mnemonic: "E-fem-eral (A few mere moments)", example: "Fashions are ephemeral." },
  { id: "v7", word: "Robust", phonetic: "/rəʊˈbʌst/", definition: "强健的，鲁棒的", mnemonic: "Robot + bust (strong like a robot)", example: "A robust statistical analysis." },
  { id: "v8", word: "Subtle", phonetic: "/ˈsʌtl/", definition: "微妙的", mnemonic: "Sub (below) + tle (tle) -> quiet", example: "The difference is subtle but important." },
  { id: "v9", word: "Paradigm", phonetic: "/ˈpærədaɪm/", definition: "���式", mnemonic: "Para (beside) + digm (show) -> standard show", example: "A major paradigm shift in science." },
  { id: "v10", word: "Cognitive", phonetic: "/ˈkɒɡn��tɪv/", definition: "认知的", mnemonic: "Cogn (know) + itive", example: "Cognitive development in children." }
];
export const LISTENING_DATA = [
  { id: "l1", text: "Artificial Intelligence is fundamentally changing the way research is conducted.", startTime: 0, endTime: 5, amplitude: [10, 30, 80, 50, 20, 40, 60], discipline: "Computer Science" },
  { id: "l2", text: "The primary goal of biological conservation is to maintain biodiversity.", startTime: 6, endTime: 11, amplitude: [20, 40, 30, 70, 90, 40, 10], discipline: "Biology" },
  { id: "l3", text: "Macroeconomic policies aim to achieve price stability and full employment.", startTime: 12, endTime: 18, amplitude: [50, 20, 60, 40, 80, 30, 50], discipline: "Economics" },
  { id: "l4", text: "Quantum mechanics reveals a probabilistic nature of the subatomic world.", startTime: 19, endTime: 25, amplitude: [90, 80, 70, 60, 50, 40, 30], discipline: "Physics" },
  { id: "l5", text: "Recent studies on neural plasticity show that the brain remains adaptable throughout life.", startTime: 26, endTime: 32, amplitude: [30, 50, 80, 90, 60, 40, 20], discipline: "Neuroscience" }
];
export const MOCK_AI_RESPONSES: Record<string, string> = {
  interpret: "这段文字的核心逻辑在于阐述‘自注意力机制’如何通过计算序列内部相互依赖关系来捕捉全局特征。",
  modify: "本研究通过引入多头注意力机制，显著提升了模型对长距离依赖关系的捕捉效率。",
  translate: "注意力机制已成为序列���模及转换模型中不可获缺的组成部分。",
  evaluate: "评分：语法(92), 逻辑(95), 原创度(98)。当前论述逻辑严密，原创度极高。"
};
export const DAILY_INSIGHTS = ["书山有路勤为径。", "知识即力量。", "���淡泊无以明志，非宁静无以致远。"];
export const ACADEMIC_QUOTES = ["博学之，审问之，慎思之，明辨之，笃行之。", "��上得来终觉浅，绝知此事要躬行。"];