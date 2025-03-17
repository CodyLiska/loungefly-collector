# LOUNGEFLY COLLECTOR APP

*THIS REPO IS USED FOR RENDER HOSTING AND IS MAIN REPO FOR PROJECT*

[<< check it out >>](https://loungefly.onrender.com/)

### TUTORIALS
- Tutorial Video - https://www.youtube.com/watch?v=SBvmnHTQIPY
#### Other Resources
- https://materializecss.com/getting-started.html
- https://www.npmjs.com/
- https://cdnjs.com/
--- 

### TODO LIST
#### - APP.JS:
- [ ] Clean up and veryify secure
#### - CONTROLLERS:
- [x] Create controller files
- [ ] check the users backpack array to see if backpack exists before adding (addUserCreatedBackpack && addBackpackFromDatabase)
- [ ] figure out if update is functionality that is needed, bc rn the users collection array hold a reference to the backpack in the database and not a different object
#### - AUTH:
- [x] Google oauth2 (Currently Using)
- [ ] Add login with email and password
#### - ROUTES:
- [ ] 
#### - HANDLEBARS:
- [ ] move js scripts at bottom of ALL pages to a js file
#### - UI:
- [x] Clean up backpack pages
- [ ] Clean up error pages <--??
- [x] Clean up layout pages
- [x] Clean up partial pages
- [x] Clean up login page
- [x] series, store, value and maybe other fields are required before submitting, make uncessary properties not required (Name & ... required)
- [x] when manually adding a BP Owned/WishList, Condition, Personal Notes
- [x] when adding BP from search page; Owned/WishList, Condition section not on form when submitting form (Personal Notes will only be avaiable in the manual add and edit pages)
- [x] the edit form doesn't have options for Series or Collection, Store, Owned/WishLish checkbox, Personal Notes, Purchase Date
- [x] add a toggle on my collection page to switch between Owned and WishList backpacks and all backpacks
- [x] after clicking add to collection from the search page, i go back to the search page but the results are gone. can this be changed so they are still there? ( the BACK button currently does this exact thing i want to happen above)
- [x] add pagenation to search results
- [x] Searching the loungeflies database page works but layout needs to be cleaned up
- [ ] format error pages
- [ ] button on search page functionality
- [ ] dashboard display total count and collection is empty
- [ ] Date/Time Added is not saving correct
- [ ] fix imgae cropping on the Details, Search results, My Collection, Show pages
- [ ] when clicking on the BP image on the Details, Search results, My Collection, Show pages a popup will open and show the BP image uncropped!
- [ ] add a show button to each item in My Collection page, and then move the functionality that's currently on the Name to that button. (ie: takes user to show page)
- [ ] allow backpack name to be changed on the Edit Page ONLY
  ## DASHBOARD
  - [ ] make 'Total Backpacks', 'Owned', 'Wishlist' boxes clickable and take the user to the approperate page
---

#### NOTES FOR NEXT SESSION
- add to collection broken
  - button in each backpack in search results
  - circle with + in bottom right corner of screen
- edit backpack broken

- UPDATE ALL FORMS TO HAVE ALL PROPERTIES OF BOTH BACKPACK MODELS
