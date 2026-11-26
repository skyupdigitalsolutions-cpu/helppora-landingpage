// Service catalogue. Amounts are in INR and are always calculated on the server.
export const CONVENIENCE_FEE = 29;

export const managers = [
  {
    id: 'inside',
    title: 'Inside House Manager',
    emoji: '🏠',
    tagline: 'Help with everyday needs at home.',
  },
  {
    id: 'outside',
    title: 'Outside House Manager',
    emoji: '🚶',
    tagline: 'Assistance with the errands that take you out.',
  },
];

export const services = [
  {
    id: 'housekeeping',
    manager: 'inside',
    name: 'Housekeeping Assistance',
    short: 'Help keeping your home clean and running smoothly.',
    description:
      'A helping hand for the daily upkeep of your home, so the house stays comfortable without the effort.',
    details: ['Home cleaning assistance', 'Everyday household support', 'Basic housekeeping services'],
    amount: 499,
  },
  {
    id: 'food',
    manager: 'inside',
    name: 'Food Assistance',
    short: 'Meals and food needs, handled for you.',
    description: 'Support for getting good food to your table, from home meals to ordering on your behalf.',
    details: ['Home food assistance', 'Meal ordering support', 'Everyday food requirements'],
    amount: 199,
  },
  {
    id: 'home-medical',
    manager: 'inside',
    name: 'Medical Assistance',
    short: 'Everyday medical support at home.',
    description: 'Practical help with medical needs at home, so you can focus on rest and recovery.',
    details: ['Help arranging medical needs at home', 'Medicine ordering support', 'Appointment booking support'],
    amount: 599,
  },
  {
    id: 'miscellaneous',
    manager: 'inside',
    name: 'Miscellaneous Assistance',
    short: 'Repairs, insurance and paperwork support.',
    description: 'Support for the small tasks that do not fit anywhere else, from gadgets to paperwork.',
    details: ['Mobile repair assistance', 'Insurance-related support', 'Document-related assistance'],
    amount: 299,
  },
  {
    id: 'medical',
    manager: 'outside',
    name: 'Medical Assistance',
    short: 'Someone by your side at the hospital or clinic.',
    description: 'Reliable help with hospital trips and appointments, including collecting medicines.',
    details: ['Hospital visit assistance', 'Medical appointment assistance', 'Medicine pickup assistance'],
    amount: 799,
  },
  {
    id: 'bank',
    manager: 'outside',
    name: 'Bank and Government Documentation',
    short: 'Help and guidance for your bank and government visits.',
    description: 'Support with the practical side of bank visits and government documentation.',
    details: ['Bank visit assistance', 'Government documentation support', 'Help with general banking-related visits'],
    amount: 499,
  },
  {
    id: 'shopping',
    manager: 'outside',
    name: 'Shopping Assistance',
    short: 'A shopping partner for stress-free outings.',
    description: 'Shop with confidence with someone who helps you carry, compare and get around.',
    details: ['Shopping assistance', 'Assistance during shopping visits'],
    amount: 599,
  },
  {
    id: 'travel',
    manager: 'outside',
    name: 'Travel Assistance',
    short: 'Support for everyday journeys.',
    description: 'Help for your regular trips around town and beyond.',
    details: ['Travel assistance', 'Support during everyday travel'],
    amount: 899,
  },
];
