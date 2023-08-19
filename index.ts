let draggedElement: null | HTMLElement
let movedElement: null | HTMLElement

const itemSearch = document.getElementById("item-search") as HTMLInputElement

const ingredientHolder = document.getElementById("ingredient-holder") as HTMLDivElement

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
    Sweet
}

const ModifierNames = {
    [Modifier.Spicy]: "spicy",
    [Modifier.Sour]: "sour",
    [Modifier.Sweet]: "sweet"
}

type IngredientHooks = {
    onCreate?: (el: HTMLDivElement) => any,
    recipeCheck?: (ingList: { [name: string]: Ingredient | ModifierIngredient }) => boolean | "continue"
}

class Ingredient {
    pure: boolean = true
    name: string
    image: string | null
    color: string
    textColor: string | null
    #element: HTMLDivElement | undefined
    recipe: Ingredient[] | null
    creates: [Ingredient[], Ingredient][]
    modifiers: Modifier[]
    hooks?: IngredientHooks

    constructor(name: string, image: string | null, color: string, textColor?: string | null, hooks?: IngredientHooks) {
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
        if(this.hooks?.onCreate)
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
        element.style.backgroundColor = this.color
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
    constructor(modifier: Modifier, name: string, image: string | null, color: string, textColor: string | null, hooks?: ModifierIngredientHooks) {
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

const rso = new Ingredient("raspberry seed oil", null, "red")
const water = new Ingredient("water", null, "blue", "white")
const pepper = new ModifierIngredient(Modifier.Spicy, "pepper", null, 'black', "white", {
    canModify: function(ing) {
        if (ing.length !== 1) return false
        let i = ing[0]
        if (i.modifiers.includes(this.modifier)) return false
        return true
    }
})
const flour = new Ingredient("flour", null, "white", "black")

const dough = new Ingredient("dough", null, "tan", "black")
dough.setRecipe(water, flour)

const rw = new Ingredient("raspberry water", null, "red", "blue", {
    onCreate: el => {
        el.addEventListener("contextmenu", e => {
            e.preventDefault()
            alert("You drink some raspberry water")
        })
    }
})
rw.setRecipe(rso, water)

const garbage = new Ingredient("garbage", null, "green", "white", {
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
        playerIngredients = [contamination]
    }
})

contamination.setRecipe(garbage, water)

const rd = new Ingredient("raspberry dough", null, "white", "red", {
    onCreate: el => {
        alert("yummy 😁")
    }
})

rd.setRecipe(rw, flour)

const rc = new Ingredient("raspberry cookie", null, "brown", "red", {
    onCreate: el => {
        alert("just like grandma used to make ❤️")
    }
})

rc.setRecipe(rd)

const lemon = new ModifierIngredient(Modifier.Sour, "lemon", null, "yellow", "black", {
    canModify: function(ing) {
        if (ing.length !== 1) return false
        let i = ing[0]
        if (i.modifiers.includes(this.modifier)) return false
        return true
    }
})

const sugar = new ModifierIngredient(Modifier.Sweet, "sugar", null, "white", "black", {
    canModify: function(ing) {
        if (ing.length !== 1) return false
        let i = ing[0]
        if (i.modifiers.includes(this.modifier)) return false
        return true
    }
})

const soda = new Ingredient("soda", null, "navajowhite", "black")
soda.setRecipe(sugar, water)

const mud = new Ingredient("mud", null, "#462100", "white", {
    onCreate: el => {
        alert("that's a lot of garbage")
    }
})

mud.setRecipe(garbage, garbage)

let lemonade = new Ingredient("lemonade", null, "yellow", "black", {
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
}

const ingredients = []

let playerIngredients = [rso, flour, pepper, water, lemon, sugar]

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
    let ingElements = bowl.querySelectorAll(".ingredient") as NodeListOf<HTMLDivElement>
    let usedIngredients = Array.from(ingElements, v => items[v.getAttribute("data-name") as keyof typeof items])
    let craftedItems: Ingredient[] = []

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


})
emptyButton.addEventListener("click", e => {
    bowl.replaceChildren("")
})
