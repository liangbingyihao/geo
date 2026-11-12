import type { QuestionTextOverride } from "@/lib/i18n/types";

export const EN_QUESTION_TEXT: Record<string, QuestionTextOverride> = {
  annunciation: {
    answer: "The Annunciation",
    options: [
      "The Annunciation",
      "Jesus Walks on Water",
      "Adoration of the Magi",
      "The Baptism of Jesus",
    ],
    hints: [
      "An angel with wings appears in the scene.",
      "The woman receiving the message is from Nazareth.",
      "This is the prelude to Jesus' birth.",
    ],
    summary:
      "The angel Gabriel appears to the virgin Mary and announces that she will bear a son, the Son of the Most High.",
    placeName: "Nazareth",
    imageTitle: "The Annunciation",
  },
  nativity: {
    answer: "The Nativity",
    options: [
      "The Nativity",
      "The Baptism of Jesus",
      "The Last Supper",
      "The Raising of Lazarus",
    ],
    hints: [
      "A newborn wrapped in cloth lies at the center.",
      "The mother is beside a manger, with animals nearby.",
      "Shepherds come to worship.",
    ],
    summary:
      "Mary gives birth to Jesus in Bethlehem and lays him in a manger; angels announce the good news to shepherds.",
    placeName: "Bethlehem",
    imageTitle: "The Nativity",
  },
  magi: {
    answer: "Adoration of the Magi",
    options: [
      "Adoration of the Magi",
      "Feeding the Five Thousand",
      "The Baptism of Jesus",
      "The Ascension",
    ],
    hints: [
      "Visitors from the East bring gifts.",
      "They follow a star.",
      "The child is honored as a king.",
    ],
    summary:
      "Magi from the East follow a star to Bethlehem, bow before the child Jesus, and offer gold, frankincense, and myrrh.",
    placeName: "Bethlehem",
    imageTitle: "The Adoration of the Magi",
  },
  baptism: {
    answer: "The Baptism of Jesus",
    options: [
      "The Baptism of Jesus",
      "The Temptation of Jesus",
      "The Wedding at Cana",
      "Calming the Storm",
    ],
    hints: [
      "Someone is baptizing in the river.",
      "The Spirit descends like a dove.",
      "John the Baptist is present.",
    ],
    summary:
      "Jesus is baptized by John in the Jordan; the heavens open, the Spirit descends like a dove, and a voice says, “This is my beloved Son.”",
    placeName: "Jordan River",
    imageTitle: "The Baptism of Christ",
  },
  temptation: {
    answer: "The Temptation of Jesus",
    options: [
      "The Temptation of Jesus",
      "The Baptism of Jesus",
      "The Agony in the Garden",
      "The Passion",
    ],
    hints: [
      "Only two figures are in the wilderness.",
      "One of them is tempting the other.",
      "Jesus answers with Scripture.",
    ],
    summary:
      "After fasting forty days in the wilderness, Jesus is tempted three times by the devil and overcomes each temptation with God's word.",
    placeName: "Judean Wilderness",
    imageTitle: "The Temptation of Christ",
  },
  cana: {
    answer: "The Wedding at Cana",
    options: [
      "The Wedding at Cana",
      "Feeding the Five Thousand",
      "The Last Supper",
      "The Good Samaritan",
    ],
    hints: [
      "The scene is a lively wedding feast.",
      "Servants pour water into stone jars.",
      "This is Jesus' first miracle.",
    ],
    summary:
      "At a wedding in Cana of Galilee, Jesus tells the servants to fill stone jars with water, and the water becomes the best wine.",
    placeName: "Cana",
    imageTitle: "The Wedding at Cana",
  },
  calling_peter: {
    answer: "The Calling of Peter and Andrew",
    options: [
      "The Calling of Peter and Andrew",
      "Calming the Storm",
      "Jesus Walks on Water",
      "The Ascension",
    ],
    hints: [
      "Two brothers are casting nets by the lake.",
      "Jesus promises to make them fishers of men.",
      "This call happens by the Sea of Galilee.",
    ],
    summary:
      "By the Sea of Galilee, Jesus calls the fishermen Peter and Andrew to follow him, promising to make them fishers of men.",
    placeName: "Sea of Galilee",
    imageTitle: "The Calling of the Apostles Peter and Andrew",
  },
  sermon: {
    answer: "The Sermon on the Mount",
    options: [
      "The Sermon on the Mount",
      "The Temptation of Jesus",
      "The Last Supper",
      "The Agony in the Garden",
    ],
    hints: [
      "Jesus teaches the crowds on a hillside.",
      "The listeners sit on the grass.",
      "The Beatitudes and the Lord's Prayer come from this teaching.",
    ],
    summary:
      "On a mountain, Jesus teaches his disciples and the crowd about the kingdom of heaven, including the Beatitudes, the Lord's Prayer, and love for enemies.",
    placeName: "Mount of Beatitudes",
    imageTitle: "The Sermon on the Mount",
  },
  storm: {
    answer: "Calming the Storm",
    options: [
      "Calming the Storm",
      "Jesus Walks on Water",
      "Feeding the Five Thousand",
      "The Baptism of Jesus",
    ],
    hints: [
      "A small boat tosses on a rough sea.",
      "The disciples panic while Jesus sleeps in the stern.",
      "He rebukes the wind and the sea.",
    ],
    summary:
      "A violent storm strikes the Sea of Galilee; Jesus rebukes the wind and the sea, and there is a great calm.",
    placeName: "Sea of Galilee",
    imageTitle: "Christ in the Storm on the Sea of Galilee",
  },
  feed5000: {
    answer: "Feeding the Five Thousand",
    options: [
      "Feeding the Five Thousand",
      "The Wedding at Cana",
      "The Last Supper",
      "Adoration of the Magi",
    ],
    hints: [
      "A large crowd gathers in a remote place.",
      "The disciples distribute bread and fish.",
      "About five thousand people are fed.",
    ],
    summary:
      "Jesus uses a boy's five loaves and two fish to feed five thousand people, and twelve baskets of leftovers remain.",
    placeName: "Tabgha",
    imageTitle: "The Feeding of the Five Thousand",
  },
  walk_water: {
    answer: "Jesus Walks on Water",
    options: [
      "Jesus Walks on Water",
      "Calming the Storm",
      "The Calling of Peter and Andrew",
      "The Ascension",
    ],
    hints: [
      "A figure appears on the lake at night.",
      "The disciples first think it is a ghost.",
      "Peter also tries to walk on the water.",
    ],
    summary:
      "At night Jesus walks on the Sea of Galilee; the disciples are afraid, and Peter walks on the water until his faith wavers.",
    placeName: "Sea of Galilee",
    imageTitle: "The Disciples See Christ Walking on the Water",
  },
  blind: {
    answer: "Jesus Heals the Blind Man",
    options: [
      "Jesus Heals the Blind Man",
      "The Raising of Lazarus",
      "The Temptation of Jesus",
      "The Good Samaritan",
    ],
    hints: [
      "A blind man stands at the center.",
      "Jesus puts mud on his eyes.",
      "He is sent to wash in the Pool of Siloam.",
    ],
    summary:
      "Jesus puts mud on the eyes of a man born blind and sends him to wash in the Pool of Siloam; he returns seeing.",
    placeName: "Jerusalem",
    imageTitle: "Christ Healing the Blind",
  },
  lazarus: {
    answer: "The Raising of Lazarus",
    options: [
      "The Raising of Lazarus",
      "Jesus Heals the Blind Man",
      "The Passion",
      "The Ascension",
    ],
    hints: [
      "The stone of the tomb has been rolled away.",
      "Jesus calls a man who has been dead four days.",
      "His sisters Martha and Mary are nearby.",
    ],
    summary:
      "At the tomb in Bethany, Jesus cries, “Lazarus, come out!” and the man who had been dead four days comes out.",
    placeName: "Bethany",
    imageTitle: "The Raising of Lazarus",
  },
  good_samaritan: {
    answer: "The Parable of the Good Samaritan",
    options: [
      "The Parable of the Good Samaritan",
      "The Parable of the Prodigal Son",
      "Feeding the Five Thousand",
      "The Last Supper",
    ],
    hints: [
      "A wounded man lies by the road.",
      "Someone stops and helps him.",
      "Jesus tells this story to answer “Who is my neighbor?”",
    ],
    summary:
      "Jesus tells of a wounded traveler and the compassionate Samaritan who proves to be a true neighbor.",
    placeName: "Road from Jericho to Jerusalem",
    imageTitle: "The Good Samaritan",
  },
  last_supper: {
    answer: "The Last Supper",
    options: [
      "The Last Supper",
      "The Wedding at Cana",
      "Feeding the Five Thousand",
      "Adoration of the Magi",
    ],
    hints: [
      "Thirteen people sit around a long table.",
      "Jesus says one of them will betray him.",
      "He institutes the Lord's Supper.",
    ],
    summary:
      "On the night he is betrayed, Jesus eats with his disciples, institutes the Lord's Supper, and foretells his betrayal.",
    placeName: "Jerusalem",
    imageTitle: "The Last Supper",
  },
  gethsemane: {
    answer: "The Agony in the Garden",
    options: [
      "The Agony in the Garden",
      "The Temptation of Jesus",
      "The Baptism of Jesus",
      "The Sermon on the Mount",
    ],
    hints: [
      "Someone prays face down in a garden at night.",
      "The disciples are asleep nearby.",
      "Jesus asks the Father to take away the cup.",
    ],
    summary:
      "In Gethsemane Jesus is deeply sorrowful and prays, “My Father, if it is possible, let this cup pass from me.”",
    placeName: "Garden of Gethsemane",
    imageTitle: "The Agony in the Garden",
  },
  crucifixion: {
    answer: "The Crucifixion",
    options: [
      "The Crucifixion",
      "The Resurrection",
      "The Ascension",
      "The Raising of Lazarus",
    ],
    hints: [
      "A cross stands at the center.",
      "His mother and disciples stand below.",
      "This is Golgotha, the place of the skull.",
    ],
    summary:
      "Jesus is crucified at Golgotha, bearing the sins of the world; after saying “It is finished,” he gives up his spirit.",
    placeName: "Golgotha",
    imageTitle: "The Crucifixion",
  },
  resurrection: {
    answer: "The Resurrection",
    options: [
      "The Resurrection",
      "The Ascension",
      "The Passion",
      "The Doubting Thomas",
    ],
    hints: [
      "The tomb is empty.",
      "Jesus rises from the dead.",
      "Women come to the tomb at dawn.",
    ],
    summary:
      "On the third day Jesus rises from the dead, conquers sin and death, and appears to his disciples.",
    placeName: "Jerusalem",
    imageTitle: "The Resurrection of Christ",
  },
  thomas: {
    answer: "The Doubting Thomas",
    options: [
      "The Doubting Thomas",
      "The Resurrection",
      "The Supper at Emmaus",
      "The Ascension",
    ],
    hints: [
      "One man reaches toward another's side.",
      "The disciples cannot believe Jesus is risen.",
      "Jesus invites him to touch the wounds.",
    ],
    summary:
      "Thomas refuses to believe unless he sees the wounds; Jesus appears and invites him to touch his side, and Thomas confesses, “My Lord and my God!”",
    placeName: "Jerusalem",
    imageTitle: "The Incredulity of Saint Thomas",
  },
  emmaus: {
    answer: "The Supper at Emmaus",
    options: [
      "The Supper at Emmaus",
      "The Last Supper",
      "Feeding the Five Thousand",
      "The Good Samaritan",
    ],
    hints: [
      "The risen Jesus walks with two disciples.",
      "They break bread together in the evening.",
      "Their eyes are opened.",
    ],
    summary:
      "The risen Jesus walks with two disciples to Emmaus and explains the Scriptures; they recognize him when he breaks bread.",
    placeName: "Emmaus",
    imageTitle: "The Supper at Emmaus",
  },
  ascension: {
    answer: "The Ascension",
    options: [
      "The Ascension",
      "The Resurrection",
      "The Doubting Thomas",
      "Pentecost",
    ],
    hints: [
      "Jesus is lifted up as the disciples watch.",
      "The place is near the Mount of Olives.",
      "A cloud receives him.",
    ],
    summary:
      "Forty days after his resurrection, Jesus is lifted up before his disciples, and a cloud receives him out of their sight.",
    placeName: "Mount of Olives",
    imageTitle: "The Ascension of Christ",
  },
  pentecost: {
    answer: "Pentecost",
    options: [
      "Pentecost",
      "The Ascension",
      "The Baptism of Jesus",
      "The Doubting Thomas",
    ],
    hints: [
      "The disciples gather in one place.",
      "Tongues of fire rest on each of them.",
      "They are filled with the Spirit and speak in other tongues.",
    ],
    summary:
      "On the day of Pentecost the Holy Spirit comes like wind and fire; the disciples are filled and boldly testify to the risen Christ.",
    placeName: "Jerusalem",
    imageTitle: "The Descent of the Holy Spirit",
  },
  saul: {
    answer: "The Conversion of Saul",
    options: [
      "The Conversion of Saul",
      "Paul Preaches in Athens",
      "Peter Is Freed from Prison",
      "Pentecost",
    ],
    hints: [
      "A light from heaven knocks down a traveler.",
      "He hears a voice calling his name.",
      "He later becomes the apostle to the Gentiles.",
    ],
    summary:
      "Saul, who persecutes the church, is struck by a light on the road to Damascus and hears the Lord's voice; he is baptized and becomes Paul.",
    placeName: "Road to Damascus",
    imageTitle: "The Conversion of Saint Paul",
  },
  athens: {
    answer: "Paul Preaches in Athens",
    options: [
      "Paul Preaches in Athens",
      "The Conversion of Saul",
      "Peter Is Freed from Prison",
      "John's Vision on Patmos",
    ],
    hints: [
      "An apostle speaks where philosophers gather.",
      "Greek temples and statues fill the background.",
      "He speaks of the “unknown god.”",
    ],
    summary:
      "At the Areopagus in Athens, Paul addresses the philosophers, beginning with the “unknown god” and proclaiming the Creator and the risen Christ.",
    placeName: "Areopagus, Athens",
    imageTitle: "St Paul Preaching in Athens",
  },
  patmos: {
    answer: "John's Vision on Patmos",
    options: [
      "John's Vision on Patmos",
      "Paul Preaches in Athens",
      "Pentecost",
      "The Ascension",
    ],
    hints: [
      "An elderly man is exiled alone on an island.",
      "He sees a heavenly vision.",
      "The Book of Revelation comes from this vision.",
    ],
    summary:
      "The apostle John is exiled to Patmos, where he sees the glorious Christ and the visions of the end, and writes the Book of Revelation.",
    placeName: "Patmos",
    imageTitle: "Saint John on Patmos",
  },
  visitation: {
    answer: "The Visitation",
    options: [
      "The Visitation",
      "The Nativity",
      "Adoration of the Magi",
      "The Baptism of Jesus",
    ],
    hints: [
      "Two women embrace at a doorway.",
      "The older woman is already pregnant.",
      "Mary has come to visit Elizabeth.",
    ],
    summary:
      "Mary travels to the hill country of Judea to visit Elizabeth; they embrace, and Elizabeth blesses Mary.",
    placeName: "Hill Country of Judea",
    imageTitle: "The Visitation",
  },
  flight_egypt: {
    answer: "The Flight into Egypt",
    options: [
      "The Flight into Egypt",
      "The Nativity",
      "Adoration of the Magi",
      "The Baptism of Jesus",
    ],
    hints: [
      "Joseph leads the family on a night journey.",
      "They are fleeing King Herod's violence.",
      "An angel tells them to go to Egypt.",
    ],
    summary:
      "Warned by an angel, Joseph takes Mary and Jesus by night and flees to Egypt to escape Herod's slaughter.",
    placeName: "Egypt",
    imageTitle: "Rest on the Flight into Egypt",
  },
  calling_matthew: {
    answer: "The Calling of Matthew",
    options: [
      "The Calling of Matthew",
      "The Calling of Peter and Andrew",
      "Jesus Walks on Water",
      "The Last Supper",
    ],
    hints: [
      "The scene is set at a tax booth.",
      "Jesus says to a man at the booth, “Follow me.”",
      "That man later wrote the Gospel of Matthew.",
    ],
    summary:
      "At the tax booth in Capernaum, Jesus calls the tax collector Matthew, who rises and follows him.",
    placeName: "Capernaum",
    imageTitle: "The Calling of Saint Matthew",
  },
  peter_commission: {
    answer: "Jesus Commissions Peter",
    options: [
      "Jesus Commissions Peter",
      "The Ascension",
      "The Doubting Thomas",
      "Pentecost",
    ],
    hints: [
      "The risen Jesus appears to his disciples by the lake.",
      "Jesus asks Peter three times, “Do you love me?”",
      "He entrusts his sheep to Peter.",
    ],
    summary:
      "By the Sea of Tiberias the risen Jesus asks Peter three times, “Do you love me?” and entrusts him with the care of his sheep.",
    placeName: "Sea of Tiberias",
    imageTitle: "Christ's Charge to Peter",
  },
  peter_prison: {
    answer: "Peter Is Freed from Prison",
    options: [
      "Peter Is Freed from Prison",
      "Paul Preaches in Athens",
      "The Conversion of Saul",
      "Pentecost",
    ],
    hints: [
      "Peter is bound in a prison cell.",
      "An angel appears at night and the chains fall off.",
      "He thinks he is seeing a vision.",
    ],
    summary:
      "Herod imprisons Peter while the church prays earnestly; an angel appears at night, opens the prison, and leads him out.",
    placeName: "Jerusalem",
    imageTitle: "The Liberation of Saint Peter",
  },
};
