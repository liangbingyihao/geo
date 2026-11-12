import type { Locale } from "@/lib/i18n/config";

export type RegionId =
  | "galilee"
  | "judea"
  | "samaria"
  | "syria"
  | "greece"
  | "asia_minor"
  | "egypt";

export interface PlaceInfo {
  regionId: RegionId;
  modernName: Record<Locale, string>;
  geoNote: Record<Locale, string>;
}

export const PLACE_INFO: Record<string, PlaceInfo> = {
  annunciation: {
    regionId: "galilee",
    modernName: {
      "zh-Hant": "Nazareth（拿撒勒）",
      en: "Nazareth",
    },
    geoNote: {
      "zh-Hant":
        "傳統認為報喜地點在拿撒勒；今為以色列北部城市，天使報喜教堂所在。",
      en: "Tradition places the Annunciation in Nazareth, now a city in northern Israel; the Basilica of the Annunciation stands there.",
    },
  },
  visitation: {
    regionId: "judea",
    modernName: {
      "zh-Hant": "Ein Karem（傳統地點）",
      en: "Ein Karem (traditional site)",
    },
    geoNote: {
      "zh-Hant":
        "聖經只說「猶大山地」；傳統將訪親地點與耶路撒冷西郊的 Ein Karem 聯繫起來。",
      en: "The Gospel says only “the hill country of Judea”; tradition links the visit to Ein Karem, west of Jerusalem.",
    },
  },
  nativity: {
    regionId: "judea",
    modernName: {
      "zh-Hant": "Bethlehem（伯利恆）",
      en: "Bethlehem",
    },
    geoNote: {
      "zh-Hant":
        "伯利恆位於耶路撒冷以南約 10 公里；聖誕教堂是傳統上的耶穌降生地。",
      en: "Bethlehem lies about 10 km south of Jerusalem; the Church of the Nativity is the traditional site of Jesus' birth.",
    },
  },
  magi: {
    regionId: "judea",
    modernName: {
      "zh-Hant": "Bethlehem（伯利恆）",
      en: "Bethlehem",
    },
    geoNote: {
      "zh-Hant":
        "博士在伯利恆朝拜；該地今屬巴勒斯坦西岸地區，聖誕教堂是傳統地點。",
      en: "The Magi worshiped in Bethlehem, today in the West Bank; the Church of the Nativity is the traditional site.",
    },
  },
  flight_egypt: {
    regionId: "egypt",
    modernName: {
      "zh-Hant": "Egypt（埃及）",
      en: "Egypt",
    },
    geoNote: {
      "zh-Hant":
        "聖經未指明埃及的具體城市；傳統上常與尼羅河三角洲或開羅一帶聯繫。",
      en: "Scripture does not name a city in Egypt; tradition often connects the flight with the Nile Delta or the Cairo area.",
    },
  },
  baptism: {
    regionId: "judea",
    modernName: {
      "zh-Hant": "Qasr al-Yahud（傳統地點）",
      en: "Qasr al-Yahud (traditional site)",
    },
    geoNote: {
      "zh-Hant":
        "傳統認為耶穌受洗處在耶利哥附近的約旦河，今 Qasr al-Yahud 一帶。",
      en: "Tradition places Jesus' baptism in the Jordan near Jericho, around Qasr al-Yahud.",
    },
  },
  temptation: {
    regionId: "judea",
    modernName: {
      "zh-Hant": "Mount of Temptation（傳統地點）",
      en: "Mount of Temptation (traditional site)",
    },
    geoNote: {
      "zh-Hant":
        "猶大曠野位於耶路撒冷與耶利哥之間；傳統將試探山與耶利哥附近的 Mount of Temptation 聯繫。",
      en: "The Judean wilderness lies between Jerusalem and Jericho; tradition identifies the Mount of Temptation near Jericho.",
    },
  },
  cana: {
    regionId: "galilee",
    modernName: {
      "zh-Hant": "Kafr Kanna（另有 Khirbet Qana）",
      en: "Kafr Kanna (another candidate: Khirbet Qana)",
    },
    geoNote: {
      "zh-Hant":
        "迦拿的位置學界仍有爭議；傳統地點為加利利的 Kafr Kanna，另有 Khirbet Qana 候選。",
      en: "Cana's location is disputed; the traditional site is Kafr Kanna in Galilee, with Khirbet Qana as another candidate.",
    },
  },
  calling_peter: {
    regionId: "galilee",
    modernName: {
      "zh-Hant": "Sea of Galilee / Lake Kinneret",
      en: "Sea of Galilee / Lake Kinneret",
    },
    geoNote: {
      "zh-Hant":
        "加利利海又稱提比哩亞海或基尼烈湖；今為以色列最大的淡水湖。",
      en: "The Sea of Galilee is also called the Sea of Tiberias or Lake Kinneret; it is Israel's largest freshwater lake.",
    },
  },
  calling_matthew: {
    regionId: "galilee",
    modernName: {
      "zh-Hant": "Capernaum（Kfar Nahum）",
      en: "Capernaum (Kfar Nahum)",
    },
    geoNote: {
      "zh-Hant":
        "迦百農位於加利利海北岸，是耶穌事工的重要基地；今有猶太會堂與聖彼得教堂遺址。",
      en: "Capernaum stood on the north shore of the Sea of Galilee and was a base for Jesus' ministry; ancient synagogue and church remains are there.",
    },
  },
  sermon: {
    regionId: "galilee",
    modernName: {
      "zh-Hant": "Mount of Beatitudes（傳統地點）",
      en: "Mount of Beatitudes (traditional site)",
    },
    geoNote: {
      "zh-Hant":
        "八福山是傳統上紀念登山寶訓的地點，位於加利利海西北岸；名稱來自「八福」，非聖經地名。",
      en: "The Mount of Beatitudes is a traditional site by the northwest shore of the Sea of Galilee; the name comes from the Beatitudes, not the Bible text.",
    },
  },
  good_samaritan: {
    regionId: "judea",
    modernName: {
      "zh-Hant": "Jericho–Jerusalem road",
      en: "Jericho–Jerusalem road",
    },
    geoNote: {
      "zh-Hant":
        "這是一條路線而非單一城市；傳統上與耶利哥到耶路撒冷之間的荒野道路有關。",
      en: "The parable is set on the road, not in a single town; tradition connects it with the wilderness road from Jericho to Jerusalem.",
    },
  },
  storm: {
    regionId: "galilee",
    modernName: {
      "zh-Hant": "Sea of Galilee",
      en: "Sea of Galilee",
    },
    geoNote: {
      "zh-Hant":
        "加利利海地勢低窪，周邊山丘易起風浪；福音書記載耶穌在船上平靜風浪。",
      en: "The Sea of Galilee lies below sea level and is prone to sudden storms; the Gospels record Jesus calming one.",
    },
  },
  feed5000: {
    regionId: "galilee",
    modernName: {
      "zh-Hant": "Tabgha（傳統地點）",
      en: "Tabgha (traditional site)",
    },
    geoNote: {
      "zh-Hant":
        "塔布加是加利利海西北岸的傳統地點，五餅二魚堂紀念餵飽五千人的神蹟；「塔布加」是現代地名。",
      en: "Tabgha is a modern name for a traditional site on the northwest shore; the Church of the Multiplication commemorates the feeding.",
    },
  },
  walk_water: {
    regionId: "galilee",
    modernName: {
      "zh-Hant": "Sea of Galilee",
      en: "Sea of Galilee",
    },
    geoNote: {
      "zh-Hant":
        "福音書記載耶穌在夜間於加利利海面行走；湖面在風暴時波濤洶湧。",
      en: "The Gospels place Jesus' night walk on the Sea of Galilee, a lake known for sudden rough weather.",
    },
  },
  blind: {
    regionId: "judea",
    modernName: {
      "zh-Hant": "Pool of Siloam, Jerusalem",
      en: "Pool of Siloam, Jerusalem",
    },
    geoNote: {
      "zh-Hant":
        "耶穌醫治瞎眼的人後，叫他往西羅亞池去洗；西羅亞池位於耶路撒冷大衛城附近。",
      en: "After healing the blind man, Jesus sent him to the Pool of Siloam, near the City of David in Jerusalem.",
    },
  },
  lazarus: {
    regionId: "judea",
    modernName: {
      "zh-Hant": "al-Eizariya（伯大尼）",
      en: "al-Eizariya (Bethany)",
    },
    geoNote: {
      "zh-Hant":
        "伯大尼位於耶路撒冷東側的橄欖山附近；今名 al-Eizariya，屬東耶路撒冷/西岸地區。",
      en: "Bethany lay east of Jerusalem near the Mount of Olives; its modern name is al-Eizariya, in East Jerusalem/the West Bank.",
    },
  },
  last_supper: {
    regionId: "judea",
    modernName: {
      "zh-Hant": "Cenacle, Mount Zion（傳統地點）",
      en: "Cenacle, Mount Zion (traditional site)",
    },
    geoNote: {
      "zh-Hant":
        "最後的晚餐發生在耶路撒冷；傳統地點為錫安山的馬可樓，但確切位置不詳。",
      en: "The Last Supper took place in Jerusalem; the traditional site is the Cenacle on Mount Zion, though the exact location is unknown.",
    },
  },
  gethsemane: {
    regionId: "judea",
    modernName: {
      "zh-Hant": "Gethsemane / Church of All Nations",
      en: "Gethsemane / Church of All Nations",
    },
    geoNote: {
      "zh-Hant":
        "客西馬尼園位於耶路撒冷東側橄欖山腳；今有萬國教堂與古老橄欖樹。",
      en: "Gethsemane lies at the foot of the Mount of Olives east of Jerusalem; the Church of All Nations stands there.",
    },
  },
  crucifixion: {
    regionId: "judea",
    modernName: {
      "zh-Hant": "Church of the Holy Sepulchre（傳統地點）",
      en: "Church of the Holy Sepulchre (traditional site)",
    },
    geoNote: {
      "zh-Hant":
        "各各他位於耶路撒冷城外；傳統認為在聖墓教堂，另有戈登各各他之說。",
      en: "Golgotha was outside Jerusalem; tradition identifies it with the Church of the Holy Sepulchre, while Gordon's Calvary is another proposal.",
    },
  },
  resurrection: {
    regionId: "judea",
    modernName: {
      "zh-Hant": "Church of the Holy Sepulchre（傳統地點）",
      en: "Church of the Holy Sepulchre (traditional site)",
    },
    geoNote: {
      "zh-Hant":
        "復活的地點傳統上與聖墓教堂聯繫；福音書記載空墳墓在耶路撒冷。",
      en: "The empty tomb is placed in Jerusalem; tradition links it with the Church of the Holy Sepulchre.",
    },
  },
  thomas: {
    regionId: "judea",
    modernName: {
      "zh-Hant": "Jerusalem",
      en: "Jerusalem",
    },
    geoNote: {
      "zh-Hant":
        "多馬的懷疑發生在耶路撒冷的門徒聚集中；確切地點不詳。",
      en: "Thomas' doubt occurred at a gathering of the disciples in Jerusalem; the exact place is unknown.",
    },
  },
  emmaus: {
    regionId: "judea",
    modernName: {
      "zh-Hant": "Nicopolis / Al-Qubeiba / Abu Ghosh（候選）",
      en: "Nicopolis / Al-Qubeiba / Abu Ghosh (candidates)",
    },
    geoNote: {
      "zh-Hant":
        "以馬忤斯的位置學界有爭議；常見候選包括 Nicopolis、Al-Qubeiba 與 Abu Ghosh。",
      en: "Emmaus is disputed; candidates include Nicopolis, Al-Qubeiba, and Abu Ghosh.",
    },
  },
  peter_commission: {
    regionId: "galilee",
    modernName: {
      "zh-Hant": "Sea of Galilee（Tiberias）",
      en: "Sea of Galilee (Tiberias)",
    },
    geoNote: {
      "zh-Hant":
        "提比哩亞海即加利利海；提比哩亞是湖畔古城，今名 Tiberias。",
      en: "The Sea of Tiberias is the Sea of Galilee; Tiberias is the lakeside city known today as Tiberias.",
    },
  },
  ascension: {
    regionId: "judea",
    modernName: {
      "zh-Hant": "Chapel of the Ascension（傳統地點）",
      en: "Chapel of the Ascension (traditional site)",
    },
    geoNote: {
      "zh-Hant":
        "耶穌升天發生在伯大尼附近的橄欖山；傳統地點為升天教堂。",
      en: "The Ascension took place near Bethany on the Mount of Olives; the traditional site is the Chapel of the Ascension.",
    },
  },
  pentecost: {
    regionId: "judea",
    modernName: {
      "zh-Hant": "Cenacle, Mount Zion（傳統地點）",
      en: "Cenacle, Mount Zion (traditional site)",
    },
    geoNote: {
      "zh-Hant":
        "五旬節聖靈降臨發生在耶路撒冷；傳統地點為錫安山的馬可樓。",
      en: "Pentecost took place in Jerusalem; the traditional site is the Cenacle on Mount Zion.",
    },
  },
  saul: {
    regionId: "syria",
    modernName: {
      "zh-Hant": "Road to Damascus",
      en: "Road to Damascus",
    },
    geoNote: {
      "zh-Hant":
        "掃羅歸主發生在往大馬士革的路上；這是一條路線，確切地點不詳。",
      en: "The conversion happened on the road to Damascus; it is a route rather than a single site, and the exact spot is unknown.",
    },
  },
  athens: {
    regionId: "greece",
    modernName: {
      "zh-Hant": "Areopagus, Athens",
      en: "Areopagus, Athens",
    },
    geoNote: {
      "zh-Hant":
        "亞略巴古位於雅典衛城西北；保羅在此向哲學家講道。",
      en: "The Areopagus is the rocky hill northwest of the Acropolis in Athens, where Paul addressed the philosophers.",
    },
  },
  patmos: {
    regionId: "asia_minor",
    modernName: {
      "zh-Hant": "Patmos（希臘）",
      en: "Patmos (Greece)",
    },
    geoNote: {
      "zh-Hant":
        "拔摩島位於愛琴海東部、小亞細亞外海；今屬希臘，島上有聖約翰修道院。",
      en: "Patmos is an island in the eastern Aegean off Asia Minor; it is now part of Greece and home to the Monastery of Saint John.",
    },
  },
  peter_prison: {
    regionId: "judea",
    modernName: {
      "zh-Hant": "Jerusalem",
      en: "Jerusalem",
    },
    geoNote: {
      "zh-Hant":
        "彼得獲救出獄發生在耶路撒冷；確切監獄位置不詳。",
      en: "Peter's deliverance took place in Jerusalem; the exact prison location is unknown.",
    },
  },
};
