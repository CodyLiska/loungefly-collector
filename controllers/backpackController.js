const Backpack = require("../models/Backpack");
const UserBackpack = require("../models/UserBackpack");
const User = require("../models/User");

module.exports = {
  // display add.hbs page
  getAddPage: async (req, res) => {
    res.render("backpacks/add");
  },

  // add user created backpack to the database
  addUserCreatedBackpack: async (req, res) => {
    try {
      const { 
        backpackName, 
        purchasePrice, 
        status,
        condition,
        purchaseDate,
        seriesCollection,
        onlineStore,
        personalNotes
      } = req.body;

      if (!backpackName) {
        req.flash('error_msg', 'Backpack name is required. Other fields are optional.');
        return res.redirect('/backpacks/add');
      }

      if (!status) {
        req.flash('error_msg', 'Please select either Owned or Wishlist status');
        return res.redirect('/backpacks/add');
      }

      // Create new backpack in main collection
      // const backpack = await Backpack.create({
      //   name,
      //   purchasePrice,
      //   seriesCollection,
      //   onlineStore
      // });

      // Add to user's collection with additional details
      await UserBackpack.create({
        backpack: backpack._id,
        user: req.user.id,
        owned: status === 'owned',
        wishlist: status === 'wishlist',
        condition: status === 'owned' ? condition : null,
        purchasePrice: purchasePrice || null,
        purchaseDate: purchaseDate || null,
        personalNotes,
        seriesCollection,
        onlineStore
      });

      req.flash('success_msg', 'Backpack successfully added to your collection');
      res.redirect('/backpacks');
    } catch (err) {
      console.error('Error adding backpack:', err);
      req.flash('error_msg', 'Error adding backpack to collection');
      res.render('error/500');
    }
  },

  // get users collection
  getUsersCollectionPage: async (req, res) => {
    try {
      // Get filter from query params, default to 'all'
      const filter = req.query.filter || 'all';

      // Build filter query
      let filterQuery = { user: req.user.id };
      if (filter === 'owned') {
        filterQuery.owned = true;
      } else if (filter === 'wishlist') {
        filterQuery.wishlist = true;
      }

      const userBackpacks = await UserBackpack.find(filterQuery)
        .populate('backpack')
        .lean();

        console.log("req.user: ", req.user)
        console.log("userBackpacks: ", userBackpacks)

      // Transform the data to include both backpack and userBackpack info
      const backpacks = userBackpacks.map(ub => ({
        _id: ub._id,
        backpack: ub.backpack,
        owned: ub.owned,
        wishlist: ub.wishlist,
        condition: ub.condition,
        addedToCollectionDate: ub.addedToCollectionDate,
        purchasePrice: ub.purchasePrice,
        purchaseDate: ub.purchaseDate,

        name: ub.backpack?.backpackName || "Unknown Backpack",
        image: ub.backpack?.image || "no image"
      }));

      res.render("backpacks/index", {
        backpacks,
        isCollection: true,
        currentFilter: filter
      });
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  },

  // get and display a single backpack
  getSingleBackpackById: async (req, res) => {
    try {
      // First try to find it in user's collection
      let userBackpack = await UserBackpack.findOne({
        backpack: req.params.id,
        user: req.user.id
      }).populate('backpack').lean();

      // If not in collection, get the base backpack
      if (!userBackpack) {
        const backpack = await Backpack.findById(req.params.id).lean();
        if (!backpack) {
          return res.render("error/404");
        }

        // Check if this backpack is in user's collection
        const inCollection = await UserBackpack.exists({
          backpack: backpack._id,
          user: req.user.id
        });

        return res.render("backpacks/show", {
          backpack: {
            _id: backpack._id,
            name: backpack.name,
            image: backpack.image,
            purchasePrice: backpack.purchasePrice,
            seriesCollection: backpack.seriesCollection,
            onlineStore: backpack.onlineStore,
            inCollection
          }
        });
      }

      // Transform UserBackpack data to match template expectations  -- THIS IS EVERYWHERE AND MIGHT BE THE DISCONNECT BETWEEN FRT/BK ENDS AND NEW MODELS
      const backpack = {
        _id: backpack._id,
        userBackpackId: userBackpack._id,
        name: backpack.backpackName,
        image: backpack.image,
        purchasePrice: userBackpack.purchasePrice || null,
        seriesCollection: userBackpack.seriesCollection || null,
        onlineStore: userBackpack.onlineStore || null,
        personalNotes: userBackpack.personalNotes,
        condition: userBackpack.condition,
        owned: userBackpack.owned,
        wishlist: userBackpack.wishlist,
        addedToCollection: userBackpack.addedToCollection,
        inCollection: true
      };

      res.render("backpacks/show", { backpack });
    } catch (err) {
      console.error("Error getting backpack:", err);
      res.render("error/404");
    }
  },

  // edit backpack
  editBackpack: async (req, res) => {
    try {
      const userBackpack = await UserBackpack.findById(req.params.id)
        .populate('backpack')
        .lean();

      if (!userBackpack) {
        console.error('UserBackpack not found:', req.params.id);
        return res.render("error/404");
      }

      // Make sure user owns this backpack
      if (userBackpack.user.toString() !== req.user.id) {
        res.redirect("/backpacks");
      } else {
        res.render("backpacks/edit", { 
          backpack: {
            _id: userBackpack._id,
            name: userBackpack.backpack.backpackName,
            image: userBackpack.backpack.image,
            purchasePrice: userBackpack.purchasePrice || userBackpack.backpack.purchasePrice,
            seriesCollection: userBackpack.seriesCollection || userBackpack.backpack.seriesCollection,
            onlineStore: userBackpack.onlineStore || userBackpack.backpack.onlineStore,
            personalNotes: userBackpack.personalNotes || '',
            condition: userBackpack.condition || 'New',
            purchasePrice: userBackpack.purchasePrice || userBackpack.backpack.purchasePrice,
            owned: userBackpack.owned || false,
            wishlist: userBackpack.wishlist || false
          }
        });
      }
    } catch (err) {
      console.error('Error in editBackpack:', err);
      return res.render("error/500");
    }
  },

  // update backpack
  updateBackpack: async (req, res) => {
    try {
      const userBackpack = await UserBackpack.findById(req.params.id);

      if (!userBackpack) {
        return res.render("error/404");
      }

      // Make sure user owns this backpack
      if (userBackpack.user.toString() !== req.user.id) {
        return res.redirect("/backpacks");
      }

      // Update the userBackpack
      await UserBackpack.findOneAndUpdate(
        { _id: req.params.id },
        {
          purchasePrice: req.body.purchasePrice,
          condition: req.body.condition,
          personalNotes: req.body.personalNotes,
          owned: req.body.owned === 'true',
          wishlist: req.body.wishlist === 'true'
        },
        { new: true }
      );

      res.redirect("/backpacks");
    } catch (err) {
      console.error("Error updating backpack:", err);
      return res.render("error/500");
    }
  },

  // delete backpack from user's collection
  deleteBackpack: async (req, res) => {
    try {
      const userBackpack = await UserBackpack.findById(req.params.id);

      if (!userBackpack) {
        return res.render("error/404");
      }

      // Make sure user owns this backpack
      if (userBackpack.user.toString() !== req.user.id) {
        return res.redirect("/backpacks");
      }

      await UserBackpack.findByIdAndDelete(req.params.id);
      res.redirect("/backpacks");
    } catch (err) {
      console.error("Error deleting backpack:", err);
      return res.render("error/500");
    }
  },

  // get the search page
  getSearchPage: async (req, res) => {
    try {
      const query = req.query.query;
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;

      // If no query, show empty search page
      if (!query || query.trim() === '') {
        return res.render("backpacks/index", { 
          backpacks: [],
          isSearchResult: true,
          searchQuery: ''
        });
      }

      // Find backpacks matching the search query
      const searchQuery = {
        $or: [
          { Name: { $regex: query, $options: 'i' } },
          { Franchise: { $regex: query, $options: 'i' } },
          { "Series Title": { $regex: query, $options: 'i' } },
          { "Other tags": { $regex: query, $options: 'i' } }
        ]
      };

      // Get total count for pagination
      const total = await Backpack.countDocuments(searchQuery);
      const totalPages = Math.ceil(total / limit);

      // Get paginated results
      const backpacks = await Backpack.find(searchQuery)
        .skip(skip)
        .limit(limit)
        .lean();

      // If no results found
      if (!backpacks || backpacks.length === 0) {
        return res.render("backpacks/index", { 
          backpacks: [],
          isSearchResult: true,
          searchQuery: query
        });
      }

      // Get user's collection to check which backpacks are already in it
      const userBackpacks = await UserBackpack.find({
        user: req.user.id
      }).lean();

      // Add inCollection flag to each backpack
      const backpacksWithCollectionStatus = backpacks.map(backpack => ({
        ...backpack,
        inCollection: userBackpacks.some(ub => 
          ub.backpack.toString() === backpack._id.toString()
        )
      }));

      // Prepare pagination data
      const pagination = {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        total,
        showing: {
          start: skip + 1,
          end: Math.min(skip + limit, total)
        }
      };

      res.render("backpacks/index", { 
        backpacks: backpacksWithCollectionStatus,
        isSearchResult: true,
        searchQuery: query,
        pagination
      });
    } catch (err) {
      console.error('Error in search:', err);
      res.render("error/500");
    }
  },

  // Add backpack to user's collection
  addBackpackFromDatabase: async (req, res) => {
    try {
      const userId = req.user.id;
      const backpackId = req.params.id;
      const searchQuery = req.body.returnTo;
      const page = req.body.returnPage || 1;
      const status = req.body.status;
      const condition = req.body.condition;

      // Check if user already has this backpack in their collection
      const existingUserBackpack = await UserBackpack.findOne({
        user: userId,
        backpack: backpackId
      });

      if (existingUserBackpack) {
        const message = encodeURIComponent("This backpack is already in your collection!");
        return res.redirect(`/backpacks/search?query=${searchQuery}&page=${page}&success=${message}`);
      }

      // Get backpack details for the success message
      const backpack = await Backpack.findById(backpackId).lean();
      
      // Create new UserBackpack entry
      await UserBackpack.create({
        user: userId,
        backpack: backpackId,
        wishlist: status === 'wishlist',
        owned: status === 'owned',
        condition: status === 'owned' ? condition : null
      });

      // Redirect back to search results with success message
      const message = encodeURIComponent(`${backpack.name} added to your collection!`);
      res.redirect(`/backpacks/search?query=${searchQuery}&page=${page}&success=${message}`);
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  },

  // Remove backpack from user's collection
  removeFromCollection: async (req, res) => {
    try {
      const userBackpackId = req.params.id;
      const userId = req.user.id;

      // Find and delete the UserBackpack entry
      const userBackpack = await UserBackpack.findOneAndDelete({
        _id: userBackpackId,
        user: userId
      });

      if (!userBackpack) {
        req.flash('error_msg', 'Backpack not found in your collection');
        return res.redirect('/backpacks');
      }

      req.flash('success_msg', 'Backpack removed from your collection');
      res.redirect('/backpacks');
    } catch (err) {
      console.error('Error removing backpack from collection:', err);
      res.render('error/500');
    }
  },

  // Edit backpack in collection
  getEditPage: async (req, res) => {
    try {
      const userBackpackId = req.params.id;
      const userId = req.user.id;

      const userBackpack = await UserBackpack.findOne({
        _id: userBackpackId,
        user: userId
      }).populate('backpack');

      if (!userBackpack) {
        req.flash('error_msg', 'Backpack not found in your collection');
        return res.redirect('/backpacks');
      }

      res.render('backpacks/edit', {
        backpack: {
          _id: userBackpack._id,
          name: userBackpack.backpack.name,
          image: userBackpack.backpack.image,
          purchasePrice: userBackpack.backpack.purchasePrice,
          seriesCollection: userBackpack.seriesCollection || userBackpack.backpack.seriesCollection,
          onlineStore: userBackpack.onlineStore || userBackpack.backpack.onlineStore,
          purchasePrice: userBackpack.purchasePrice,
          purchaseDate: userBackpack.purchaseDate,
          personalNotes: userBackpack.personalNotes,
          condition: userBackpack.condition,
          owned: userBackpack.owned,
          wishlist: userBackpack.wishlist
        }
      });
    } catch (err) {
      console.error('Error loading edit page:', err);
      res.render('error/500');
    }
  },

  // Update backpack in collection
  updateBackpack: async (req, res) => {
    try {
      const userBackpackId = req.params.id;
      const userId = req.user.id;
      const { 
        status, 
        condition, 
        purchasePrice, 
        purchaseDate,
        seriesCollection, 
        onlineStore, 
        personalNotes 
      } = req.body;

      // Find the user's backpack
      const userBackpack = await UserBackpack.findOne({
        _id: userBackpackId,
        user: userId
      });

      if (!userBackpack) {
        req.flash('error_msg', 'Backpack not found in your collection');
        return res.redirect('/backpacks');
      }

      // Update the backpack with new values
      userBackpack.owned = status === 'owned';
      userBackpack.wishlist = status === 'wishlist';
      userBackpack.condition = status === 'owned' ? condition : null;
      userBackpack.purchasePrice = purchasePrice || null;
      userBackpack.purchaseDate = purchaseDate || null;
      userBackpack.seriesCollection = seriesCollection;
      userBackpack.onlineStore = onlineStore;
      userBackpack.personalNotes = personalNotes;

      await userBackpack.save();

      req.flash('success_msg', 'Your backpack has been updated');
      res.redirect('/backpacks');
    } catch (err) {
      console.error('Error updating backpack:', err);
      res.render('error/500');
    }
  },
};
