import CONSTANTS from "./constants";
import Effect from "./effects/effect";
import { getConvenientEffectsDead, getConvenientEffectsUnconscious, getConvenientEffectsWounded } from "./lib/lib";

/**
 * Defines all of the effect definitions
 */
 export class FinalBlowEffectDefinitions {
  constructor() {}

  /**
   * Get all effects
   *
   * @returns {Effect[]} all the effects
   */
  static async all(overlay = true): Promise<Effect[]> {
    const effects: Effect[] = [];

    const wounded = FinalBlowEffectDefinitions.wounded(overlay);
    if(wounded){
      effects.push(wounded);
    }
    const unconscious = FinalBlowEffectDefinitions.unconscious(overlay);
    if(unconscious){
      effects.push(unconscious);
    }
    const dead = FinalBlowEffectDefinitions.dead(overlay);
    if(dead){
      effects.push(dead);
    }
    return effects;
  }

  static wounded(overlay = true):Effect {
    if (game.modules.get("dfreds-convenient-effects")?.active){
      return getConvenientEffectsWounded();
    }else{
      return new Effect({
        customId: 'wounded',
        name: 'Wounded',
        description: 'Wounded',
        icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/wounded.svg`,
        transfer: true,
        changes: [],
        isTemporary: false,
        overlay: overlay
      });
    }
  }

  static unconscious(overlay = true) {
    if (game.modules.get("dfreds-convenient-effects")?.active){
      return getConvenientEffectsUnconscious();
    }else{
      return new Effect({
        customId: 'unconscious',
        name: 'Unconscious',
        description: 'Unconscious',
        icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/unconscious.svg`,
        changes: [],
        isTemporary: false,
        overlay: overlay
      });
    }
  }

  static dead(overlay = true) {
    if (game.modules.get("dfreds-convenient-effects")?.active){
      return getConvenientEffectsDead();
    }else{
      return new Effect({
        customId: 'dead',
        name: 'Dead',
        description: 'No active effects',
        icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/skull.svg`,
        changes: [],
        isTemporary: false,
        overlay: overlay
      });
    }
  }
}
