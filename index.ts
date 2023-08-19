let draggedElement: null | HTMLElement
let movedElement: null | HTMLElement
const itemSearch = document.getElementById("item-search") as HTMLInputElement
const ingredientHolder = document.getElementById("ingredient-holder") as HTMLDivElement
const alertDiv = document.getElementById("alert-text") as HTMLDivElement
const oven = document.getElementById('oven') as HTMLDivElement
const counter = document.getElementById('count') as HTMLSpanElement



function alert(message: string) {
    const span = document.createElement('span')
    span.setAttribute("class", "success-text")
    span.innerText = message
    span.style.animation = "fadeIn 3.0s"
    alertDiv.appendChild(span)
}
function setCounter(count: string) {
    counter.innerText = count
}

itemSearch.addEventListener("input", e => {
    let regex = /./
    if (itemSearch.value.startsWith("!")) {
        regex = new RegExp(itemSearch.value.slice(1))
    }
    else {
        regex = new RegExp(itemSearch.value)
    }
    ingredientHolder.querySelectorAll(".ingredient").forEach(elem => {
        let name = elem.getAttribute("data-name") as string
        if (itemSearch.value.startsWith("!")) {
            if (!name.match(regex)) {
                elem.classList.remove("hidden")
            }
            else {
                elem.classList.add("hidden")
            }
        }
        else {
            if (!name.match(regex)) {
                elem.classList.add("hidden")
            }
            else {
                elem.classList.remove("hidden")
            }
        }
    })
})

const bowl = document.getElementById('bowl') as HTMLDivElement

const craftButton = document.getElementById("craft-button") as HTMLButtonElement
const emptyButton = document.getElementById("empty-button") as HTMLButtonElement

type IngredientRecipe = [Ingredient, Ingredient] | null

enum Modifier {
    Spicy,
    Sour,
    Sweet,
    Boiled,
    Cooked,
}

const ModifierNames = {
    [Modifier.Spicy]: "spicy",
    [Modifier.Sour]: "sour",
    [Modifier.Sweet]: "sweet",
    [Modifier.Boiled]: "boiled",
    [Modifier.Cooked]: "cooked"
}

type IngredientHooks = {
    onCreate?: (el: HTMLDivElement) => any,
    recipeCheck?: (ingList: { [name: string]: Ingredient | ModifierIngredient }) => boolean | "continue"
}

class Ingredient {
    pure: boolean = true
    name: string
    image: string | null
    color: string | null
    textColor: string | null
    #element: HTMLDivElement | undefined
    recipe: Ingredient[] | null
    creates: [Ingredient[], Ingredient][]
    modifiers: Modifier[]
    hooks?: IngredientHooks
    static count = 0

    constructor(name: string, image: string | null, color: string | null, textColor?: string | null, hooks?: IngredientHooks) {
        Ingredient.count++
        this.image = image
        this.name = name
        this.color = color
        this.textColor = textColor ?? null
        this.hooks = hooks
        this.creates = []
        this.recipe = null
        this.modifiers = []
    }

    copyWithModifier(modifier: Modifier) {
        let ing = new Ingredient(this.name, this.image, this.color, this.textColor, this.hooks)
        ing.modifiers = [...this.modifiers] //make a copy of modifiers otherwise when one modifier list is modified the other will be as well
        ing.modifiers.push(modifier)
        return ing
    }

    setRecipe(...items: Ingredient[]) {
        this.recipe = items
        for (let item of items) {
            item.creates.push([items, this])
        }
    }

    checkRecipe(ingList: Ingredient[]) {
        if (this.hooks?.recipeCheck) {
            let res = this.hooks.recipeCheck(Object.fromEntries(ingList.map(v => [v.name, v])))
            if (res !== 'continue')
                return res
        }
        if (this.pure) {
            for (let ing of ingList) {
                if (ing.modifiers.length) return false
            }
        }
        if (this.recipe?.length !== ingList.length) {
            return false
        }
        if (ingList.every(v => this.recipe?.includes(v)) && this.recipe?.every(v => ingList.includes(v))) {
            return true
        }
    }

    create() {
        let dispName = this.getDisplayName()
        if (this.hooks?.onCreate)
            this.hooks.onCreate(this.getElement())
        else alert(`You have crafted ${dispName}`)
        if (!items[dispName as keyof typeof items]) {
            items[dispName as keyof typeof items] = this as any
        }
    }

