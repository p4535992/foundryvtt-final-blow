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
// //@ts-ignore
// import { DND5E } from '../../systems/dnd5e/module/config.js';
// //@ts-ignore
// import { ActorSheet5e  } from '../../systems/dnd5e/module/actor/sheets/base.js';
// //@ts-ignore
// import { ActorSheet5eCharacter  } from '../../systems/dnd5e/module/actor/sheets/character.js';
// //@ts-ignore
// import { Item5e } from '../../systems/dnd5e/module/item/entity.js';

// Import TypeScript modules
import { registerSettings } from './module/settings.js';
import { preloadTemplates } from './module/preloadTemplates.js';
import { ItemSheet5eWithBags } from './module/ItemSheet5eWithBags.js';
import { ItemSheetShop } from './module/ItemSheetShop.js';
import { fixupItemData, initHooks, readyHooks, setupHooks } from './module/module';
import { createSpellBookFromActor } from './module/util.js';
import type { ItemData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs.js';
import { error, i18n, warn } from './module/lib/lib.js';
import CONSTANTS from './module/constants.js';

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async () => {
	console.log(`${CONSTANTS.MODULE_NAME} | Initializing ${CONSTANTS.MODULE_NAME}`);

	// Register custom module settings
	registerSettings();
	initHooks();

  // Preload Handlebars templates
	await preloadTemplates();


});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once('setup', function () {
	// Do anything after initialization but before ready
  //@ts-ignore
  Items.registerSheet(game.system.id, ItemSheet5eWithBags, { makeDefault: false, types: ["backpack"], label: i18n('itemcollection.ItemSheet5eWithBags') });
  //@ts-ignore
	Items.registerSheet(game.system.id, ItemSheetShop, { makeDefault: false, types: ["backpack"], label: i18n('itemcollection.ItemSheetShop') });

  setupHooks();
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', async () => {
	// Do anything once the module is ready
	if (!game.modules.get("lib-wrapper")?.active && game.user?.isGM){
   	error(`The '${CONSTANTS.MODULE_NAME}' module requires to install and activate the 'libWrapper' module.`, true);
		return;
	}
	readyHooks();
  //@ts-ignore
  window.Itemcollection = {
    migrateItems,
    migrateActorItems,
    migrateAllActorItems,
    migrateAllTokenItems,
    migrateAllItems,
    migrateWorld,
    Shops: {
      createShop,
      createShopItem
    },
    createSpellBookFromActor: createSpellBookFromActor
  }
});

export async function migrateItems(items:any[], name = "") {
  const promises:any[] = [];
  for (const item of items) {
    if (item.type === "backpack"
        && item.data.flags?.itemcollection
        && item.getFlag(CONSTANTS.MODULE_NAME,'version') !== "0.8.6") {
      error(`Migrating ${name}: Item ${item.name}`)
      const itemcontents = <ItemData[]>duplicate(item.getFlag(CONSTANTS.MODULE_NAME,'contents') || []);
      for (const itemData of itemcontents) {
        if (itemData.type === "backpack") fixupItemData(itemData);
        (itemData.effects ?? []).forEach(effectData => {
          effectData.data.origin = undefined;
        })
        itemData._id = randomID();
      }
      promises.push(item.update({
        "flags.itemcollection.version": "0.8.6",
        "flags.itemcollection.bagWeight": item.data.flags.itemcollection?.fixedWeight ?? 0,
        "flags.itemcollection.bagPrice": item.data.data.price,
        "flags.itemcollection.contentsData": itemcontents,
        "flags.itemcollection.-=contents": null,
        "flags.itemcollection.-=goldValue": null,
        "flags.itemcollection.-=fixedWeight": null,
        "flags.itemcollection.-=importSpells": null
      }));
      // promises.push(item.update({"flags.itemcollection.-=contents": null, "flags.itemcollection.-=fixedWeight": null}));
    }
  }
  return Promise.all(promises);
}

