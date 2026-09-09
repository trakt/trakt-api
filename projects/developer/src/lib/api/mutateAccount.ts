export async function mutateAccount(
  slot: number,
  method: 'POST' | 'DELETE',
): Promise<void> {
  const action = method === 'POST' ? 'refresh access token' : 'log out';
  let response: Response;

  try {
    response = await fetch(
      `/api/accounts/${slot}${method === 'POST' ? '/refresh' : ''}`,
      { method },
    );
  } catch {
    throw new Error(
      `Could not ${action}. Check your connection and try again.`,
    );
  }

  if (!response.ok) {
    throw new Error(
      `Could not ${action} (${response.status}). Try again${
        method === 'POST' ? ' or reconnect your account' : ''
      }.`,
    );
  }
}
