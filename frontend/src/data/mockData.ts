export const MOCK_APPS = [
  { id: 'instagram', name: 'Instagram', color: 'text-pink-600', icon: '/icons/insta icon.jpeg' },
  { id: 'x', name: 'X', color: 'text-black', icon: '/icons/x icon.jpeg' },
  { id: 'linkedin', name: 'LinkedIn', color: 'text-blue-600', icon: '/icons/linked in icon.jpeg' },
  { id: 'github', name: 'GitHub', color: 'text-gray-800', icon: '/icons/githubicon.png' },
  { id: 'tiktok', name: 'TikTok', color: 'text-black', icon: '/icons/tiktok icon.jpeg' },
  { id: 'discord', name: 'Discord', color: 'text-indigo-600', icon: '/icons/discord.jpeg' },
  { id: 'facebook', name: 'Facebook', color: 'text-blue-600', icon: '/icons/facebook icon.jpeg' }
] as const;

export const MOCK_ACCOUNTS: Record<string, any[]> = {
  instagram: [
    { id: 'ig_1', username: '@alex_design', avatarUrl: 'https://i.pravatar.cc/150?u=ig_1', type: 'creator' },
    { id: 'ig_2', username: '@studio_shots', avatarUrl: 'https://i.pravatar.cc/150?u=ig_2', type: 'business' },
  ],
  x: [
    { id: 'x_1', username: '@alex_dev', avatarUrl: 'https://i.pravatar.cc/150?u=x_1', type: 'personal' },
  ],
  linkedin: [
    { id: 'li_1', username: 'Alex Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=li_1', type: 'professional' },
  ],
  github: [
    { id: 'gh_1', username: 'alexj-dev', avatarUrl: 'https://i.pravatar.cc/150?u=gh_1', type: 'developer' },
    { id: 'gh_2', username: 'alex-org', avatarUrl: 'https://i.pravatar.cc/150?u=gh_2', type: 'organization' },
  ],
  tiktok: [
    { id: 'tk_1', username: '@alex_toks', avatarUrl: 'https://i.pravatar.cc/150?u=tk_1', type: 'creator' }
  ],
  discord: [
    { id: 'dc_1', username: 'AlexJ#1234', avatarUrl: 'https://i.pravatar.cc/150?u=dc_1', type: 'personal' }
  ],
  facebook: [
    { id: 'fb_1', username: 'Alex Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=fb_1', type: 'personal' }
  ]
};

export const MOCK_POSTS = [
  { id: 'p1', content: 'Just launched my new portfolio! #design #web', likes: 124, comments: 12, shares: 5, date: '2h ago' },
  { id: 'p2', content: 'Exploring the new features in React 19. It is incredibly fast!', likes: 432, comments: 45, shares: 23, date: '1d ago' },
  { id: 'p3', content: 'Design system concept for a fintech dashboard. Dark mode included.', likes: 89, comments: 8, shares: 2, date: '3d ago' },
  { id: 'p4', content: 'Solved 5 hard Leetcode DP problems today, feeling productive.', likes: 56, comments: 4, shares: 1, date: '4d ago' },
];
