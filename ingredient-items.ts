const rso = new Ingredient("raspberry seed oil", "https://cdn-icons-png.flaticon.com/128/6866/6866609.png", null, "white")

const water = new Ingredient("water", "https://cdn-icons-png.flaticon.com/128/3105/3105807.png", null, "white")

const fire = new Ingredient("fire", "https://cdn-icons-png.flaticon.com/128/426/426833.png", null, "white")

const bw = new ModifierIngredient(Modifier.Boiled, "boiling water", "https://cdn-icons-png.flaticon.com/128/3387/3387974.png", null, "orange", {
    canModify: function(ing){
        return this.hasOneIngredient(ing) && this.ingredientDoesNotHaveModifier(ing[0])
    }
})

const ov = new ModifierIngredient(Modifier.Cooked, "oven", null, null, null, {
    canModify: function(ing){
        return this.hasOneIngredient(ing) && this.ingredientDoesNotHaveModifier(ing[0])
    }
})
bw.setRecipe(fire, water)
const pepper = new ModifierIngredient(Modifier.Spicy, "pepper", "https://cdn-icons-png.flaticon.com/128/3003/3003814.png", null, "white", {
    canModify: function (ing) {
        return this.hasOneIngredient(ing) && this.ingredientDoesNotHaveModifier(ing[0])
    }
})
const flour = new Ingredient("flour", "https://cdn-icons-png.flaticon.com/128/10738/10738997.png", null, "white")
const egg = new Ingredient("egg", "https://cdn-icons-png.flaticon.com/128/487/487310.png", null, "white")
const dough = new Ingredient("dough", "https://cdn-icons-png.flaticon.com/128/6717/6717362.png", null, "white")
dough.setRecipe(water, flour)
const pasta = new Ingredient("pasta", "https://cdn-icons-png.flaticon.com/128/8880/8880560.png", null, "white")
pasta.setRecipe(egg, dough, bw)

const rw = new Ingredient("raspberry water", "https://cdn-icons-png.flaticon.com/128/6106/6106801.png", null, "blue", {
    onCreate: el => {
        el.addEventListener("contextmenu", e => {
            e.preventDefault()
            alert("You drink some raspberry water")
        })
    }
})
rw.setRecipe(rso, water)

const garbage = new Ingredient("garbage", "https://cdn-icons-png.flaticon.com/128/9306/9306132.png", null, "green", {
    onCreate: el => {
        alert(`You created ${el.getAttribute("data-name")}!!!`)
    }
})

const contamination = new Ingredient("contamination", null, "black", "red", {
    onCreate: el => {
        alert("Uh oh all your food was spoiled and has been emptied for you")
        for (let item of playerIngredients) {
            item.getElement().remove()
        }

    }
})

contamination.setRecipe(garbage, water)
const nw = new Ingredient("nuclear waste", "https://cdn-icons-png.flaticon.com/128/6002/6002980.png", null, "yellow", {
    onCreate(el) {
        alert("uh oh")
    },
})
nw.setRecipe(contamination)

const nb = new Ingredient("nuclear bomb", "https://cdn-icons-png.flaticon.com/128/1537/1537032.png", null, "yellow", {
    onCreate(el) {
        alert("the cia is watching")
    },
})
nb.setRecipe(nw, nw)

const nk = new Ingredient("north korea", "https://icons.iconarchive.com/icons/wikipedia/flags/128/KP-North-Korea-Flag-icon.png", null, "white", {
    onCreate(el) {
        alert("all hail kim jong-un")
        const body = document.getElementById('body') as HTMLBodyElement
        body.style.backgroundImage = "url(https://www.abflags.com/_flags/flags-of-the-world/Korea%2C%20North%20flag/Korea%2C%20North%20flag-XXL-anim.gif)"
    },
})
nk.setRecipe(nb, nb)

const rd = new Ingredient("raspberry dough", "https://cdn-icons-png.flaticon.com/128/9273/9273839.png", null, "red", {
    onCreate: el => {
        alert("yummy 😁")
    }
})

rd.setRecipe(rw, flour)

const rc = new Ingredient("raspberry cookie", "https://cdn-icons-png.flaticon.com/128/2001/2001244.png", null, "red", {
    onCreate: el => {
        alert("just like grandma used to make ❤️")
    }
})

rc.setRecipe(ov, rd)

