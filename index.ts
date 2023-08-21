let draggedElement: null | HTMLElement
let movedElement: null | HTMLElement
const itemSearch = document.getElementById("item-search") as HTMLInputElement
const ingredientHolder = document.getElementById("ingredient-holder") as HTMLDivElement
const finalIngredientHolder = document.getElementById("final-ingredient-holder") as HTMLDivElement
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

document.addEventListener("keydown", e => {
    if(e.key === "/"){
        itemSearch.focus()
        e.preventDefault()
        itemSearch.value = ""
    }
})

const bowl = document.getElementById('bowl') as HTMLDivElement

const craftButton = document.getElementById("craft-button") as HTMLButtonElement
const emptyButton = document.getElementById("empty-button") as HTMLButtonElement

function deviceHoverListener(e: MouseEvent){
    if (!draggedElement) { return }
    let clone = draggedElement?.cloneNode(true) as HTMLDivElement
    clone.addEventListener("click", e => {
        clone.remove()
    });
    (e.target as HTMLDivElement).appendChild(clone)
    draggedElement = null
}


bowl?.addEventListener("mouseover", deviceHoverListener)
oven?.addEventListener("mouseover", deviceHoverListener)

const ingredients = []

let playerIngredients = [rso, flour, pepper, water, lemon, sugar, egg, fire]

playerIngredients.push = new Proxy(playerIngredients.push, {
    apply(target, thisArg, argsList) {
        if (!playerIngredients.includes(argsList[0])) {
            if(argsList[0].creates.length){
                ingredientHolder.append(argsList[0].getElement())
            }
            else {
                finalIngredientHolder.append(argsList[0].getElement())
            }
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

