const  {UserRepo} = require('../models/User');
const ReadingStreakService = require('../services/readingStreakService');

const getReadingStats = async (req, res) => {
  try{
    const userId = req.user.id;

    const user = await UserRepo.findById(userId);

    if(!user) {
      return res.status(404).json({message : 'User not found,'});
    }

    const streakStats = await ReadingStreakService.getStreakStats(userId);

    const annualBookGoal = user.readingGoal || 24;

    const completedBookThisYear = streakStats.completedBookThisYear || 0;

    const annualGoalProgress = {
      completed : completedBookThisYear,
      target: annualBookGoal,
      percentage: Math.min(100, Math.round((completedBookThisYear/annualBookGoal)*100)),
      remaining: Math.max(0, annualBookGoal-completedBookThisYear)
    }

    return res.status(200).json({
      goals: {
        annualBookGoal : user.readingGoal ||24,
        dailyPageGoal : user.dailyPageGoal || 30
      },
      streak:streakStats
    });
  }catch(error){
    console.error('getreadingStats error:', error.message);

    return res.status(500).json({
      message: 'Failed to fetch reading statistics.'
    });
  }
};

const updateReadingGoals = async (req, res) =>{
  try{
    const {annualBookGoal, dailyPageGoal} = req.body;

    if(annualBookGoal !== undefined && (!Number.isInteger(annualBookGoal) || annualBookGoal <1)){
      return res.status(400).json({
        message: 'Annual book goal must be a positive integer.'
      });
    }

    if(dailyPageGoal !== undefined && (!Number.isInteger(dailyPageGoal) || dailyPageGoal <1)){
      return res.status(400).json({
        message: 'Daily Page goal must be a positive integer.'
      });
    }

    if(annualBookGoal === undefined && dailyPageGoal == undefined){
      return res.status(400).json({
        message: 'Please provide atleast one reading goal.'
      });
    }

    const updateData = {};

    if(annualBookGoal !== undefined) {
      updateData.readingGoal = annualBookGoal;
    }

    if(dailyPageGoal !== undefined){
      updateData.dailyPageGoal = dailyPageGoal;
    }


    const updatedUser = await UserRepo.updateById(
      req.user.id,
      updateData
    );

    if(!updatedUser){
      return res.status(404).json({
        message:'User not found.'
      });
    }

    return res.status(200).json({
      message : 'Reading goals updated successfully.',
      goals: {
        annualBookGoal: updatedUser.readingGoal,
        dailyPageGoal: updatedUser.dailyPageGoal
      }
    });
  }catch(error){
    console.error('updateReadingGoals error:', error.message);

    return res.status(500).json({
      message: 'Failed to update reading goals.'
    });
  }
};

module.exports = {
  getReadingStats,
  updateReadingGoals
}