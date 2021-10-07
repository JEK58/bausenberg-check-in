const CheckinModel = require("../models/Checkin");

const CheckinService = {
  getAll: async () => {
    return await Checkin.find({});
  },

  delete: async (id) => {
    return await CheckinModel.findByIdAndDelete(id);
  },

  save: async (data) => {
    const checkin = new CheckinModel(data);
    return await checkin.save();
  },
};

module.exports = CheckinService;
