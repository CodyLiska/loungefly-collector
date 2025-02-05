// Models
// const Model_1 = require('../models/Model_1');
// const Model_2 = require('../models/Model_2');

module.exports = {
  getLandingPage: async (req, res) => {
    res.render("index", { layout: "main" });
  },
  getAddPage: async (req, res) => {
    res.render("add", { layout: "main" });
  },
  getCollectionPage: async (req, res) => {
    res.render("collection", { layout: "main" });
  },
  getSearchPage: async (req, res) => {
    res.render("search", { layout: "main" });
  },
};
