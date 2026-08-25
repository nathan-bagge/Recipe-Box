/*
 * This is the whole recipe collection — one array, one entry per recipe.
 * Adding a recipe just means appending another object here; nothing else
 * needs to change, the homepage and search pick it up automatically.
 *
 * Ingredient "amount" must be a plain number (scaling multiplies it), and
 * "unit" is a short string shown after it (or null for count-based items
 * like "2 large eggs" — put the descriptive word in "name" instead).
 *
 * Every ingredient has an "id". Steps can reference it inline with
 * {id} — at render time this is replaced with that ingredient's amount
 * scaled to the current serving size, so the weight shows up right where
 * it's used in the method, not just in the ingredients list above it.
 */
window.RECIPES = [
  {
    id: 'cinnamon-rolls',
    title: 'Cinnamon Rolls with Cream Cheese Frosting',
    tags: ['breakfast', 'baking', 'yeast', 'brunch', 'sweet'],
    baseServings: 12,
    cookTime: '25\u201330 min',
    description: 'Soft, yeasted cinnamon rolls soaked in warm cream before baking, finished with a cream cheese frosting. Makes 12 rolls in a 9x13" pan.',
    ingredients: [
      {
        group: 'Dough',
        items: [
          { id: 'milk', name: 'warm milk (about 115\u00b0F / 46\u00b0C)', amount: 1, unit: 'cup' },
          { id: 'yeast', name: 'instant dry yeast', amount: 2.5, unit: 'tsp' },
          { id: 'eggs', name: 'large eggs, at room temperature', amount: 2, unit: null },
          { id: 'butterD', name: 'salted butter, melted or very softened (not above 110\u00b0F)', amount: 0.333, unit: 'cup' },
          { id: 'sugarD', name: 'granulated sugar', amount: 0.5, unit: 'cup' },
          { id: 'saltD', name: 'salt', amount: 1, unit: 'tsp' },
          { id: 'flourD', name: 'bread flour, divided \u2014 start with 4 cups, add more only if needed', amount: 4.5, unit: 'cups' }
        ]
      },
      {
        group: 'Filling',
        items: [
          { id: 'butterF', name: 'salted butter, almost melted', amount: 0.5, unit: 'cup' },
          { id: 'sugarF', name: 'brown sugar, packed', amount: 1, unit: 'cup' },
          { id: 'cinnamon', name: 'ground cinnamon', amount: 2, unit: 'tbsp' },
          { id: 'cream', name: 'heavy cream, for pouring over the risen rolls', amount: 0.5, unit: 'cup' }
        ]
      },
      {
        group: 'Frosting',
        items: [
          { id: 'creamcheese', name: 'cream cheese, softened', amount: 6, unit: 'oz' },
          { id: 'butterFr', name: 'salted butter, softened', amount: 0.333, unit: 'cup' },
          { id: 'powderedsugar', name: 'powdered sugar', amount: 2, unit: 'cups' },
          { id: 'extract', name: 'maple extract (or vanilla)', amount: 0.5, unit: 'tbsp' }
        ]
      }
    ],
    steps: [
      'Warm the {milk} milk to about 115\u00b0F (46\u00b0C) and pour into a stand mixer bowl. Sprinkle over the {yeast} yeast and leave for 3\u20134 minutes until frothy. {timer:180}',
      'Add the {eggs} eggs, {butterD} butter, and {sugarD} sugar and mix until combined.',
      'Add the {saltD} salt and 4 cups of the flour (reserving the rest \u2014 {flourD} total) and mix with the beater blade just until combined. Rest for 5 minutes to let the flour absorb the liquid.',
      'Switch to the dough hook and knead on medium speed for 5\u20137 minutes, adding up to \u00bd cup more flour only if needed, until smooth and elastic \u2014 the dough should be slightly tacky and pull away from the sides of the bowl but may stick a little to the base. {timer:300}',
      'Transfer the dough to a greased bowl, cover, and leave somewhere warm until doubled in size \u2014 about 30 minutes. Don\u2019t let it over-rise or the rolls will turn out too airy. {timer:1800}',
      'While the dough rises, mix the {butterF} filling butter, {sugarF} brown sugar, and {cinnamon} cinnamon together in a bowl until well combined.',
      'Turn the dough out onto a well-floured surface and roll into roughly a 24x15" rectangle \u2014 it doesn\u2019t need to be exact.',
      'Spread the cinnamon filling evenly over the dough.',
      'Roll up tightly from the long side, jelly-roll style, then cut into 12 slices and arrange in a greased 9x13" baking pan. Cover and let rise for 20 minutes while the oven preheats to 375\u00b0F (190\u00b0C). {timer:1200}',
      'Warm the {cream} cream until just no longer cold (not hot), then pour it over the risen rolls, letting it soak in around them.',
      'Bake for 25\u201330 minutes until lightly golden and cooked through in the centre \u2014 check at 20 minutes and loosely cover with foil if browning too quickly. {timer:1500}',
      'While the rolls cool slightly, beat the {creamcheese} cream cheese and {butterFr} butter together until smooth, then mix in the {extract} extract and {powderedsugar} powdered sugar. Spread over the rolls once they\u2019ve cooled.'
    ],
    notes: 'If the yeast doesn\u2019t go frothy in step 1, it may be dead \u2014 worth starting over with fresh yeast rather than continuing, since the rolls won\u2019t rise properly.',
    source: null
  },
  {
    id: 'chocolate-chip-cookies',
    title: 'Chocolate Chip Cookies',
    tags: ['dessert', 'baking', 'cookies', 'chocolate'],
    baseServings: 30,
    cookTime: '8\u201310 min',
    description: 'A straightforward chocolate chip cookie \u2014 crisp at the edges, soft in the centre. Makes about 30 cookies.',
    ingredients: [
      { id: 'butter', name: 'salted butter, softened', amount: 150, unit: 'g' },
      { id: 'sugar1', name: 'light brown muscovado sugar', amount: 80, unit: 'g' },
      { id: 'sugar2', name: 'granulated sugar', amount: 80, unit: 'g' },
      { id: 'vanilla', name: 'vanilla extract', amount: 2, unit: 'tsp' },
      { id: 'egg', name: 'large egg', amount: 1, unit: null },
      { id: 'flour', name: 'plain flour', amount: 225, unit: 'g' },
      { id: 'bicarb', name: 'bicarbonate of soda', amount: 0.5, unit: 'tsp' },
      { id: 'salt', name: 'salt', amount: 0.25, unit: 'tsp' },
      { id: 'chocchips', name: 'plain chocolate chips or chunks', amount: 200, unit: 'g' }
    ],
    steps: [
      'Heat the oven to 190C (170C fan) / gas 5 and line two baking sheets with non-stick baking paper.',
      'Beat the {butter} butter with the {sugar1} and {sugar2} sugars until creamy.',
      'Beat in the {vanilla} vanilla extract and {egg} egg.',
      'Sift in the {flour} flour, {bicarb} bicarbonate of soda, and {salt} salt, and mix in with a wooden spoon.',
      'Stir in the {chocchips} chocolate chips or chunks.',
      'Use a teaspoon to scoop small mounds of dough onto the baking trays, spaced well apart \u2014 this should make about 30 cookies.',
      'Bake for 8\u201310 minutes until light brown at the edges and still slightly soft in the centre. {timer:480}',
      'Leave on the tray for a couple of minutes to firm up, then transfer to a cooling rack.'
    ],
    notes: null,
    source: null
  },
  {
    id: 'millionaires-shortbread',
    title: "Millionaire's Shortbread",
    tags: ['dessert', 'baking', 'traybake', 'chocolate', 'caramel'],
    baseServings: 24,
    cookTime: '45\u201350 min',
    description: 'Buttery shortbread base, a thick fudgy caramel layer, and a dark chocolate topping \u2014 makes about 24 squares from a 20cm x 30cm tin. Rich, so cut small.',
    ingredients: [
      {
        group: 'Shortbread',
        items: [
          { id: 'flour', name: 'plain flour', amount: 250, unit: 'g' },
          { id: 'butter1', name: 'unsalted butter, chilled and chopped', amount: 200, unit: 'g' },
          { id: 'sugar1', name: 'golden caster sugar', amount: 100, unit: 'g' },
          { id: 'vanilla', name: 'vanilla extract', amount: 0.25, unit: 'tsp' },
          { id: 'salt1', name: 'salt', amount: 1, unit: 'pinch' }
        ]
      },
      {
        group: 'Caramel',
        items: [
          { id: 'butter2', name: 'butter', amount: 90, unit: 'g' },
          { id: 'condensedmilk', name: 'condensed milk', amount: 1, unit: 'x 379g can' },
          { id: 'syrup', name: 'golden syrup', amount: 2, unit: 'tbsp' },
          { id: 'sugar2', name: 'dark brown sugar', amount: 2, unit: 'tbsp' },
          { id: 'salt2', name: 'salt', amount: 1, unit: 'pinch' }
        ]
      },
      {
        group: 'Chocolate Topping',
        items: [
          { id: 'chocolate', name: 'dark chocolate', amount: 300, unit: 'g' },
          { id: 'butter3', name: 'butter', amount: 50, unit: 'g' },
          { id: 'whitechoc', name: 'white chocolate, melted (optional, for decoration)', amount: 25, unit: 'g' }
        ]
      }
    ],
    steps: [
      'Heat the oven to 160C (140C fan) / gas mark 4. Line a 20cm x 30cm tin with baking parchment. Rub the {flour} flour and {butter1} butter together with your fingertips until the mixture resembles fine breadcrumbs, then stir in the {sugar1} sugar, {vanilla} vanilla, and {salt1} of salt.',
      'Tip the mixture into the prepared tin in an even layer and press down firmly with the back of a spoon. Bake for 45\u201350 minutes until light golden brown, then leave to cool completely in the tin. {timer:2700}',
      'For the caramel, put the {butter2} butter, {condensedmilk} condensed milk, {sugar2} sugar, {syrup} syrup, and {salt2} of salt in a pan. Heat gently until simmering, then whisk continuously for about 6 minutes until thick and fudgy \u2014 the caramel will be very hot, so take care. Leave to cool for 5 minutes, then pour over the cooled shortbread and leave to cool completely. {timer:360}',
      'Melt the {chocolate} dark chocolate and {butter3} butter together in a bowl set over a pan of simmering water, or in the microwave in 30-second bursts, stirring each time. Once melted and glossy, pour over the set caramel layer.',
      'Optional decoration: pipe melted {whitechoc} white chocolate in straight lines along the length of the tin over the dark chocolate. Turn the tin 90\u00b0 and drag a skewer up and down through the lines to create a feathered pattern. Gently shake the tin to settle the chocolate, then leave to set completely before cutting into squares or triangles.'
    ],
    notes: 'Very rich \u2014 cut into small squares. The caramel needs continuous whisking or it can catch and burn, so don\u2019t walk away from the pan during that step.',
    source: 'https://www.bbcgoodfood.com/recipes/millionaires-shortbread'
  }
];
