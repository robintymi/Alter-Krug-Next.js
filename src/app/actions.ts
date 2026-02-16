'use server';

import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const ADMIN_PASSWORD = "alterkrug-admin";
const SESSION_COOKIE_NAME = "alter_krug_admin_session";

const dataFilePath = path.join(process.cwd(), 'src/data/site-content.json');

async function readSiteContent() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read site content:', error);
    return null;
  }
}

export async function getSiteContent() {
  return readSiteContent();
}

export async function updateSiteContent(newContent: unknown) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(newContent, null, 2), 'utf-8');
    revalidatePath('/');
    revalidatePath('/restaurant');
    revalidatePath('/speisekarte');
    revalidatePath('/getraenke');
    revalidatePath('/events');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Failed to update site content:', error);
    return { success: false, error: 'Failed to save content' };
  }
}

export async function login(password: string) {
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return { success: true };
  }

  return { success: false, error: 'Falsches Passwort' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return { success: true };
}

export async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value === 'authenticated';
}