const lemon = new ModifierIngredient(Modifier.Sour, "lemon", "https://cdn-icons-png.flaticon.com/128/7484/7484115.png", null, "white", {
    canModify: function (ing) {
        return this.hasOneIngredient(ing) && this.ingredientDoesNotHaveModifier(ing[0])
    }
})

const sugar = new ModifierIngredient(Modifier.Sweet, "sugar", "https://cdn-icons-png.flaticon.com/128/5029/5029280.png", null, "white", {
    canModify: function (ing) {
        return this.hasOneIngredient(ing) && this.ingredientDoesNotHaveModifier(ing[0])
    }
})

const soda = new Ingredient("soda", "https://cdn-icons-png.flaticon.com/128/9557/9557668.png", null, "white")
soda.setRecipe(sugar, water)

const mud = new Ingredient("mud", 'https://cdn-icons-png.flaticon.com/128/7756/7756706.png', null, "white", {
    onCreate: el => {
        alert("that's a lot of garbage")
    }
})

mud.setRecipe(garbage, garbage)
//garden stuff
const dirt = new Ingredient("dirt", "https://cdn-icons-png.flaticon.com/128/7922/7922824.png", null, "white")
dirt.setRecipe(mud, mud)
const grass = new Ingredient("grass", "https://cdn-icons-png.flaticon.com/128/4683/4683517.png", null, "white")
grass.setRecipe(dirt, water)
const garden = new Ingredient("garden", "https://cdn-icons-png.flaticon.com/128/1518/1518965.png", null, "white", {
    onCreate(el) {
        alert("you grew your very own garden")
    },
})
garden.setRecipe(grass, water, dirt)
const seeds = new Ingredient("seeds", "https://cdn-icons-png.flaticon.com/128/1576/1576984.png", null, "white")
seeds.setRecipe(rso, garden, water)
const aliveChicken = new Ingredient("alive chicken", "https://cdn-icons-png.flaticon.com/128/2002/2002616.png", null, "white", {
    onCreate(el) {
        alert("you grew your very own chicken!!")
    },
})
aliveChicken.setRecipe(garden, egg)
const chicken = new Ingredient("chicken", "https://cdn-icons-png.flaticon.com/128/1895/1895698.png", null, "black")
chicken.setRecipe(ov, chicken)
const raspberry = new Ingredient("raspberry", "https://cdn-icons-png.flaticon.com/128/1542/1542487.png", null, "white")
raspberry.setRecipe(rso, seeds, garden)
const tomato = new Ingredient("tomato", "https://cdn-icons-png.flaticon.com/128/1202/1202125.png", null, "white", {
    onCreate(el) {
        alert("you've discovered a new mutation")
    },
})
const pizza = new Ingredient("pizza", "https://cdn-icons-png.flaticon.com/128/2438/2438412.png", null, "white", {
    onCreate(el) {
        alert("mama mia")
    },
})
pizza.setRecipe(tomato, dough, ov)
tomato.setRecipe(raspberry, garden, seeds, water)
const spaghetti = new Ingredient("spaghetti", "https://cdn-icons-png.flaticon.com/128/3480/3480618.png", null, "white", {
    onCreate(el) {
        alert("you've made a delicious dish of spaghetti!! from garbage to this??")
    },
})
spaghetti.setRecipe(tomato, pasta)
//


let lemonade = new Ingredient("lemonade", "https://cdn-icons-png.flaticon.com/128/753/753929.png", null, "black", {
    recipeCheck: ({ water, lemon, sugar }) => {
        if (water?.hasModifier(Modifier.Sour) && !lemon && sugar) {
            return true
        }
        if (water?.hasModifier(Modifier.Sweet) && !sugar && lemon) {
            return true
        }
        return 'continue'
    }
})
lemonade.setRecipe(water, lemon, sugar)

let cookieDough = new Ingredient("cookie dough", 'https://cdn-icons-png.flaticon.com/128/4126/4126009.png', "tan", "black")
cookieDough.setRecipe(dough, sugar)

let cookie = new Ingredient("cookie", 'https://cdn-icons-png.flaticon.com/128/541/541732.png', "tan", "black")
cookie.setRecipe(ov, cookieDough)

let salt = new Ingredient("salt", "https://cdn-icons-png.flaticon.com/128/736/736882.png", "white", "black")

//this is for items that do not have a recipe
let items = {
    salt,
    "raspberry seed oil": rso,
    pepper: pepper,
    garbage,
    water,
    lemon: lemon,
    sugar,
    flour,
    fire,
    egg
}
