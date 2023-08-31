import { BeaverCraftingHelpers } from "./beavers-crafting-helpers";
import { error, warn, log, getItem, info } from "./lib";

// The ID of the Components Compendium
const TIME_TOKEN = "Time Coin";

const LABEL = "Scribe Scroll";

//const FEATS = [{ name: 'spellscriber', price: 0.5 },{ name: 'master scriber', price: 0.5 },{ name: 'etc', price: 0.5 }];
const FEATS = [{ name: "", price: 0.5 }];

// ------------------------------------ //
// const COMPONENTS_COMPENDIUM = 'MC5e.MC5e';
// const pack = game.packs.get(COMPONENTS_COMPENDIUM);
// const components = pack.index.contents;

// ------------------------------------ //
const LEVELS_COST = {
  0: { gp: 15, time: 0 },
  1: { gp: 25, time: 0 },
  2: { gp: 250, time: 0 },
  3: { gp: 500, time: 0 },
  4: { gp: 2500, time: 2 },
  5: { gp: 5000, time: 4 },
  6: { gp: 15000, time: 8 },
  7: { gp: 25000, time: 16 },
  8: { gp: 50000, time: 32 },
  9: { gp: 250000, time: 48 },
};

// ------------------------------------ //
const SPELL_COMPONENTS = {
	'Arcane Sword': { h: ['Miniature Platinum Sword (250 gp)'] },
	Augury: { h: ['Specially Marked Tokens (25 gp)'] },
	'Circle of Death': { h: ['Crushed Black Pearl Powder (500 gp)'] },
	Clairvoyance: { h: [['Glass Eye (100 gp)', 'Jewelled Horn (100 gp)']] },
	Contingency: { h: ['Statuette (1500 gp)'] },
	'Create Undead': { h: ['Black Onyx (150 gp)'] },
	'Find the Path': { h: ['Divinatory Bones (100 gp)'] },
	Forbiddance: { h: ['Powdered Ruby (1,000 gp)'] },
	Forcecage: { h: [['Ruby Dust (1,500 gp)', 'Powdered Ruby (1,500 gp)']] },
	Gate: { h: ['Diamond (5,000 gp)'] },
	'Holy Aura': { h: ['Tiny Reliquary (1,000 gp)'] },
	Identify: { h: ['White Pearl (100 gp)'] },
	'Instant Summons': { h: ['Sapphire (1,000 gp)'] },
	'Magic Jar': { h: ['Golden Reliquary (500 gp)'] },
	'Magnificent Mansion': {
		h: ['Miniature Ivory Portal (5 gp)', 'Piece of polished marble (5 gp)', 'Tiny Silver Spoon (5 gp)'],
	},
	'Plane Shift': { h: ['Forked Metal Rod (250 gp)'] },
	'Programmed Illusion': { h: ['Jade Dust (25 gp)'] },
	Scrying: { h: ['Crystal Ball (1,000 gp)'] },
	'Secret Chest': { h: ['Exquisite Chest (5,000 gp)'] },
	Shapechange: { h: ['Jade Circlet (1500 gp)'] },
	'Warding Bond': { h: ['Platinum Ring (50 gp)'] },
	'Guards and Wards': { c: ['Charcoal (10 gp)'] },
	'Arcane Lock': { c: ['Gold Dust (25 gp)'] },
	'Astral Projection': { c: ['Jacinth (1,000 gp)', 'Ornate Carved Silver Bar (100 gp)'] },
	Awaken: { c: ['Agate (1,000 gp)'] },
	Clone: { c: ['Diamond (1,000 gp)'] },
	'Continual Flame': { c: ['Ruby Dust (50gp)'] },
	Divination: { c: ['Incense (25 gp)'] }, 
	'Find Familiar': { c: ['Charcoal (10 gp)'] },
	'Glyph of Warding': { c: ['Powdered Diamond Dust (200 gp)'] },
	'Greater Restoration': { c: ['Diamond Dust (100 gp)'] },
	Hallow: { c: ['Herbs, Oil, & Incense (1,000 gp)'] },
	"Heroes' Feast": { c: ['Gem-Encrusted Bowl (1,000 gp)'] },
	'Illusory Script': { c: ['Lead-based Ink (10 gp)'] },
	'Legend Lore': { c: ['Incense (250 gp)'], h: [{ i: 'Ivory Strip (50 gp)', qtd: 4 }] },
	'Magic Circle': { c: ['Powdered Silver & Iron (100 gp)'] },
	'Magic Mouth': { c: ['Jade Dust (10 gp)'] },
	Nondetection: { c: ['Diamond Dust (25 gp)'] },
	'Planar Binding': { c: ['Jewel (1,000 gp)'] },
	'Raise Dead': { c: ['Diamond (500 gp)'] },
	Reincarnate: { c: ['Rare Oils & Ungents (1,000 gp)'] },
	Resurrection: { c: ['Diamond (1,000 gp)'] },
	Revivify: { c: ['Diamond (300 gp)'] },
	Sequester: { c: ['Powdered Gem Dusts (5,000 gp)'] },
	Simulacrum: { c: ['Powdered Ruby (1,500 gp)'] },
	Stoneskin: { c: ['Diamond Dust (100 gp)'] },
	Symbol: { c: ['Powdered Diamond & Opal (1,000 gp)'] },
	'Teleportation Circle': { c: ['Gem-infused rare inks (50 gp)'] },
	'True Resurrection': { c: ['Diamonds (25,0000 gp)'] },
	'True Seeing': { c: ['Eye Ointment (25 gp)'] },
};

