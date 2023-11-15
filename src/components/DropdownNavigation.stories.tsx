import type { Meta, StoryObj } from '@storybook/react';
import DropdownNavigation from './DropdownNavigation';

const meta = {
  title: 'Dropdown navigation',
  component: DropdownNavigation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof DropdownNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    label: 'Current',
    options: [
      { label: 'First', path: '/first' },
      { label: 'Second', path: '/second' },
      { label: 'Third', path: '/third' },
    ],
  },
};
