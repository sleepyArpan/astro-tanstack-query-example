import { types } from '../utils';

export async function fetchTodos(): Promise<types.Todo[]> {
  const response = await fetch('/api/todos');
  return response.json();
}

export async function createNewTodo(formData: FormData) {
  await fetch('/api/todos', {
    method: 'POST',
    body: formData,
  });
}