export class ScrollHelpers {
  static doNotCreateASpellScrollIfYouAreNotGMV2(spell, spellScrollData) {
    if (!game.user.isGM) {
      error(`Non puoi inserire una spell qui`, true);
      foundry.utils.mergeObject(spellScrollData, spell.toObject?.() ?? { ...spell });
    }
  }
  //   static doNotCreateASpellScrollIfYouAreNotGM(wrapped, ...args) {
  //     let result = wrapped(...args);
  //     let [event, itemCurrent] = args;
  //     // if (!game.user.isGM) {
  //     let itemData = fromUuidSync(itemCurrent.uuid);
  //     // Create a Consumable spell scroll on the Inventory tab
  //     if (itemData.type === "spell" && (this._tabs[0].active === "inventory" || this.actor.type === "vehicle")) {
  //       throw error(`Non puoi inserire una spell qui`, true);
  //     } else {
  //       return result;
  //     }
  //   }

  static createScrollContextVoice(item, options) {
    if (!item.type === "spell") {
      //warn(`Non puoi creare uno scroll l'oggetto non e' una spell`, true);
      return;
    }
    options.push({
      name: LABEL,
      icon: "<i class='fas fa-scroll-old fa-fw'></i>",
      callback: () => {
        ScrollHelpers.createScroll(item);
      },
    });
  }

  static async createScroll(itemOrItemUuid) {
    const item = getItem(itemOrItemUuid);
    if (!item) {
      warn(`Non sono riuscito a torvare l'item con riferimento ${itemOrItemUuid}`);
      return;
    }
    return await createScrollInner(item, SPELL_COMPONENTS, FEATS, LABEL, TIME_TOKEN);
  }

  static async createScrollWithParams(itemOrItemUuid, spellComponents, feats, label, timeToken) {
    const item = getItem(itemOrItemUuid);
    if (!item) {
      warn(`Non sono riuscito a torvare l'item con riferimento ${itemOrItemUuid}`);
      return;
    }
    return await createScrollInner(item, spellComponents, feats, label, timeToken);
  }
}

function getItems(actor, itemName) {
  const items = actor.items.contents.filter((f) => itemName === f.name);
  return { items, qtd: items.reduce((a, b) => a + b.system.quantity, 0) };
}

function ask(str, min, max, flavor) {
  return Dialog.prompt({
    title: "How many?",
    content: Handlebars.compile(/*html*/ `
            <form>
                <div class="form-group">
                    <label>${str}</label>
                    <div class="form-fields">
                        <select>
                            {{#each range}}
                                <option value="{{this}}">{{this}}</option>
                            {{/each}}
                        </select>
                    </div>
                    {{#if flavor}}
                    <p class="notes">{{flavor}}</p>
                    {{/if}}
                </div>
            </form>
            `)({
      flavor,
      range: Array(1 + max - min)
        .fill(min)
        .map((i, idx) => i + idx),
    }),
    label: "Confirm",
    callback: (html) => +html.find("select")[0].value,
  });
}

function getActorSpellLevels(actor) {
  const levels = Object.entries(actor.system.spells).map(([k, v]) => {
    if (k === "pact")
      return {
        value: v.value,
        level: v.level,
        pact: true,
      };
    const level = +/spell([1-9])/.exec(k)[1];
    return { value: v.value, level };
  });

  return levels.filter((l) => l.value).sort((a, b) => a.level - b.level);
}

