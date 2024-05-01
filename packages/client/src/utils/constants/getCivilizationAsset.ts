import ottomanArmy from "../../images/armyAssets/ottoman/ottoman_army.png";
import ottomanSwordsman from "../../images/armyAssets/ottoman/ottoman_swordsman.png";
import ottomanArcher from "../../images/armyAssets/ottoman/ottoman_archer.png";
import ottomanCavalry from "../../images/armyAssets/ottoman/ottoman_cavalry.png";
import ottomanCastle from "../../images/castleAssets/ottoman_castle.png";

import russianArmy from "../../images/armyAssets/russian/russian-army.png";
import russianSwordsman from "../../images/armyAssets/russian/russian-swordsman.png";
import russianArcher from "../../images/armyAssets/russian/russian-archer.png";
import russianCavalry from "../../images/armyAssets/russian/russian-cavalry.png";
import russianCastle from "../../images/castleAssets/russian-castle.png";

import englishArmy from "../../images/armyAssets/english/english-army.png";
import englishArcher from "../../images/armyAssets/english/english-archer.png";
import englishCavalry from "../../images/armyAssets/english/english-cavalry.png";
import englishSwordsman from "../../images/armyAssets/english/english-swordsman.png";
import englishCastle from "../../images/castleAssets/english-castle.png";

import frenchArmy from "../../images/armyAssets/french/french-army.png";
import frenchArcher from "../../images/armyAssets/french/french-archer.png";
import frenchCavalry from "../../images/armyAssets/french/french-cavalry.png";
import frenchSwordsman from "../../images/armyAssets/french/french-swordsman.png";
import frenchCastle from "../../images/castleAssets/french-castle.png";

import chineseArmy from "../../images/armyAssets/chinese/chinese-army.png";
import chineseArcher from "../../images/armyAssets/chinese/chinese-archer.png";
import chineseCavalry from "../../images/armyAssets/chinese/chinese-cavalry.png";
import chineseSwordsman from "../../images/armyAssets/chinese/chinese-swordsman.png";
import chineseCastle from "../../images/castleAssets/chinese-castle.png";

export const getCastleCivilizationAsset = (type: number | null) => {
  if (type === 0) {
    return russianCastle;
  } else if (type === 1) {
    return ottomanCastle;
  } else if (type === 2) {
    return englishCastle;
  } else if (type === 3) {
    return frenchCastle;
  } else if (type === 4) {
    return chineseCastle;
  } else {
    return "";
  }
};

export const getArmyCivilizationAsset = (type: number | null) => {
  if (type === 0) {
    return russianArmy;
  } else if (type === 1) {
    return ottomanArmy;
  } else if (type === 2) {
    return englishArmy;
  } else if (type === 3) {
    return frenchArmy;
  } else if (type === 4) {
    return chineseArmy;
  } else {
    return "";
  }
};

export const getSwordsmanCivilizationAsset = (type: number | null) => {
  if (type === 0) {
    return russianSwordsman;
  } else if (type === 1) {
    return ottomanSwordsman;
  } else if (type === 2) {
    return englishSwordsman;
  } else if (type === 3) {
    return frenchSwordsman;
  } else if (type === 4) {
    return chineseSwordsman;
  } else {
    return "";
  }
};

export const getArcherCivilizationAsset = (type: number | null) => {
  if (type === 0) {
    return russianArcher;
  } else if (type === 1) {
    return ottomanArcher;
  } else if (type === 2) {
    return englishArcher;
  } else if (type === 3) {
    return frenchArcher;
  } else if (type === 4) {
    return chineseArcher;
  } else {
    return "";
  }
};

export const getCavalryCivilizationAsset = (type: number | null) => {
  if (type === 0) {
    return russianCavalry;
  } else if (type === 1) {
    return ottomanCavalry;
  } else if (type === 2) {
    return englishCavalry;
  } else if (type === 3) {
    return frenchCavalry;
  } else if (type === 4) {
    return chineseCavalry;
  } else {
    return "";
  }
};
