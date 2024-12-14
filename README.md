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
#### - UI:
- [ ] Clean up backpack pages
- [ ] Clean up error pages <--??
- [ ] Clean up layout pages
- [ ] Clean up partial pages
- [ ] Clean up dashboard page
- [ ] Clean up login page
- [ ] Date/Time Added is not saving correct
---

#### NOTES FOR NEXT SESSION
- [ ] Searching the loungeflies database page works but layout needs to be cleaned up


#### AI TODO NOTES
- [ ] format error pages
- [ ] button on search page functionality
- [ ] dashboard display total count and collection is empty




fix imgae cropping on the Details, Search results, My Collection, Show pages

when clicking on the BP image on the Details, Search results, My Collection, Show pages a popup will open and show the BP image uncropped!

add a show button to each item in My Collection page, and then move the functionality that's currently on the Name to that button. (ie: takes user to show page)




~~series, store, value and maybe other fields are required before submitting, make uncessary properties not required (Name & ... required)~~

~~when manually adding a BP Owned/WishList, Condition, Personal Notes~~

~~when adding BP from search page; Owned/WishList, Condition section not on form when submitting form (Personal Notes will only be avaiable in the manual add and edit pages)~~

~~the edit form doesn't have options for Series or Collection, Store, Owned/WishLish checkbox, Personal Notes, Purchase Date~~ 

~~add a toggle on my collection page to switch between Owned and WishList backpacks and all backpacks~~

~~after clicking add to collection from the search page, i go back to the search page but the results are gone. can this be changed so they are still there? ( the BACK button currently does this exact thing i want to happen above)~~

~~add pagenation to search results~~