async function spendCoin(actor, gp) {
  const currencies = Object.values(CONFIG.DND5E.currencies).sort((a, b) => a.conversion - b.conversion);
  const currency = actor.system.currency;
  const spend = {};
  const update = {};

  for (const c of currencies) {
    const k = c.abbreviation;
    const val = gp * c.conversion;
    const amount = ~~Math.min(val, currency[k]);
    spend[k] = amount;
    update[k] = currency[k] - amount;
    gp -= amount / c.conversion;
  }

  if (gp > 0) {
    const msg = "Not enough gold coins to spend, or amount is indivisible";
    throw new error(msg, true);
  }

  if (Object.values(update).length) {
    await actor.update({ "system.currency": update });
  }

  return spend;
}

function totalTime(actor, TIME_TOKEN) {
  const items = actor.items.contents.filter((i) => i.name === TIME_TOKEN);
  return items.reduce((a, b) => a + b.system.quantity, 0);
}

async function spendTime(actor, qtd, TIME_TOKEN) {
  const items = actor.items.contents.filter((i) => i.name === TIME_TOKEN);
  const total = items.reduce((a, b) => a + b.system.quantity, 0);
  if (total < qtd) {
    throw error(`Not enough ${TIME_TOKEN}`, true);
  }
  return removeConsumables({ items: { items, qtd }, qtd });
}

async function removeConsumables({ items, qtd }) {
  for (const item of items.items) {
    if (item.system.quantity > qtd) {
      await item.update({ "system.quantity": item.system.quantity - qtd });
      break;
    }
    item.delete();
    qtd -= item.system.quantity;
  }
}