async function migrateActorItems(actor:Actor) {
  if (!(actor instanceof Actor)) {
    error(`${actor} is not an actor`);
    return;
  }
  return migrateItems(actor.items.contents, <string>actor.name);
}

async function migrateAllActorItems() {
  const promises:any[] = [];
  for (const actor of <Actors>game.actors) {
    promises.push(migrateActorItems(actor));
  }
  return Promise.all(promises);
}

async function migrateAllTokenItems() {
  const promises:any[] = [];
  for (const scene of <Scenes>game.scenes) {
    for (const tokenDocument of scene.tokens) {
      if (!tokenDocument.isLinked && tokenDocument.actor) {
        promises.push(migrateActorItems(tokenDocument.actor))
      }
    }
  }
  return Promise.all(promises);
}

async function migrateAllItems() {
  return migrateItems(<Item[]>game.items?.contents, "World");
}

async function migrateWorld() {
  Promise.all([migrateAllItems(), migrateAllActorItems(), migrateAllTokenItems()]);
}

export async function createShop(compendiumName, shopName, conditions: {}, {minValue = 0, minQuantity = 0, createShop = false}) {
  const compendium = game.packs.get(compendiumName);
  if (!compendium){
    warn(`Could not find compendium ${compendiumName}`, true);
    error(`Could not find compendium ${compendiumName}`);
    return;
  }
  let shop = <StoredDocument<Item>>game.items?.getName(shopName);
  if (createShop) {
    shop = await createShopItem(shopName);
    error(`Itemcollection: Created shop shopName ${duplicate(shop.data.flags.itemcollection)}`)
  } else if (!shop || shop.type !== "backpack") {
    warn(`Could not find a shop named ${shopName}`, true);
    error(`Could not find a shop named ${shopName}`);
    return;
  }
  //@ts-ignore
  await compendium.getDocuments()
  //@ts-ignore
  const itemsToAdd = compendium.filter(item => chooseCondition(item, conditions))
      .map(item => item.data)
      .map(itemData => {
        //@ts-ignore
        itemData.data.quantity = Math.max(itemData.data.quantity || 0, minQuantity);
        return itemData
      })
      .map(itemData => {
        //@ts-ignore
        if (itemData.data.price && minValue > (itemData.data.quantity * itemData.data.price)) {
          //@ts-ignore
          itemData.data.quantity = Math.ceil(minValue/itemData.data.price);
        }
        return itemData;
      });
  //@ts-ignore
  console.log(`Creating ${itemsToAdd.length} items, out of ${compendium.size} in ${shopName}`);
  //@ts-ignore createEmbeddedDocuments
  await shop.createEmbeddedDocuments("Item", itemsToAdd);
  ui.notifications.notify(`Shop ${shopName} finished`)
}
export function chooseCondition(item, {rarity = "", type = "", consumableType = "", equipmentType = "", nameRegExp = null,maxPrice= 9999999999999999999999}) {
  if (rarity && item.data.data.rarity !== rarity) return false;
  if (type && item.type !== type) return false;
  if (item.data.data.price > maxPrice) return false;
  if (item.type === "consumable" && consumableType && consumableType !== item.data.data.consumableType) return false;
  if (item.type === "equipment" && equipmentType && equipmentType !== item.data.data.armor.type) return false;
  if (nameRegExp && !item.name.match(nameRegExp)) return false;
  return true;
}

export async function createShopItem(shopName):Promise<StoredDocument<Item>> {
  return <Promise<StoredDocument<Item>>>Item.create({
    name: shopName,
    type: "backpack",
    "flags.core.sheetClass": "dnd5e.ItemSheetShop",
    img: "icons/environment/settlement/market-stall.webp",
    "flags.itemcollection.contentsData": [],
    "flags.itemcollection.bagWeight": 0,
    "flags.itemcollection.bagPrice": 0,
    "flags.itemcollection.version": "0.8.6",
    "data.capacity.value": 0,
    "data.capacity.weightless": true,
  })
}
