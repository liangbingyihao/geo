import type { Question } from "../lib/types";

export const QUESTIONS: Question[] = [
  {
    id: "annunciation",
    era: "NT",
    difficulty: 1,
    mode: "zoom",
    answer: "天使向馬利亞報喜",
    options: ["天使向馬利亞報喜", "耶穌在水面行走", "東方博士朝拜", "耶穌受洗"],
    hints: [
      "畫面中有一位帶翅膀的使者。",
      "領受信息的那位女子來自拿撒勒。",
      "這是耶穌降生前的序幕。",
    ],
    scripture: { book: "路加福音", chapter: 1, verse: "26-38" },
    event: { year: -5, tolerance: 8, placeName: "拿撒勒", lat: 32.6996, lng: 35.3035 },
    image: {
      src: "/images/annunciation.jpg",
      title: "聖母領報",
      artist: "Gerard David",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Gerard_David_-_The_Annunciation_(The_Angel_and_the_Virgin).jpg",
    },
    summary:
      "天使加百列向童女馬利亞顯現，宣告她將懷孕生子，這孩子要稱為至高者的兒子。",
  },
  {
    id: "nativity",
    era: "NT",
    difficulty: 1,
    mode: "zoom",
    answer: "耶穌降生",
    options: ["耶穌降生", "耶穌受洗", "最後的晚餐", "拉撒路復活"],
    hints: [
      "畫面中央是一個被布包裹的嬰孩。",
      "母親身旁有馬槽與牲畜。",
      "牧羊人前來朝拜。",
    ],
    scripture: { book: "路加福音", chapter: 2, verse: "1-20" },
    event: { year: -4, tolerance: 8, placeName: "伯利恆", lat: 31.7054, lng: 35.2024 },
    image: {
      src: "/images/nativity.jpg",
      title: "耶穌降生",
      artist: "Lucas Cranach the Elder",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Lucas_Cranach_d._%C3%84._016.jpg",
    },
    summary:
      "馬利亞在伯利恆生下耶穌，放在馬槽裡；天使向野地的牧羊人報大喜的信息。",
  },
  {
    id: "magi",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "東方博士朝拜",
    options: ["東方博士朝拜", "五餅二魚", "耶穌受洗", "耶穌升天"],
    hints: [
      "幾位來自東方的訪客帶著禮物。",
      "他們跟隨星的引導。",
      "畫面中的嬰孩被尊為君王。",
    ],
    scripture: { book: "馬太福音", chapter: 2, verse: "1-12" },
    event: { year: -4, tolerance: 8, placeName: "伯利恆", lat: 31.7054, lng: 35.2024 },
    image: {
      src: "/images/magi.jpg",
      title: "三博士朝拜",
      artist: "Fra Angelico 與 Fra Filippo Lippi",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Fra_Angelico,_Fra_Filippo_Lippi,_The_Adoration_of_the_Magi.jpg",
    },
    summary:
      "幾位東方的博士跟隨明星來到伯利恆，俯伏朝拜嬰孩耶穌，並獻上黃金、乳香、沒藥。",
  },
  {
    id: "baptism",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "耶穌受洗",
    options: ["耶穌受洗", "耶穌受試探", "迦拿婚宴水變酒", "平靜風浪"],
    hints: [
      "有人在河水中施洗。",
      "天空有聖靈如鴿子降下。",
      "施洗者約翰在場。",
    ],
    scripture: { book: "馬太福音", chapter: 3, verse: "13-17" },
    event: { year: 27, tolerance: 6, placeName: "約旦河", lat: 31.8375, lng: 35.535 },
    image: {
      src: "/images/baptism.jpg",
      title: "基督受洗",
      artist: "Jan van Scorel",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Jan_van_Scorel_-_The_Baptism_of_Christ_-_WGA21079.jpg",
    },
    summary:
      "耶穌在約旦河受約翰的洗，天開了，聖靈如鴿子降下，天上有聲音說：「這是我的愛子。」",
  },
  {
    id: "temptation",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "耶穌受試探",
    options: ["耶穌受試探", "耶穌受洗", "客西馬尼園的禱告", "耶穌受難"],
    hints: [
      "荒涼的曠野中只有兩個身影。",
      "其中一位帶著試探的誘惑。",
      "耶穌引用經文抵擋誘惑。",
    ],
    scripture: { book: "馬太福音", chapter: 4, verse: "1-11" },
    event: { year: 27, tolerance: 6, placeName: "猶大曠野", lat: 31.874, lng: 35.434 },
    image: {
      src: "/images/temptation.jpg",
      title: "基督受試探",
      artist: "Titian",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Titian_(Tiziano_Vecelli)_-_The_Temptation_of_Christ_-_25.30_-_Minneapolis_Institute_of_Arts.jpg",
    },
    summary:
      "耶穌在曠野禁食四十晝夜，魔鬼三次試探他，他皆以神的話語勝過。",
  },
  {
    id: "cana",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "迦拿婚宴水變酒",
    options: ["迦拿婚宴水變酒", "五餅二魚", "最後的晚餐", "好撒瑪利亞人的比喻"],
    hints: [
      "場景是一場熱鬧的婚宴。",
      "僕人把水倒進石缸。",
      "這是耶穌所行的頭一件神蹟。",
    ],
    scripture: { book: "約翰福音", chapter: 2, verse: "1-11" },
    event: { year: 28, tolerance: 6, placeName: "迦拿", lat: 32.747, lng: 35.339 },
    image: {
      src: "/images/cana.jpg",
      title: "迦拿婚宴",
      artist: "Benvenuto Tisi",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Wedding_at_Cana,_by_Benvenuto_Tisi.jpg",
    },
    summary:
      "在加利利的迦拿一場婚宴上，耶穌吩咐僕人把水倒滿石缸，水就變成了上好的酒。",
  },
  {
    id: "calling_peter",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "耶穌呼召彼得與安得烈",
    options: ["耶穌呼召彼得與安得烈", "耶穌平靜風浪", "耶穌在水面行走", "耶穌升天"],
    hints: [
      "兩兄弟正在湖邊撒網。",
      "耶穌應許他們要得人如得魚。",
      "這是加利利海邊的呼召。",
    ],
    scripture: { book: "馬太福音", chapter: 4, verse: "18-20" },
    event: { year: 28, tolerance: 6, placeName: "加利利海", lat: 32.88, lng: 35.575 },
    image: {
      src: "/images/calling_peter.jpg",
      title: "呼召彼得與安得烈",
      artist: "Duccio di Buoninsegna",
      license: "CC0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Duccio_di_Buoninsegna,_The_Calling_of_the_Apostles_Peter_and_Andrew,_1308-1311,_NGA_282.jpg",
    },
    summary:
      "耶穌在加利利海邊看見打魚的彼得與安得烈，呼召他們跟從他，應許使他們得人如得魚。",
  },
  {
    id: "sermon",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "登山寶訓",
    options: ["登山寶訓", "耶穌受試探", "最後的晚餐", "客西馬尼園的禱告"],
    hints: [
      "耶穌在山上向群眾教導。",
      "聽眾坐在草地上。",
      "八福與主禱文都出自這段教導。",
    ],
    scripture: { book: "馬太福音", chapter: 5, verse: "1-16" },
    event: { year: 28, tolerance: 6, placeName: "八福山", lat: 32.8806, lng: 35.5556 },
    image: {
      src: "/images/sermon.jpg",
      title: "登山寶訓",
      artist: "Carl Bloch",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Bloch-SermonOnTheMount.jpg",
    },
    summary:
      "耶穌在山上向門徒與群眾宣講天國的倫理，包括八福、主禱文與愛仇敵的教導。",
  },
  {
    id: "storm",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "耶穌平靜風浪",
    options: ["耶穌平靜風浪", "耶穌在水面行走", "五餅二魚", "耶穌受洗"],
    hints: [
      "小船在洶湧的海上搖晃。",
      "門徒驚慌，耶穌卻在船尾睡著。",
      "他斥責風和海。",
    ],
    scripture: { book: "馬可福音", chapter: 4, verse: "35-41" },
    event: { year: 28, tolerance: 6, placeName: "加利利海", lat: 32.8, lng: 35.58 },
    image: {
      src: "/images/storm.jpg",
      title: "加利利海上的風暴",
      artist: "Rembrandt",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Rembrandt_Christ_in_the_Storm_on_the_Lake_of_Galilee.jpg",
    },
    summary:
      "耶穌與門徒在加利利海上遇見大風浪，他起來斥責風和海，海面就大大平靜。",
  },
  {
    id: "feed5000",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "五餅二魚",
    options: ["五餅二魚", "迦拿婚宴水變酒", "最後的晚餐", "東方博士朝拜"],
    hints: [
      "一大群人聚集在野地。",
      "門徒分發餅和魚。",
      "約有五千人吃飽。",
    ],
    scripture: { book: "約翰福音", chapter: 6, verse: "1-14" },
    event: { year: 29, tolerance: 6, placeName: "塔布加", lat: 32.873, lng: 35.548 },
    image: {
      src: "/images/feed5000.jpg",
      title: "餵飽五千人",
      artist: "Domenico Fiasella",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Domenico_Fiasella_-_Feeding_the_five_thousand_-_371_-_Gem%C3%A4ldegalerie.jpg",
    },
    summary:
      "耶穌用一個孩童的五個餅和兩條魚，使五千人吃飽，剩下的零碎還裝滿十二個籃子。",
  },
  {
    id: "walk_water",
    era: "NT",
    difficulty: 3,
    mode: "zoom",
    answer: "耶穌在水面行走",
    options: ["耶穌在水面行走", "耶穌平靜風浪", "耶穌呼召彼得與安得烈", "耶穌升天"],
    hints: [
      "夜晚的湖面上出現一個身影。",
      "門徒起初以為是鬼怪。",
      "彼得也曾試著下水。",
    ],
    scripture: { book: "馬太福音", chapter: 14, verse: "22-33" },
    event: { year: 29, tolerance: 6, placeName: "加利利海", lat: 32.82, lng: 35.57 },
    image: {
      src: "/images/walk_water.jpg",
      title: "門徒看見耶穌在水面行走",
      artist: "Henry Ossawa Tanner",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:The_Disciples_See_Christ_Walking_on_the_Water,_by_Henry_Ossawa_Tanner.jpg",
    },
    summary:
      "夜裡耶穌在加利利海面上行走，門徒害怕；彼得也下水行走，卻因小信而沉下去。",
  },
  {
    id: "blind",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "耶穌醫治瞎眼的人",
    options: ["耶穌醫治瞎眼的人", "拉撒路復活", "耶穌受試探", "好撒瑪利亞人的比喻"],
    hints: [
      "一個失明的人站在畫面中央。",
      "耶穌用泥抹他的眼睛。",
      "他奉差往西羅亞池去洗。",
    ],
    scripture: { book: "約翰福音", chapter: 9, verse: "1-12" },
    event: { year: 30, tolerance: 6, placeName: "耶路撒冷", lat: 31.7784, lng: 35.2354 },
    image: {
      src: "/images/blind.jpg",
      title: "基督醫治生來瞎眼的人",
      artist: "El Greco",
      license: "CC0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Christ_Healing_the_Blind_MET_DT407.jpg",
    },
    summary:
      "耶穌用唾沫和泥抹在生來瞎眼之人的眼睛上，叫他往西羅亞池去洗，他回頭就看見了。",
  },
  {
    id: "lazarus",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "拉撒路復活",
    options: ["拉撒路復活", "耶穌醫治瞎眼的人", "耶穌受難", "耶穌升天"],
    hints: [
      "墓穴的石頭被挪開。",
      "耶穌呼喚一個死去四天的人出來。",
      "他的姊妹馬大與馬利亞在旁。",
    ],
    scripture: { book: "約翰福音", chapter: 11, verse: "1-44" },
    event: { year: 30, tolerance: 6, placeName: "伯大尼", lat: 31.771, lng: 35.263 },
    image: {
      src: "/images/lazarus.jpg",
      title: "拉撒路復活",
      artist: "Rembrandt",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Rembrandt_Harmensz._van_Rijn_-_The_Raising_of_Lazarus_-_Google_Art_Project.jpg",
    },
    summary:
      "耶穌在伯大尼的墓前大聲呼叫：「拉撒路，出來！」死了四天的人就從墳墓裡出來。",
  },
  {
    id: "good_samaritan",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "好撒瑪利亞人的比喻",
    options: ["好撒瑪利亞人的比喻", "浪子回頭的比喻", "五餅二魚", "最後的晚餐"],
    hints: [
      "路旁躺著一個受傷的人。",
      "有人停下腳步伸出援手。",
      "耶穌用這故事回答「誰是我的鄰舍」。",
    ],
    scripture: { book: "路加福音", chapter: 10, verse: "25-37" },
    event: { year: 30, tolerance: 8, placeName: "耶利哥往耶路撒冷的路", lat: 31.85, lng: 35.4 },
    image: {
      src: "/images/good_samaritan.jpg",
      title: "好撒瑪利亞人",
      artist: "Joseph Highmore",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Joseph_Highmore_(1692-1780)_-_The_Good_Samaritan_-_T00076_-_Tate.jpg",
    },
    summary:
      "耶穌以被強盜打傷的路人為喻，指出真正愛鄰舍的是那位動了慈心的撒瑪利亞人。",
  },
  {
    id: "last_supper",
    era: "NT",
    difficulty: 1,
    mode: "zoom",
    answer: "最後的晚餐",
    options: ["最後的晚餐", "迦拿婚宴水變酒", "五餅二魚", "東方博士朝拜"],
    hints: [
      "十三個人圍坐在長桌旁。",
      "耶穌說有人要出賣他。",
      "他設立了聖餐。",
    ],
    scripture: { book: "路加福音", chapter: 22, verse: "7-20" },
    event: { year: 30, tolerance: 6, placeName: "耶路撒冷", lat: 31.7717, lng: 35.2297 },
    image: {
      src: "/images/last_supper.jpg",
      title: "最後的晚餐",
      artist: "Leonardo da Vinci",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Leonardo_da_Vinci_(1452-1519)_-_The_Last_Supper_(1495-1498).jpg",
    },
    summary:
      "耶穌在被賣的那一夜與門徒共進晚餐，拿起餅和杯設立聖餐，並預告自己將被出賣。",
  },
  {
    id: "gethsemane",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "客西馬尼園的禱告",
    options: ["客西馬尼園的禱告", "耶穌受試探", "耶穌受洗", "登山寶訓"],
    hints: [
      "夜色中的園子裡有人俯伏禱告。",
      "門徒在一旁睡著了。",
      "耶穌求父挪去那杯。",
    ],
    scripture: { book: "馬太福音", chapter: 26, verse: "36-46" },
    event: { year: 30, tolerance: 6, placeName: "客西馬尼園", lat: 31.7794, lng: 35.2397 },
    image: {
      src: "/images/gethsemane.jpg",
      title: "客西馬尼園的苦禱",
      artist: "Giovanni Bellini",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Bellini,Giovanni_-_Agony_in_the_Garden_-_National_Gallery.jpg",
    },
    summary:
      "耶穌在客西馬尼園極其憂傷，禱告說：「我父啊，倘若可行，求你叫這杯離開我。」",
  },
  {
    id: "crucifixion",
    era: "NT",
    difficulty: 1,
    mode: "zoom",
    answer: "耶穌被釘十字架",
    options: ["耶穌被釘十字架", "耶穌復活", "耶穌升天", "拉撒路復活"],
    hints: [
      "畫面中央是十字架。",
      "母親與門徒站在十字架下。",
      "這是各各他的刑場。",
    ],
    scripture: { book: "約翰福音", chapter: 19, verse: "17-30" },
    event: { year: 30, tolerance: 6, placeName: "各各他", lat: 31.7784, lng: 35.2298 },
    image: {
      src: "/images/crucifixion.jpg",
      title: "基督受難",
      artist: "Hendrick ter Brugghen",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Hendrick_ter_Brugghen_The_Crucifixion_with_the_Virgin_and_Saint_John.jpg",
    },
    summary:
      "耶穌在各各他被釘在十字架上，承擔世人的罪，說完「成了」便將靈魂交付父神。",
  },
  {
    id: "resurrection",
    era: "NT",
    difficulty: 1,
    mode: "zoom",
    answer: "耶穌復活",
    options: ["耶穌復活", "耶穌升天", "耶穌受難", "多馬的懷疑"],
    hints: [
      "墓穴已經空了。",
      "耶穌勝過死亡從墓中出來。",
      "復活清晨婦女們來到墳墓。",
    ],
    scripture: { book: "馬太福音", chapter: 28, verse: "1-10" },
    event: { year: 30, tolerance: 6, placeName: "耶路撒冷", lat: 31.7784, lng: 35.2298 },
    image: {
      src: "/images/resurrection.jpg",
      title: "基督復活",
      artist: "Giovanni Bellini",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Giovanni_Bellini_-_Resurrection_of_Christ_-_WGA01675.jpg",
    },
    summary:
      "第三日清晨，耶穌從死裡復活，勝過罪與死亡，並向門徒顯現。",
  },
  {
    id: "thomas",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "多馬的懷疑",
    options: ["多馬的懷疑", "耶穌復活", "以馬忤斯的晚餐", "耶穌升天"],
    hints: [
      "一個人伸手探入另一人的肋旁。",
      "門徒不敢相信耶穌已復活。",
      "耶穌邀請他觸摸釘痕。",
    ],
    scripture: { book: "約翰福音", chapter: 20, verse: "24-29" },
    event: { year: 30, tolerance: 6, placeName: "耶路撒冷", lat: 31.7717, lng: 35.2297 },
    image: {
      src: "/images/thomas.jpg",
      title: "多馬的懷疑",
      artist: "Caravaggio",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:The_Incredulity_of_Saint_Thomas-Caravaggio_(1601-2).jpg",
    },
    summary:
      "多馬說非看見釘痕就不信；耶穌顯現要他伸手探入肋旁，多馬便告白：「我的主！我的神！」",
  },
  {
    id: "emmaus",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "以馬忤斯的晚餐",
    options: ["以馬忤斯的晚餐", "最後的晚餐", "五餅二魚", "好撒瑪利亞人的比喻"],
    hints: [
      "復活的耶穌與兩個門徒同行。",
      "他們在傍晚一起擘餅。",
      "門徒的眼睛忽然明亮了。",
    ],
    scripture: { book: "路加福音", chapter: 24, verse: "13-35" },
    event: { year: 30, tolerance: 6, placeName: "以馬忤斯", lat: 31.839, lng: 34.99 },
    image: {
      src: "/images/emmaus.jpg",
      title: "以馬忤斯的晚餐",
      artist: "Caravaggio",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:1602-3_Caravaggio,Supper_at_Emmaus_National_Gallery,_London.jpg",
    },
    summary:
      "復活的耶穌與兩個門徒往以馬忤斯去，途中講解聖經；擘餅時他們才認出他來。",
  },
  {
    id: "ascension",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "耶穌升天",
    options: ["耶穌升天", "耶穌復活", "多馬的懷疑", "五旬節聖靈降臨"],
    hints: [
      "耶穌在門徒注視下被舉起。",
      "地點在橄欖山附近。",
      "一朵雲彩把他接去。",
    ],
    scripture: { book: "使徒行傳", chapter: 1, verse: "6-11" },
    event: { year: 30, tolerance: 6, placeName: "橄欖山", lat: 31.7789, lng: 35.245 },
    image: {
      src: "/images/ascension.jpg",
      title: "基督升天",
      artist: "Hans von Kulmbach",
      license: "CC0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:The_Ascension_of_Christ_MET_DP280379.jpg",
    },
    summary:
      "耶穌復活四十天後，在門徒眼前被舉上升，有雲彩把他接去，天使預告他必再來。",
  },
  {
    id: "pentecost",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "五旬節聖靈降臨",
    options: ["五旬節聖靈降臨", "耶穌升天", "耶穌受洗", "多馬的懷疑"],
    hints: [
      "門徒聚集在一處。",
      "火焰般的舌頭落在各人頭上。",
      "他們被聖靈充滿，說起別國的話。",
    ],
    scripture: { book: "使徒行傳", chapter: 2, verse: "1-13" },
    event: { year: 30, tolerance: 6, placeName: "耶路撒冷", lat: 31.7717, lng: 35.2297 },
    image: {
      src: "/images/pentecost.jpg",
      title: "聖靈降臨",
      artist: "Lucas Franchoys（攝影：Ad Meskens）",
      license: "CC BY-SA 4.0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Lucas_Franchoys_(I)_-_Descent_of_the_Holy_Spirit_(Sint-Janskerk,_Mechelen).jpg",
    },
    summary:
      "五旬節當天，聖靈如風如火降臨在門徒身上，他們被聖靈充滿，勇敢見證復活的基督。",
  },
  {
    id: "saul",
    era: "NT",
    difficulty: 3,
    mode: "zoom",
    answer: "掃羅歸主（大馬士革路上）",
    options: ["掃羅歸主（大馬士革路上）", "保羅在雅典講道", "彼得獲救出獄", "五旬節聖靈降臨"],
    hints: [
      "一道大光照倒了一個趕路的人。",
      "他聽見有聲音呼喚他的名字。",
      "他後來成為向外邦人傳福音的使徒。",
    ],
    scripture: { book: "使徒行傳", chapter: 9, verse: "1-19" },
    event: { year: 34, tolerance: 8, placeName: "大馬士革路上", lat: 33.45, lng: 36.35 },
    image: {
      src: "/images/saul.jpg",
      title: "掃羅歸主",
      artist: "Caravaggio",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:The_Conversion_of_Saint_Paul-Caravaggio_(c._1600-1).jpg",
    },
    summary:
      "逼迫教會的掃羅在往大馬士革路上被大光光照，聽見主的聲音，三日後受洗，成為使徒保羅。",
  },
  {
    id: "athens",
    era: "NT",
    difficulty: 3,
    mode: "zoom",
    answer: "保羅在雅典講道",
    options: ["保羅在雅典講道", "掃羅歸主（大馬士革路上）", "彼得獲救出獄", "約翰在拔摩島見異象"],
    hints: [
      "一位使徒在哲學家聚集之地宣講。",
      "背景是希臘的神廟與雕像。",
      "他提到「未識之神」。",
    ],
    scripture: { book: "使徒行傳", chapter: 17, verse: "16-34" },
    event: { year: 51, tolerance: 10, placeName: "雅典亞略巴古", lat: 37.9715, lng: 23.7267 },
    image: {
      src: "/images/athens.jpg",
      title: "保羅在雅典講道",
      artist: "Raphael",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:V%26A_-_Raphael,_St_Paul_Preaching_in_Athens_(1515).jpg",
    },
    summary:
      "保羅在雅典的亞略巴古向哲學家宣講，以「未識之神」為切入點，引領人認識創造主與復活的基督。",
  },
  {
    id: "patmos",
    era: "NT",
    difficulty: 3,
    mode: "zoom",
    answer: "約翰在拔摩島見異象",
    options: ["約翰在拔摩島見異象", "保羅在雅典講道", "五旬節聖靈降臨", "耶穌升天"],
    hints: [
      "一位老人獨自被放逐在海島上。",
      "他看見天上的異象。",
      "《啟示錄》由此寫成。",
    ],
    scripture: { book: "啟示錄", chapter: 1, verse: "9-20" },
    event: { year: 95, tolerance: 10, placeName: "拔摩島", lat: 37.308, lng: 26.548 },
    image: {
      src: "/images/patmos.jpg",
      title: "拔摩島上的聖約翰",
      artist: "Nicolas Poussin",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Nicolas_Poussin_-_Landscape_with_Saint_John_on_Patmos_-_Google_Art_Project.jpg",
    },
    summary:
      "使徒約翰被放逐到拔摩島，在靈裡看見榮耀的基督與末後的異象，寫下《啟示錄》。",
  },
  {
    id: "visitation",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "聖母訪親",
    options: ["聖母訪親", "耶穌降生", "東方博士朝拜", "耶穌受洗"],
    hints: [
      "兩位女子在門口相擁。",
      "其中一位年長者已經懷孕。",
      "這是馬利亞探望伊利莎白。",
    ],
    scripture: { book: "路加福音", chapter: 1, verse: "39-56" },
    event: { year: -5, tolerance: 8, placeName: "猶大山地", lat: 31.76, lng: 35.16 },
    image: {
      src: "/images/visitation.jpg",
      title: "聖母訪親",
      artist: "Domenico Ghirlandaio",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Visitation_by_Domenico_Ghirlandaio.jpg",
    },
    summary:
      "馬利亞起身往猶大山地探望伊利莎白，兩人相擁，伊利莎白稱馬利亞為有福的。",
  },
  {
    id: "flight_egypt",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "逃往埃及",
    options: ["逃往埃及", "耶穌降生", "東方博士朝拜", "耶穌受洗"],
    hints: [
      "約瑟在夜間帶著一家人趕路。",
      "他們要躲避希律王的殺害。",
      "天使吩咐他們往埃及去。",
    ],
    scripture: { book: "馬太福音", chapter: 2, verse: "13-15" },
    event: { year: -4, tolerance: 8, placeName: "埃及", lat: 30.0, lng: 31.2 },
    image: {
      src: "/images/flight_egypt.jpg",
      title: "逃往埃及途中休息",
      artist: "Caravaggio",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Rest_on_the_Flight_into_Egypt-Caravaggio_(c.1597).jpg",
    },
    summary:
      "天使警告約瑟，約瑟就連夜帶著馬利亞和耶穌逃往埃及，躲避希律的屠殺。",
  },
  {
    id: "calling_matthew",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "耶穌呼召馬太",
    options: ["耶穌呼召馬太", "耶穌呼召彼得與安得烈", "耶穌在水面行走", "最後的晚餐"],
    hints: [
      "場景在稅關。",
      "耶穌對一個坐在稅關上的人說：「跟從我。」",
      "那人後來寫了馬太福音。",
    ],
    scripture: { book: "馬太福音", chapter: 9, verse: "9-13" },
    event: { year: 28, tolerance: 6, placeName: "迦百農", lat: 32.88, lng: 35.575 },
    image: {
      src: "/images/calling_matthew.jpg",
      title: "聖馬太蒙召",
      artist: "Caravaggio",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:The_Calling_of_Saint_Matthew-Caravaggo_(1599-1600).jpg",
    },
    summary:
      "耶穌在迦百農的稅關呼召稅吏馬太，馬太就起來跟從了他。",
  },
  {
    id: "peter_commission",
    era: "NT",
    difficulty: 3,
    mode: "zoom",
    answer: "耶穌託付彼得",
    options: ["耶穌託付彼得", "耶穌升天", "多馬的懷疑", "五旬節聖靈降臨"],
    hints: [
      "復活後的耶穌在湖邊向門徒顯現。",
      "耶穌三次問彼得「你愛我嗎？」",
      "耶穌把羊群託付給他。",
    ],
    scripture: { book: "約翰福音", chapter: 21, verse: "15-19" },
    event: { year: 30, tolerance: 6, placeName: "提比哩亞海邊", lat: 32.88, lng: 35.58 },
    image: {
      src: "/images/peter_commission.jpg",
      title: "基督託付彼得",
      artist: "Raphael",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Raphael_-_Christ%27s_Charge_to_Peter_c.1515-6.jpg",
    },
    summary:
      "復活後的耶穌在提比哩亞海邊三次問彼得「你愛我嗎」，並把餵養羊群的使命託付給他。",
  },
  {
    id: "peter_prison",
    era: "NT",
    difficulty: 2,
    mode: "zoom",
    answer: "彼得獲救出獄",
    options: ["彼得獲救出獄", "保羅在雅典講道", "掃羅歸主（大馬士革路上）", "五旬節聖靈降臨"],
    hints: [
      "彼得被鎖在監牢裡。",
      "天使在夜間出現，鎖鏈脫落。",
      "他以為自己是在見異象。",
    ],
    scripture: { book: "使徒行傳", chapter: 12, verse: "1-11" },
    event: { year: 44, tolerance: 6, placeName: "耶路撒冷", lat: 31.778, lng: 35.235 },
    image: {
      src: "/images/peter_prison.jpg",
      title: "彼得獲救出獄",
      artist: "Battistello Caracciolo",
      license: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Battistello_Caracciolo_-_Liberation_of_Saint_Peter.jpg",
    },
    summary:
      "希律王囚禁彼得，教會迫切禱告；天使夜間顯現，打開監門，領彼得脫離牢獄。",
  },
];

export const QUESTIONS_BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));
