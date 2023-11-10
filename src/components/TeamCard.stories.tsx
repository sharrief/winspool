import type { Meta, StoryObj } from '@storybook/react';
import TeamCard from './TeamCard';
import teamThemes from '../util/teamThemes';
import lakersLogo from '../../public/images/lakers.png';
import blazersLogo from '../../public/images/trail_blazers.png';
import cavaliersLogo from '../../public/images/cavaliers.png';
import magicLogo from '../../public/images/magic.png';
import thunderLogo from '../../public/images/thunder.png';
import sixersLogo from '../../public/images/76ers.png';
import netsLogo from '../../public/images/nets.png';
import spursLogo from '../../public/images/spurs.png';
import hornetsLogo from '../../public/images/hornets.png';
import knicksLogo from '../../public/images/knicks.png';
import kingsLogo from '../../public/images/kings.png';
import clippersLogo from '../../public/images/clippers.png';
import raptorsLogo from '../../public/images/raptors.png';
import mavericksLogo from '../../public/images/mavericks.png';
import timberwolvesLogo from '../../public/images/timberwolves.png';
import nuggetsLogo from '../../public/images/nuggets.png';
import jazzLogo from '../../public/images/jazz.png';
import pelicansLogo from '../../public/images/pelicans.png';
import sunsLogo from '../../public/images/suns.png';
import bullsLogo from '../../public/images/bulls.png';
import wizardsLogo from '../../public/images/wizards.png';
import grizzliesLogo from '../../public/images/grizzlies.png';
import bucksLogo from '../../public/images/bucks.png';
import warriorsLogo from '../../public/images/warriors.png';
import heatLogo from '../../public/images/heat.png';
import pistonsLogo from '../../public/images/pistons.png';
import rocketsLogo from '../../public/images/rockets.png';
import celticsLogo from '../../public/images/celtics.png';
import pacersLogo from '../../public/images/pacers.png';
import hawksLogo from '../../public/images/hawks.png';

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
export const TieGames: Story = {
  args: {
    name: 'Los Angeles Lakers',
    image: lakersLogo,
    theme: teamThemes.lakers,
    ...stats,
  },
};
export const Lakers: Story = {
  args: {
    name: 'Los Angeles Lakers',
    image: lakersLogo,
    theme: teamThemes.lakers,
    ...stats,
  },
};
export const TrailBlazers: Story = {
  args: {
    name: 'Portland Trail Blazers',
    image: blazersLogo,
    theme: teamThemes.trail_blazers,
    ...stats,
  },
};
export const Cavaliers: Story = {
  args: {
    name: 'Cleveland Cavaliers',
    image: cavaliersLogo,
    theme: teamThemes.cavaliers,
    ...stats,
  },
};
export const Magic: Story = {
  args: {
    name: 'Orlando Magic',
    image: magicLogo,
    theme: teamThemes.magic,
    ...stats,
  },
};
export const Thunder: Story = {
  args: {
    name: 'Oklahoma City Thunder',
    image: thunderLogo,
    theme: teamThemes.thunder,
    ...stats,
  },
};
export const Sixers: Story = {
  args: {
    name: 'Philadelphia 76ers',
    image: sixersLogo,
    theme: teamThemes['76ers'],
    ...stats,
  },
};
export const Nets: Story = {
  args: {
    name: 'Brooklyn Nets',
    image: netsLogo,
    theme: teamThemes.nets,
    ...stats,
  },
};
export const Spurs: Story = {
  args: {
    name: 'San Antonio Spurs',
    image: spursLogo,
    theme: teamThemes.spurs,
    ...stats,
  },
};
export const Hornets: Story = {
  args: {
    name: 'Charlotte Hornets',
    image: hornetsLogo,
    theme: teamThemes.hornets,
    ...stats,
  },
};
export const Knicks: Story = {
  args: {
    name: 'New York Knicks',
    image: knicksLogo,
    theme: teamThemes.knicks,
    ...stats,
  },
};
export const Kings: Story = {
  args: {
    name: 'Sacramento Kings',
    image: kingsLogo,
    theme: teamThemes.kings,
    ...stats,
  },
};
export const Clippers: Story = {
  args: {
    name: 'Los Angeles Clippers',
    image: clippersLogo,
    theme: teamThemes.clippers,
    ...stats,
  },
};
export const Raptors: Story = {
  args: {
    name: 'Toronto Raptors',
    image: raptorsLogo,
    theme: teamThemes.raptors,
    ...stats,
  },
};
export const Mavericks: Story = {
  args: {
    name: 'Dallas Mavericks',
    image: mavericksLogo,
    theme: teamThemes.mavericks,
    ...stats,
  },
};
export const Timberwolves: Story = {
  args: {
    name: 'Minnesota Timberwolves',
    image: timberwolvesLogo,
    theme: teamThemes.timberwolves,
    ...stats,
  },
};
export const Nuggets: Story = {
  args: {
    name: 'Denver Nuggets',
    image: nuggetsLogo,
    theme: teamThemes.nuggets,
    ...stats,
  },
};
export const Jazz: Story = {
  args: {
    name: 'Utah Jazz',
    image: jazzLogo,
    theme: teamThemes.jazz,
    ...stats,
  },
};
export const Pelicans: Story = {
  args: {
    name: 'New Orleans Pelicans',
    image: pelicansLogo,
    theme: teamThemes.pelicans,
    ...stats,
  },
};
export const Suns: Story = {
  args: {
    name: 'Phoenix Suns',
    image: sunsLogo,
    theme: teamThemes.suns,
    ...stats,
  },
};
export const Bulls: Story = {
  args: {
    name: 'Chicago Bulls',
    image: bullsLogo,
    theme: teamThemes.bulls,
    ...stats,
  },
};
export const Wizards: Story = {
  args: {
    name: 'Washington Wizards',
    image: wizardsLogo,
    theme: teamThemes.wizards,
    ...stats,
  },
};
export const Grizzlies: Story = {
  args: {
    name: 'Memphis Grizzlies',
    image: grizzliesLogo,
    theme: teamThemes.grizzlies,
    ...stats,
  },
};
export const Bucks: Story = {
  args: {
    name: 'Milwaukee Bucks',
    image: bucksLogo,
    theme: teamThemes.bucks,
    ...stats,
  },
};
export const Warriors: Story = {
  args: {
    name: 'Golden State Warrios',
    image: warriorsLogo,
    theme: teamThemes.warriors,
    ...stats,
  },
};
export const Heat: Story = {
  args: {
    name: 'Miami Heat',
    image: heatLogo,
    theme: teamThemes.heat,
    ...stats,
  },
};
export const Pistons: Story = {
  args: {
    name: 'Detroit Pistons',
    image: pistonsLogo,
    theme: teamThemes.pistons,
    ...stats,
  },
};
export const Rockets: Story = {
  args: {
    name: 'Houston Rockets',
    image: rocketsLogo,
    theme: teamThemes.rockets,
    ...stats,
  },
};
export const Celtics: Story = {
  args: {
    name: 'Boston Celtics',
    image: celticsLogo,
    theme: teamThemes.celtics,
    ...stats,
  },
};
export const Pacers: Story = {
  args: {
    name: 'Indiana Pacers',
    image: pacersLogo,
    theme: teamThemes.pacers,
    ...stats,
  },
};
export const Hawks: Story = {
  args: {
    name: 'Atlanta Hawks',
    image: hawksLogo,
    theme: teamThemes.hawks,
    ...stats,
  },
};
