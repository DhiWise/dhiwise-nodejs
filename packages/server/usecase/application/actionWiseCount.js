const mongoose = require('mongoose');
const {
  OK, SERVER_ERROR, INVALID_REQUEST_PARAMS,
} = require('../../constants/message').message;

const actionWiseCount = ({ deviceActionRepo }) => async (id) => {
  try {
    if (!id) return INVALID_REQUEST_PARAMS;

    const data = await deviceActionRepo.aggregate({
      queryStages: [
        { $match: { applicationId: mongoose.Types.ObjectId(id) } }, {
          $group: {
            _id: {
              type: '$customJson.action.type',
              screenId: '$screenId',
            },
            count: { $sum: 1 },
          },
        },
      ],
    });
    return {
      ...OK,
      data,
    };
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = actionWiseCount;