    getDisplayName() {
        let displayName = ""
        for (let mod of this.modifiers) {
            displayName += ModifierNames[mod] + " "
        }
        displayName += ` ${this.name}`
        return displayName.trim()
    }

    getElement() {
        if (this.#element) {
            return this.#element
        }
        let element = document.createElement("div")
        element.classList.add("ingredient")
        element.setAttribute("data-name", this.getDisplayName())
        if (this.recipe?.length) {
            let recipieElement = document.createElement("span")
            element.append(recipieElement)
            recipieElement.classList.add("recipie")
            recipieElement.innerText = this.recipe?.map(v => v.name).join(" + ") ?? ""
        }
        if (this.image) {
            element.style.backgroundImage = `url(${this.image})`
        }
        if (this.textColor) {
            element.style.color = this.textColor
        }
        element.style.backgroundColor = this.color ?? ""
        element.draggable = true
        element.addEventListener("dragstart", e => {
            draggedElement = element
        })
        element.addEventListener("dragend", e => {
            setTimeout(() => {
                draggedElement = null
            }, 300)
        })
        element.setAttribute("data-name", this.getDisplayName())


        element.innerHTML = this.getDisplayName()

        this.#element = element
        return element
    }

    hasModifier(modifier: Modifier) {
        return this.modifiers.includes(modifier)
    }
}

type ModifierIngredientHooks = IngredientHooks & {
    canModify?: (this: ModifierIngredient, ing: Ingredient[]) => boolean
}

class ModifierIngredient extends Ingredient {
    modifier: Modifier
    hooks?: ModifierIngredientHooks
    static count = 0
    constructor(modifier: Modifier, name: string, image: string | null, color: string | null, textColor: string | null, hooks?: ModifierIngredientHooks) {
        ModifierIngredient.count++
        super(name, image, color, textColor, hooks)
        this.modifier = modifier
        this.hooks = hooks
    }
    modifyIngredients(ing: Ingredient[]) {
        if (this.hooks?.canModify) {
            if (!this.hooks.canModify.bind(this)(ing))
                return false
        }
        let copy = ing[0].copyWithModifier(this.modifier)
        copy.setRecipe(this, ...ing)
        return copy
    }
}



bowl?.addEventListener("mouseover", e => {
    if (!draggedElement) { return }
    let clone = draggedElement?.cloneNode(true) as HTMLDivElement
    clone.addEventListener("click", e => {
        clone.remove()
    })
    bowl.appendChild(clone)
    draggedElement = null
})

oven?.addEventListener("mouseover", e => {
    if (!draggedElement) { return }
    let clone = draggedElement?.cloneNode(true) as HTMLDivElement
    clone.addEventListener("click", e => {
        clone.remove()
    })
    oven.appendChild(clone)
    draggedElement = null
})

const rso = new Ingredient("raspberry seed oil", "https://cdn-icons-png.flaticon.com/128/6866/6866609.png", null, "white")
const water = new Ingredient("water", "https://cdn-icons-png.flaticon.com/128/3105/3105807.png", null, "white")
const fire = new Ingredient("fire", "https://cdn-icons-png.flaticon.com/128/426/426833.png", null, "white")
const bw = new ModifierIngredient(Modifier.Boiled, "boiling water", "https://cdn-icons-png.flaticon.com/128/3387/3387974.png", null, "orange")
const ov = new ModifierIngredient(Modifier.Cooked, "oven", null, null, null)
bw.setRecipe(fire, water)
const pepper = new ModifierIngredient(Modifier.Spicy, "pepper", "https://cdn-icons-png.flaticon.com/128/3003/3003814.png", null, "white", {
    canModify: function (ing) {
        if (ing.length !== 1) return false
        let i = ing[0]
        if (i.modifiers.includes(this.modifier)) return false
        return true
    }
})
const flour = new Ingredient("flour", "https://cdn-icons-png.flaticon.com/128/10738/10738997.png", null, "black")
const egg = new Ingredient("egg", "https://cdn-icons-png.flaticon.com/128/487/487310.png", null, "black")
const dough = new Ingredient("dough", "https://cdn-icons-png.flaticon.com/128/6717/6717362.png", null, "black")
dough.setRecipe(water, flour)
const pasta = new Ingredient("pasta", "https://cdn-icons-png.flaticon.com/128/8880/8880560.png", null, "black")
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

