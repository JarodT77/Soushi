/** Nombre de passages nécessaires pour obtenir une récompense. */
export const OBJECTIF_TAMPONS = 10;

/**
 * À partir du total de passages, calcule l'état de la carte à tampons :
 * - `tamponsActuels` : tampons sur la carte en cours (0 → OBJECTIF-1)
 * - `recompenses` : nombre de récompenses gagnées (paliers atteints)
 */
export function calculFidelite(
  nombreDePassage: number,
  recompensesUtilisees = 0
) {
  const total = Math.max(0, nombreDePassage);
  const reste = total % OBJECTIF_TAMPONS;

  // Quand un palier est atteint pile (ex. 10, 20…), on affiche la carte
  // PLEINE (10/10) plutôt qu'une carte vide. Elle repart à 1 au passage suivant.
  const tamponsActuels = total > 0 && reste === 0 ? OBJECTIF_TAMPONS : reste;

  const recompensesGagnees = Math.floor(total / OBJECTIF_TAMPONS);
  const recompensesDisponibles = Math.max(
    0,
    recompensesGagnees - Math.max(0, recompensesUtilisees)
  );

  return {
    objectif: OBJECTIF_TAMPONS,
    tamponsActuels,
    recompensesGagnees,
    recompensesDisponibles,
    total,
  };
}
