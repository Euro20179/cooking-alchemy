//THIS FILE SHOULD REMAIN VALID JSON INCASE OF NECESSITIY TO CONVERT TO ACTUAL JSON

type IngredientJsonSchema = {
    modifier?: "boiled" | "cooked" | "spicy" | "sour" | "sweet"
    image?: string,
    css?: {
        [key: string]: string
    },
    starter?: boolean,
    recipe?: string[]
}
const ingredientsJson: {[key: string]: IngredientJsonSchema} = {
    "raspberry seed oil": {
        "image": "https://cdn-icons-png.flaticon.com/128/6866/6866609.png",
        "css": {
            "color": "white"
        },
        "starter": true
    },
    "water": {
        "image": "https://cdn-icons-png.flaticon.com/128/3105/3105807.png",
        "css": {
            "color": "white"
        },
        "starter": true
    },
    "fire": {
        "image": "https://cdn-icons-png.flaticon.com/128/426/426833.png",
        "css": {
            "color": "white"
        },
        "starter": true
    },
    "boiling water": {
        "modifier": "boiled",
        "image": "https://cdn-icons-png.flaticon.com/128/3387/3387974.png",
        "css": {
            "color": "orange"
        },
        "recipe": ["fire", "water"]
    },
    "oven": {
        "modifier": "cooked"
    },
    "pepper": {
        "modifier": "spicy",
        "image": "https://cdn-icons-png.flaticon.com/128/3003/3003814.png",
        "css": {
            "color": "white"
        },
        "starter": true
    },
    "flour": {
        "image": "https://cdn-icons-png.flaticon.com/128/10738/10738997.png",
        "css": {
            "color": "white"
        },
        "starter": true
    },
    "egg": {
        "image": "https://cdn-icons-png.flaticon.com/128/487/487310.png",
        "css": {
            "color": "white"
        },
        "starter": true
    },
    "dough": {
        "image": "https://cdn-icons-png.flaticon.com/128/6717/6717362.png",
        "css": {
            "color": "white"
        },
        "recipe": ["water", "flour"]
    },
    "pasta": {
        "image": "https://cdn-icons-png.flaticon.com/128/8880/8880560.png",
        "css": {
            "color": "white"
        },
        "recipe": ["egg", "dough", "boiling water"]
    },
    "raspberry water": {
        "image": "https://cdn-icons-png.flaticon.com/128/6106/6106801.png",
        "css": {
            "color": "blue"
        },
        "recipe": ["raspberry seed oil", "water"]
    },
    "garbage": {
        "image": "https://cdn-icons-png.flaticon.com/128/9306/9306132.png",
        "css": {
            "color": "green"
        }
    },
    "contamination": {
        "css": {
            "background-color": "black",
            "color": "red"
        },
        "recipe": ["garbage", "water"]
    },
    "nuclear waste": {
        "image": "https://cdn-icons-png.flaticon.com/128/6002/6002980.png",
        "css": {
            "color": "yellow"
        },
        "recipe": ["contamination"]
    },
    "nuclear bomb": {
        "image": "https://cdn-icons-png.flaticon.com/128/1537/1537032.png",
        "css": {
            "color": "yellow"
        },
        "recipe": ["nuclear waste", "nuclear waste"]
    },
    "north korea": {
        "image": "https://icons.iconarchive.com/icons/wikipedia/flags/128/KP-North-Korea-Flag-icon.png",
        "css": {
            "color": "white"
        },
        "recipe": ["nuclear bomb", "nuclear bomb"]
    },
    "raspberry dough": {
        "image": "https://cdn-icons-png.flaticon.com/128/9273/9273839.png",
        "css": {
            "color": "red"
        },
        "recipe": ["raspberry water", "flour"]
    },
    "raspberry cookie": {
        "image": "https://cdn-icons-png.flaticon.com/128/2001/2001244.png",
        "css": {
            "color": "red"
        },
        "recipe": ["oven", "raspberry dough"]
    },
    "lemon": {
        "modifier": "sour",
        "image": "https://cdn-icons-png.flaticon.com/128/7484/7484115.png",
        "css": {
            "color": "white"
        },
        "starter": true
    },
    "sugar": {
        "modifier": "sweet",
        "image": "https://cdn-icons-png.flaticon.com/128/5029/5029280.png",
        "css": {
            "color": "white"
        },
        "starter": true
    },
    "soda": {
        "image": "https://cdn-icons-png.flaticon.com/128/9557/9557668.png",
        "css": {
            "color": "white"
        },
        "recipe": ["sugar", "water"]
    },
    "mud": {
        "image": "https://cdn-icons-png.flaticon.com/128/7756/7756706.png",
        "css": {
            "color": "white"
        },
        "recipe": ["garbage", "garbage"]
    },
    "dirt": {
        "image": "https://cdn-icons-png.flaticon.com/128/7922/7922824.png",
        "css": {
            "color": "white"
        },
        "recipe": ["mud", "mud"]
    },
    "grass": {
        "image": "https://cdn-icons-png.flaticon.com/128/4683/4683517.png",
        "css": {
            "color": "white"
        },
        "recipe": ["dirt", "water"]
    },
    "garden": {
        "image": "https://cdn-icons-png.flaticon.com/128/1518/1518965.png",
        "css": {
            "color": "white"
        },
        "recipe": ["grass", "water", "dirt"]
    },
    "seeds": {
        "image": "https://cdn-icons-png.flaticon.com/128/1576/1576984.png",
        "css": {
            "color": "white"
        },
        "recipe": ["raspberry seed oil", "garden", "water"]
    },
    "alive chicken": {
        "image": "https://cdn-icons-png.flaticon.com/128/2002/2002616.png",
        "css": {
            "color": "white"
        },
        "recipe": ["garden", "egg"]
    },
    "chicken": {
        "image": "https://cdn-icons-png.flaticon.com/128/1895/1895698.png",
        "css": {
            "color": "black"
        },
        "recipe": ["oven", "alive chicken"]
    },
    "raspberry": {
        "image": "https://cdn-icons-png.flaticon.com/128/1542/1542487.png",
        "css": {
            "color": "white"
        },
        "recipe": ["raspberry seed oil", "seeds", "garden"]
    },
    "tomato": {
        "image": "https://cdn-icons-png.flaticon.com/128/1202/1202125.png",
        "css": {
            "color": "white"
        },
        "recipe": ["raspberry", "garden", "seeds", "water"]
    },
    "pizza": {
        "image": "https://cdn-icons-png.flaticon.com/128/2438/2438412.png",
        "css": {
            "color": "white"
        },
        "recipe": ["tomato", "dough", "oven"]
    },
    "spaghetti": {
        "image": "https://cdn-icons-png.flaticon.com/128/3480/3480618.png",
        "css": {
            "color": "white"
        },
        "recipe": ["tomato", "pasta"]
    },
    "italy": {
        "image": "https://imgs.search.brave.com/OYihjnz29-zpUA0R91DlCb5HJ4CUMKZ5DswRSLIG_kA/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTIx/MDQzMDY4L3Bob3Rv/L2l0YWx5LmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1TSVJD/aWtmLVEwV2VEWE42/QndCa0RmVDU1OXFS/T3lSRE9LSXVINDF1/ZExjPQ",
        "css": {
            "color": "white"
        },
        "recipe": ["spaghetti", "pizza"]
    },
    "lemonade": {
        "image": "https://cdn-icons-png.flaticon.com/128/753/753929.png",
        "css": {
            "color": "black"
        },
        "recipe": ["water", "lemon", "sugar"]
    },
    "cookie dough": {
        "image": "https://cdn-icons-png.flaticon.com/128/4126/4126009.png",
        "css": {
            "color": "black",
            "background-color": "tan"
        },
        "recipe": ["dough", "sugar"]
    },
    "cookie": {
        "image": "https://cdn-icons-png.flaticon.com/128/541/541732.png",
        "css": {
            "color": "black",
            "background-color": "tan"
        },
        "recipe": ["oven", "cookie dough"]
    },
    "salt": {
        "image": "https://cdn-icons-png.flaticon.com/128/736/736882.png",
        "css": {
            "color": "black",
            "background-color": "white"
        },
        "starter": true
    }
}