async function createScrollInner(item, SPELL_COMPONENTS, FEATS, LABEL, TIME_TOKEN) {
  if (!(item.name in SPELL_COMPONENTS)) {
    const { consumed, cost } = item.system.materials;
    if (consumed && cost) {
      const msg = "Components not registered for this spell";
      throw new error(item + ", " + msg, true);
    }
  }

  const components = SPELL_COMPONENTS[item.name] ?? {};
  const actor = item.parent;
  if (!actor) {
    warn(`Non posso creare uno spell scroll perchè l'oggetto non e' su un'attore`, true);
    return;
  }

  let max = 99,
    consumables = [];
  [...(components.c ?? []), ...(components.h ?? [])].forEach((c) => {
    let qtd = 1;
    if (typeof c === "object") {
      if ("qtd" in c) {
        qtd = c.qtd;
        c = c.i;
      } else {
        const items = c.map((i) => getItems(actor, i));
        c = items.sort((a, b) => b.qtd - a.qtd)[0].items[0].name;
      }
    }
    const items = getItems(actor, c);
    const maxItem = ~~(items.qtd / qtd);
    max = Math.min(max, maxItem);

    if (maxItem < 1) {
      const msg = `Lacking material component: ${c}`;
      throw new error(msg, true);
    }

    const consume = components.c?.includes(c);
    if (consume) {
      consumables.push({ name: c, qtd, items });
    }
  });

  // Special Rules
  let flavor = "";

  if (max > 1) {
    if (item.name === "Astral Projection") {
      max = await ask(
        "How many creatures the scroll should affect?",
        1,
        max,
        "More creatures increases the component cost."
      );
      if (max > 1) flavor = `Up to ${max} creatures`;
    } else if (item.name === "Create Undead") {
      if (max > 3) max = 3;
      if (max > 1) flavor = `Up to ${max} undeads`;
      max = 1;
    } else {
      max = 1;
    }
  }

  consumables.forEach((c) => (c.qtd *= max));

  const isCantrip = item.system.level === 0;
  const spellLevels = isCantrip ? [{ value: null, level: 0 }] : getActorSpellLevels(actor);
  let currentSpellLevel;

  if (!spellLevels.find((s) => s.level >= item.system.level)) {
    ui.notifications.error(`You don't have enough spell slots available to scribe the scroll`);
    return;
  }

  let cost;

  const confirm = await Dialog.confirm({
    title: `${LABEL}: ${item.name}${flavor ? ` (${flavor})` : ""}?`,
    content: Handlebars.compile(/*html*/ `
            <form>
                <div class="form-group">
                    <label style="font-weight:bold">Cast at Level</label>
                    <div class="form-fields">
                        <select>
                        {{#each levels}}
                            <option value="{{id}}">{{name}} {{#if slots}}({{slots}}){{/if}}</option>
                        {{/each}}
                        </select>
                    </div>
                </div>
                {{#if flavor}}
                <div class="form-group">
                    <label style="font-weight:bold">Effect on</label>
                    <p>{{flavor}}</p>
                </div>
                {{/if}}
                <br>
                <p>Creating the scroll will cost:</p>
                <ul id="cost">
                </ul>
            </form>
        `)({
      flavor,
      levels: spellLevels
        .filter((s) => s.level >= item.system.level)
        .map((s) => ({
          id: spellLevels.indexOf(s),
          name: (s.pact ? "Pact Magic: " : "") + CONFIG.DND5E.spellLevels[s.level],
          slots: s.value === null ? "" : `${s.value} Slot${s.value > 1 ? "s" : ""}`,
        })),
    }),
    yes: () => true,
    no: () => false,
    defaultYes: false,
    render: (html) => {
      function updateCost(level) {
        let { gp, time } = LEVELS_COST[level];
        const price = FEATS.filter((f) => actor.items.contents.find((i) => i.name === f)).reduce(
          (a, b) => a * b.price,
          1
        );

        (gp *= price), (time *= price);

        cost = [
          { name: "gold piece" + (gp > 1 ? "s" : ""), qtd: gp, type: "gp" },
          { name: "time coin" + (time > 1 ? "s" : ""), qtd: time, type: "time" },
          ...consumables,
        ];

        ul.innerHTML = Handlebars.compile(/*html*/ `
                    {{#each cost}}
                        {{#if qtd}}
                        <li>{{qtd}} × <b>{{name}}</b></li>
                        {{/if}}
                    {{/each}}
                `)({
          cost: cost
            .filter((c) => c.qtd)
            .map((c) => ({
              name: c.name,
              qtd: c.qtd.toLocaleString(),
            })),
        });

        html[0].closest(".app").style.height = "";
      }

      const ul = html.find("#cost")[0];

      const select = html.find("select");
      select.on("change", (ev) => {
        const spellLevel = spellLevels[+ev.currentTarget.value];
        currentSpellLevel = spellLevel;
        updateCost(spellLevel.level);
      });
      select.trigger("change");
    },
    options: { height: "auto" },
  });
  if (confirm !== true) return;

  info("Scribing the scroll...", true);

  // Check if Actor has GP and Time
  const gp = cost.find((c) => c.type === "gp").qtd;
  const time = cost.find((c) => c.type === "time").qtd;

  if (totalTime(actor, TIME_TOKEN) < time) {
    throw error(`Not enough ${TIME_TOKEN}`, true);
  }

  // Spending GP and Time Coins
  if (!game.user.isGM) {
    await spendCoin(actor, gp); // Automatically checks for GP
    await spendTime(actor, time, TIME_TOKEN);
  } else {
    info(`Il gamemaster ignora i controlli sul prezzo e sul consumo dei time token`, true);
  }
  // Removing consumable items from Actor
  for (const consumable of consumables) {
    await removeConsumables(consumable);
  }

  // Spending Spell Slot
  if (currentSpellLevel.level !== 0) {
    if (currentSpellLevel.pact) {
      await actor.update({ "system.spells.pact.value": currentSpellLevel.value - 1 });
    } else {
      await actor.update({
        [`system.spells.spell${currentSpellLevel.level}.value`]: currentSpellLevel.value - 1,
      });
    }
  }

  // Creating Spell Scroll
  const data = item.toObject();
  if (currentSpellLevel.level > item.system.level) {
    if (flavor === "") flavor = [];
    else flavor = [flavor];
    flavor = [CONFIG.DND5E.spellLevels[currentSpellLevel.level], ...flavor].join(", ");
  }
  if (flavor) {
    data.name = data.name + " (" + flavor + ")";
  }

  setProperty(data, `flags.beavers-crafting.status`, `created`);
  const scroll = await CONFIG.Item.documentClass.createScrollFromSpell(data);
  const docs = await actor.createEmbeddedDocuments("Item", [scroll]);
  if (docs?.length > 0) {
    await BeaverCraftingHelpers.setItemAsBeaverCrafted(docs[0]);
  }

  ChatMessage.create({
    content: Handlebars.compile(/*html*/ `
            <h2>${LABEL}</h2>
            <p><b>${actor.name}</b> created one <b>${data.name}</b> scroll spending these components:</p>
            <ul>
            {{#each cost}}
                {{#if qtd}}
                <li>{{qtd}} × <b>{{name}}</b></li>
                {{/if}}
            {{/each}}
            </ul>
        `)({
      cost: cost
        .filter((c) => c.qtd)
        .map((c) => ({
          name: c.name,
          qtd: c.qtd.toLocaleString(),
        })),
    }),
  });

  ui.notifications.info(`Scroll created: ${data.name}`);

  return docs;
}
