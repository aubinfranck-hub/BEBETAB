import type {Txt} from '@revideo/2d';
import type {ThreadGenerator} from '@revideo/core';

/**
 * Revideo 0.11 ne sait pas recalculer un `text={() => ...}` hors du contexte de la scène
 * (erreur "The scene is not available in the current context", texte absent du rendu).
 * On pousse donc la valeur à chaque image depuis le fil d'animation.
 */
export function* bindText(node: Txt, getter: () => string, frames: number): ThreadGenerator {
  for (let frame = 0; frame < frames; frame++) {
    node.text(getter());
    yield;
  }
}
