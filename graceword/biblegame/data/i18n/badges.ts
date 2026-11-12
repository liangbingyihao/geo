import type { Locale } from "@/lib/i18n/config";
import type { BadgeId } from "@/lib/badges";

interface BadgeText {
  title: string;
  description: string;
}

export const BADGE_TEXT: Record<Locale, Record<BadgeId, BadgeText>> = {
  "zh-Hant": {
    "first-daily": {
      title: "初次登場",
      description: "完成第一次每日挑戰。",
    },
    "streak-3": {
      title: "三日不輟",
      description: "連續三天完成每日挑戰。",
    },
    "streak-7": {
      title: "七日同行",
      description: "連續七天完成每日挑戰。",
    },
    "story-first": {
      title: "故事開卷",
      description: "完成第一個故事。",
    },
    "story-all": {
      title: "故事全覽",
      description: "完成全部故事。",
    },
    "story-perfect": {
      title: "滿分故事",
      description: "在單一故事中拿到滿分。",
    },
    "high-score": {
      title: "高分玩家",
      description: "單日最佳得分達到 40,000。",
    },
    practice: {
      title: "溫故知新",
      description: "重玩任一已完成的故事。",
    },
  },
  en: {
    "first-daily": {
      title: "First Steps",
      description: "Complete your first daily challenge.",
    },
    "streak-3": {
      title: "Three in a Row",
      description: "Complete the daily challenge three days in a row.",
    },
    "streak-7": {
      title: "Seven-Day Walk",
      description: "Complete the daily challenge seven days in a row.",
    },
    "story-first": {
      title: "First Story",
      description: "Complete your first story.",
    },
    "story-all": {
      title: "Whole Story",
      description: "Complete every story.",
    },
    "story-perfect": {
      title: "Perfect Story",
      description: "Score full marks in a single story.",
    },
    "high-score": {
      title: "High Scorer",
      description: "Reach a daily best of 40,000.",
    },
    practice: {
      title: "Practice Makes",
      description: "Replay a completed story.",
    },
  },
};
