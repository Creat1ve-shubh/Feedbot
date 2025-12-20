export const caseStudies = [
  {
    id: 1,
    brand: "Nike",
    industry: "Sports & Lifestyle",
    postsAnalyzed: 2847,
    sentimentBreakdown: {
      positive: 68,
      negative: 18,
      mixed: 14,
    },
    topEmotions: [
      { name: "Inspiration", value: 35 },
      { name: "Excitement", value: 28 },
      { name: "Trust", value: 22 },
      { name: "Concern", value: 15 },
    ],
    topTopics: [
      { topic: "Athlete Performance", posts: 450 },
      { topic: "Product Innovation", posts: 380 },
      { topic: "Sustainability", posts: 290 },
      { topic: "Community", posts: 260 },
    ],
    keyInsight:
      "Nike customers are highly engaged with athletic performance and innovation messaging. Strong positive sentiment around sustainability initiatives.",
    color: "from-blue-400 to-blue-600",
  },
  {
    id: 2,
    brand: "Tesla",
    industry: "Automotive & Technology",
    postsAnalyzed: 3421,
    sentimentBreakdown: {
      positive: 62,
      negative: 22,
      mixed: 16,
    },
    topEmotions: [
      { name: "Excitement", value: 40 },
      { name: "Skepticism", value: 25 },
      { name: "Innovation", value: 22 },
      { name: "Concern", value: 13 },
    ],
    topTopics: [
      { topic: "Autonomous Technology", posts: 580 },
      { topic: "Electric Vehicles", posts: 520 },
      { topic: "Elon Musk", posts: 410 },
      { topic: "Environmental Impact", posts: 340 },
    ],
    keyInsight:
      "Tesla followers show strong interest in cutting-edge technology, with debates around autonomous capabilities. Mixed sentiment on recent announcements.",
    color: "from-red-400 to-red-600",
  },
  {
    id: 3,
    brand: "Apple",
    industry: "Consumer Technology",
    postsAnalyzed: 4156,
    sentimentBreakdown: {
      positive: 71,
      negative: 15,
      mixed: 14,
    },
    topEmotions: [
      { name: "Delight", value: 38 },
      { name: "Loyalty", value: 32 },
      { name: "Anticipation", value: 20 },
      { name: "Frustration", value: 10 },
    ],
    topTopics: [
      { topic: "Product Design", posts: 620 },
      { topic: "Innovation", posts: 550 },
      { topic: "User Experience", posts: 480 },
      { topic: "Ecosystem Integration", posts: 420 },
    ],
    keyInsight:
      "Apple maintains strong brand loyalty with customers delighted by design and ecosystem integration. Highest positive sentiment among analyzed brands.",
    color: "from-gray-400 to-gray-600",
  },
];

export type CaseStudy = (typeof caseStudies)[0];
