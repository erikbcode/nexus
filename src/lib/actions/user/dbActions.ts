'use server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const changeUsername = async (formData: FormData, userId: string) => {
  try {
    // Check that form is populated
    const newUsername = formData.get('username');

    if (!newUsername || newUsername.length < 3) {
      return {
        status: 411,
        data: {
          title: 'Invalid username.',
          description: 'Please enter a valid username between 3 and 20 characters.',
        },
      };
    }

    const session = await getAuthSession();

    if (!session?.user) {
      return {
        status: 401,
        data: {
          title: 'Login required',
          description: 'You need to be logged in to do that.',
        },
      };
    }

    // Check if desired username is taken
    const username = await prisma.user.findFirst({
      where: {
        username: newUsername as string,
      },
    });

    if (username) {
      return {
        status: 409,
        data: {
          title: 'Invalid username.',
          description: 'The username you entered is already taken.',
        },
      };
    }

    // Update the username in the database
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username: newUsername as string,
      },
    });

    return {
      status: 200,
      data: {
        title: 'Success',
        description: 'Username successfully changed.',
      },
    };
  } catch (e) {
    return {
      status: 500,
      data: {
        title: 'Error.',
        description: 'Could not update username. Please try again later.',
      },
    };
  }
};
