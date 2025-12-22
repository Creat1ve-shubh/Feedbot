import { IconBolt, IconCar, IconShoppingBag } from "@tabler/icons-react";

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
    gradientBg: "bg-gradient-to-br from-orange-500 via-red-500 to-red-700",
    icon: IconBolt,
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
    gradientBg: "bg-gradient-to-br from-red-600 via-purple-600 to-indigo-700",
    icon: IconCar,
  },
  {
    id: 3,
    brand: "Louis Vuitton",
    industry: "Luxury & Fashion",
    postsAnalyzed: 1956,
    sentimentBreakdown: {
      positive: 72,
      negative: 12,
      mixed: 16,
    },
    topEmotions: [
      { name: "Aspiration", value: 38 },
      { name: "Admiration", value: 32 },
      { name: "Exclusivity", value: 20 },
      { name: "Skepticism", value: 10 },
    ],
    topTopics: [
      { topic: "Collection Launches", posts: 320 },
      { topic: "Celebrity Endorsements", posts: 280 },
      { topic: "Heritage", posts: 210 },
      { topic: "Sustainability", posts: 180 },
    ],
    keyInsight:
      "Strong aspirational sentiment around new collections and celebrity collaborations. Luxury positioning resonates well with audience expectations.",
    gradientBg: "bg-gradient-to-br from-amber-600 via-yellow-600 to-yellow-800",
    icon: IconShoppingBag,
  },
];

export type CaseStudy = (typeof caseStudies)[0];
