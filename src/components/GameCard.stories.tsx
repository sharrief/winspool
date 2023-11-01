import type { Meta, StoryObj } from '@storybook/react';
import GameCard from './GameCard';
import bucksLogo from '../../public/images/bucks.png';
import sixersLogo from '../../public/images/76ers.png';

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
export const Live: Story = {
  args: {
    homeAbbreviation: 'MIL',
    homeName: 'bucks',
    homeLogo: bucksLogo,
    homeScore: 98,
    awayName: '76ers',
    awayAbbreviation: 'PHI',
    awayLogo: sixersLogo,
    awayScore: 88,
    timeLeft: '4:54',
    period: '4th',
    startTime: '5:00 PM ET',
    startDate: 'Sun Oct 29',
    started: true,
    completed: false,
  },
};

export const Scheduled: Story = {
  args: {
    homeAbbreviation: 'MIL',
    homeName: 'bucks',
    homeLogo: bucksLogo,
    homeScore: 98,
    awayName: '76ers',
    awayAbbreviation: 'PHI',
    awayLogo: sixersLogo,
    awayScore: 88,
    timeLeft: '4:54',
    period: '4th',
    startTime: '5:00 PM ET',
    startDate: 'Sun Oct 29',
    started: false,
    completed: false,
  },
};

export const Final: Story = {
  args: {
    homeAbbreviation: 'MIL',
    homeName: 'bucks',
    homeLogo: bucksLogo,
    homeScore: 98,
    awayName: '76ers',
    awayAbbreviation: 'PHI',
    awayLogo: sixersLogo,
    awayScore: 88,
    timeLeft: '',
    period: 'Final',
    startTime: '5:00 PM ET',
    startDate: 'Sun Oct 29',
    started: true,
    completed: true,
  },
};
