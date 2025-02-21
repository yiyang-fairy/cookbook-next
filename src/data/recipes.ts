import { Recipe, RecipeType } from "@/types/recipe";

export const recipes: Recipe[] = [
    {
        id: "1",
        name: "红烧肉",
        type: RecipeType.MEAT,
        ingredients: ["五花肉", "生抽", "老抽", "料酒", "八角", "葱", "姜", "蒜"],
        cookingTime: 60,
        steps: [
            "五花肉切块，冷水下锅焯水去腥",
            "锅中放油，爆香葱姜蒜",
            "放入五花肉翻炒上色",
            "加入调料，倒入适量热水",
            "大火烧开后转小火炖煮40分钟",
            "收汁即可出锅"
        ],
        selectedCount: 12,
        updateTime: "2024-03-20"
    },
    {
        id: "2",
        name: "酸辣白菜",
        type: RecipeType.VEGETABLE,
        ingredients: ["白菜", "干辣椒", "蒜", "醋"],
        cookingTime: 15,
        steps: [
            "白菜洗净切段",
            "锅中放油，爆香干辣椒和蒜",
            "加入白菜翻炒",
            "加入适量盐和醋调味",
            "大火快炒至断生即可"
        ],
        selectedCount: 8,
        updateTime: "2024-03-19"
    },
    {
        id: "3",
        name: "宫保鸡丁",
        type: RecipeType.MIXED,
        ingredients: ["鸡胸肉", "花生", "黄瓜", "胡萝卜", "干辣椒", "花椒", "葱", "姜", "蒜"],
        cookingTime: 30,
        steps: [
            "鸡胸肉切丁，用料酒、生抽、淀粉腌制15分钟",
            "花生提前炒熟，黄瓜和胡萝卜切丁",
            "锅中放油，爆香干辣椒和花椒",
            "放入鸡丁翻炒至变色",
            "加入黄瓜和胡萝卜丁",
            "最后加入花生，调味即可"
        ],
        selectedCount: 15,
        updateTime: "2024-03-18"
    },
    {
        id: "4",
        name: "清炒西兰花",
        type: RecipeType.DIET,
        ingredients: ["西兰花", "蒜", "盐", "橄榄油"],
        cookingTime: 10,
        steps: [
            "西兰花洗净切小朵",
            "锅中加水烧开，加入少许盐",
            "西兰花焯水30秒后捞出",
            "锅中放入橄榄油，爆香蒜末",
            "放入西兰花翻炒，加盐调味即可"
        ],
        selectedCount: 6,
        updateTime: "2024-03-17"
    },
    {
        id: "5",
        name: "糖醋排骨",
        type: RecipeType.MEAT,
        ingredients: ["排骨", "糖", "醋", "生抽", "料酒", "葱", "姜", "蒜"],
        cookingTime: 45,
        steps: [
            "排骨切段，冷水下锅焯水",
            "锅中放油，爆香葱姜蒜",
            "放入排骨翻炒上色",
            "加入糖醋调料翻炒",
            "加入适量水，大火烧开后转小火",
            "炖煮30分钟，收汁即可"
        ],
        selectedCount: 18,
        updateTime: "2024-03-16"
    },
    {
        id: "6",
        name: "麻婆豆腐",
        type: RecipeType.MIXED,
        ingredients: ["豆腐", "猪肉末", "豆瓣酱", "花椒", "葱花", "生抽"],
        cookingTime: 20,
        steps: [
            "豆腐切块，猪肉末提前腌制",
            "锅中放油，爆香花椒",
            "放入肉末翻炒",
            "加入豆瓣酱炒出红油",
            "加入豆腐块，适量水",
            "大火烧开后转中火烧3分钟",
            "最后撒上葱花即可"
        ],
        selectedCount: 14,
        updateTime: "2024-03-15"
    },
    {
        id: "7",
        name: "凉拌黄瓜",
        type: RecipeType.DIET,
        ingredients: ["黄瓜", "蒜", "醋", "生抽", "辣椒油"],
        cookingTime: 5,
        steps: [
            "黄瓜洗净切滚刀块",
            "蒜末备用",
            "调制凉拌汁",
            "黄瓜拌入调味料",
            "最后淋上辣椒油即可"
        ],
        selectedCount: 9,
        updateTime: "2024-03-14"
    }
]; 