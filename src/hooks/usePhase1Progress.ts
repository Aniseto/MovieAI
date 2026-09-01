/**
 * hooks/usePhase1Progress.ts
 *
 * Calcula el estado de completitud de Fase 1 a partir del editorStore.
 * Se recalcula reactivamente cada vez que cambian los bloques.
 *
 * canGenerate: true cuando el proyecto tiene suficiente contenido para
 * lanzar la generación de storyboard en Fase 2.
 */

import { useMemo } from 'react'
import { useEditorStore } from '@/store/editorStore'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type CompletionState = 'empty' | 'draft' | 'complete'

export interface CharacterProgress {
  total: number
  complete: number
  hasProtagonist: boolean
}

export interface LocationProgress {
  total: number
  complete: number
}

export interface SceneProgress {
  total: number
  complete: number
}

export interface Phase1Progress {
  synopsis:   CompletionState
  structure:  CompletionState
  characters: CharacterProgress
  locations:  LocationProgress
  scenes:     SceneProgress
  canGenerate: boolean
  /** Porcentaje 0-100 para mostrar en la UI */
  percent: number
  /** Items booleanos simplificados para la vista de tarjeta */
  items: {
    sinopsis:   boolean
    personajes: boolean
    escenarios: boolean
    escenas:    boolean
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function contentState(content: string | undefined): CompletionState {
  if (!content || content.trim() === '') return 'empty'
  if (content.trim().length < 80) return 'draft'
  return 'complete'
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePhase1Progress(projectSlug?: string): Phase1Progress {
  const blocks = useEditorStore((s) => s.blocks)

  return useMemo(() => {
    // ── Sinopsis y estructura — bloques de tipo 'synopsis' / 'structure'
    const synopsisBlock  = blocks.find((b) => b.type === 'synopsis')
    const structureBlock = blocks.find((b) => b.type === 'structure')

    const synopsis  = contentState(synopsisBlock?.content)
    const structure = contentState(structureBlock?.content)

    // ── Personajes
    const charBlocks = blocks.filter((b) => b.type === 'character')
    const completeChars = charBlocks.filter((b) => contentState(b.content) === 'complete')
    const hasProtagonist = charBlocks.some(
      (b) => b.content?.toLowerCase().includes('protagonista') || b.slug === 'protagonista'
    )
    const characters: CharacterProgress = {
      total:        charBlocks.length,
      complete:     completeChars.length,
      hasProtagonist,
    }

    // ── Escenarios
    const locBlocks     = blocks.filter((b) => b.type === 'location')
    const completeLocs  = locBlocks.filter((b) => contentState(b.content) === 'complete')
    const locations: LocationProgress = {
      total:    locBlocks.length,
      complete: completeLocs.length,
    }

    // ── Escenas — bloques de tipo 'scene' (resúmenes en el editor libre)
    // En la práctica las escenas viven en ficheros separados, pero el store
    // puede tener bloques tipo 'scene' si se añaden manualmente.
    // Para el cálculo de canGenerate usamos una heurística conservadora.
    const sceneBlocks    = blocks.filter((b) => b.type === 'scene')
    const completeScenes = sceneBlocks.filter((b) => contentState(b.content) === 'complete')
    const scenes: SceneProgress = {
      total:    sceneBlocks.length,
      complete: completeScenes.length,
    }

    // ── canGenerate
    const canGenerate =
      synopsis === 'complete' &&
      characters.hasProtagonist &&
      characters.complete >= 1 &&
      locations.complete >= 1 &&
      scenes.complete >= 2

    // ── Porcentaje (5 criterios binarios)
    const criteria = [
      synopsis !== 'empty',
      structure !== 'empty',
      characters.total >= 1,
      locations.total >= 1,
      scenes.total >= 1,
    ]
    const percent = Math.round((criteria.filter(Boolean).length / criteria.length) * 100)

    // ── Items simplificados para la tarjeta
    const items = {
      sinopsis:   synopsis !== 'empty',
      personajes: characters.total >= 1,
      escenarios: locations.total >= 1,
      escenas:    scenes.total >= 1,
    }

    void projectSlug // disponible para uso futuro (fetch remoto)

    return { synopsis, structure, characters, locations, scenes, canGenerate, percent, items }
  }, [blocks, projectSlug])
}
