import type { ActorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs";

const API = {
	renderDialogMMMForFinalBlowArr(...inAttributes) {
		// if (!Array.isArray(inAttributes)) {
		//   throw error('renderDialogMMMForFinalBlowArr | inAttributes must be of type array');
		// }
		this.renderDialogMMMForFinalBlow();
	},

	renderDialogMMMForFinalBlow() {
		//@ts-ignore
		MaxwelMaliciousMaladies.displayDialog();
	},
};

export default API;
