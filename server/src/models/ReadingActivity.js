const mongoose = require('mongoose');
const {readingActivitiesStore} = require('../config/storage.js');
const {getIsMongoConnected} = require('../config/db');

const readingActivitySchema = new mongoose.Schema({
  userId: {
    type: String,
    required:true
  },
  date: {
    type: String,
    required:true
  },
  pagesRead: {
    type:Number,
    required:true,
    default:0,
    min:0
  }
});

readingActivitySchema.index(
  {userId: 1, date:1},
  {unique:true}
);

const MongoReadingActivity = mongoose.model(
  'ReadingActivity',
  readingActivitySchema
);

class ReadingActivityRepo {
  
  static async addPages(userId, date, pages){
    if(!userId || !date || !Number.isFinite(pages) || pages <=0){
      throw new Error('Invalid reading activity data');
    }

    if(getIsMongoConnected()){
      return await MongoReadingActivity.findOneAndUpdate(
        {userId, date},
        {
          $inc:{pagesRead: pages},
          $setOnInsert: {userId, date}
        },
        {
          upsert: true,
          new:true,
          runValidators:true
        }
      );
    }

    const existing = readingActivitiesStore.findOne({userId, date});

    if(existing){
      return readingActivitiesStore.findByIdAndUpdate(
        existing._id,
        {pagesRead: existing.pagesRead + pages}
      );
    }

    return readingActivitiesStore.create({
      userId,
      date,
      pagesRead:pages
    });

  }

  static async findByUser(userId){
    if(getIsMongoConnected()){
      return await MongoReadingActivity
      .find({userId})
      .sort({date:1})
      .lean();
    }

    return readingActivitiesStore
    .find({userId})
    .sort((a,b) => a.date.localeCompare(b.date));
  }

  
}

module.exports = {
  ReadingActivityRepo,
  MongoReadingActivity
};