 export const  FILTER_CATEGORIES = [
  {
    id: 'productType',
    label: 'Product Type',
    type: 'grid',
    options: [
      { id: 'Earrings', label: 'Earrings' },
      { id: 'Rings', label: 'Rings' },
      { id: 'Bracelets', label: 'Bracelets' },
      { id: 'Necklace', label: 'Necklace' },
      { id: 'Bangle', label: 'Bangle' },
      { id: 'Pendant', label: 'Pendant' },
      { id: 'Chain', label: 'Chain' },
    ]
  },
  {
    id: 'price',
    label: 'Price',
    type: 'list',
    options: [
      { id: 'p1', label: 'Under ₹10,000' },
      { id: 'p2', label: '₹10,000 - ₹20,000' },
      { id: 'p3', label: '₹20,000 - ₹50,000' },
      { id: 'p4', label: 'Above ₹50,000' },
    ]
  },
  {
    id: 'weight',
    label: 'Weight Ranges',
    type: 'list',
    options: [
      { id: 'w1', label: '0 - 2g' },
      { id: 'w2', label: '2 - 5g' },
      { id: 'w3', label: '5 - 10g' },
      { id: 'w4', label: '10g+' },
    ]
  },
  {
    id: 'material',
    label: 'Material',
    type: 'list',
    options: [
      { id: 'gold', label: 'Gold' },
      { id: 'diamond', label: 'Diamond' },
      { id: 'platinum', label: 'Platinum' },
      { id: 'silver', label: 'Silver' },
    ]
  },
  {
    id: 'ringSize',
    label: 'Ring Size',
    type: 'list',
    options: [
      { id: '6', label: '6' },
      { id: '7', label: '7' },
      { id: '8', label: '8' },
      { id: '9', label: '9' },
      { id: '10', label: '10' },
    ]
  },
  {
    id: 'bangleSize',
    label: 'Bangle Size',
    type: 'list',
    options: [
      { id: '2.2', label: '2.2' },
      { id: '2.4', label: '2.4' },
      { id: '2.6', label: '2.6' },
      { id: '2.8', label: '2.8' },
    ]
  },
  {
    id: 'brand',
    label: 'Brand',
    type: 'list',
    options: [
      { id: 'kalyan', label: 'Kalyan' },
      { id: 'tanishq', label: 'Tanishq' },
      { id: 'malabar', label: 'Malabar' },
      { id: 'caratlane', label: 'CaratLane' },
    ]
  },
];