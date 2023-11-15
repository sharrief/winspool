import type { Meta, StoryObj } from '@storybook/react';
import NavBar from './NavBar';

const meta = {
  title: 'NavBar',
  component: NavBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { siteName: 'Wins Pool' },
};
