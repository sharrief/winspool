/* eslint-disable import/prefer-default-export */
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel('next-app');
}
