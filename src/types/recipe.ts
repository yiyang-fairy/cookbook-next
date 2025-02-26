export enum RecipeType {
  ALL = 'ALL',
  MEAT = 'MEAT',
  VEGETABLE = 'VEGETABLE',
  MIXED = 'MIXED',
  DIET = 'DIET',
}

export const typeMap = {
  [RecipeType.ALL]: '全部',
  [RecipeType.MEAT]: '纯肉类',
  [RecipeType.VEGETABLE]: '纯素菜',
  [RecipeType.MIXED]: '荤素搭配',
  [RecipeType.DIET]: '减脂类',
};

export interface Recipe {
  id: string;
  name: string;
  type: RecipeType;
  ingredients: string[];
  cookingTime: number;
  steps: string[];
  selectedCount: number;
  updateTime: string;
  cover_images: string;
} 