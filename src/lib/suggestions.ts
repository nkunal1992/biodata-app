import type { BiodataData } from "./biodata";

export type SuggestionFor = "aboutMe" | "expectations";

export interface Suggestion {
  id: string;
  for: SuggestionFor;
  tags: string[];
  en: string;
  hi: string;
}

/** Tag groups → chips in the picker; labels via i18n editor.tags.<id>. */
export const TAG_GROUPS: Record<string, string[]> = {
  profession: ["engineer", "doctor", "teacher", "business", "govt", "banker"],
  personality: ["calm", "cheerful", "ambitious", "simple", "creative"],
  values: ["family", "spiritual", "traditional", "modern", "balanced"],
  hobbies: ["travel", "cooking", "music", "sports", "reading", "fitness"],
};

const A = "aboutMe" as const;
const E = "expectations" as const;

export const SUGGESTIONS: Suggestion[] = [
  // ── About Me ──────────────────────────────────────────────
  {
    id: "am-engineer", for: A, tags: ["engineer", "ambitious", "balanced"],
    en: "I work as a {occupation|software professional} and take pride in what I do. Outside work I value family time, fitness and the occasional trek. I believe in growing together while keeping our traditions close.",
    hi: "मैं {occupation|सॉफ्टवेयर पेशेवर} के रूप में कार्य करता/करती हूँ और अपने काम पर गर्व करता/करती हूँ। काम के अलावा परिवार का समय, फिटनेस और कभी-कभार ट्रेकिंग मुझे प्रिय है। मैं परंपराओं के साथ मिलकर आगे बढ़ने में विश्वास रखता/रखती हूँ।",
  },
  {
    id: "am-doctor", for: A, tags: ["doctor", "family", "simple"],
    en: "I am a {occupation|doctor} by profession — caring for people is both my work and my nature. Family means everything to me; I enjoy quiet evenings, good food and keeping life simple and honest.",
    hi: "पेशे से मैं {occupation|डॉक्टर} हूँ — लोगों की सेवा मेरा काम भी है और स्वभाव भी। परिवार मेरे लिए सब कुछ है; शांत शामें, अच्छा खाना और सरल व ईमानदार जीवन मुझे पसंद है।",
  },
  {
    id: "am-teacher", for: A, tags: ["teacher", "calm", "reading"],
    en: "Teaching is my calling — I love learning and helping others learn. I am patient, well-read and grounded, and I enjoy quiet evenings with family over anything extravagant.",
    hi: "पढ़ाना मेरा पेशा और जुनून दोनों है — मुझे सीखना और सिखाना पसंद है। मैं धैर्यवान, पढ़ी-लिखी और जमीन से जुड़ी हूँ; शोर-शराबे से ज्यादा परिवार के साथ शांत शामें मुझे भाती हैं।",
  },
  {
    id: "am-business", for: A, tags: ["business", "ambitious", "family"],
    en: "I run my own {occupation|business} and enjoy building things from the ground up. Ambitious at work, deeply rooted at home — festivals, family dinners and long drives keep me happy.",
    hi: "मैं अपना {occupation|व्यवसाय} चलाता/चलाती हूँ और नई चीज़ें बनाने में आनंद लेता/लेती हूँ। काम में महत्वाकांक्षी, घर में पूरी तरह जुड़ा हुआ — त्योहार, पारिवारिक भोज और लंबी ड्राइव मुझे खुश रखते हैं।",
  },
  {
    id: "am-govt", for: A, tags: ["govt", "traditional"],
    en: "I serve in a {occupation|government job} — stability, integrity and public service matter to me. I follow a disciplined routine and cherish traditional values passed down in our family.",
    hi: "मैं {occupation|सरकारी नौकरी} में कार्यरत हूँ — स्थिरता, ईमानदारी और जनसेवा मेरे लिए महत्वपूर्ण है। अनुशासित दिनचर्या रखता/रखती हूँ और परिवार की पारंपरिक मूल्यों को मानता/मानती हूँ।",
  },
  {
    id: "am-banker", for: A, tags: ["banker", "calm", "family"],
    en: "I work in {occupation|banking/finance} — numbers by day, family and friends by evening. Calm, dependable and organized, I like a balanced, drama-free life.",
    hi: "मैं {occupation|बैंकिंग/वित्त} क्षेत्र में कार्य करता/करती हूँ — दिन में आंकड़े, शाम को परिवार और दोस्त। शांत, भरोसेमंद और व्यवस्थित स्वभाव का/की हूँ; संतुलित जीवन मुझे पसंद है।",
  },
  {
    id: "am-calm", for: A, tags: ["calm", "simple", "balanced"],
    en: "Calm by nature, I keep life simple and meaningful. I value honesty over show, listen more than I speak, and believe the best relationships grow on trust and patience.",
    hi: "स्वभाव से शांत हूँ, जीवन सरल और सार्थक रखता/रखती हूँ। दिखावे से ज्यादा ईमानदारी को मानता/मानती हूँ, बोलने से ज्यादा सुनता/सुनती हूँ — और मानता/मानती हूँ कि अच्छे रिश्ते विश्वास और धैर्य पर बनते हैं।",
  },
  {
    id: "am-cheerful", for: A, tags: ["cheerful", "family", "modern"],
    en: "A cheerful, easy-going person who finds joy in small things — chai with family, road trips, old songs. Modern in outlook, rooted at heart; I get along with everyone easily.",
    hi: "खुशमिजाज और सहज स्वभाव का/की हूँ — छोटी चीज़ों में खुशी ढूंढता/ढूंढती हूँ: परिवार के साथ चाय, रोड ट्रिप, पुराने गाने। सोच आधुनिक, दिल से जुड़ा हुआ/जुड़ी हुई; हर किसी के साथ आसानी से घुल-मिल जाता/जाती हूँ।",
  },
  {
    id: "am-family", for: A, tags: ["family", "traditional", "calm"],
    en: "Family is my world. Raised with strong values in {city|a close-knit family}, I respect elders, celebrate every festival together, and believe home is built on love and togetherness.",
    hi: "परिवार ही मेरी दुनिया है। {city|एक घनिष्ठ परिवार} में मजबूत संस्कारों के साथ बड़ी/बड़ा हूँ, बड़ों का सम्मान करता/करती हूँ, हर त्योहार साथ मनाता/मनाती हूँ — और मानता/मानती हूँ घर प्रेम और एकता से बनता है।",
  },
  {
    id: "am-spiritual", for: A, tags: ["spiritual", "traditional", "calm"],
    en: "Spiritual and grounded, I begin my day with prayer and gratitude. I follow our traditions with understanding — not blind ritual — and find peace in simplicity and seva.",
    hi: "आध्यात्मिक और जमीन से जुड़ा हुआ/जुड़ी हुई, दिन की शुरुआत प्रार्थना और कृतज्ञता से करता/करती हूँ। परंपराएँ समझ के साथ निभाता/निभाती हूँ — अंधानुकरण नहीं — और सादगी व सेवा में सुकून पाता/पाती हूँ।",
  },
  {
    id: "am-travel", for: A, tags: ["travel", "cheerful", "modern"],
    en: "A traveler at heart — mountains or beaches, I love exploring new places and cuisines. I bring the same curiosity and open mind to life and relationships.",
    hi: "दिल से यात्री हूँ — पहाड़ हों या समुद्र, नई जगहें और स्वाद खोजना मुझे पसंद है। यही जिज्ञासा और खुला दिमाग जीवन और रिश्तों में भी लाता/लाती हूँ।",
  },
  {
    id: "am-cooking", for: A, tags: ["cooking", "family", "simple"],
    en: "Cooking is my love language — nothing makes me happier than feeding people I care about. Weekend means family recipes, music in the kitchen and a full house.",
    hi: "खाना बनाना मेरा प्रेम प्रकट करने का तरीका है — अपनों को खिलाने से बढ़कर खुशी कुछ नहीं। वीकेंड मतलब घर की रेसिपी, रसोई में संगीत और भरा-पूरा घर।",
  },
  {
    id: "am-music", for: A, tags: ["music", "creative", "cheerful"],
    en: "Music is my happy place — old Kishore Kumar classics to soft instrumental, always playing somewhere. Creative and light-hearted, I believe life needs a good soundtrack.",
    hi: "संगीत मेरी खुशी की जगह है — किशोर कुमार के पुराने गानों से लेकर सॉफ्ट इंस्ट्रूमेंटल तक, कहीं न कहीं बजता ही रहता है। रचनात्मक और हल्के-फुल्के स्वभाव का/की हूँ; जीवन में एक अच्छा संगीत होना चाहिए।",
  },
  {
    id: "am-sports", for: A, tags: ["sports", "fitness", "ambitious"],
    en: "Fitness is a lifestyle, not a phase — morning runs, weekend cricket/badminton, disciplined eating. I bring the same energy and commitment to everything I do.",
    hi: "फिटनेस मेरे लिए जीवनशैली है, सिर्फ चरण नहीं — सुबह की दौड़, वीकेंड क्रिकेट/बैडमिंटन, संयमित खान-पान। वही ऊर्जा और प्रतिबद्धता हर काम में लाता/लाती हूँ।",
  },
  {
    id: "am-reading", for: A, tags: ["reading", "calm", "simple"],
    en: "A quiet reader and lifelong learner — books, podcasts and long conversations on everything from history to cricket. Soft-spoken but opinionated where it counts.",
    hi: "शांत स्वभाव का/की पाठक और सीखने वाला/वाली हूँ — किताबें, पॉडकास्ट और इतिहास से क्रिकेट तक लंबी बातचीत। धीमा बोलता/बोलती हूँ पर जहां ज़रूरी हो वहां अपनी राय रखता/रखती हूँ।",
  },
  {
    id: "am-balanced", for: A, tags: ["balanced", "modern", "traditional"],
    en: "I balance a modern career with traditional values — ambitious Monday to Friday, all family on weekends. I respect where we come from while being open to where the world is going.",
    hi: "आधुनिक करियर और पारंपरिक मूल्यों का संतुलन रखता/रखती हूँ — सोमवार से शुक्रवार महत्वाकांक्षी, वीकेंड पर पूरा परिवार। जहां से हम आए हैं उसका सम्मान करता/करती हूँ और दुनिया जहां जा रही है उसके लिए खुला/खुली हूँ।",
  },
  {
    id: "am-creative", for: A, tags: ["creative", "cheerful", "modern"],
    en: "Creative at heart — sketching, photography or DIY decor, I always have a project going. I see beauty in details and bring that eye to making a warm, beautiful home.",
    hi: "दिल से रचनात्मक हूँ — स्केचिंग, फोटोग्राफी या DIY सजावट, कोई न कोई प्रोजेक्ट हमेशा चलता है। बारीकियों में सुंदरता देखता/देखती हूँ और वही नज़र सुंदर घर बनाने में लगाता/लगाती हूँ।",
  },
  {
    id: "am-simple", for: A, tags: ["simple", "calm", "traditional"],
    en: "Simple living, high thinking — that sums me up. Not much for loud parties; happiest with good food, family and an early morning. Honest to a fault and easy to live with.",
    hi: "सरल जीवन, उच्च विचार — यही मैं हूँ। शोर-शराबे वाली पार्टियों से दूर; अच्छे खाने, परिवार और सुबह की सैर में खुश। ईमानदार और जीने में आसान।",
  },
  {
    id: "am-ambitious", for: A, tags: ["ambitious", "engineer", "modern"],
    en: "Driven and growth-focused — I set goals and chase them, whether at work or in life. But success means little without someone to share it with; family always comes first.",
    hi: "लक्ष्य-प्रधान और आगे बढ़ने वाला/वाली हूँ — काम हो या जीवन, लक्ष्य बनाकर उन्हें पूरा करता/करती हूँ। पर बिना साथी के सफलता अधूरी है; परिवार हमेशा पहले आता है।",
  },
  {
    id: "am-fitness", for: A, tags: ["fitness", "sports", "calm"],
    en: "Health-conscious and disciplined — yoga or gym most mornings, mostly home food, early to bed. I believe a healthy body builds a calm mind and a happy home.",
    hi: "स्वास्थ्य-सचेत और अनुशासित — अधिकतर सुबह योगा या जिम, घर का खाना, जल्दी सोना। मानता/मानती हूँ स्वस्थ शरीर से शांत मन और खुशहाल घर बनता है।",
  },
  {
    id: "am-modern", for: A, tags: ["modern", "cheerful", "balanced"],
    en: "Independent thinker with a modern outlook — I believe in equality, open communication and shared decisions in a marriage. Looking for a partner who is also a friend.",
    hi: "आधुनिक सोच वाला/वाली स्वतंत्र व्यक्ति — विवाह में समानता, खुली बातचीत और साझा निर्णयों में विश्वास रखता/रखती हूँ। ऐसे साथी की तलाश जो दोस्त भी हो।",
  },
  {
    id: "am-traditional", for: A, tags: ["traditional", "spiritual", "family"],
    en: "Rooted in our culture — I grew up in {city|a traditional household} where festivals, rituals and respect for elders are a way of life. Carrying those values forward gracefully.",
    hi: "अपनी संस्कृति में जड़ें — {city|पारंपरिक घराने} में पली/पला जहां त्योहार, रीति-रिवाज और बड़ों का सम्मान जीवन-पद्धति है। उन्हीं संस्कारों को गरिमा के साथ आगे बढ़ाती/बढ़ाता हूँ।",
  },
  {
    id: "am-education", for: A, tags: ["teacher", "ambitious", "reading"],
    en: "{qualification|Well-educated} and always curious — I believe education is a journey, not a degree. Enjoy mentoring juniors and learning something new every year.",
    hi: "{qualification|सुशिक्षित} और हमेशा जिज्ञासु — शिक्षा मेरे लिए यात्रा है, सिर्फ डिग्री नहीं। जूनियर्स को मार्गदर्शन करना और हर साल कुछ नया सीखना पसंद है।",
  },
  {
    id: "am-warm", for: A, tags: ["family", "cheerful", "cooking"],
    en: "Warm, social and family-first — our home is always full of laughter and guests. I love hosting, feeding people and making everyone feel at home.",
    hi: "हँसमुख, मिलनसार और परिवार-प्रथम — हमारे घर में हमेशा हंसी और मेहमान रहते हैं। मेहमाननवाज़ी करना, लोगों को खिलाना और सबको अपनापन देना मुझे अच्छा लगता है।",
  },

  // ── Partner Expectations ──────────────────────────────────
  {
    id: "ex-educated", for: E, tags: ["ambitious", "balanced", "modern"],
    en: "Looking for a well-educated, understanding partner who values both career and family. Someone kind-hearted with whom conversation never runs out.",
    hi: "सुशिक्षित और समझदार जीवनसाथी चाहिए जो करियर और परिवार दोनों को महत्व दे। ऐसा दयालु साथी जिससे बातें कभी खत्म न हों।",
  },
  {
    id: "ex-family", for: E, tags: ["family", "traditional", "simple"],
    en: "A family-oriented partner who respects elders and believes in togetherness. Someone for whom family is not a responsibility but a joy.",
    hi: "पारिवारिक मूल्यों वाला साथी जो बड़ों का सम्मान करे और एकता में विश्वास रखे। जिसके लिए परिवार जिम्मेदारी नहीं, खुशी हो।",
  },
  {
    id: "ex-professional", for: E, tags: ["engineer", "doctor", "ambitious"],
    en: "Prefer a working professional — doctor, engineer or similar — who is passionate about their work yet makes time for family and little joys of life.",
    hi: "कार्यरत पेशेवर — डॉक्टर, इंजीनियर या समान — जो अपने काम से प्रेम करे पर परिवार और जीवन की छोटी खुशियों के लिए समय निकाले।",
  },
  {
    id: "ex-spiritual", for: E, tags: ["spiritual", "traditional", "calm"],
    en: "Seeking a spiritually inclined partner who respects our traditions and leads a balanced, honest life. Vegetarian preferred.",
    hi: "आध्यात्मिक प्रवृत्ति का साथी चाहिए जो परंपराओं का सम्मान करे और संतुलित, ईमानदार जीवन जिए। शाकाहारी वरीयता।",
  },
  {
    id: "ex-modern", for: E, tags: ["modern", "cheerful", "balanced"],
    en: "A broad-minded partner with a modern outlook — someone who sees marriage as a partnership of equals and values communication over convention.",
    hi: "खुली सोच वाला आधुनिक साथी — जो विवाह को समान भागीदारी माने और रिवाज से ज्यादा बातचीत को महत्व दे।",
  },
  {
    id: "ex-calm", for: E, tags: ["calm", "simple", "family"],
    en: "Looking for a calm, mature and understanding life partner — someone who handles ups and downs with grace and keeps the home full of warmth.",
    hi: "शांत, परिपक्व और समझदार जीवनसाथी — जो जीवन के उतार-चढ़ाव को सहजता से संभाले और घर को ममता से भर दे।",
  },
  {
    id: "ex-similar-bg", for: E, tags: ["traditional", "family", "spiritual"],
    en: "Prefer a partner from a similar cultural/family background — shared values make the journey smoother. Must be respectful, honest and caring.",
    hi: "समान सांस्कृतिक/पारिवारिक परिवेश का साथी वरीय — साझा मूल्यों से सफर आसान होता है। सम्मानजनक, ईमानदार और देखभाल करने वाला हो।",
  },
  {
    id: "ex-nonsmoker", for: E, tags: ["fitness", "simple", "traditional"],
    en: "Looking for a non-smoker, non-drinker partner who leads a clean, disciplined life and values health — someone dependable and sincere.",
    hi: "गैर-धूम्रपान और शराब से दूर रहने वाला, स्वच्छ व अनुशासित जीवन जीने वाला, स्वास्थ्य को महत्व देने वाला भरोसेमंद और सच्चा साथी चाहिए।",
  },
  {
    id: "ex-flexible", for: E, tags: ["modern", "balanced", "travel"],
    en: "Open to location — what matters is the person. A flexible, supportive partner willing to build a life together wherever work takes us.",
    hi: "स्थान के प्रति लचीले — मायने इंसान की है। लचीला और सहयोगी साथी जो काम जहां भी ले जाए, साथ मिलकर जीवन बनाए।",
  },
  {
    id: "ex-supportive", for: E, tags: ["ambitious", "balanced", "modern"],
    en: "A supportive partner who cheers my ambitions and shares theirs — we grow together, celebrating each other's wins and standing through challenges.",
    hi: "सहयोगी साथी जो मेरी महत्वाकांक्षाओं में साथ खड़ा रहे और अपनी साझा करे — एक-दूसरे की सफलता मनाते और चुनौतियों में साथ निभाते हुए साथ बढ़ें।",
  },
  {
    id: "ex-homely", for: E, tags: ["simple", "traditional", "cooking"],
    en: "Seeking a homely, warm-hearted partner who loves creating a beautiful home and finds happiness in family life. Understanding and adjusting nature preferred.",
    hi: "घरेलू, सहृदय साथी जो सुंदर घर सजाना और पारिवारिक जीवन में खुशी ढूंढना जाने। समझदार और घुलने-मिलने वाला स्वभाव वरीय।",
  },
  {
    id: "ex-educated-hi", for: E, tags: ["teacher", "doctor", "reading"],
    en: "Well-read, thoughtful partner preferred — someone who values learning and meaningful conversation, and brings depth and warmth to the relationship.",
    hi: "पढ़ा-लिखा, विचारशील साथी वरीय — जो सीखने और सार्थक बातचीत को महत्व दे और रिश्ते में गहराई व गर्मजोशी लाए।",
  },
  {
    id: "ex-kind", for: E, tags: ["simple", "calm", "family"],
    en: "Above all — kindness. Looking for a good human being first; education, career and looks come second. A caring heart makes a beautiful home.",
    hi: "सबसे ऊपर — दयालुता। पहले अच्छा इंसान चाहिए; शिक्षा, करियर और रूप बाद में। देखभाल करने वाला दिल ही सुंदर घर बनाता है।",
  },
  {
    id: "ex-business", for: E, tags: ["business", "ambitious", "family"],
    en: "Prefer a partner from a business family or with entrepreneurial spirit — someone driven yet grounded, who values family reputation and relationships.",
    hi: "व्यापारिक परिवार या उद्यमी सोच वाला साथी वरीय — जो आगे बढ़ने वाला हो पर जुड़ा हुआ भी, और पारिवारिक प्रतिष्ठा व रिश्तों को महत्व दे।",
  },
  {
    id: "ex-govt-job", for: E, tags: ["govt", "traditional", "simple"],
    en: "Prefer a partner in government service or a stable profession — steady, sincere and family-loving, who believes in a simple and honest life.",
    hi: "सरकारी सेवा या स्थिर पेशे में कार्यरत साथी वरीय — स्थिर, ईमानदार और परिवार से प्रेम करने वाला, सरल और सच्चे जीवन में विश्वास रखने वाला।",
  },
  {
    id: "ex-veg", for: E, tags: ["traditional", "spiritual", "fitness"],
    en: "Vegetarian partner preferred (our family is strictly vegetarian). Looking for someone who respects our customs and lifestyle.",
    hi: "शाकाहारी साथी वरीय (हमारा परिवार पूर्णतः शाकाहारी है)। ऐसा साथी जो हमारी रीति-रिवाज और जीवनशैली का सम्मान करे।",
  },
  {
    id: "ex-mature", for: E, tags: ["calm", "balanced", "modern"],
    en: "Seeking a mature, emotionally intelligent partner — someone who talks things through, apologizes when wrong, and treats marriage as teamwork.",
    hi: "परिपक्व, भावनात्मक रूप से समझदार साथी — जो बात करके सुलझाए, गलती पर माफी मांगे, और विवाह को टीमवर्क माने।",
  },
  {
    id: "ex-similar-pro", for: E, tags: ["engineer", "banker", "modern"],
    en: "Prefer a partner in a similar professional field — shared schedules and mutual understanding of work life help build an easy, supportive marriage.",
    hi: "समान पेशेवर क्षेत्र का साथी वरीय — समान कार्य-समय और कामकाजी जीवन की परस्पर समझ से सहज, सहयोगी विवाह बनता है।",
  },
  {
    id: "ex-caring", for: E, tags: ["family", "calm", "simple"],
    en: "A caring, patient partner who stands by family in good times and bad — someone whose presence itself makes people feel safe and loved.",
    hi: "देखभाल करने वाला, धैर्यवान साथी जो अच्छे-बुरे समय में परिवार के साथ खड़ा रहे — जिसकी मौजूदगी से ही लोगों को सुरक्षा और प्रेम महसूस हो।",
  },
  {
    id: "ex-adventurous", for: E, tags: ["travel", "sports", "cheerful"],
    en: "Looking for an active, adventurous partner — someone who says yes to treks, trips and trying new things, and keeps life energetic and fun.",
    hi: "सक्रिय, रोमांच-प्रेमी साथी — जो ट्रेक, यात्राओं और नई चीज़ों के लिए हां कहे और जीवन को ऊर्जावान व मज़ेदार बनाए।",
  },
];

