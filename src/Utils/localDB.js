// import {splashTwo} from '../Assets';
import {
  Demo,
  ProfileFive,
  ProfileFour,
  ProfileOne,
  ProfileSix,
  ProfileThree,
  ProfileTwo,
  Sample,
  about,
  asenaProfile,
  bg1,
  bg2,
  bg3,
  bg4,
  bg5,
  bg6,
  bio,
  biomass,
  callS,
  contact,
  demo,
  demokit,
  downloadIcon,
  emailS,
  groupPeople,
  hadylProfile,
  icon1,
  icon2,
  icon3,
  icon4,
  icon5,
  icon6,
  linaProfile,
  lock,
  logout,
  messageS,
  microphoneS,
  oil,
  pBoom,
  pKits,
  pMat,
  pPillow,
  pSock,
  pSorbent,
  parkerProfile,
  privacy,
  product,
  profile,
  rapid,
  remediation,
  sample,
  splashIndustrial,
  splashLand,
  splashMarine,
  splashOne,
  splashThree,
  splashTwo,
  terms,
  tindraProfile,
  trainingPDFIcon,
  videoThumb,
  water,
} from '../Assets';

export const onBoardingData = [
  {
    id: 0,
    heading: 'Rail Track Alert!',
    description: 'Your safety companion near railtracks.',
    image: splashOne,
    splashImage: splashMarine,
  },
  {
    id: 1,
    heading: 'Stay Safe Around Railtracks!',
    description: 'Safety tips for your journey.',
    image: splashTwo,
    splashImage: splashLand,
  },
  {
    id: 2,
    heading: `Let's Get Started!`,
    description: `You're near a railtrack.`,
    image: splashThree,
    splashImage: splashIndustrial,
  },
];
export const homeScreenBtns = [
  {
    id: 'Training',
    title: 'Training',
    image: bg1,
    icon: icon1,
    routeName: 'TrainingScreen',
    category: [
      {
        id: 1,
        title: 'Training 101',
      },
      {
        id: 2,
        title: 'Videos',
      },
      {
        id: 3,
        title: 'Content',
      },
      {
        id: 4,
        title: 'Training 101',
      },
      {
        id: 5,
        title: 'Videos',
      },
      {
        id: 6,
        title: 'Content',
      },
    ],
  },
  {
    id: 'Video',
    title: 'Videos',
    image: bg2,
    icon: icon2,
    routeName: 'TrainingScreen',
    isVideo: true,
    category: [
      {
        id: 1,
        title: 'General',
      },
      {
        id: 2,
        title: 'Booms',
      },
      {
        id: 3,
        title: 'Pillows',
      },
      {
        id: 4,
        title: 'Socks',
      },
      {
        id: 5,
        title: 'General',
      },
      {
        id: 6,
        title: 'Content',
      },
    ],
  },
  {
    id: 3,
    title: 'Order a Demo Kit',
    image: bg3,
    icon: icon3,
    routeName: 'DemoKitScreen',
  },
  {
    id: 'MSDSheets',
    title: 'MSDS ',
    image: bg4,
    icon: icon4,
    routeName: 'MSDScreen',
    isVideo: true,
  },
  {
    id: 5,
    title: 'Products',
    image: bg5,
    icon: icon5,
    routeName: 'ProductScreen',
  },
  {
    id: 'salespitch',
    title: 'Perfect Sales Pitch',
    image: bg6,
    icon: icon6,
    routeName: 'TrainingScreen',
  },
];

export const videosData = {
  banner: {},
  category: [
    {
      id: 1,
      videoTitle: 'Green Boom Informational Session | Dr. Sudhir Sharma',
      videoDesc:
        'Join Green Boom CEO Dr. Sudhir Sharma for a short informational session on plastic waste and the importance of choosing biodegradable oil spill',
      videoThumb: videoThumb,
    },
    {
      id: 1,
      videoTitle: 'Green Boom Informational Session | Dr. Sudhir Sharma',
      videoDesc:
        'Join Green Boom CEO Dr. Sudhir Sharma for a short informational session on plastic waste and the importance of choosing biodegradable oil spill',
      videoThumb: videoThumb,
    },
    {
      id: 1,
      videoTitle: 'Green Boom Informational Session | Dr. Sudhir Sharma',
      videoDesc:
        'Join Green Boom CEO Dr. Sudhir Sharma for a short informational session on plastic waste and the importance of choosing biodegradable oil spill',
      videoThumb: videoThumb,
    },
    {
      id: 1,
      videoTitle: 'Green Boom Informational Session | Dr. Sudhir Sharma',
      videoDesc:
        'Join Green Boom CEO Dr. Sudhir Sharma for a short informational session on plastic waste and the importance of choosing biodegradable oil spill',
      videoThumb: videoThumb,
    },
  ],
};

