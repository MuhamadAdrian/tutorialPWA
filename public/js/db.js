//oflinedata
db.enablePersistence()
.catch(err => {
    if (err.code == 'failed-precondition') {
        console.log('persistence failed')
    }
    else if(err.code == 'unimplemented'){
        console.log('persistence is not available')
    }
})

//realtimeListener
db.collection('recipes').onSnapshot((snapshot) => {
    //console.log(snapshot.docChanges())
    snapshot.docChanges().forEach(change => {
        //console.log(change, change.doc.data(), change.doc.id)
        if (change.type === "added") {
            //add the data and show them intothe web page
            renderRecipe(change.doc.data(), change.doc.id)
        }
        if (change.type === "removed") {
            //remove the data from the web page
            removeRecipe(change.doc.id)
        }
    })
})

//add new recipes
const form = document.querySelector('form');
form.addEventListener('submit', event => {
    event.preventDefault();

    const recipe = {
        title: form.title.value,
        ingredients: form.ingredients.value
    };

    db.collection('recipes').add(recipe)
    .catch(err => {console.log(err)})

    form.title.value = '';
    form.ingredients.value = ''
})

//delete a Recipe
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', event => {
    if (event.target.tagName === 'I') {
        const id = event.target.getAttribute('data-id');
        db.collection('recipes').doc(id).delete()
    }
})