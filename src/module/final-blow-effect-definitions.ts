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
		if (wounded) {
			effects.push(wounded);
		}
		const unconscious = FinalBlowEffectDefinitions.unconscious(overlay);
		if (unconscious) {
			effects.push(unconscious);
		}
		const dead = FinalBlowEffectDefinitions.dead(overlay);
		if (dead) {
			effects.push(dead);
		}
		const specialdead = FinalBlowEffectDefinitions.specialdead(overlay);
		if (specialdead) {
			effects.push(specialdead);
		}
		return effects;
	}

	static wounded(overlay = true): Effect {
		if (game.modules.get("dfreds-convenient-effects")?.active) {
			return getConvenientEffectsWounded();
		} else {
			return new Effect({
				customId: "woundedblow",
				name: "Wounded Blow",
				description: "No active effects",
				icon: `modules/${CONSTANTS.MODULE_NAME}/icons/bleeding-wound-blow.svg`,
				transfer: true,
				changes: [],
				isTemporary: true,
				overlay: overlay,
			});
		}
	}

	static unconscious(overlay = true) {
		if (game.modules.get("dfreds-convenient-effects")?.active) {
			return getConvenientEffectsUnconscious();
		} else {
			return new Effect({
				customId: "unconsciousblow",
				name: "Unconscious Blow",
				description: "No active effects",
				icon: `modules/${CONSTANTS.MODULE_NAME}/icons/unconscious-blow.svg`,
				changes: [],
				isTemporary: true,
				overlay: overlay,
			});
		}
	}

	static dead(overlay = true) {
		if (game.modules.get("dfreds-convenient-effects")?.active) {
			return getConvenientEffectsDead();
		} else {
			return new Effect({
				customId: "deadblow",
				name: "Dead Blow",
				description: "No active effects",
				icon: `modules/${CONSTANTS.MODULE_NAME}/icons/pirate-grave-blow.svg`,
				changes: [],
				isTemporary: true,
				overlay: overlay,
			});
		}
	}

	static specialdead(overlay = true) {
		// if (game.modules.get("dfreds-convenient-effects")?.active) {
		// 	return getConvenientEffectsDead();
		// } else {
		return new Effect({
			customId: "specialdeadblow",
			name: "Special Dead Blow",
			description: "No active effects",
			icon: `modules/${CONSTANTS.MODULE_NAME}/icons/red-skull-blow.png`,
			changes: [],
			isTemporary: true,
			overlay: overlay,
		});
		// }
	}
}
