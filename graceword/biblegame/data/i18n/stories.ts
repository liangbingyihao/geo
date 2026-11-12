import type { Locale } from "@/lib/i18n/config";
import type { StoryId } from "../stories";

interface StoryText {
  title: string;
  intro: string;
  outro: string;
}

export const STORY_TEXT: Record<Locale, Record<StoryId, StoryText>> = {
  "zh-Hant": {
    birth: {
      title: "降生與童年",
      intro: "從天使報喜到逃往埃及，跟隨耶穌降生的最初幾幕。",
      outro: "道成了肉身，住在我們中間。",
    },
    "early-ministry": {
      title: "受洗與早期事工",
      intro: "從約旦河受洗到呼召第一批門徒，看見耶穌公開事工的起點。",
      outro: "天國近了，你們應當悔改。",
    },
    galilee: {
      title: "加利利事工與教導",
      intro: "在加利利海邊，耶穌教導、醫治、平靜風浪，也呼召人跟隨他。",
      outro: "他的話語帶著權柄。",
    },
    passion: {
      title: "受難週",
      intro: "從醫治瞎眼、拉撒路復活到各各他，跟隨耶穌走向十字架的一週。",
      outro: "成了。",
    },
    resurrection: {
      title: "復活與升天",
      intro: "從空墳墓到橄欖山，復活的基督向門徒顯現並託付使命。",
      outro: "你們要去，使萬民作我的門徒。",
    },
    "early-church": {
      title: "初代教會與保羅",
      intro: "從五旬節到拔摩島，跟隨福音傳遍地中海的腳步。",
      outro: "直到地極，作我的見證。",
    },
  },
  en: {
    birth: {
      title: "Birth & Childhood",
      intro: "From the annunciation to the flight into Egypt, the first scenes of Jesus' birth.",
      outro: "The Word became flesh and dwelt among us.",
    },
    "early-ministry": {
      title: "Baptism & Early Ministry",
      intro: "From the Jordan River to the calling of the first disciples, the beginning of Jesus' public ministry.",
      outro: "The kingdom of heaven is at hand. Repent.",
    },
    galilee: {
      title: "Galilee: Ministry & Teaching",
      intro: "By the Sea of Galilee, Jesus teaches, heals, calms the storm, and calls people to follow him.",
      outro: "His words carried authority.",
    },
    passion: {
      title: "Passion Week",
      intro: "From the healing of the blind man and the raising of Lazarus to Golgotha, follow Jesus through the week that leads to the cross.",
      outro: "It is finished.",
    },
    resurrection: {
      title: "Resurrection & Ascension",
      intro: "From the empty tomb to the Mount of Olives, the risen Christ appears and commissions his disciples.",
      outro: "Go and make disciples of all nations.",
    },
    "early-church": {
      title: "The Early Church & Paul",
      intro: "From Pentecost to Patmos, follow the gospel as it spreads across the Mediterranean.",
      outro: "To the ends of the earth, my witnesses.",
    },
  },
};
