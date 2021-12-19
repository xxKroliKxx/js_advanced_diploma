export default class Character {
  constructor(level, type, attack, defence, friendly, critAttackChance = 0, critlDamage = 0) {
    if (new.target === Character) {
      throw new Error('Creating a class is prohibited');
    }
    this.level = level;
    this.attack = attack;
    this.defence = defence;
    this.health = 100;
    this.type = type;
    this.friendly = friendly;
    this.criticalAttackChance = critAttackChance;
    this.criticalDamage = critlDamage;
  }

  dealDamage(attacking) {
    let damage = Math.round(Math.max(attacking.attack - this.defence, attacking.attack * 1.1));
    if (attacking.criticalAttackChance !== 0) {
      const rnd = Math.random();
      if (attacking.criticalAttackChance / 100 >= rnd) {
        damage = Math.round(damage * (attacking.criticalDamage / 100 + 1));
      }
    }
    this.health = Math.max(0, this.health - damage);
    return damage;
  }

  lvlUP() {
    this.level += 1;
    const life = 1 - (this.health / 100);
    this.attack = Math.max(this.attack, Math.round(this.attack * (1.8 - life)));
    this.defence = Math.max(this.defence, Math.round(this.defence * (1.8 - life)));
    this.health = Math.min(100, this.health + 80);
  }

  stats() {
    return `\u{1F396}${this.level} \u{2694} ${this.attack} \u{1F6E1} ${this.defence} \u{2764} ${this.health}`;
  }
}

export class Bowman extends Character {
  constructor(
    lvl,
    health = 100,
    attack = 80, // 25
    defence = 25,
    critAttackChance = 15,
    critDamage = 40,
  ) {
    super(lvl, 'bowman', attack, defence, true, critAttackChance, critDamage);
    this.health = health;
    this.rangeOfTravel = 2;
    this.attackRange = 2;
  }
}

export class Swordsman extends Character {
  constructor(
    lvl,
    health = 100,
    attack = 60, // 40
    defence = 10,
    critAttackChance = 10,
    critDamage = 15,
  ) {
    super(lvl, 'swordsman', attack, defence, true, critAttackChance, critDamage);
    this.health = health;
    this.rangeOfTravel = 4;
    this.attackRange = 1;
  }
}

export class Magician extends Character {
  constructor(
    lvl,
    health = 100,
    attack = 80, // 10
    defence = 40,
    critAttackChance = 30,
    critDamage = 15,
  ) {
    super(lvl, 'magician', attack, defence, true, critAttackChance, critDamage);
    this.health = health;
    this.rangeOfTravel = 1;
    this.attackRange = 4;
  }
}

export class Vampire extends Character {
  constructor(lvl, health = 100, attack = 25, defence = 25) {
    super(lvl, 'vampire', attack, defence, false);
    this.health = health;
    this.rangeOfTravel = 2;
    this.attackRange = 2;
  }
}

export class Undead extends Character {
  constructor(lvl, health = 100, attack = 40, defence = 10) {
    super(lvl, 'undead', attack, defence, false);
    this.health = health;
    this.rangeOfTravel = 4;
    this.attackRange = 1;
  }
}

export class Daemon extends Character {
  constructor(lvl, health = 100, attack = 10, defence = 40) {
    super(lvl, 'daemon', attack, defence, false);
    this.health = health;
    this.rangeOfTravel = 1;
    this.attackRange = 4;
  }
}
