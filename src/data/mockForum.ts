export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    reputation: number;
  };
  category: string;
  subcategory?: string;
  tags: string[];
  votes: number;
  views: number;
  answers: ForumAnswer[];
  hasAcceptedAnswer: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ForumAnswer {
  id: string;
  postId: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    reputation: number;
  };
  votes: number;
  isAccepted: boolean;
  replies: ForumReply[];
  createdAt: string;
}

export interface ForumReply {
  id: string;
  answerId: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    reputation: number;
  };
  votes: number;
  createdAt: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  postCount: number;
  subcategories?: string[];
}

export const forumCategories: ForumCategory[] = [
  {
    id: 'phones',
    name: 'Smartphones',
    description: 'Questions about mobile phones and tablets',
    icon: 'Smartphone',
    postCount: 1243,
    subcategories: ['iPhone', 'Android', 'Accessories']
  },
  {
    id: 'computers',
    name: 'Computers & Laptops',
    description: 'PC, Mac, and laptop discussions',
    icon: 'Laptop',
    postCount: 2156,
    subcategories: ['Windows', 'macOS', 'Linux', 'Hardware']
  },
  {
    id: 'appliances',
    name: 'Home Appliances',
    description: 'Kitchen and home appliance help',
    icon: 'Home',
    postCount: 876,
    subcategories: ['Kitchen', 'Laundry', 'HVAC']
  },
  {
    id: 'audio-video',
    name: 'Audio & Video',
    description: 'TVs, sound systems, and entertainment',
    icon: 'Tv',
    postCount: 654,
    subcategories: ['TVs', 'Sound Systems', 'Streaming']
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Console and PC gaming hardware',
    icon: 'Gamepad2',
    postCount: 1432,
    subcategories: ['PlayStation', 'Xbox', 'Nintendo', 'PC Gaming']
  },
  {
    id: 'general',
    name: 'General Discussion',
    description: 'Everything else electronics',
    icon: 'MessageSquare',
    postCount: 987,
    subcategories: ['Tips & Tricks', 'News', 'Reviews']
  }
];

export const mockForumPosts: ForumPost[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro screen flickering after iOS update',
    content: 'My iPhone 14 Pro started having screen flickering issues after updating to the latest iOS version. The screen randomly flickers, especially when scrolling. Has anyone else experienced this? Any solutions?',
    author: {
      id: 'u1',
      name: 'TechUser2023',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechUser',
      reputation: 456
    },
    category: 'phones',
    subcategory: 'iPhone',
    tags: ['iPhone', 'iOS', 'screen-issues', 'troubleshooting'],
    votes: 24,
    views: 1543,
    hasAcceptedAnswer: true,
    isPinned: false,
    createdAt: '2024-01-10T10:30:00Z',
    updatedAt: '2024-01-11T15:45:00Z',
    answers: [
      {
        id: 'a1',
        postId: '1',
        content: 'Try resetting your display settings. Go to Settings > Display & Brightness > Auto-Lock and change it to a different setting, then change it back. This solved the flickering for me.',
        author: {
          id: 'u2',
          name: 'AppleExpert',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AppleExpert',
          reputation: 1234
        },
        votes: 18,
        isAccepted: true,
        createdAt: '2024-01-10T12:00:00Z',
        replies: []
      },
      {
        id: 'a2',
        postId: '1',
        content: 'If the above doesn\'t work, try a force restart. Press volume up, then volume down, then hold the power button until you see the Apple logo.',
        author: {
          id: 'u3',
          name: 'iPhoneTech',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=iPhoneTech',
          reputation: 892
        },
        votes: 12,
        isAccepted: false,
        createdAt: '2024-01-10T14:30:00Z',
        replies: []
      }
    ]
  },
  {
    id: '2',
    title: 'Best laptop for software development under $1500?',
    content: 'I\'m looking for a laptop for software development. I mainly work with React, Node.js, and Docker. Budget is around $1500. What would you recommend?',
    author: {
      id: 'u4',
      name: 'DevNewbie',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DevNewbie',
      reputation: 234
    },
    category: 'computers',
    subcategory: 'Hardware',
    tags: ['laptop', 'recommendations', 'development', 'budget'],
    votes: 45,
    views: 2341,
    hasAcceptedAnswer: false,
    isPinned: true,
    createdAt: '2024-01-08T09:15:00Z',
    updatedAt: '2024-01-12T11:20:00Z',
    answers: [
      {
        id: 'a3',
        postId: '2',
        content: 'I\'d recommend the Dell XPS 15 or the MacBook Air M2. Both are excellent for development and within your budget. The M2 has better battery life and performance for the price.',
        author: {
          id: 'u5',
          name: 'CodeMaster',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CodeMaster',
          reputation: 2156
        },
        votes: 32,
        isAccepted: false,
        createdAt: '2024-01-08T10:45:00Z',
        replies: [
          {
            id: 'r1',
            answerId: 'a3',
            content: 'Agreed! I\'ve been using the M2 MacBook Air for 6 months and it\'s been fantastic for React development.',
            author: {
              id: 'u6',
              name: 'ReactDev',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ReactDev',
              reputation: 678
            },
            votes: 8,
            createdAt: '2024-01-08T12:00:00Z'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Refrigerator making strange noise - normal or issue?',
    content: 'My Samsung refrigerator (3 years old) has started making a humming/buzzing noise. It\'s not constant, comes and goes every few hours. Should I be concerned?',
    author: {
      id: 'u7',
      name: 'HomeOwner',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HomeOwner',
      reputation: 123
    },
    category: 'appliances',
    subcategory: 'Kitchen',
    tags: ['refrigerator', 'noise', 'troubleshooting', 'samsung'],
    votes: 15,
    views: 876,
    hasAcceptedAnswer: true,
    isPinned: false,
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-12T16:30:00Z',
    answers: [
      {
        id: 'a4',
        postId: '3',
        content: 'This is likely the compressor or condenser fan. Check if the noise changes when you open the door. Also, make sure the fridge is level and not touching the wall. If the noise persists, you might need to call a technician.',
        author: {
          id: 'u8',
          name: 'AppliancePro',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AppliancePro',
          reputation: 1567
        },
        votes: 22,
        isAccepted: true,
        createdAt: '2024-01-12T15:00:00Z',
        replies: []
      }
    ]
  }
];
