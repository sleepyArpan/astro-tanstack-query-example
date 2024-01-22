import type { APIRoute } from 'astro';
import { types } from '../../utils';

const todos: Array<types.Todo> = [];

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(todos), {
    status: 200,
  });
};

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const todoName = formData.get('todoName');
  if (!todoName) {
    return new Response('Missing todoName', {
      status: 400,
    });
  }
  if (typeof todoName !== 'string') {
    return new Response(
      'Todo should only be typed inside the given input field',
      {
        status: 400,
      }
    );
  }
  todos.push({ name: todoName, done: false, id: Date.now() });
  return new Response(JSON.stringify(todos), {
    status: 200,
  });
};
