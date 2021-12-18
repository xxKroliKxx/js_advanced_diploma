import Team from "./Team";

export default class Character {
    constructor(level, type = 'generic', attack, defence, friendly, criticalAttackChance = 0, criticalDamage = 0) {
        // TODO: test
        if (!new.target) {
            throw new Error('Creating a class is prohibited')
        }
        this.level = level;
        this.attack = attack;
        this.defence = defence;
        this.health = 100;
        this.type = type;
        this.friendly = friendly
        this.criticalAttackChance = criticalAttackChance
        this.criticalDamage = criticalDamage
    }

    dealDamage(attacking) {
        let damage = attacking.attack//Math.max(attacking.attack - this.defence, attacking.attack * 0.1)
        if (attacking.criticalAttackChance != 0) {
            let rnd = Math.random()
            if (attacking.criticalAttackChance / 100 >= rnd) {
                damage = Math.round(damage * (attacking.criticalDamage / 100 + 1))
            }
        }
        this.health = Math.max(0, this.health - damage)
        return damage
    }

    lvlUP() {
        this.level += 1
        let life = 1 - (this.health / 100)
        this.attack = Math.max(this.attack, Math.round(this.attack * (1.8 - life)))
        this.defence = Math.max(this.defence, Math.round(this.defence * (1.8 - life)))
        this.health = Math.min(100, this.health + 80)
    }
}

export class Bowman extends Character {
    constructor(lvl) {
        super(lvl, 'bowman', 25, 25, true, 15, 40);
        this.health = 100;
        this.rangeOfTravel = 2;
        this.attackRange = 2;
    }
}

export class Swordsman extends Character {
    constructor(lvl) {
        super(lvl, 'swordsman', 40, 10, true, 10, 15);
        this.health = 100;
        this.rangeOfTravel = 4;
        this.attackRange = 1;
    }
}

export class Magician extends Character {
    constructor(lvl) {
        super(lvl, 'magician', 10, 40, true);
        this.health = 100;
        this.rangeOfTravel = 1;
        this.attackRange = 4;
    }
}

export class Vampire extends Character {
    constructor(lvl) {
        super(lvl, 'vampire', 25, 25, false);
        this.health = 100;
        this.rangeOfTravel = 2;
        this.attackRange = 2;
    }
}

export class Undead extends Character {
    constructor(lvl) {
        super(lvl, 'undead', 40, 10, false);
        this.health = 100;
        this.rangeOfTravel = 4;
        this.attackRange = 1;
    }
}

export class Daemon extends Character {
    constructor(lvl) {
        super(lvl, 'daemon', 10, 40, false);
        this.health = 100;
        this.rangeOfTravel = 1;
        this.attackRange = 4;
    }
}