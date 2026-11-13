import type { FoodAnalysis, HygieneAnalysis, MealPlan, Recipe } from './types'

const pause = (milliseconds = 650) => new Promise(resolve => window.setTimeout(resolve, milliseconds))

const foodProfiles = {
  salad: ['Mediterranean harvest bowl', 428, 18, 49, 19],
  pizza: ['Garden vegetable pizza', 684, 27, 82, 28],
  pasta: ['Tomato basil pasta', 612, 21, 94, 18],
  rice: ['Vegetable rice bowl', 536, 19, 86, 14],
  curry: ['Chickpea vegetable curry', 514, 24, 67, 18],
  fruit: ['Seasonal fruit plate', 246, 4, 59, 2],
} as const

export async function analyzeFood(file: File): Promise<FoodAnalysis> {
  await pause(850)
  const filename = file.name.toLowerCase()
  const key = (Object.keys(foodProfiles).find(name => filename.includes(name)) || 'salad') as keyof typeof foodProfiles
  const [dish, calories, protein, carbs, fat] = foodProfiles[key]
  const confidence = Math.min(.96, .87 + (file.size % 9) / 100)
  const freshness = file.size % 3 === 2 ? 'Moderately Fresh' : 'Fresh'

  return {
    dish,
    confidence,
    items: [
      { name: 'Leafy greens', confidence: .96, portion: '2 cups' },
      { name: 'Roasted chickpeas', confidence: .92, portion: '¾ cup' },
      { name: 'Cherry tomatoes', confidence: .89, portion: '½ cup' },
      { name: 'Avocado', confidence: .86, portion: '½ medium' },
    ],
    nutrition: { calories, protein, carbs, fat, fiber: 12 },
    health_score: freshness === 'Fresh' ? 88 : 74,
    freshness,
    freshness_confidence: .93,
    insights: [
      'High in fiber and plant protein',
      'Good balance of complex carbs and healthy fats',
      'Nutrition values are visual estimates for demonstration purposes',
    ],
  }
}

export async function analyzeHygiene(_file: File): Promise<HygieneAnalysis> {
  await pause(1000)
  return {
    score: 86,
    status: 'Good',
    duration: '00:42',
    checks: [
      { label: 'Glove usage', score: 94, status: 'Pass' },
      { label: 'Hair restraint', score: 88, status: 'Pass' },
      { label: 'Surface cleanliness', score: 82, status: 'Review' },
      { label: 'Safe food handling', score: 91, status: 'Pass' },
    ],
    alerts: [{ time: '00:31', message: 'Wipe preparation surface before the next task.' }],
  }
}

export async function createMealPlan(goal: string, diet: string, calories: number): Promise<MealPlan> {
  await pause()
  const options: Record<string, [string, string]> = {
    everything: ['Herb chicken grain bowl', 'Miso salmon & greens'],
    vegetarian: ['Paneer quinoa bowl', 'Lentil bolognese'],
    vegan: ['Tempeh harvest bowl', 'Red lentil curry'],
    pescatarian: ['Tuna quinoa bowl', 'Miso salmon & greens'],
  }
  const [lunch, dinner] = options[diet] || options.everything
  const multiplier = calories / 2000
  const meals = [
    ['Breakfast', 'Overnight oats with berries', 410],
    ['Lunch', lunch, 560],
    ['Snack', 'Apple, almonds & yogurt', 260],
    ['Dinner', dinner, 670],
  ] as const

  return {
    goal,
    target_calories: calories,
    meals: meals.map(([time, name, energy]) => ({ time, name, calories: Math.round(energy * multiplier) })),
    coach_note: 'Keep water nearby and aim for a palm-sized protein serving at lunch and dinner.',
  }
}

export async function createRecipe(prompt: string): Promise<Recipe> {
  await pause()
  return {
    title: 'Lemon herb chickpea skillet',
    subtitle: `A quick, balanced idea inspired by “${prompt.trim()}”`,
    time: '24 min',
    difficulty: 'Easy',
    ingredients: ['Chickpeas', 'Cherry tomatoes', 'Spinach', 'Lemon', 'Garlic', 'Herbs'],
    steps: [
      'Warm olive oil and gently bloom the garlic.',
      'Add chickpeas and tomatoes; cook until the tomatoes soften.',
      'Fold in spinach, lemon zest, juice, and fresh herbs.',
      'Taste, season, and serve with toasted whole-grain bread.',
    ],
    tip: 'Pat the chickpeas dry before cooking for better browning.',
  }
}
