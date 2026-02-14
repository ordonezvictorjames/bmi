class AdventureRPG {
    constructor() {
        this.character = {
            name: 'Hero',
            class: 'Novice',
            level: 1,
            experience: 0,
            expToNext: 100,
            hp: 100,
            maxHp: 100,
            mp: 50,
            maxMp: 50,
            attack: 10,
            defense: 5,
            gold: 0
        };
        
        this.currentEnemy = null;
        this.battleTimer = null;
        
        this.enemies = [
            { name: 'Rat', emoji: '🐀', hp: 15, maxHp: 15, attack: 3, exp: 5, gold: 2, level: 1 },
            { name: 'Spider', emoji: '🕷️', hp: 25, maxHp: 25, attack: 5, exp: 8, gold: 4, level: 2 },
            { name: 'Goblin', emoji: '👺', hp: 40, maxHp: 40, attack: 8, exp: 15, gold: 8, level: 3 },
            { name: 'Orc', emoji: '👹', hp: 60, maxHp: 60, attack: 12, exp: 25, gold: 15, level: 5 },
            { name: 'Skeleton', emoji: '💀', hp: 80, maxHp: 80, attack: 15, exp: 35, gold: 25, level: 7 },
            { name: 'Troll', emoji: '🧌', hp: 120, maxHp: 120, attack: 20, exp: 50, gold: 40, level: 10 },
            { name: 'Dragon', emoji: '🐉', hp: 200, maxHp: 200, attack: 30, exp: 100, gold: 100, level: 15 }
        ];
        
        this.classes = [
            {
                id: 'novice',
                name: '🧙‍♂️ Novice',
                description: 'Starting adventurer',
                requirements: { level: 1 },
                bonuses: { hp: 0, mp: 0, attack: 0, defense: 0 },
                current: true
            },
            {
                id: 'swordsman',
                name: '⚔️ Swordsman',
                description: 'Melee combat specialist',
                requirements: { level: 10 },
                bonuses: { hp: 50, mp: 0, attack: 15, defense: 10 },
                current: false
            },
            {
                id: 'archer',
                name: '🏹 Archer',
                description: 'Ranged combat expert',
                requirements: { level: 10 },
                bonuses: { hp: 30, mp: 20, attack: 12, defense: 5 },
                current: false
            },
            {
                id: 'wizard',
                name: '🧙‍♂️ Wizard',
                description: 'Master of magic arts',
                requirements: { level: 10 },
                bonuses: { hp: 20, mp: 80, attack: 8, defense: 3 },
                current: false
            },
            {
                id: 'knight',
                name: '🛡️ Knight',
                description: 'Advanced swordsman',
                requirements: { level: 25, class: 'swordsman' },
                bonuses: { hp: 100, mp: 10, attack: 25, defense: 20 },
                current: false
            },
            {
                id: 'hunter',
                name: '🎯 Hunter',
                description: 'Master archer',
                requirements: { level: 25, class: 'archer' },
                bonuses: { hp: 60, mp: 40, attack: 22, defense: 12 },
                current: false
            },
            {
                id: 'sage',
                name: '🔮 Sage',
                description: 'Archmage of destruction',
                requirements: { level: 25, class: 'wizard' },
                bonuses: { hp: 40, mp: 150, attack: 18, defense: 8 },
                current: false
            }
        ];
        
        this.equipment = [
            {
                id: 'wooden_sword',
                name: '🗡️ Wooden Sword',
                description: 'Basic training weapon',
                cost: 50,
                bonuses: { attack: 5 },
                owned: 0
            },
            {
                id: 'leather_armor',
                name: '🦺 Leather Armor',
                description: 'Light protection',
                cost: 100,
                bonuses: { defense: 8, hp: 20 },
                owned: 0
            },
            {
                id: 'iron_sword',
                name: '⚔️ Iron Sword',
                description: 'Sturdy metal blade',
                cost: 200,
                bonuses: { attack: 12 },
                owned: 0
            },
            {
                id: 'magic_staff',
                name: '🪄 Magic Staff',
                description: 'Enhances magical power',
                cost: 300,
                bonuses: { attack: 8, mp: 30 },
                owned: 0
            },
            {
                id: 'steel_armor',
                name: '🛡️ Steel Armor',
                description: 'Heavy protection',
                cost: 500,
                bonuses: { defense: 15, hp: 50 },
                owned: 0
            },
            {
                id: 'enchanted_bow',
                name: '🏹 Enchanted Bow',
                description: 'Magical ranged weapon',
                cost: 800,
                bonuses: { attack: 18, mp: 10 },
                owned: 0
            }
        ];
        
        this.init();
    }
    
    init() {
        this.loadGame();
        this.bindEvents();
        this.spawnEnemy();
        this.startAutoAttack();
        this.updateDisplay();
        this.renderClasses();
        this.renderEquipment();
    }
    
    bindEvents() {
        const attackBtn = document.getElementById('attack-btn');
        attackBtn.addEventListener('click', () => this.attack());
        
        // Add touch events for mobile
        attackBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.attack();
        });
    }
    
    spawnEnemy() {
        // Choose enemy based on character level
        const availableEnemies = this.enemies.filter(enemy => 
            enemy.level <= this.character.level + 2
        );
        
        const enemy = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
        this.currentEnemy = {
            ...enemy,
            hp: enemy.maxHp
        };
        
        this.updateEnemyDisplay();
    }
    
    attack() {
        if (!this.currentEnemy) return;
        
        const damage = Math.max(1, this.character.attack - Math.floor(Math.random() * 5));
        this.currentEnemy.hp -= damage;
        
        this.showDamageNumber(damage);
        this.updateBattleLog(`You deal ${damage} damage!`);
        
        if (this.currentEnemy.hp <= 0) {
            this.defeatEnemy();
        } else {
            // Enemy counter-attack
            setTimeout(() => this.enemyAttack(), 500);
        }
        
        this.updateEnemyDisplay();
    }
    
    enemyAttack() {
        if (!this.currentEnemy || this.currentEnemy.hp <= 0) return;
        
        const damage = Math.max(1, this.currentEnemy.attack - this.character.defense);
        this.character.hp -= damage;
        
        this.updateBattleLog(`${this.currentEnemy.name} deals ${damage} damage!`);
        
        if (this.character.hp <= 0) {
            this.character.hp = 1; // Don't let player die completely
            this.updateBattleLog('You barely survived! Retreating...');
            setTimeout(() => this.spawnEnemy(), 2000);
        }
        
        this.updateDisplay();
    }
    
    defeatEnemy() {
        const exp = this.currentEnemy.exp;
        const gold = this.currentEnemy.gold;
        
        this.character.experience += exp;
        this.character.gold += gold;
        
        this.updateBattleLog(`Victory! +${exp} EXP, +${gold} Gold`);
        
        this.checkLevelUp();
        setTimeout(() => this.spawnEnemy(), 1500);
        
        this.updateDisplay();
        this.saveGame();
    }
    
    checkLevelUp() {
        while (this.character.experience >= this.character.expToNext) {
            this.character.experience -= this.character.expToNext;
            this.character.level++;
            this.character.expToNext = Math.floor(this.character.expToNext * 1.2);
            
            // Level up bonuses
            this.character.maxHp += 10;
            this.character.maxMp += 5;
            this.character.attack += 2;
            this.character.defense += 1;
            this.character.hp = this.character.maxHp; // Full heal on level up
            this.character.mp = this.character.maxMp;
            
            this.updateBattleLog(`Level Up! Now level ${this.character.level}!`);
            this.renderClasses(); // Update available classes
        }
    }
    
    changeClass(classId) {
        const newClass = this.classes.find(c => c.id === classId);
        if (!newClass) return;
        
        // Check requirements
        if (newClass.requirements.level > this.character.level) return;
        if (newClass.requirements.class && this.character.class !== newClass.requirements.class) return;
        
        // Remove old class bonuses
        const oldClass = this.classes.find(c => c.current);
        if (oldClass) {
            oldClass.current = false;
            this.character.maxHp -= oldClass.bonuses.hp;
            this.character.maxMp -= oldClass.bonuses.mp;
            this.character.attack -= oldClass.bonuses.attack;
            this.character.defense -= oldClass.bonuses.defense;
        }
        
        // Apply new class bonuses
        newClass.current = true;
        this.character.class = newClass.name.split(' ')[1]; // Remove emoji
        this.character.maxHp += newClass.bonuses.hp;
        this.character.maxMp += newClass.bonuses.mp;
        this.character.attack += newClass.bonuses.attack;
        this.character.defense += newClass.bonuses.defense;
        
        // Update avatar
        document.getElementById('character-avatar').textContent = newClass.name.split(' ')[0];
        
        this.character.hp = this.character.maxHp; // Full heal on class change
        this.character.mp = this.character.maxMp;
        
        this.updateDisplay();
        this.renderClasses();
        this.saveGame();
    }
    
    buyEquipment(equipmentId) {
        const equipment = this.equipment.find(e => e.id === equipmentId);
        if (!equipment) return;
        
        if (this.character.gold >= equipment.cost) {
            this.character.gold -= equipment.cost;
            equipment.owned++;
            
            // Apply bonuses
            if (equipment.bonuses.attack) this.character.attack += equipment.bonuses.attack;
            if (equipment.bonuses.defense) this.character.defense += equipment.bonuses.defense;
            if (equipment.bonuses.hp) {
                this.character.maxHp += equipment.bonuses.hp;
                this.character.hp += equipment.bonuses.hp;
            }
            if (equipment.bonuses.mp) {
                this.character.maxMp += equipment.bonuses.mp;
                this.character.mp += equipment.bonuses.mp;
            }
            
            this.updateDisplay();
            this.renderEquipment();
            this.saveGame();
        }
    }
    
    startAutoAttack() {
        // Auto-attack every 2 seconds when not manually attacking
        this.battleTimer = setInterval(() => {
            if (this.currentEnemy && this.currentEnemy.hp > 0) {
                // Passive regeneration
                this.character.hp = Math.min(this.character.maxHp, this.character.hp + 1);
                this.character.mp = Math.min(this.character.maxMp, this.character.mp + 1);
                this.updateDisplay();
            }
        }, 2000);
    }
    
    showDamageNumber(damage) {
        const damageEl = document.createElement('div');
        damageEl.className = 'damage-number';
        damageEl.textContent = `-${damage}`;
        
        const enemyAvatar = document.getElementById('enemy-avatar');
        const rect = enemyAvatar.getBoundingClientRect();
        
        damageEl.style.left = rect.left + rect.width/2 + 'px';
        damageEl.style.top = rect.top + 'px';
        
        document.body.appendChild(damageEl);
        
        setTimeout(() => {
            document.body.removeChild(damageEl);
        }, 1000);
    }
    
    updateBattleLog(message) {
        document.getElementById('battle-log').textContent = message;
    }
    
    updateDisplay() {
        document.getElementById('character-name').textContent = this.character.name;
        document.getElementById('character-class').textContent = this.character.class;
        document.getElementById('character-level').textContent = `Level ${this.character.level}`;
        document.getElementById('gold').textContent = this.formatNumber(this.character.gold);
        document.getElementById('experience').textContent = this.formatNumber(this.character.experience);
        document.getElementById('hp').textContent = `${this.character.hp}/${this.character.maxHp}`;
        document.getElementById('mp').textContent = `${this.character.mp}/${this.character.maxMp}`;
        
        // Update EXP bar
        const expProgress = (this.character.experience / this.character.expToNext) * 100;
        document.getElementById('exp-progress').style.width = expProgress + '%';
        document.getElementById('exp-text').textContent = `${this.character.experience}/${this.character.expToNext} EXP`;
    }
    
    updateEnemyDisplay() {
        if (!this.currentEnemy) return;
        
        document.getElementById('enemy-avatar').textContent = this.currentEnemy.emoji;
        document.getElementById('enemy-name').textContent = `${this.currentEnemy.name} (Lv.${this.currentEnemy.level})`;
        document.getElementById('enemy-hp-text').textContent = `${this.currentEnemy.hp}/${this.currentEnemy.maxHp}`;
        
        const hpProgress = (this.currentEnemy.hp / this.currentEnemy.maxHp) * 100;
        document.getElementById('enemy-hp-progress').style.width = hpProgress + '%';
    }
    
    renderClasses() {
        const classesContainer = document.getElementById('classes');
        classesContainer.innerHTML = '';
        
        this.classes.forEach(classData => {
            const canChange = this.character.level >= classData.requirements.level &&
                            (!classData.requirements.class || this.character.class === classData.requirements.class);
            
            const classElement = document.createElement('div');
            classElement.className = `class-item ${canChange ? 'available' : ''} ${classData.current ? 'current' : ''}`;
            
            const reqText = classData.requirements.class ? 
                `Req: Lv.${classData.requirements.level}, ${classData.requirements.class}` :
                `Req: Level ${classData.requirements.level}`;
            
            classElement.innerHTML = `
                <div class="class-info">
                    <div class="class-name">${classData.name}</div>
                    <div class="class-description">${classData.description}</div>
                    <div class="class-requirements">${reqText}</div>
                </div>
                <div class="class-stats">
                    <div class="class-bonus">+${classData.bonuses.attack} ATK, +${classData.bonuses.defense} DEF</div>
                </div>
                <button class="class-button ${classData.current ? 'current-class' : ''}" 
                        ${!canChange || classData.current ? 'disabled' : ''} 
                        onclick="game.changeClass('${classData.id}')">
                    ${classData.current ? 'Current' : 'Change'}
                </button>
            `;
            
            classesContainer.appendChild(classElement);
        });
    }
    
    renderEquipment() {
        const equipmentContainer = document.getElementById('equipment');
        equipmentContainer.innerHTML = '';
        
        this.equipment.forEach(equipment => {
            const canAfford = this.character.gold >= equipment.cost;
            
            const equipmentElement = document.createElement('div');
            equipmentElement.className = `equipment-item ${canAfford ? 'affordable' : ''}`;
            
            equipmentElement.innerHTML = `
                <div class="equipment-info">
                    <div class="equipment-name">${equipment.name}</div>
                    <div class="equipment-description">${equipment.description}</div>
                </div>
                <div class="equipment-stats">
                    <div class="equipment-cost">${this.formatNumber(equipment.cost)} Gold</div>
                    <div style="font-size: 10px; color: #666;">Owned: ${equipment.owned}</div>
                </div>
                <button class="equipment-button" ${!canAfford ? 'disabled' : ''} 
                        onclick="game.buyEquipment('${equipment.id}')">
                    Buy
                </button>
            `;
            
            equipmentContainer.appendChild(equipmentElement);
        });
    }
    
    formatNumber(num) {
        if (num < 1000) {
            return num.toString();
        } else if (num < 1000000) {
            return (num / 1000).toFixed(1) + 'K';
        } else {
            return (num / 1000000).toFixed(1) + 'M';
        }
    }
    
    saveGame() {
        const gameData = {
            character: this.character,
            classes: this.classes.map(c => ({ id: c.id, current: c.current })),
            equipment: this.equipment.map(e => ({ id: e.id, owned: e.owned })),
            timestamp: Date.now()
        };
        localStorage.setItem('adventureRPGSave', JSON.stringify(gameData));
    }
    
    loadGame() {
        const savedData = localStorage.getItem('adventureRPGSave');
        if (savedData) {
            try {
                const gameData = JSON.parse(savedData);
                
                if (gameData.character) {
                    this.character = { ...this.character, ...gameData.character };
                }
                
                if (gameData.classes) {
                    gameData.classes.forEach(savedClass => {
                        const classData = this.classes.find(c => c.id === savedClass.id);
                        if (classData) {
                            classData.current = savedClass.current;
                        }
                    });
                }
                
                if (gameData.equipment) {
                    gameData.equipment.forEach(savedEquipment => {
                        const equipment = this.equipment.find(e => e.id === savedEquipment.id);
                        if (equipment) {
                            equipment.owned = savedEquipment.owned || 0;
                        }
                    });
                }
                
                // Calculate offline progress
                if (gameData.timestamp) {
                    const offlineTime = (Date.now() - gameData.timestamp) / 1000; // seconds
                    const offlineGold = Math.floor(offlineTime / 10); // 1 gold per 10 seconds offline
                    this.character.gold += offlineGold;
                    
                    if (offlineGold > 0) {
                        setTimeout(() => {
                            alert(`Welcome back! You earned ${offlineGold} gold while away!`);
                        }, 1000);
                    }
                }
            } catch (e) {
                console.error('Failed to load save data:', e);
            }
        }
    }
}

// Initialize the game when the page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new AdventureRPG();
});

// Prevent zoom on double tap (mobile)
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
});

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);