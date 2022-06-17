// ================================
// Logger utility
// ================================

import type { ActorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import CONSTANTS from "../constants";

// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3

export function debug(msg, args = '') {
  if (game.settings.get(CONSTANTS.MODULE_NAME, 'debug')) {
    console.log(`DEBUG | ${CONSTANTS.MODULE_NAME} | ${msg}`, args);
  }
  return msg;
}

export function log(message) {
  message = `${CONSTANTS.MODULE_NAME} | ${message}`;
  console.log(message.replace('<br>', '\n'));
  return message;
}

export function notify(message) {
  message = `${CONSTANTS.MODULE_NAME} | ${message}`;
  ui.notifications?.notify(message);
  console.log(message.replace('<br>', '\n'));
  return message;
}

export function info(info, notify = false) {
  info = `${CONSTANTS.MODULE_NAME} | ${info}`;
  if (notify) ui.notifications?.info(info);
  console.log(info.replace('<br>', '\n'));
  return info;
}

export function warn(warning, notify = false) {
  warning = `${CONSTANTS.MODULE_NAME} | ${warning}`;
  if (notify) ui.notifications?.warn(warning);
  console.warn(warning.replace('<br>', '\n'));
  return warning;
}

export function error(error, notify = true) {
  error = `${CONSTANTS.MODULE_NAME} | ${error}`;
  if (notify) ui.notifications?.error(error);
  return new Error(error.replace('<br>', '\n'));
}

export function timelog(message): void {
  warn(Date.now(), message);
}

export const i18n = (key: string): string => {
  return game.i18n.localize(key)?.trim();
};

export const i18nFormat = (key: string, data = {}): string => {
  return game.i18n.format(key, data)?.trim();
};

// export const setDebugLevel = (debugText: string): void => {
//   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
//   // 0 = none, warnings = 1, debug = 2, all = 3
//   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
// };

export function dialogWarning(message, icon = 'fas fa-exclamation-triangle') {
  return `<p class="${CONSTANTS.MODULE_NAME}-dialog">
        <i style="font-size:3rem;" class="${icon}"></i><br><br>
        <strong style="font-size:1.2rem;">${CONSTANTS.MODULE_NAME}</strong>
        <br><br>${message}
    </p>`;
}

// =========================================================================================


export async function zeroHPExpiry(actor:Actor, update:ActorData, options, user) {
  const hpUpdate = getProperty(update, "data.attributes.hp.value");
  if (hpUpdate !== 0) return;
  const expiredEffects: string[] = [];
  for (const effect of actor.effects) {
    //@ts-ignore
    if (effect.data.flags?.dae?.specialDuration?.includes("zeroHP")) {
      expiredEffects.push(<string>effect.data._id);
    }
  }
  if (expiredEffects.length > 0){
    //@ts-ignore
    await actor.deleteEmbeddedDocuments("ActiveEffect", expiredEffects, { "expiry-reason": "midi-qol:zeroHP" })
  }
}

export async function checkAndApply(actor:Actor, update:ActorData, options, user) {
  const hpUpdate = getProperty(update, "data.attributes.hp.value");
  // return wrapped(update,options,user);
  if (hpUpdate === undefined){
    return;
  }
  //@ts-ignore
  const attributes = actor.data.data.attributes;

  const needsDead = hpUpdate === 0;
  if(needsDead){
    checkAndApplyDead(actor, update, options, user);
  }
}

export async function checkAndApplyWounded(actor:Actor, update:ActorData, options, user) {
  const hpUpdate = getProperty(update, "data.attributes.hp.value");
  // return wrapped(update,options,user);
  if (hpUpdate === undefined){
    return;
  }
  //@ts-ignore
  const attributes = actor.data.data.attributes;
  // if (configSettings.addWounded > 0) {
    //@ts-ignore
    const CEWounded = game.dfreds?.effects?._wounded
    // const woundedLevel = attributes.hp.max * configSettings.addWounded / 100;
    // const needsWounded = hpUpdate > 0 && hpUpdate < woundedLevel;
    const needsWounded = true;
    if (game.modules.get("dfreds-convenient-effects")?.active && CEWounded) {
      const wounded = await this.convenientEffectsHasEffect(CEWounded.name, actor.uuid);
      if (wounded !== needsWounded) {
        //@ts-ignore
        await game.dfreds?.effectInterface.toggleEffect(CEWounded.name, { overlay: false, uuids: [actor.uuid] });
      }
    } else {
      const tokens = actor.getActiveTokens();
      //@ts-ignore
      const controlled = tokens.filter(t => t._controlled);
      const token = controlled.length ? controlled.shift() : tokens.shift();
      const bleeding = CONFIG.statusEffects.find(se => se.id === "bleeding");
      if (bleeding && token)
        await token.toggleEffect(<string>bleeding.icon, { overlay: false, active: needsWounded })
    }
  // }
}

export async function checkAndApplyUnconscious(actor:Actor, update:ActorData, options, user) {
  const hpUpdate = getProperty(update, "data.attributes.hp.value");
  // return wrapped(update,options,user);
  if (hpUpdate === undefined){
    return;
  }
  //@ts-ignore
  const attributes = actor.data.data.attributes;
  // if (configSettings.addDead) {
    // const needsDead = hpUpdate === 0;
    const needsDead = true;
    if (game.modules.get("dfreds-convenient-effects")?.active && game.settings.get("dfreds-convenient-effects", "modifyStatusEffects") !== "none") {
      const effectName = this.getConvenientEffectsUnconscious().name;
      const hasEffect = await this.convenientEffectsHasEffect(effectName, actor.uuid);
      if ((needsDead !== hasEffect)) {
        if (!actor.hasPlayerOwner) { // For CE dnd5e does not treat dead as dead for the combat tracker so update it by hand as well
          let combatant;
          if (actor.token) combatant = game.combat?.getCombatantByToken(<string>actor.token.id);
          //@ts-ignore
          else combatant = game.combat?.getCombatantByActor(actor.id);
          if (combatant) await combatant.update({ defeated: needsDead })
        }
        //@ts-ignore
        await game.dfreds?.effectInterface.toggleEffect(effectName, { overlay: true, uuids: [actor.uuid] });
      }
    }
    else {
      const tokens = actor.getActiveTokens();
      //@ts-ignore
      const controlled = tokens.filter(t => t._controlled);
      const token = controlled.length ? controlled.shift() : tokens.shift();
      if (token) {
        await token.toggleEffect("/icons/svg/unconscious.svg", { overlay: true, active: needsDead });
      }
    }
  // }
}

export async function checkAndApplyDead(actor:Actor, update:ActorData, options, user) {
  const hpUpdate = getProperty(update, "data.attributes.hp.value");
  // return wrapped(update,options,user);
  if (hpUpdate === undefined){
    return;
  }
  //@ts-ignore
  const attributes = actor.data.data.attributes;
  // if (configSettings.addDead) {
    // const needsDead = hpUpdate === 0;
    const needsDead = true;
    if (game.modules.get("dfreds-convenient-effects")?.active && game.settings.get("dfreds-convenient-effects", "modifyStatusEffects") !== "none") {
      const effectName = actor.hasPlayerOwner ? this.getConvenientEffectsUnconscious().name : this.getConvenientEffectsDead().name;
      const hasEffect = await this.convenientEffectsHasEffect(effectName, actor.uuid);
      if ((needsDead !== hasEffect)) {
        if (!actor.hasPlayerOwner) { // For CE dnd5e does not treat dead as dead for the combat tracker so update it by hand as well
          let combatant;
          if (actor.token) combatant = game.combat?.getCombatantByToken(<string>actor.token.id);
          //@ts-ignore
          else combatant = game.combat?.getCombatantByActor(actor.id);
          if (combatant) await combatant.update({ defeated: needsDead })
        }
        //@ts-ignore
        await game.dfreds?.effectInterface.toggleEffect(effectName, { overlay: true, uuids: [actor.uuid] });
      }
    }
    else {
      const tokens = actor.getActiveTokens();
      //@ts-ignore
      const controlled = tokens.filter(t => t._controlled);
      const token = controlled.length ? controlled.shift() : tokens.shift();
      if (token) {
        if (actor.hasPlayerOwner) {
          await token.toggleEffect("/icons/svg/unconscious.svg", { overlay: true, active: needsDead });
        } else {
          await token.toggleEffect(CONFIG.controlIcons.defeated, { overlay: true, active: needsDead });
        }
      }
    }
  // }
}

export async function convenientEffectsHasEffect(effectName: string, uuid: string) {
  //@ts-ignore
  return game.dfreds.effectInterface.hasEffectApplied(effectName, uuid);
},

export function getConvenientEffectsUnconscious() {
  //@ts-ignore
  return game.dfreds?.effects?._unconscious;
},

export function getConvenientEffectsDead() {
  //@ts-ignore
  return game.dfreds?.effects?._dead;
}
