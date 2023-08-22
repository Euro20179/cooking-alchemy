let draggedElement: null | HTMLElement
let movedElement: null | HTMLElement
const itemSearch = document.getElementById("item-search") as HTMLInputElement
const ingredientHolder = document.getElementById("ingredient-holder") as HTMLDivElement
const finalIngredientHolder = document.getElementById("final-ingredient-holder") as HTMLDivElement
const alertDiv = document.getElementById("alert-text") as HTMLDivElement
const oven = document.getElementById('oven') as HTMLDivElement
const counter = document.getElementById('count') as HTMLSpanElement

let pageOnFire = false

function endPageFire(){
    pageOnFire = false
    document.body.setAttribute("style", "")
}

function startPageFire(){
    pageOnFire = true

    alert("Oh no the page has caught on fire!!\nGet some water fast!!!")

    document.body.style.background = "url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi0.wp.com%2Fwww.throughourlives.com%2Fwp-content%2Fuploads%2F2021%2F06%2Fa8367730317b31e794253218502c591e.gif%3Ffit%3D390%252C498&f=1&nofb=1&ipt=025b8afb96d00ec75c5b4b7d6b04f6c19feff09932d0e5e37d722f05638869ea&ipo=images')"
}

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
    if (e.key === "/") {
        itemSearch.focus()
        e.preventDefault()
        itemSearch.value = ""
    }
})

const bowl = document.getElementById('bowl') as HTMLDivElement

const craftButton = document.getElementById("craft-button") as HTMLButtonElement
const emptyButton = document.getElementById("empty-button") as HTMLButtonElement

function deviceHoverListener(e: MouseEvent) {
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

let playerIngredients: Ingredient[] = []

for(let item in ingredientsJson){
    if(ingredientsJson[item].starter){
        playerIngredients.push(items[item])
    }
}

playerIngredients.push = new Proxy(playerIngredients.push, {
    apply(target, thisArg, argsList) {
        if (!playerIngredients.includes(argsList[0])) {
            if (argsList[0].creates.length) {
                ingredientHolder.append(argsList[0].getElement())
            }
            else {
                finalIngredientHolder.append(argsList[0].getElement())
            }
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
    let modifiedCraftedItems: Ingredient[] = []

    if (device === oven) usedIngredients.unshift(items['oven'])

    if(usedIngredients[0].name === "water"){
        endPageFire()
    }

    if(usedIngredients[0].name === 'oven' && Math.random() > 0.99){
        startPageFire()
    }

    for (let item of usedIngredients) {
        if (item.creates.length) {
            for (let [_, result] of item.creates) {
                if (result.checkRecipe(usedIngredients) && !craftedItems.includes(result)) {
                    craftedItems.push(result)
                }
            }
        }
        if (item instanceof ModifierIngredient && !craftedItems.length) {
            let modified = item.modifyIngredients(usedIngredients.filter(v => v !== item))
            if (!modified) continue
            items[modified.getDisplayName() as keyof typeof items] = modified as Ingredient & ModifierIngredient
            modifiedCraftedItems.push(modified)
        }
    }
    for (let elem of ingElements) {
        elem.remove()
    }

    let totalItems = craftedItems.concat(modifiedCraftedItems)

    console.log(totalItems)

    if (!totalItems.length) {
        totalItems.push(items['garbage'])
    }
    let itemCanNotify = totalItems.length < 2
    if (totalItems.length >= 2) {
        alert("You have created multiple ingredients")
    }
    for (let item of totalItems) {
        playerIngredients.push(item)
        item.create(itemCanNotify)
    }
    setCounter(`${ingredientHolder.querySelectorAll('.ingredient').length}/${Ingredient.count + ModifierIngredient.count} ingredients`)
})
emptyButton.addEventListener("click", e => {
    bowl.replaceChildren("")
    oven.replaceChildren("")
})
setCounter(`${ingredientHolder.querySelectorAll('.ingredient').length}/${Ingredient.count + ModifierIngredient.count} ingredients`)
