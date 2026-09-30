import { MenuCategory, MenuItem } from '../types';

export const menuItems: MenuItem[] = [
  {
    id: 'menu-01',
    name: 'Beef tartare',
    category: 'Starters',
    description: 'Hand-cut beef, smoked shallot, capers, rye crisp',
    price: 18,
    image: 'beef-tartare',
  },
  {
    id: 'menu-02',
    name: 'Burrata & heirloom tomato',
    category: 'Starters',
    description: 'Basil oil, aged balsamic, toasted sourdough',
    price: 15,
    image: 'burrata-and-heirloom-tomato',
  },
  {
    id: 'menu-03',
    name: 'Crispy calamari',
    category: 'Starters',
    description: 'Lemon pepper, parsley, roasted garlic aioli',
    price: 17,
    image: 'crispy-calamari',
  },
  {
    id: 'menu-04',
    name: 'Chicken wings',
    category: 'Starters',
    description: 'Crispy wings, house hot sauce, celery, ranch dip',
    price: 16,
    image: 'chicken-wings',
  },
  {
    id: 'menu-05',
    name: 'Truffle parmesan fries',
    category: 'Sides',
    description: 'Sea salt, parmesan, truffle oil, herb aioli',
    price: 10,
    image: 'truffle-parmesan-fries',
  },
  {
    id: 'menu-06',
    name: 'French onion soup',
    category: 'Soups',
    description: 'Caramelized onion broth, crostini, melted Swiss cheese',
    price: 11,
    image: 'french-onion-soup',
  },
  {
    id: 'menu-07',
    name: 'Caesar salad',
    category: 'Salads',
    description: 'Romaine, parmesan, bacon, croutons, creamy Caesar dressing',
    price: 14,
    image: 'caesar-salad',
  },
  {
    id: 'menu-08',
    name: 'Harvest greens',
    category: 'Salads',
    description: 'Mixed greens, apple, goat cheese, walnuts, maple vinaigrette',
    price: 15,
    image: 'harvest-greens',
  },
  {
    id: 'menu-09',
    name: 'Perfect Frame Club club burger',
    category: 'Burgers',
    description: 'Beef patty, aged cheddar, lettuce, tomato, pickles, house sauce',
    price: 21,
    image: 'shorelines-club-burger',
  },
  {
    id: 'menu-10',
    name: 'Crispy chicken burger',
    category: 'Burgers',
    description: 'Buttermilk chicken, cabbage slaw, pickles, spicy mayo',
    price: 20,
    image: 'crispy-chicken-burger',
  },
  {
    id: 'menu-11',
    name: 'Grilled Atlantic salmon',
    category: 'Mains',
    description: 'Herb-roasted potatoes, seasonal vegetables, lemon butter',
    price: 29,
    image: 'grilled-atlantic-salmon',
  },
  {
    id: 'menu-12',
    name: 'AAA striploin steak',
    category: 'Mains',
    description: 'Grilled striploin, garlic mash, seasonal vegetables, peppercorn jus',
    price: 34,
    image: 'aaa-striploin-steak',
  },
  {
    id: 'menu-13',
    name: 'Chicken supreme',
    category: 'Mains',
    description: 'Roasted chicken breast, potato purée, green beans, mushroom jus',
    price: 26,
    image: 'chicken-supreme',
  },
  {
    id: 'menu-14',
    name: 'Fish & chips',
    category: 'Mains',
    description: 'Beer-battered haddock, fries, coleslaw, tartar sauce',
    price: 22,
    image: 'fish-and-chips',
  },
  {
    id: 'menu-15',
    name: 'Wild mushroom pasta',
    category: 'Pasta',
    description: 'Fettuccine, roasted mushrooms, parmesan, garlic cream sauce',
    price: 23,
    image: 'wild-mushroom-pasta',
  },
  {
    id: 'menu-16',
    name: 'Shrimp linguine',
    category: 'Pasta',
    description: 'Garlic shrimp, cherry tomatoes, chili, parsley, lemon butter',
    price: 26,
    image: 'shrimp-linguine',
  },
  {
    id: 'menu-17',
    name: 'Margherita flatbread',
    category: 'Flatbreads',
    description: 'Tomato, mozzarella, fresh basil, extra virgin olive oil',
    price: 17,
    image: 'margherita-flatbread',
  },
  {
    id: 'menu-18',
    name: 'Pepperoni flatbread',
    category: 'Flatbreads',
    description: 'Pepperoni, mozzarella, tomato sauce, oregano',
    price: 19,
    image: 'pepperoni-flatbread',
  },
  {
    id: 'menu-19',
    name: 'New York cheesecake',
    category: 'Desserts',
    description: 'Classic cheesecake, berry compote, whipped cream',
    price: 10,
    image: 'new-york-cheesecake',
  },
  {
    id: 'menu-20',
    name: 'Chocolate lava cake',
    category: 'Desserts',
    description: 'Warm chocolate centre, vanilla ice cream, cocoa crumble',
    price: 11,
    image: 'chocolate-lava-cake',
  },
  {
    id: 'menu-21',
    name: 'Crème brûlée',
    category: 'Desserts',
    description: 'Vanilla custard, caramelized sugar, fresh berries',
    price: 10,
    image: 'creme-brulee',
  },
  {
    id: 'menu-22',
    name: 'Espresso',
    category: 'Coffee & tea',
    description: 'Freshly brewed double espresso',
    price: 4,
    image: 'espresso',
  },
  {
    id: 'menu-23',
    name: 'Cappuccino',
    category: 'Coffee & tea',
    description: 'Espresso, steamed milk, milk foam',
    price: 5,
    image: 'cappuccino',
  },
  {
    id: 'menu-24',
    name: 'Fresh brewed coffee',
    category: 'Coffee & tea',
    description: 'Regular or decaffeinated coffee',
    price: 4,
    image: 'fresh-brewed-coffee',
  },
  {
    id: 'menu-25',
    name: 'Sparkling water',
    category: 'Cold drinks',
    description: 'Chilled sparkling mineral water',
    price: 5,
    image: 'sparkling-water',
  },
  {
    id: 'menu-26',
    name: 'Lemonade',
    category: 'Cold drinks',
    description: 'Fresh lemon, simple syrup, sparkling water',
    price: 6,
    image: 'lemonade',
  },
  {
    id: 'menu-27',
    name: 'Iced tea',
    category: 'Cold drinks',
    description: 'Fresh brewed tea, lemon, lightly sweetened',
    price: 5,
    image: 'iced-tea',
  },
  {
    id: 'menu-28',
    name: 'Ginger ale',
    category: 'Cold drinks',
    description: 'Classic chilled ginger ale',
    price: 4,
    image: 'ginger-ale',
  },
];

export const menuCategories: MenuCategory[] = [
  'Starters',
  'Sides',
  'Soups',
  'Salads',
  'Burgers',
  'Mains',
  'Pasta',
  'Flatbreads',
  'Desserts',
  'Coffee & tea',
  'Cold drinks',
];

export interface MenuSection {
  category: MenuCategory;
  data: MenuItem[];
}

export function menuSections(activeCategory?: MenuCategory): MenuSection[] {
  const source = activeCategory
    ? menuCategories.filter(category => category === activeCategory)
    : menuCategories;

  return source
    .map(category => ({
      category,
      data: menuItems.filter(item => item.category === category),
    }))
    .filter(section => section.data.length > 0);
}

export function menuItemById(id: string): MenuItem | undefined {
  return menuItems.find(item => item.id === id);
}

export const clubTables = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Lounge bar'];
