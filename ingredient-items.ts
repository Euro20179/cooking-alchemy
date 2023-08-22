function getModifierFromString(name: "sour" | "spicy" | "sweet" | "boiled" | "cooked"){
    return {
        "sour": Modifier.Sour,
        "sweet": Modifier.Sweet,
        "spicy": Modifier.Spicy,
        "boiled": Modifier.Boiled,
        "cooked": Modifier.Cooked
    }[name]
}

//this is for items that do not have a recipe
let items: { [key: string]: Ingredient | ModifierIngredient } = {
}

for (let item in ingredientsJson) {
    let itemData = ingredientsJson[item as keyof typeof ingredientsJson]
    if(itemData.modifier){

    }
    let ing;
    if(itemData.modifier){
        ing = new ModifierIngredient(getModifierFromString(itemData.modifier), item, itemData.image || null, itemData.css || null)
    }
    else{
        ing = new Ingredient(item, itemData.image || null, itemData.css || null)
    }
    items[item] = ing
}

//we do this after adding to the items object to make sure that all items exist in the items object
for (let item in ingredientsJson) {
    if (!ingredientsJson[item].recipe) continue
    let recipe = []
    for (let required of ingredientsJson[item].recipe || []) {
        recipe.push(items[required])
    }
    items[item].setRecipe(...recipe)
};

(items['boiling water'] as ModifierIngredient).hooks.canModify = function(ing) {
    return this.hasOneIngredient(ing) && this.ingredientDoesNotHaveModifier(ing[0])
};

(items['oven'] as ModifierIngredient).hooks.canModify = function(ing) {
    return this.hasOneIngredient(ing) && this.ingredientDoesNotHaveModifier(ing[0])
};

(items['pepper'] as ModifierIngredient).hooks.canModify = function(ing) {
    return this.hasOneIngredient(ing) && this.ingredientDoesNotHaveModifier(ing[0])
};

items['raspberry water'].hooks.onCreate = function(el) {
    el.addEventListener("contextmenu", e => {
        e.preventDefault()
        alert("You drink some raspberry water")
    })
}

items['garbage'].hooks.onCreate = function(el) {
    alert(`YOu created ${el.getAttribute("data-name")}!!!!`)
}

items['contamination'].hooks.onCreate = function(el) {
    alert("Uh oh all your food was spoiled and has been emptied for you")
    for (let item of playerIngredients) {
        item.getElement().remove()
    }
}

items['nuclear waste'].hooks.onCreate = () => alert("uh oh")

items['nuclear bomb'].hooks.onCreate = () => alert("the cia is watching")

items['north korea'].hooks.onCreate = function() {
    alert("all hail kim jong-un")
    const body = document.getElementById('body') as HTMLBodyElement
    body.style.backgroundImage = "url(https://www.abflags.com/_flags/flags-of-the-world/Korea%2C%20North%20flag/Korea%2C%20North%20flag-XXL-anim.gif)"
}

items['raspberry dough'].hooks.onCreate = function() {
    alert("yummy 😁")
}

items['raspberry cookie'].hooks.onCreate = function() {
    alert("just like grandma used to make♥️")
};

(items['lemon'] as ModifierIngredient).hooks.canModify = function(ing) {
    return this.hasOneIngredient(ing) && this.ingredientDoesNotHaveModifier(ing[0])
};
(items['sugar'] as ModifierIngredient).hooks.canModify = function(ing) {
    return this.hasOneIngredient(ing) && this.ingredientDoesNotHaveModifier(ing[0])
};

items['mud'].hooks.onCreate = () => alert("that's a lot of garbage")

items['garden'].hooks.onCreate = () => alert("You grew your very own garden")

items['alive chicken'].hooks.onCreate = () => alert("you grew your very own chicken!!")

items['tomato'].hooks.onCreate = () => alert("you've discovered a new mutation")
items['pizza'].hooks.onCreate = () => alert("mama mia")
items['spaghetti'].hooks.onCreate = () => alert("you've made a delicious dish of spaghetti!! from garbage to this??")

items['lemonade'].hooks.recipeCheck = function({ water, lemon, sugar }) {
    if (water?.hasModifier(Modifier.Sour) && !lemon && sugar) {
        return true
    }
    if (water?.hasModifier(Modifier.Sweet) && !sugar && lemon) {
        return true
    }
    return 'continue'
}
