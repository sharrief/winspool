import type { Meta, StoryObj } from '@storybook/react';
import OwnerPoolSummary from './OwnerPoolSummary';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'OwnerSummary',
  component: OwnerPoolSummary,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
} satisfies Meta<typeof OwnerPoolSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

const owner: Story['args']['owner'] = {
  id: 1,
  name: 'John Smith',
  wins: 7,
  ties: 5,
  losses: 6,
};
const rank = 1;
const teamStats = { wins: 10, ties: 1, losses: 9 };
const teams: Story['args']['teams'] = [
  {
    id: 1,
    name: 'lakers',
    fullName: 'Los Angeles Lakers',
    ...teamStats,
  },
  {
    id: 2,
    name: 'lakers',
    fullName: 'Los Angeles Lakers',
    ...teamStats,
  },
  {
    id: 3,
    name: 'lakers',
    fullName: 'Los Angeles Lakers',
    ...teamStats,
  },
  {
    id: 4,
    name: 'lakers',
    fullName: 'Los Angeles Lakers',
    ...teamStats,
  },
];

export const Basic: Story = {
  args: {
    owner, teams, rank,
  },
};
