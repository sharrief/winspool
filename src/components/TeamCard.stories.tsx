import type { Meta, StoryObj } from '@storybook/react';
import TeamCard from './TeamCard';
import getTeamMeta from '../util/getTeamMeta';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Team card',
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
function getArgsForTeam(id: number) {
  const team = getTeamMeta(id);
  return {
    name: team.fullName,
    image: team.logo,
    theme: team,
  };
}
export const Hawks: Story = {
  args: {
    ...getArgsForTeam(1),
    ...stats,
  },
};
export const Celtics: Story = {
  args: {
    ...getArgsForTeam(2),
    ...stats,
  },
};
export const Nets: Story = {
  args: {
    ...getArgsForTeam(3),
    ...stats,
  },
};
export const Hornets: Story = {
  args: {
    ...getArgsForTeam(4),
    ...stats,
  },
};
export const Bulls: Story = {
  args: {
    ...getArgsForTeam(5),
    ...stats,
  },
};
export const Cavaliers: Story = {
  args: {
    ...getArgsForTeam(6),
    ...stats,
  },
};
export const Mavericks: Story = {
  args: {
    ...getArgsForTeam(7),
    ...stats,
  },
};
export const Nuggets: Story = {
  args: {
    ...getArgsForTeam(8),
    ...stats,
  },
};
export const Pistons: Story = {
  args: {
    ...getArgsForTeam(9),
    ...stats,
  },
};
export const Warriors: Story = {
  args: {
    ...getArgsForTeam(10),
    ...stats,
  },
};
export const Rockets: Story = {
  args: {
    ...getArgsForTeam(11),
    ...stats,
  },
};
export const Pacers: Story = {
  args: {
    ...getArgsForTeam(12),
    ...stats,
  },
};
export const Clippers: Story = {
  args: {
    ...getArgsForTeam(13),
    ...stats,
  },
};
export const Lakers: Story = {
  args: {
    ...getArgsForTeam(14),
    ...stats,
  },
};
export const Grizzlies: Story = {
  args: {
    ...getArgsForTeam(15),
    ...stats,
  },
};
export const Heat: Story = {
  args: {
    ...getArgsForTeam(16),
    ...stats,
  },
};
export const Bucks: Story = {
  args: {
    ...getArgsForTeam(17),
    ...stats,
  },
};
export const Timberwolves: Story = {
  args: {
    ...getArgsForTeam(18),
    ...stats,
  },
};
export const Pelicans: Story = {
  args: {
    ...getArgsForTeam(19),
    ...stats,
  },
};
export const Knicks: Story = {
  args: {
    ...getArgsForTeam(20),
    ...stats,
  },
};
export const Thunder: Story = {
  args: {
    ...getArgsForTeam(21),
    ...stats,
  },
};
export const Magic: Story = {
  args: {
    ...getArgsForTeam(22),
    ...stats,
  },
};
export const Sixers: Story = {
  args: {
    ...getArgsForTeam(23),
    ...stats,
  },
};
export const Suns: Story = {
  args: {
    ...getArgsForTeam(24),
    ...stats,
  },
};
export const TrailBlazers: Story = {
  args: {
    ...getArgsForTeam(25),
    ...stats,
  },
};
export const Kings: Story = {
  args: {
    ...getArgsForTeam(26),
    ...stats,
  },
};
export const Spurs: Story = {
  args: {
    ...getArgsForTeam(27),
    ...stats,
  },
};
export const Raptors: Story = {
  args: {
    ...getArgsForTeam(28),
    ...stats,
  },
};
export const Jazz: Story = {
  args: {
    ...getArgsForTeam(29),
    ...stats,
  },
};
export const Wizards: Story = {
  args: {
    ...getArgsForTeam(30),
    ...stats,
  },
};
