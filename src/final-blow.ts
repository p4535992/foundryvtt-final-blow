/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your module
 */
// Import JavaScript modules

// Import TypeScript modules
import { registerSettings } from "./scripts/settings.js";
import { initHooks, readyHooks, setupHooks } from "./scripts/module";
import { error, i18n, warn } from "./scripts/lib/lib.js";
import CONSTANTS from "./scripts/constants.js";
import type API from "./scripts/api.js";

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once("init", async () => {
	// console.log(`${CONSTANTS.MODULE_NAME} | Initializing ${CONSTANTS.MODULE_NAME}`);

	// Register custom module settings
	registerSettings();
	initHooks();

	// Preload Handlebars templates
	//await preloadTemplates();
});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once("setup", function () {
	// Do anything after initialization but before ready
	setupHooks();
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once("ready", async () => {
	// Do anything once the module is ready
	// if (!game.modules.get('lib-wrapper')?.active && game.user?.isGM) {
	//   let word = 'install and activate';
	//   if (game.modules.get('lib-wrapper')) word = 'activate';
	//   throw error(`Requires the 'libWrapper' module. Please ${word} it.`);
	// }
	// if (!game.modules.get('socketLib')?.active && game.user?.isGM) {
	//   let word = 'install and activate';
	//   if (game.modules.get('socketLib')) word = 'activate';
	//   throw error(`Requires the 'socketLib' module. Please ${word} it.`);
	// }
	if (!game.modules.get("active-effect-manager-lib")?.active && game.user?.isGM) {
		let word = "install and activate";
		if (game.modules.get("active-effect-manager-lib")) word = "activate";
		throw error(`Requires the 'active-effect-manager-lib' module. Please ${word} it.`);
	}
	readyHooks();
});

/* ------------------------------------ */
/* Other Hooks							*/
/* ------------------------------------ */

Hooks.once("devModeReady", ({ registerPackageDebugFlag }) => {
	registerPackageDebugFlag(CONSTANTS.MODULE_NAME);
});

export interface FinalBlowModuleData {
	api: typeof API;
	socket: any;
}

/**
 * Initialization helper, to set API.
 * @param api to set to game module.
 */
export function setApi(api: typeof API): void {
	const data = game.modules.get(CONSTANTS.MODULE_NAME) as unknown as FinalBlowModuleData;
	data.api = api;
}

/**
 * Returns the set API.
 * @returns Api from games module.
 */
export function getApi(): typeof API {
	const data = game.modules.get(CONSTANTS.MODULE_NAME) as unknown as FinalBlowModuleData;
	return data.api;
}

/**
 * Initialization helper, to set Socket.
 * @param socket to set to game module.
 */
export function setSocket(socket: any): void {
	const data = game.modules.get(CONSTANTS.MODULE_NAME) as unknown as FinalBlowModuleData;
	data.socket = socket;
}

/*
 * Returns the set socket.
 * @returns Socket from games module.
 */
export function getSocket() {
	const data = game.modules.get(CONSTANTS.MODULE_NAME) as unknown as FinalBlowModuleData;
	return data.socket;
}
