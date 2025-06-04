import { connectDB } from './mongodb';
import User from '../models/User';
import Achievement from '../models/Achievement';

const POINTS = {
  CREATE_NEWS: 10,
  CREATE_TOPIC: 5,
  REPLY_TOPIC: 2,
  PARTICIPATE_EVENT: 15,
};

const LEVELS = [
  { level: 1, points: 0 },
  { level: 2, points: 100 },
  { level: 3, points: 250 },
  { level: 4, points: 500 },
  { level: 5, points: 1000 },
];

export async function addPoints(userId: string, action: keyof typeof POINTS) {
  await connectDB();
  const points = POINTS[action];
  
  const user = await User.findById(userId);
  if (!user) return null;

  user.points += points;
  
  // Atualizar nível
  const newLevel = LEVELS.reduce((currentLevel, level) => {
    if (user.points >= level.points) {
      return level.level;
    }
    return currentLevel;
  }, user.level);

  if (newLevel > user.level) {
    user.level = newLevel;
  }

  await user.save();
  await checkAchievements(userId);

  return user;
}

export async function checkAchievements(userId: string) {
  const user = await User.findById(userId);
  if (!user) return null;

  const achievements = await Achievement.find({
    'unlockedBy': { $ne: userId }
  });

  const unlockedAchievements = [];

  for (const achievement of achievements) {
    let shouldUnlock = false;

    switch (achievement.criteria.type) {
      case 'points':
        shouldUnlock = user.points >= achievement.criteria.value;
        break;
      case 'news':
        const newsCount = await mongoose.models.News.countDocuments({ author: userId });
        shouldUnlock = newsCount >= achievement.criteria.value;
        break;
      case 'topics':
        const topicsCount = await mongoose.models.Topic.countDocuments({ author: userId });
        shouldUnlock = topicsCount >= achievement.criteria.value;
        break;
      case 'replies':
        const topics = await mongoose.models.Topic.find({ author: userId });
        const repliesCount = topics.reduce((acc, topic) => acc + topic.replies.length, 0);
        shouldUnlock = repliesCount >= achievement.criteria.value;
        break;
      case 'events':
        const eventsCount = await mongoose.models.Event.countDocuments({ organizer: userId });
        shouldUnlock = eventsCount >= achievement.criteria.value;
        break;
    }

    if (shouldUnlock) {
      achievement.unlockedBy.push(userId);
      await achievement.save();
      unlockedAchievements.push(achievement);
    }
  }

  return unlockedAchievements;
}

export { POINTS, LEVELS }; 