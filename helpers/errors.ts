// Normalize backend / network errors into a user-facing message.
// Backend REST errors: { message } with err.response.data.message.

export const getErrorMessage = (err: unknown): string | null => {
  if (err && typeof err === "object" && "response" in err) {
    const data = (err as { response?: { data?: { message?: string } } })
      .response?.data;
    if (data?.message) return data.message;
  }
  if (err instanceof Error) return err.message;
  return null;
};
