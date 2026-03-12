'use server';

import { sendMessage } from './api';

export async function submitContactForm(data: { name: string; email: string; phone?: string; subject?: string; message: string }) {
  return sendMessage(data);
}
