'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UploadScreen } from './UploadScreen'
import { AnalyzingScreen } from './AnalyzingScreen'
import { ResultScreen } from './ResultScreen'
import type { Recipe, ScreenState, RecipeHistoryItem } from './types'

const HISTORY_KEY = 'yukzzp_recipe_history'
const MAX_HISTORY = 10

function saveToHistory(recipe: Recipe) {
  try {
    const existing: RecipeHistoryItem[] = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
    const item: RecipeHistoryItem = {
      id: crypto.randomUUID(),
      dish_name: recipe.name,
      created_at: new Date().toISOString(),
      recipe,
    }
    const updated = [item, ...existing].slice(0, MAX_HISTORY)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  } catch {}
}

export function DevelopClient() {
  const [screen, setScreen] = useState<ScreenState>('upload')
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleAnalyze = async (imageDataUrl: string, dishHint?: string) => {
    setScreen('analyzing')
    setError(null)
    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        'analyze-recipe-photo',
        { body: { imageDataUrl, dishHint, servings: 10 } },
      )
      if (fnError) throw new Error(fnError.message)
      if (!data?.recipe) throw new Error('레시피 데이터가 없습니다')
      setRecipe(data.recipe)
      saveToHistory(data.recipe)
      setScreen('result')
    } catch (e) {
      setError(e instanceof Error ? e.message : '분석 중 오류가 발생했습니다')
      setScreen('upload')
    }
  }

  const handleReset = () => {
    setRecipe(null)
    setError(null)
    setScreen('upload')
  }

  if (screen === 'upload')
    return <UploadScreen onAnalyze={handleAnalyze} error={error} />
  if (screen === 'analyzing')
    return <AnalyzingScreen />
  if (screen === 'result' && recipe)
    return <ResultScreen recipe={recipe} onReset={handleReset} />
  return <UploadScreen onAnalyze={handleAnalyze} error={error} />
}
