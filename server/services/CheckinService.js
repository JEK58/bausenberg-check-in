const CheckInModel = require("../models/CheckIn");

const CheckInService = {
  getAll: async () => {
    return await CheckIn.find({});
  },

  delete: async (id) => {
    return await CheckInModel.findByIdAndDelete(id);
  },

  save: async (data) => {
    const checkIn = new CheckInModel(data);
    return await checkIn.save();
  },
};

module.exports = CheckInService;
