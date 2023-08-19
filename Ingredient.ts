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
