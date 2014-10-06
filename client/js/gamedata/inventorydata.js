'use strict';

var ITEMLOC = {
  GROUND: 0,
  INVENTORY: 1,
  EQUIPPED_EQUIP: 2,
  EQUIPPED_AMMO: 3,
  EQUIPPED_COSTUME: 4,
  EQUIPPED_PAT: 5,
  STORAGE_ACCOUNT: 6,
  STORAGE_PREMIUM: 7,
  STORAGE_CHARACTER: 8,
  STORAGE_ITEMMALL: 9,
  ITEMMALL_PURCHASES: 10,
  WISH_LIST: 11,
  ALL: 12,
  QUEST: 13
};

var INVEQUIPIDX = {
  FACE_ITEM: 1,
  HELMET: 2,
  ARMOR: 3,
  BACK: 4,
  ARMS: 5,
  BOOTS: 6,
  WEAPON: 7,
  SHIELD: 8,
  NECKLACE: 9,
  RING: 10,
  EARRING: 11,
  MAX: 12
};

var VISEQUIPIDX = {
  FACE: 0,
  HAIR: 1,
  HELMET: 2,
  ARMOR: 3,
  ARMS: 4,
  BOOTS: 5,
  FACE_ITEM: 6,
  BACK: 7,
  WEAPON: 8,
  SHIELD: 9
};

var ITEMTYPE = {
  FACE_ITEM: 1,
  HELMET: 2,
  ARMOR: 3,
  ARMS: 4,
  BOOTS: 5,
  BACK: 6,
  JEWEL: 7,
  WEAPON: 8,
  SHIELD: 9,
  USE: 10,
  ETC: 11,
  GEM: 11,
  NATURAL: 12,
  QUEST: 13,
  RIDE_PART: 14,
  MOUNT: 15,
  MAX: 16
};

var ITEM_DATA = {
  STANDARD_PRICE: 5
};

var WEAPON_DATA = {
  RANGE: 33
};

var ITMPARTTOVISPART = {};
ITMPARTTOVISPART[INVEQUIPIDX.HELMET] = VISEQUIPIDX.HELMET;
ITMPARTTOVISPART[INVEQUIPIDX.ARMOR] = VISEQUIPIDX.ARMOR;
ITMPARTTOVISPART[INVEQUIPIDX.ARMS] = VISEQUIPIDX.ARMS;
ITMPARTTOVISPART[INVEQUIPIDX.BOOTS] = VISEQUIPIDX.BOOTS;
ITMPARTTOVISPART[INVEQUIPIDX.FACE_ITEM] = VISEQUIPIDX.FACE_ITEM;
ITMPARTTOVISPART[INVEQUIPIDX.BACK] = VISEQUIPIDX.BACK;
ITMPARTTOVISPART[INVEQUIPIDX.WEAPON] = VISEQUIPIDX.WEAPON;
ITMPARTTOVISPART[INVEQUIPIDX.SHIELD] = VISEQUIPIDX.SHIELD;

var ITMPARTTOTYPE = {};
ITMPARTTOTYPE[INVEQUIPIDX.FACE_ITEM] = ITEMTYPE.FACE_ITEM;
ITMPARTTOTYPE[INVEQUIPIDX.HELMET] = ITEMTYPE.HELMET;
ITMPARTTOTYPE[INVEQUIPIDX.ARMOR] = ITEMTYPE.ARMOR;
ITMPARTTOTYPE[INVEQUIPIDX.BACK] = ITEMTYPE.BACK;
ITMPARTTOTYPE[INVEQUIPIDX.ARMS] = ITEMTYPE.ARMS;
ITMPARTTOTYPE[INVEQUIPIDX.BOOTS] = ITEMTYPE.BOOTS;
ITMPARTTOTYPE[INVEQUIPIDX.WEAPON] = ITEMTYPE.WEAPON;
ITMPARTTOTYPE[INVEQUIPIDX.SHIELD] = ITEMTYPE.SHIELD;
ITMPARTTOTYPE[INVEQUIPIDX.NECKLACE] = ITEMTYPE.NECKLACE;
ITMPARTTOTYPE[INVEQUIPIDX.RING] = ITEMTYPE.RING;
ITMPARTTOTYPE[INVEQUIPIDX.EARRING] = ITEMTYPE.EARRING;

