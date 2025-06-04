# TODO List to get to MVP

### Dashboard
- [ ] backpack images don't show up in Recently Added

### Find Backpacks Page (/backpacks/search)
- [ ] images don't show up in search results
- [ ] clicking on the image should disaply the image in a modal

### Backpack Details Page (/backpacks/show/:id)
- [ ] images don't show up in details page
- [ ] verify the data shown is accurate and all is being displayed
- [ ] if the backpack is already in the users collection then dont display the "add to collection" button, instead make it a "remove from collection" button
- [ ] layoyt will need to be updated, its too vertical

### My Collection Page (/backpacks/collection)
- [ ] images don't show up in collection page
- [ ] the page that loads after clicking on the backpacks name is missing data, the image doesn't show up, and the layout will most likely need to be updated
- [ ] delete button breaks, loads a `Cannot DELETE /backpacks/:id` error 
- [ ] when i click on the edit button, the edit page loads as expected, then when i click back in the browser, the backpack images that weren't showing before now show up (same with the /dashboard page)

### Edit Backpack Page (/backpacks/edit/:id)
- [ ] can't save changes, the page loads "Server Error We're sorry, something went wrong, Go to Dashboard" error message
- [ ] double check all the backpack properties are displayed on the page and can be edited
- [ ] confirm saving changes DO NOT update the the backpack in the general database, only the user's collection
- [ ] dont diplay the "add to collection" button, instead make it a "remove from collection" button
- [ ] cancel button doesn't work, get an error: `Cannot GET /backpacks` localhost:3000/backpacks <- needs to be /backpacks/collection

### Database
- [ ] the names need to be cleaned of special characters and formatted consistently
- [ ] the metadata needs to be cleaned of special characters and formatted consistently
- [ ] backpack images need to be downloaded and stored in the database

#### Roadmap