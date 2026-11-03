const {ReadingActivityRepo} = require('../models/ReadingActivity');
const {BookRepo} = require('../models/Book');

const getDateKey = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

const getDayDifference = (date1, date2) =>{
  const first = new Date(`${date1}T00:00:00.000Z`);
  const second = new Date(`${date2}T00:00:00.000Z`);

  return Math.round((second-first)/(1000*60*60*24));
};

class ReadingStreakService {
  static async getStreakStats(userId){
    const activities = await ReadingActivityRepo.findByUser(userId);

    const book = await BookRepo.findByUser(userId);

    const currentYear = new Date().getFullYear();
    const completedBooksThisYear = book.filter((book) => {
      if(book.status !== 'completed' || !book.completedAt) return false;

      const completedDate = new Date(book.completedAt);

      return (
        !Number.isNaN(completedDate.getTime())&& completedDate.getFullYear()===currentYear
      );
    }).length;

    const totalPagesRead = activities.reduce(
      (total, activity) => total + activity.pagesRead, 0
    );

    const today1 = getDateKey(new Date());

    const weeklyActivity = Array.from({length:7},(_,  index) => {
      const date = new Date(`${today1}T00:00:00.00Z`);

      date.setUTCDate(date.getUTCDate()-(6-index));

      const dateKey = getDateKey(date);
      const activity = activities.find(
        item=>getDateKey(item.date) === date.Key
      );

      return {
        date:dateKey,
        pagesRead: activity? activity.pagesRead:0
      };
    });


    const readingDates = [
      ...new Set(
        activities
        .filter(activity => activity.pageRead>0)
        .map(activity => getDateKey(activity.date))
      )
    ].sort();

    if(readingDates.length === 0){
      return{
        currentStreak : 1,
        longestStreak: 0,
        totalReadingDays : 0,
        lastReadDate: null,
        milestones: {
          sevenDay: false,
          thirtyDay: false
        },
        totalPagesRead,
        weeklyActivity
      };
    }

    let currentStreak = 1;
    let longestStreak = 1;

    for(let i = 0; i<readingDates.length; i++){
      const difference = getDayDifference(
        readingDates[i-1],
        readingDates[i]
      );

      if(difference === 1){
        currentStreak++;
      }else{
        currentStreak = 1;
      }

      longestStreak = Math.max(longestStreak, currentStreak);
    }

    const today = getDateKey(new Date());
    const lastReadDate = readingDates[readingDates.length-1];

    const daysSinceLastRead = getDayDifference(lastReadDate, today);

    if(daysSinceLastRead >1 || daysSinceLastRead <0){
      currentStreak = 0;
    }

    return {
      currentStreak,
      longestStreak,
      totalReadingDays: readingDates.length,
      lastReadDate,
      milestones :{
        sevenDay :longestStreak >= 7,
        thirtyDay : longestStreak >=30
      },
      completedBookThisYear,
      totalPagesRead,
      weeklyActivity
    };

  }
}

module.exports = ReadingStreakService