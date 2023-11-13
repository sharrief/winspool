import type { Meta, StoryObj } from '@storybook/react';
import getTeamMeta from '@/util/getTeamMeta';
import GameCard from './GameCard';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Game card',
  component: GameCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
} satisfies Meta<typeof GameCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
const home = getTeamMeta(1);
const away = getTeamMeta(2);
const game = {
  homeAbbreviation: home.abbreviation,
  homeColor: home.primaryColor,
  homeLogo: home.logo,
  homeScore: 98,
  awayAbbreviation: away.abbreviation,
  awayColor: away.primaryColor,
  awayLogo: away.logo,
  awayScore: 88,
  timeLeft: '4:54',
  period: '4th',
  startTime: '5:00 PM ET',
  startDate: 'Sun Oct 29',
  started: true,
  completed: false,
};
export const Live: Story = {
  args: game,
};

export const Scheduled: Story = {
  args: {
    ...game,
    homeScore: 0,
    awayScore: 0,
    startTime: '5:00 PM ET',
    startDate: 'Sun Oct 29',
    started: false,
    completed: false,
  },
};

export const Final: Story = {
  args: {
    ...game,
    period: 'Final',
    started: true,
    completed: true,
  },
};