export const settingData = [
  {
    title: 'My Profile',
    image: profile,
    screenUrl: 'MyProfileScreen',
  },
  {
    title: 'Emergency Contacts',
    image: groupPeople,
    screenUrl: 'EmergencyContactScreen',
  },
  {
    title: 'Change Password',
    image: lock,
    screenUrl: 'ChangePasswordScreen',
  },
  {
    title: 'About Green Boom',
    image: about,
    pageUrl: 'https://www.greenboom.com/about',
  },
  {
    title: 'Privacy Policy',
    image: privacy,
    pageUrl: 'https://www.greenboom.com/privacy',
  },
  {
    title: 'Terms and Conditions',
    image: terms,
    pageUrl: 'https://www.greenboom.com/terms',
  },
  {
    title: 'Contact us',
    image: contact,
    screenUrl: 'ContactScreen',
  },
  {
    title: 'Log out',
    image: logout,
    screenUrl: '',
    logOut: 'onCancel',
  },
];
export const contactArry = [
  {
    name: 'Brother',
    phone: '2484456387438',
  },
  {
    name: 'Dad',
    phone: '2484456387438',
  },
  {
    name: 'Cousin',
    phone: '2484456387438',
  },
  {
    name: 'Uncle',
    phone: '2484456387438',
  },
  {
    name: 'Mate',
    phone: '2484456387438',
  },
];

export const contactData = [
  {
    image: ProfileOne,
    designation: 'Sales Support Europe',
    name: 'Lina Nashabat',
    subDesignation: 'Sales Executive',
    email: 'Lina.Nashabat@greenboom.com',
    phone: '+1 (470) 830-2859 ',
    available: '(Available East American office hours)',
  },
  {
    image: ProfileTwo,
    designation: 'Sales Support USA',
    name: 'Parker Pruett',
    subDesignation: 'Sales Director',
    email: 'Parker.Pruett@greenboom.com',
    phone: '+1 (470) 830-4517 ',
    available: '(Available East American office hours)',
  },
  {
    image: ProfileThree,
    designation: 'Sales Support Middle East',
    name: 'Hadyl Harbiye',
    subDesignation: 'Regional Sales Manager',
    email: 'Hadyl.Harbiye@greenboom.com',
    phone: '+974 33251000 ',
    available: '(Available Middle Eastern office hours)',
  },
  {
    image: ProfileFour,
    designation: 'Sales Support Middle East',
    name: 'Asena Kir',
    subDesignation: 'Regional Sales Manager',
    email: 'Asena.Kir@greenboom.com',
    phone: '+974 3325 8000 ',
    available: '(Available Middle Eastern office hours)',
  },
  {
    image: ProfileFive,
    designation: 'Marketing & Product Support',
    name: 'Tindra Falk',
    subDesignation: 'Global Marketing Lead',
    email: 'Tindra.Falk@greenboom.com',
    phone: '+1 (404)786-8003 ',
    available: '(Available European office hours)',
  },
  {
    image: ProfileSix,
    designation: 'For All Other Questions',
    email: 'Info@greenboom.com',
  },
];

export const accordionData = [
  {
    id: 1,
    title: 'Email Script',
    icon: emailS,
  },
  {
    id: 2,
    title: 'Phone Call Script',
    icon: callS,
  },
  {
    id: 3,
    title: 'Voice Mail Script',
    icon: microphoneS,
  },
  {
    id: 4,
    title: 'SMS Script',
    icon: messageS,
  },
];

// export const productsData = [
//   {
//     name: 'Loose Sorbent',
//     sku: 'L0010S',
//     usage: 'For use on water surface',
//     title:
//       'Green Boom’s land use sorbents provide rapid absorption in land and industry environments.',
//     description:
//       'Spill control at its best! With a high capacity for oil absorption, the sorbent coagulates after oil absorption for easy cleanup. Also efficient in sand or sludge remediation.',
//     longDescription:
//       'Spill control at its best! With a high capacity for oil absorption, the sorbent coagulates after oil absorption for easy cleanup. Also efficient in sand or sludge remediation. Fast-wicking cellulose-based granules begin to soak up liquid the moment they touch the spill. Lightweight absorbent is easier than clay to carry and use without injury. Oil spill on sand or sludge has never been easier to clean! The loose sorbent quickly absorbs the oil, and together with the added microbes makes the oil non-traceable after just a few weeks',
//     sizeValue: 'Small',
//     dimensionValue: '10lb / 5kg bag',
//     absorbencyValue: 'Up to 6 gal / 22,7 L',
//     qtyValue: '1 Bag',
//     productDimensionSize: '30" x 14" x 3"',
//     productDimensionCm: '35,6 x 76,2 x 7,62 cm',
//     packageDimensionSize: '30" x 14" x 3"',
//     packageDimensionCm: '35,6 x 76,2 x 7,62 cm',
//     weightProduct: '10lbs / 5kg',
//     totalWeightProduct: '10lbs / 5kg',
//   },
// ];

export const productBottom = [
  {
    icon: bio,
    name: '100% Biodegradable',
  },
  {
    icon: water,
    name: 'Water Repellent',
  },
  {
    icon: oil,
    name: 'Absorbs Oil Only',
  },
  {
    icon: biomass,
    name: '100% Biomass',
  },
  {
    icon: rapid,
    name: 'Rapid Absorption',
  },
  {
    icon: remediation,
    name: 'Oil degrading Remediation Material',
  },
];

export const sizes = ['Small', 'Medium', 'large'];
export const remedidationOption = ['No', 'Yes'];

export const notRequired = [
  'id',
  'product_id',
  'sku_num',
  'updated_at',
  'created_at',
  'added_remediation_material',
];
export const notReqDimension = [
  'created_at',
  'id',
  'product_data_size_id',
  'product_id',
  'updated_at',
];

export const kitList = [
  'Small Sock',
  'Pillow',
  'Mat',
  'Sample of Loose Sorbent',
  'Information',
];

export const kitImages = {
  1: Sample,
  2: Demo,
};
