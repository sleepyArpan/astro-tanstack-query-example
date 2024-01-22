import type { FormEvent } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { types, query } from '../utils';

async function fetchTodos(): Promise<types.Todo[]> {
  const response = await fetch('/api/todos');
  return response.json();
}

async function createNewTodo(formData: FormData) {
  await fetch('/api/todos', {
    method: 'POST',
    body: formData,
  });
}

type TodosProps = {
  initialData: types.Todo[];
};

export default function Todos({ initialData }: TodosProps) {
  const {
    data: todosData,
    isError: isTodosFetchError,
    isPending: isTodosFetchPending,
  } = useQuery(
    {
      queryKey: ['todos'],
      queryFn: fetchTodos,
      initialData,
    },
    query.client
  );

  const {
    mutate: createNewTodoMutate,
    status: createNewTodoStatus,
    error: createNewTodoError,
  } = useMutation(
    {
      mutationFn: createNewTodo,
      onSuccess: () => {
        query.client.invalidateQueries({ queryKey: ['todos'] });
      },
    },
    query.client
  );

  if (isTodosFetchPending) return <div>Loading...</div>;
  if (isTodosFetchError)
    return <div>Unexpected Error occurred, please try again</div>;

  function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    createNewTodoMutate(new FormData(formEvent.currentTarget));
  }

  function getFormFooter() {
    if (createNewTodoStatus === 'pending')
      return <div>Creating new todo...</div>;
    if (createNewTodoStatus === 'error')
      return (
        <div>
          <span>{createNewTodoError.message}</span>
          <button>Retry</button>
        </div>
      );
    return <button>Create todo</button>;
  }

  return (
    <div>
      {todosData.length > 0 ? (
        <ul>
          {todosData.map(todo => (
            <li key={todo.id}>{todo.name}</li>
          ))}
        </ul>
      ) : (
        <div>No todos found</div>
      )}
      <span style={{ fontSize: '1.5rem', marginTop: '20px' }}>New todo</span>
      <form onSubmit={handleSubmit}>
        <label htmlFor='todoName'>Todo name</label>
        <input type='text' name='todoName' required />
        {getFormFooter()}
      </form>
    </div>
  );
}
