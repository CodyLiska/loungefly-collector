const Backpack = require("../models/Backpack");
const UserBackpack = require("../models/UserBackpack");
const User = require("../models/User");
const { generatePresignedUrl } = require("../helpers/s3Helper");

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
        heartLogo,
        status,
        condition,
        seriesCollection,
        onlineStore,
        purchasePrice,
        addedToCollectionDate,
        personalNotes,
      } = req.body;

      if (!backpackName) {
        req.flash(
          "error_msg",
          "Backpack name is required. Other fields are optional."
        );
        return res.redirect("/backpacks/add");
      }

      if (!status) {
        req.flash("error_msg", "Please select either Owned or Wishlist status");
        return res.redirect("/backpacks/add");
      }

      const backpack = await Backpack.create({
        backpackName,
        heartLogo,
        seriesCollection,
        onlineStore,
        purchasePrice,
        addedToCollectionDate,
        personalNotes,
      });

      console.log("req.user: ", req.user);
      console.log("req.body: ", req.body);

      // Add to user's collection with additional details
      await UserBackpack.create({
        backpack: backpack._id,
        user: req.user.id,
        heartLogo,
        owned: status === "owned",
        wishlist: status === "wishlist",
        condition: status === "owned" ? condition : null,
        seriesCollection,
        onlineStore,
        purchasePrice: purchasePrice || null,
        addedToCollectionDate: addedToCollectionDate || null,
        personalNotes,
      });

      req.flash(
        "success_msg",
        "Backpack successfully added to your collection"
      );
      res.redirect("/backpacks");
    } catch (err) {
      console.error("Error adding backpack:", err);
      req.flash("error_msg", "Error adding backpack to collection");
      res.render("error/500");
    }
  },

  // GET: USER COLLECTION PAGE  ** MVP DONE 3/16 **
  getUsersCollectionPage: async (req, res) => {
    try {
      // Get filter from query params, default to 'all'
      const filter = req.query.filter || "all";

      // Build filter query
      let filterQuery = { user: req.user.id };
      if (filter === "owned") {
        filterQuery.owned = true;
      } else if (filter === "wishlist") {
        filterQuery.wishlist = true;
      }

      const userBackpacks = await UserBackpack.find(filterQuery)
        .populate("backpack")
        .lean();

      // console.log("req.user: ", req.user)
      // console.log("userBackpacks: ", userBackpacks)

      const backpacks = userBackpacks.map((bp) => ({
        _id: bp._id,
        image: bp.backpack.image,
        backpackName: bp.backpack.backpackName,
        purchasePrice: bp.backpack.purchasePrice,
        seriesCollection: bp.backpack.seriesCollection,
        onlineStore: bp.backpack.shopsIfExclusive,
        purchaseDate: bp.backpack.purchaseDate,
        owned: bp.owned,
        wishlist: bp.wishlist,
        inCollection: userBackpacks.some(
          (ub) => ub.backpack.toString() === bp._id.toString()
        ),
      }));

      res.render("backpacks/collection", {
        backpacks,
        isCollection: true,
        currentFilter: filter,
      });
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  },

  // get and display a single backpack (or this is a mapper to backpack base model)
  getSingleBackpackById: async (req, res) => {
    // const backpackId = req.params.id;
    // const backpack = await Backpack.findById(backpackId).lean();

    const backpackSelected = await Backpack.findById(req.params.id).lean();

    // AWS s3 implementation
    // if (backpackSelected.image) {
    //   backpackSelected.imageUrl = await generatePresignedUrl(
    //     backpackSelected.image
    //   );
    // }

    // console.log("Backpack: ", backpack);

    if (!backpackSelected) {
      return res.status(404).send("Backpack not found");
    }

    res.render("backpacks/show", { backpackSelected });
  },

  // GET: EDIT BACKPACK PAGE  ** MVP DONE 3/24 **
  editBackpack: async (req, res) => {
    try {
      // Find the UserBackpack by ID to ensure it belongs to the user
      const userBackpack = await UserBackpack.findOne({
        _id: req.params.id,
        user: req.user.id,
      }).populate("backpack");

      if (!userBackpack) {
        req.flash("error", "Backpack not found in your collection");
        return res.redirect("/backpacks/collection");
      }

      const backpackToEdit = {
        _id: userBackpack.backpack._id,
        name: userBackpack.backpack.name,
        image: userBackpack.backpack.image,
        purchasePrice: userBackpack.backpack.purchasePrice,
        seriesCollection: userBackpack.backpack.seriesCollection,
        onlineStore: userBackpack.backpack.onlineStore,
        purchaseDate: userBackpack.backpack.purchaseDate,
        personalNotes: userBackpack.personalNotes,
        condition: userBackpack.condition,
        owned: userBackpack.owned,
        wishlist: userBackpack.wishlist,
        ...userBackpack.backpack.toObject(),
      };

      console.log("backpackToEdit: ", backpackToEdit);

      res.render("backpacks/edit", {
        backpackToEdit,
        userBackpackId: req.params.id,
      });
    } catch (err) {
      console.error(err);
      req.flash("error", "Error loading edit page");
      res.redirect("/backpacks/collection");
    }
  },

  // GET: UPDATE BACKPACK PAGE  ** MVP DONE 3/24 **
  updateBackpack: async (req, res) => {
    try {
      const userBackpack = await UserBackpack.findOne({
        _id: req.params.id,
        user: req.user.id,
      }).populate("backpack");

      if (!userBackpack) {
        req.flash("error", "Backpack not found in your collection");
        return res.render("error/404");
      }

      // Update both userBackpack and backpack
      // userBackpack.owned = req.body.owned === "true";
      // userBackpack.wishlist = req.body.wishlist === "true";
      userBackpack.condition = req.body.condition;
      userBackpack.purchasePrice = req.body.purchasePrice;
      userBackpack.personalNotes = req.body.personalNotes;
      console.log("userBackpack: ", userBackpack);

      // Additional Fields from Backpack Model
      userBackpack.backpack.name = req.body.name; // not implemented yet
      userBackpack.backpack.seriesCollection = req.body.seriesCollection;
      userBackpack.website = req.body.website;
      userBackpack.customTags = req.body.customTags;
      userBackpack.addedToCollection = req.body.addedToCollection;

      await userBackpack.save();
      // await backpack.save();

      req.flash("success", "Backpack updated successfully");
      res.redirect("/backpacks/collection");
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

  // GET: BACKPACK SEARCH PAGE  ** MVP DONE 3/16 **
  getSearchPage: async (req, res) => {
    try {
      const query = req.query.query;
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;

      // Add debug logging
      // console.log('Search query:', query);

      // If no query, show empty search page
      if (!query || query.trim() === "") {
        return res.render("backpacks/index", {
          backpacks: [],
          isSearchResult: true,
          searchQuery: "",
        });
      }

      // Find backpacks matching the search query
      // **NOTE**: the field names in your query MUST match the field names in your MongoDB document
      const searchQuery = {
        $or: [
          { backpackName: { $regex: query, $options: "i" } },
          { franchise: { $regex: query, $options: "i" } },
          { seriesCollection: { $regex: query, $options: "i" } },
          { otherTags: { $regex: query, $options: "i" } },
        ],
      };

      // Add debug logging
      // console.log('MongoDB query:', JSON.stringify(searchQuery));

      // Get total count for pagination
      const total = await Backpack.countDocuments(searchQuery);

      // Calculate total pages
      const totalPages = Math.ceil(total / limit);

      // Add debug logging
      // console.log('Total results found:', total);
      // console.log('Total pages:', totalPages);

      // Get paginated results
      const backpacks = await Backpack.find(searchQuery)
        .skip(skip)
        .limit(limit)
        .lean();

      // console.log("backpacks: ", backpacks);

      // If no results found
      if (!backpacks || backpacks.length === 0) {
        return res.render("backpacks/index", {
          backpacks: [],
          isSearchResult: true,
          searchQuery: query,
        });
      }

      // Get user's collection to check which backpacks are already in it
      const userBackpacks = await UserBackpack.find({
        user: req.user.id,
      }).lean();

      // console.log("backpacks", backpacks);

      // Add inCollection flag to each backpack
      const backpacksWithCollectionStatus = backpacks.map((bp) => ({
        _id: bp._id,
        image: bp.image,
        backpackName: bp.backpackName,
        purchasePrice: bp.purchasePrice,
        seriesCollection: bp.seriesCollection,
        onlineStore: bp.shopsIfExclusive,
        inCollection: userBackpacks.some(
          (ub) => ub.backpack.toString() === bp._id.toString()
        ),
      }));

      // console.log("backpacksWithCollectionStatus: " + JSON.stringify(backpacksWithCollectionStatus, null, 2));

      // Prepare pagination data
      const pagination = {
        currentPage: page,
        totalPages, // Now totalPages is defined
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        total,
        showing: {
          start: skip + 1,
          end: Math.min(skip + limit, total),
        },
      };

      res.render("backpacks/index", {
        backpacks: backpacksWithCollectionStatus,
        isSearchResult: true,
        searchQuery: query,
        pagination,
      });
    } catch (err) {
      console.error("Error in search:", err);
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
        backpack: backpackId,
      });

      if (existingUserBackpack) {
        const message = encodeURIComponent(
          "This backpack is already in your collection!"
        );
        return res.redirect(
          `/backpacks/search?query=${searchQuery}&page=${page}&success=${message}`
        );
      }

      // Get backpack details for the success message
      const backpack = await Backpack.findById(backpackId).lean();

      // Create new UserBackpack entry
      await UserBackpack.create({
        user: userId,
        backpack: backpackId,
        wishlist: status === "wishlist",
        owned: status === "owned",
        condition: status === "owned" ? condition : null,
      });

      // Redirect back to search results with success message
      const message = encodeURIComponent(
        `${backpack.backpackName} added to your collection!`
      );
      res.redirect(
        `/backpacks/search?query=${searchQuery}&page=${page}&success=${message}`
      );
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
        user: userId,
      });

      if (!userBackpack) {
        req.flash("error_msg", "Backpack not found in your collection");
        return res.redirect("/backpacks");
      }

      req.flash("success_msg", "Backpack removed from your collection");
      res.redirect("/backpacks");
    } catch (err) {
      console.error("Error removing backpack from collection:", err);
      res.render("error/500");
    }
  },
};
