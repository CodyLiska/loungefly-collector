const Backpack = require("../models/Backpack");
const User = require("../models/User");

module.exports = {
  // display add.hbs page
  getAddPage: async (req, res) => {
    res.render("backpacks/add");
  },

  // add user created backpack to the database
  addUserCreatedBackpack: async (req, res) => {
    try {
      const userId = req.user.id; // get the logged in user's id

      // Create the new Backpack from the add page
      const newBackpack = await Backpack.create({
        bg_name: req.body.bg_name,
        bg_image: req.body.bg_image,
        bg_price: req.body.bg_price,
        bg_series: req.body.bg_series,
        bg_link: req.body.bg_link,
        bg_fromSite: req.body.bg_fromSite,
        user: userId,
      });

      // Find the user and add the newBackpack
      const user = await User.findById(userId);
      // *****************************************************************************************
      // TODO: check the users backpack array to see if
      // the added backpack id already exists. Error if backpack exists,
      // else add to collection
      // *****************************************************************************************
      user.backpacks.push(newBackpack._id); // add the newBackpack's id to users collection
      await user.save();

      res.redirect("/dashboard");
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  },

  // get users collection
  getUsersCollectionPage: async (req, res) => {
    try {
      const backpacks = await Backpack.find({ _id: req.params.id })
        .populate("user")
        .sort({ createdAt: "desc" })
        .lean();

      res.render("backpacks/index", { backpacks });
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  },

  // NOT BEING USED
  getUsersCollectionById: async (req, res) => {
    try {
      const backpacks = await Backpack.find({
        user: req.params.userId,
      })
        .populate("user")
        .lean();

      res.render("backpacks/index", {
        backpacks,
      });
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  },

  // get and display a single backpack
  getSingleBackpackById: async (req, res) => {
    try {
      let backpack = await Backpack.findById(req.params.id)
        .populate("user")
        .lean();
  
      if (!backpack) {
        return res.render("error/404");
      }
  
      res.render("backpacks/show", {
        backpack,
      });
    } catch (err) {
      console.error(err);
      res.render("error/404");
    }
  },

  // edit backpack
  editBackpack: async (req, res) => {
    try {
      const backpack = await Backpack.findById(req.params.id).lean();
  
      if (!backpack) {
        return res.render("error/404");
      }
  
      if (req.user.backpacks.includes(backpack._id.toString())) {
        res.render("backpacks/edit", {
          backpack,
        });
      } else {
        res.redirect("/dashboard");
      }
    } catch (err) {
      console.error(err);
      return res.render("error/500");
    }
  },

  // TODO: currently this updates the backpack's values in the database
  // not sure if this will be usefull since the users collection array hold a reference to the 
  // backpack in the database and not a different object
  // MIGHT NOT WANT TO HAVE THIS AS AN OPTION??
  // update backpack
  updateBackpack: async (req, res) => {
    try {
      const userId = req.user.id;
      const backpackId = req.params.id;

      // find user
      const user = await User.findById(userId);

      if(!user){
        return res.render("error/404");
      }

      // check if backpack is in the users collection
      const backpackInUsersCollection = user.backpacks.includes(backpackId);

      if(!backpackInUsersCollection) {
        return res.redirect("/dashboard")
      }

      // get the backpack to update
      let backpack = await Backpack.findById(backpackId);

      if(!backpack){
        return res.render("error/404")
      }

      // update the backpack fields from the form data
      backpack.bg_name = req.body.bg_name || backpack.bg_name;
      backpack.bg_image = req.body.bg_image || backpack.bg_image;
      backpack.bg_price = req.body.bg_price || backpack.bg_price;
      backpack.bg_series = req.body.bg_series || backpack.bg_series;
      backpack.bg_link = req.body.bg_link || backpack.bg_link;
      backpack.bg_fromSite = req.body.bg_fromSite || backpack.bg_fromSite;

      await backpack.save();
      res.redirect("/dashboard");
    } catch (err) {
      console.error(err);
      return res.render("error/500");
    }
  },

  // delete backpack
  deleteBackpack: async (req, res) => {
    try {
      let backpack = await Backpack.findById(req.params.id).lean();
  
      if (!backpack) {
        return res.render("error/404");
      }
  
      if (req.user.backpacks.includes(backpack._id.toString())) {
        // Remove the backpack from the User's backpack array
        await User.updateOne(
          { _id: req.user._id },
          { $pull: { backpacks: backpack._id } }
        );
  
        // Delete the backpack from the Backpack collection
        await Backpack.deleteOne({ _id: req.params.id });
  
        res.redirect("/dashboard");
      } else {
        res.redirect("/dashboard");
      }
    } catch (err) {
      console.error(err);
      return res.render("error/500");
    }
  },

  // get the search page
  getSearchPage: async (req, res) => {
    try {
      const backpacks = await Backpack.find({
        bg_name: new RegExp(req.query.query, "i"),
      })
        .populate("user")
        .sort({ createdAt: "desc" })
        .lean();
      res.render("backpacks/index", { backpacks });
    } catch (err) {
      console.log(err);
      res.render("error/404");
    }
  },

  // add backpack from database
  addBackpackFromDatabase: async (req, res) => {
    try {
      const userId = req.user._id;
      const backpackId = req.params.id;
  
      const user = await User.findById(userId);
      // *****************************************************************************************
      // TODO: check the users backpack array to see if
      // the added backpack id already exists. Error if backpack exists,
      // else add to collection
      // *****************************************************************************************
      user.backpacks.push(backpackId);
      await user.save();
  
      res.redirect("/dashboard");
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  }
};
