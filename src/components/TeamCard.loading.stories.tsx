import type { Meta, StoryObj } from '@storybook/react';
import getTeamMeta from '@/util/getTeamMeta';
import TeamCard from './TeamCard.loading';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Team card loading',
  component: TeamCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
} satisfies Meta<typeof TeamCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
const stats = {
  score: 15,
  wins: 5,
  losses: 6,
};

const { fullName, logo, ...rest } = getTeamMeta(1);
export const Lakers: Story = {
  args: {
    name: fullName,
    image: logo,
    theme: rest,
    ...stats,
  },
};