var ITMTYPETOPART = {};
ITMTYPETOPART[ITEMTYPE.FACE_ITEM] = INVEQUIPIDX.FACE_ITEM;
ITMTYPETOPART[ITEMTYPE.HELMET] = INVEQUIPIDX.HELMET;
ITMTYPETOPART[ITEMTYPE.ARMOR] = INVEQUIPIDX.ARMOR;
ITMTYPETOPART[ITEMTYPE.BACK] = INVEQUIPIDX.BACK;
ITMTYPETOPART[ITEMTYPE.ARMS] = INVEQUIPIDX.ARMS;
ITMTYPETOPART[ITEMTYPE.BOOTS] = INVEQUIPIDX.BOOTS;
ITMTYPETOPART[ITEMTYPE.WEAPON] = INVEQUIPIDX.WEAPON;
ITMTYPETOPART[ITEMTYPE.SHIELD] = INVEQUIPIDX.SHIELD;
ITMTYPETOPART[ITEMTYPE.NECKLACE] = INVEQUIPIDX.NECKLACE;
ITMTYPETOPART[ITEMTYPE.RING] = INVEQUIPIDX.RING;
ITMTYPETOPART[ITEMTYPE.EARRING] = INVEQUIPIDX.EARRING;

var InventoryData = function() {
  EventEmitter.call(this);
  this.items = [];
  this.money = new Int64();
};

InventoryData.prototype = Object.create(EventEmitter.prototype);

InventoryData.prototype.setMoney = function(money) {
  this.money = money;
  this.emit('changed');
};

InventoryData.prototype.setItems = function(items) {
  this.items = items;
  this.emit('changed');
};

InventoryData.prototype.changeItems = function(changeItems) {
  for (var i = 0; i < changeItems.length; ++i) {
    var changeItem = changeItems[i];

    for (var j = 0; j < this.items.length; ++j) {
      var item = this.items[j]

      if (item.itemKey.lo === changeItem.itemKey.lo &&
          item.itemKey.hi === changeItem.itemKey.hi) {
        this.items[j] = changeItem.item;
      }
    }
  }
  this.emit('changed');
};

InventoryData.prototype.appendItems = function(items) {
  this.items = this.items.concat(items);
  this.emit('changed');
};

InventoryData.prototype.findByItemKey = function(itemKey) {
  for (var i = 0; i < this.items.length; ++i) {
    var item = this.items[i];

    if (item.itemKey.lo === itemKey.lo &&
        item.itemKey.hi === itemKey.hi) {
      return item;
    }
  }

  return null;
};

InventoryData.prototype.findBySlot = function(slotNo) {
  if (slotNo < INVEQUIPIDX.MAX) {
    return this.findByLocSlot(ITEMLOC.EQUIPPED_EQUIP, slotNo);
  } else if (slotNo < INVEQUIPIDX.MAX + 120) {
    return this.findByLocSlot(ITEMLOC.INVENTORY, slotNo - INVEQUIPIDX.MAX);
  } else if (slotNo < INVEQUIPIDX.MAX + 120 + 3) {
    return this.findByLocSlot(ITEMLOC.EQUIPPED_AMMO, slotNo - INVEQUIPIDX.MAX - 120);
  } else if (slotNo < INVEQUIPIDX.MAX + 120 + 3 + 5) {
    return this.findByLocSlot(ITEMLOC.EQUIPPED_PAT, slotNo - INVEQUIPIDX.MAX - 120 - 3);
  } else {
    throw new Error('Find by slot ' + slotNo);
  }
};

InventoryData.prototype.findByLocSlot = function(location, slotNo) {
  for (var i = 0; i < this.items.length; ++i) {
    var item = this.items[i];

    if (item.location === location && item.slotNo === slotNo) {
      return item;
    }
  }

  return null;
};
