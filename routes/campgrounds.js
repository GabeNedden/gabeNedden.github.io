var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")
var middleware = require("../middleware");

//Index Page
router.get("/", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

//NEW FORM
router.get ("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});
//POST CREATE NEW
router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
	newCampground = {name: name, image: image, description: desc, author: author};
	Campground.create(newCampground, function(err){
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//UPDATE form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
    res.render("campgrounds/edit", {campground: foundCampground});
         });
     });

//UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY Campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/");
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;