'use strict';

const Character = require('../models/character');

module.exports = {
  '1': new Character({
    name: 'Tahlrok',
    player: 'Jeremy',
    caste: 'Zenith',
    concept: 'Former nearly-giant general of the Realm, now mercenary general.',
    essence: {
      personal: 13,
      peripheral: 33,
      dots: [
        { source: 'base' }
      ]
    },
    willpower: {
      dots: [
        { source: 'base' },
        { source: 'base' },
        { source: 'base' },
        { source: 'base' },
        { source: 'base' },
        { source: 'creation' }
      ]
    },
    limitBreak: 'Contempt of the Virtuous',
    limitTrigger: 'The Solar sees innocents suffering, and is either unable or unwilling to help them.',
    experience: [],
    attributes: {
      physical: {
        category: 'primary',
        strength: [
          { source: 'base' },
          { source: 'creation' },
          { source: 'creation' },
          { source: 'creation' }
        ],
        dexterity: [
          { source: 'base' },
          { source: 'creation' },
          { source: 'creation' },
          { source: 'bonus' }
        ],
        stamina: [
          { source: 'base' },
          { source: 'creation' },
          { source: 'creation' }
        ]
      },
      mental: {
        category: 'secondary',
        perception: [
          { source: 'base' },
          { source: 'creation' }
        ],
        wits: [
          { source: 'base' },
          { source: 'creation' },
          { source: 'creation' }
        ],
        intelligence: [
          { source: 'base' },
          { source: 'creation' },
          { source: 'creation' },
          { source: 'creation' }
        ]
      },
      social: {
        category: 'tertiary',
        charisma: [
          { source: 'base' },
          { source: 'creation' },
          { source: 'creation' },
          { source: 'bonus' }
        ],
        manipulation: [
          { source: 'base' },
          { source: 'creation' }
        ],
        appearance: [
          { source: 'base' },
          { source: 'creation' }
        ]
      }
    },
    abilities: {
      archery: {
        dots: []
      },
      athletics: {
        supernal: true,
        specialities: [
          'Feats of Strength'
        ],
        dots: [
          { source: 'creation' },
          { source: 'creation' },
          { source: 'creation' },
          { source: 'bonus' },
          { source: 'bonus' }
        ]
      },
      awareness: {
        dots: [
          { source: 'creation' },
          { source: 'creation' }
        ]
      },
      brawl: {
        dots: [
          { source: 'creation' },
          { source: 'creation' },
          { source: 'creation' }
        ]
      },
      bureaucracy: {
        dots: []
      },
      craft: {
        dots: []
      },
      dodge: {
        specialities: [
          'Personal Projectile'
        ],
        dots: [
          { source: 'creation' },
          { source: 'creation' },
          { source: 'creation' }
        ]
      },
      integrity: {
        dots: [
          { source: 'creation' },
          { source: 'creation' }
        ]
      },
      investigation: {
        dots: []
      },
      larceny: {
        dots: []
      },
      linguistics: {
        dots: [
          { source: 'creation' }
        ]
      },
      lore: {
        dots: []
      },
      martialArts: {
        dots: []
      },
      medicine: {
        dots: [
          { source: 'creation' }
        ]
      },
      melee: {
        specialities: [
          'Sheild',
          'Grand Goremaul'
        ],
        dots: [
          { source: 'creation' },
          { source: 'creation' },
          { source: 'creation' },
          { source: 'bonus' },
          { source: 'bonus' }
        ]
      },
      occult: {
        dots: []
      },
      performance: {
        dots: []
      },
      presence: {
        dots: [
          { source: 'creation' },
          { source: 'creation' }
        ]
      },
      resistance: {
        dots: [
          { source: 'creation' },
          { source: 'creation' },
          { source: 'creation' }
        ]
      },
      ride: {
        dots: []
      },
      sail: {
        dots: []
      },
      socialize: {
        dots: []
      },
      stealth: {
        dots: []
      },
      survival: {
        dots: [
          { source: 'creation' }
        ]
      },
      thrown: {
        dots: []
      },
      war: {
        dots: [
          { source: 'creation' },
          { source: 'creation' },
          { source: 'creation' },
          { source: 'bonus' }
        ]
      }
    },
    merits: [
      {
        name: 'Giant (10ft tall)',
        dots: [
          { source: 'base' },
          { source: 'base' },
          { source: 'base' },
          { source: 'base' }
        ]
      },
      {
        name: 'Mighty Thew',
        dots: [
          { source: 'base' },
          { source: 'base' },
          { source: 'base' }
        ]
      },
      {
        name: 'Grand Goremaul',
        dots: [
          { source: 'base' },
          { source: 'base' },
          { source: 'base' }
        ]
      },
      {
        name: 'Command',
        dots: [
          { source: 'bonus' },
          { source: 'bonus' },
          { source: 'bonus' }
        ]
      },
      {
        name: 'Resources',
        dots: [
          { source: 'bonus' }
        ]
      }
    ],
    intimacies: {
      defining: [
        {
          type: 'principle',
          positive: true,
          description: 'For the glory of my army!'
        }
      ],
      major: [
        {
          type: 'tie',
          positive: false,
          description: 'Wyld Hunt'
        },
        {
          type: 'principle',
          positive: true,
          description: 'Solve it with muscle.'
        }
      ],
      minor: [
        {
          type: 'principle',
          positive: true,
          description: 'Train hard, drink hard.'
        }
      ]
    }
  }),
  charms: [
    {
      ability: 'athletics',
      name: 'Increasing Strength Exercise'
    },
    {
      ability: 'athletics',
      name: 'Thunder\'s Might'
    },
    {
      ability: 'athletics',
      name: 'Power Suffusing Form Technique'
    },
    {
      ability: 'athletics',
      name: 'Legion Aurochs Method'
    },
    {
      ability: 'athletics',
      name: 'Aegis of Unstoppable Force'
    },
    {
      ability: 'athletics',
      name: 'Nine Aeons Thew'
    },
    {
      ability: 'athletics',
      name: 'Monkey Leap Technique'
    },
    {
      ability: 'athletics',
      name: 'Soaring Crane Leap'
    },
    {
      ability: 'melee',
      name: 'Dipping Swallow Defense'
    },
    {
      ability: 'melee',
      name: 'Excellent Strike'
    },
    {
      ability: 'resistance',
      name: 'Durability of Oak Meditation'
    },
    {
      ability: 'resistance',
      name: 'Ox-Body Technique'
    },
    {
      ability: 'dodge',
      name: 'Reed in the Wind'
    },
    {
      ability: 'war',
      name: 'Ideal Battle Knowledge Prana'
    }
  ],
  health: [
    {
      penalty: 0,
      source: 'base'
    },
    {
      penalty: 0,
      source: 'merit',
      sourceName: 'Giant (10ft tall)'
    },
    {
      penalty: -1,
      source: 'base'
    },
    {
      penalty: -1,
      source: 'base'
    },
    {
      penalty: -1,
      source: 'charm',
      sourceName: 'Ox-Body Technique'
    },
    {
      penalty: -2,
      source: 'base'
    },
    {
      penalty: -2,
      source: 'base'
    },
    {
      penalty: -2,
      source: 'charm',
      sourceName: 'Ox-Body Technique'
    },
    {
      penalty: -4,
      source: 'base'
    }
  ]
};
