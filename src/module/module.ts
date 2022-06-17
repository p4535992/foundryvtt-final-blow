import API from "./api";
import CONSTANTS from "./constants";
import { warn, error, debug, i18n, zeroHPExpiry } from "./lib/lib";


export const initHooks = () => {
  warn("Init Hooks processing");
  // setup all the hooks
}

export const setupHooks = () => {
  warn("Setup Hooks processing");
}

export const readyHooks = async () => {
  warn("Ready Hooks processing");

  //@ts-ignore
  libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Actor.documentClass.prototype._preUpdate", _preUpdateActor, "WRAPPER");
}

// ==========================================

async function _preUpdateActor(wrapped, update, options, user) {
  try {
    await checkAndApply(this, update, options, user);
    await zeroHPExpiry(this, update, options, user);
  } catch (err) {
    console.warn("midi-qol | preUpdateActor failed ", err)
  }
  finally {
    return wrapped(update, options, user);
  }
}