const nk = new Ingredient("north korea", "https://icons.iconarchive.com/icons/wikipedia/flags/128/KP-North-Korea-Flag-icon.png", null, "black", {
    onCreate(el) {
        alert("all hail kim jong-un")
        const body = document.getElementById('body') as HTMLBodyElement
        body.style.backgroundImage = "url(https://www.abflags.com/_flags/flags-of-the-world/Korea%2C%20North%20flag/Korea%2C%20North%20flag-XXL-anim.gif)"
    },
})
nk.setRecipe(nb, nb)

const rd = new Ingredient("raspberry dough", null, "white", "red", {
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

rc.setRecipe(rd)

const lemon = new ModifierIngredient(Modifier.Sour, "lemon", "https://cdn-icons-png.flaticon.com/128/7484/7484115.png", null, "black", {
    canModify: function (ing) {
        if (ing.length !== 1) return false
        let i = ing[0]
        if (i.modifiers.includes(this.modifier)) return false
        return true
    }
})

const sugar = new ModifierIngredient(Modifier.Sweet, "sugar", "https://cdn-icons-png.flaticon.com/128/5029/5029280.png", null, "white", {
    canModify: function (ing) {
        if (ing.length !== 1) return false
        let i = ing[0]
        if (i.modifiers.includes(this.modifier)) return false
        return true
    }
})

const soda = new Ingredient("soda", "https://cdn-icons-png.flaticon.com/128/9557/9557668.png", null, "black")
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
const seeds = new Ingredient("seeds", "https://cdn-icons-png.flaticon.com/128/1576/1576984.png", null, "black")
seeds.setRecipe(rso, garden, water)
const raspberry = new Ingredient("raspberry", "https://cdn-icons-png.flaticon.com/128/1542/1542487.png", null, "white")
raspberry.setRecipe(rso, seeds, garden)
const tomato = new Ingredient("tomato", "https://cdn-icons-png.flaticon.com/128/1202/1202125.png", null, "black", {
    onCreate(el) {
        alert("you've discovered a new mutation")
    },
})
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



let items = {
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

const ingredients = []

let playerIngredients = [rso, flour, pepper, water, lemon, sugar, egg, fire]

playerIngredients.push = new Proxy(playerIngredients.push, {
    apply(target, thisArg, argsList) {
        if (!playerIngredients.includes(argsList[0])) {
            ingredientHolder.append(argsList[0].getElement())
            argsList[0].create()
        }
        return target.bind(thisArg)(argsList[0])
    }
})

for (let ing of playerIngredients) {
    ingredientHolder.append(ing.getElement())
}

craftButton.addEventListener("click", e => {
    let device
    let ingElements = bowl.querySelectorAll(".ingredient") as NodeListOf<HTMLDivElement>
    if (ingElements.length < 1) {
        ingElements = oven.querySelectorAll(".ingredient")
        device = oven
    } else device = bowl
    let usedIngredients = Array.from(ingElements, v => items[v.getAttribute("data-name") as keyof typeof items])
    console.log(usedIngredients)
    let craftedItems: Ingredient[] = []
    if (device === oven) usedIngredients.unshift(ov)

    for (let item of usedIngredients) {
        if (item instanceof ModifierIngredient) {
            let modified = item.modifyIngredients(usedIngredients.filter(v => v !== item))
            if (!modified) continue
            items[modified.getDisplayName() as keyof typeof items] = modified as Ingredient & ModifierIngredient
            craftedItems.push(modified)
        }
        if (!item.creates.length) continue
        for (let [_, result] of item.creates) {
            if (result.checkRecipe(usedIngredients)) {
                craftedItems.push(result)
            }
        }
    }
    for (let elem of ingElements) {
        elem.remove()
    }
    if (!craftedItems.length) {
        playerIngredients.push(items['garbage'])
    }
    for (let item of craftedItems) {
        playerIngredients.push(item)
    }
    setCounter(`${ingredientHolder.querySelectorAll('.ingredient').length}/${Ingredient.count + ModifierIngredient.count} ingredients`)
})
emptyButton.addEventListener("click", e => {
    bowl.replaceChildren("")
    oven.replaceChildren("")
})
setCounter(`${ingredientHolder.querySelectorAll('.ingredient').length}/${Ingredient.count + ModifierIngredient.count} ingredients`)