const TOKEN_MAP: Record<string, (d: BiodataData) => string> = {
  name: (d) => d.personal.name,
  occupation: (d) => d.career.occupation,
  company: (d) => d.career.company,
  qualification: (d) => d.career.qualification,
  income: (d) => d.career.income,
  city: (d) => d.personal.birthPlace || d.family.nativePlace,
  fatherOccupation: (d) => d.family.fatherOccupation,
  motherTongue: (d) => d.astro.motherTongue,
};

/**
 * Replace `{token}` / `{token|fallback}` with real values from the biodata.
 * Falls back to the pipe text, then "" — never leaves raw braces.
 */
export function fillPlaceholders(text: string, data: BiodataData): string {
  return text
    .replace(/\{(\w+)(?:\|([^}]*))?\}/g, (_m, key: string, fb?: string) => {
      const v = TOKEN_MAP[key]?.(data)?.trim();
      return v || (fb ?? "");
    })
    .replace(/ {2,}/g, " ")
    .trim();
}

/** Filter suggestions: entry must carry every active tag (empty = all). */
export function suggestionsFor(
  kind: SuggestionFor,
  activeTags: string[],
): Suggestion[] {
  return SUGGESTIONS.filter(
    (s) =>
      s.for === kind && activeTags.every((t) => s.tags.includes(t)),
  );
}
