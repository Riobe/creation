'use strict';

module.exports = function Character(values) {
  this.name = values.name;
  this.player = values.player;
  this.caste = values.caste;
  this.concept = values.concept;
  this.essence = values.essence;
  this.willpower = values.willpower;
  this.limitBreak = values.limitBreak;
  this.limitTrigger = values.limitTrigger;
  this.experience = values.experience;
  this.attributes = values.attributes;
  this.abilities = values.abilities;
  this.merits = values.merits;
  this.intimacies = values.intimacies;
  this.charms = values.charms;
  this.health = values.health;
};
