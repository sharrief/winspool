import type { Meta, StoryObj } from '@storybook/react';
import OwnerSeasonSummary from './OwnerSeasonSummary';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'OwnerSummary',
  component: OwnerSeasonSummary,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
} satisfies Meta<typeof OwnerSeasonSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
const owner: Story['args']['owner'] = {
  id: 1,
  name: 'John Smith',
}
const ownerStats: Story['args']['ownerStats'] = new Map([[2023, {
    wins: 7, ties: 5, losses: 6,
  }]])
const teams: Story['args']['teams'] = [
  {
    id: 1,
    name: 'lakers',
    fullName: 'Los Angeles Lakers'
  },
  {
    id: 2,
    name: 'lakers',
    fullName: 'Los Angeles Lakers'
  },
  {
    id: 3,
    name: 'lakers',
    fullName: 'Los Angeles Lakers'
  },
  {
    id: 4,
    name: 'lakers',
    fullName: 'Los Angeles Lakers'
  },
]

const season = 2023;
const seasonTeamStats = new Map();
export const Basic: Story = {
  args: {
    owner, ownerStats, teams, season, seasonTeamStats
  },
};
