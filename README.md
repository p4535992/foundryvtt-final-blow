# Final Blow

![Latest Release Download Count](https://img.shields.io/github/downloads/p4535992/foundryvtt-final-blow/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge) 

[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ffinal-blow&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=final-blow) 

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-final-blow%2Fmaster%2Fsrc%2Fmodule.json&label=Foundry%20Version&query=$.compatibility.verified&colorB=orange&style=for-the-badge)

![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-final-blow%2Fmaster%2Fsrc%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Ffinal-blow%2Fshield%2Fendorsements&style=for-the-badge)](https://www.foundryvtt-hub.com/package/final-blow/)

![GitHub all releases](https://img.shields.io/github/downloads/p4535992/foundryvtt-final-blow/total?style=for-the-badge)

[![Translation status](https://weblate.foundryvtt-hub.com/widgets/final-blow/-/287x66-black.png)](https://weblate.foundryvtt-hub.com/engage/final-blow/)

### If you want to buy me a coffee [![alt-text](https://img.shields.io/badge/-Patreon-%23ff424d?style=for-the-badge)](https://www.patreon.com/p4535992)

This module is given the possibility during the final blow to the enemy (the one that brings him to 0hp), to show a dialog box where the player is asked if the blow is lethal or not. So we give the choice to decide whether to apply the state of "Unconscious "or" Death " token by token.

The choice is written on chat so that everyone can see it.

A dialogue will popout and ask with some options depending on your preferences.

The request arises from the fact that so I don't have to ask repeatedly:

_"It's a lethal blow ... do you want to kill him or not?"_ and avoid discussions related to this...

![img](./wiki/tutorial1.gif)

## NOTE: If you are a javascript developer and not a typescript developer, you can just use the javascript files under the dist folder


## Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/p4535992/foundryvtt-final-blow/master/src/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button

### socketLib

This module uses the [socketLib](https://github.com/manuelVo/foundryvtt-socketlib) library like a dependency. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

### active-effect-manager-lib

This module uses the [active-effect-manager-lib](https://github.com/p4535992/foundryvtt-active-effect-manager-lib) library like a dependency. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

## Known Issue\Limitation

## Feature

### Integration with [Maxwell's Manual of Malicious Maladies](https://github.com/theripper93/Maxwell-s-Manual-of-Malicious-Maladies)

If the module [Maxwell's Manual of Malicious Maladies](https://github.com/theripper93/Maxwell-s-Manual-of-Malicious-Maladies) is present and active it wwill be called for the wounded action.

## Api


## [Changelog](./CHANGELOG.md)

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/p4535992/foundryvtt-final-blow/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## License

- Some icons are retrieve from the [Dnd5e system](https://gitlab.com/foundrynet/dnd5e) with [MIT](https://gitlab.com/foundrynet/dnd5e/-/blob/master/LICENSE.txt)
- Some icons are retrieve from the [Pf2 system](https://gitlab.com/hooking/foundry-vtt---pathfinder-2e/) with [GPLv2](https://gitlab.com/hooking/foundry-vtt---pathfinder-2e/-/blob/master/LICENSE)
- Some setting and the chat template are a customized version of the one give from the module [Koboldworks Turn Announcer](https://gitlab.com/koboldworks/agnostic/turn-announcer/) with license [MIT](https://gitlab.com/koboldworks/agnostic/turn-announcer/-/blob/master/LICENSE)

This package is under an [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).

## Acknowledgements

Bootstrapped with League of Extraordinary FoundryVTT Developers  [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types).

## Credit

Thanks to anyone who helps me with this code! I appreciate the user community's feedback on this project!

Ty to [koboldworks](https://gitlab.com/koboldworks/) for the module  [Koboldworks Turn Announcer](https://gitlab.com/koboldworks/agnostic/turn-announcer/)
