import type { Meta, StoryObj } from '@storybook/react';
import PaginationNavigation from './PaginationNavigation';

const meta = {
  title: 'PaginationNavigation',
  component: PaginationNavigation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof PaginationNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    label: 'Current',
    prevPath: '/previous',
    nextPath: '/next',
  },
};
