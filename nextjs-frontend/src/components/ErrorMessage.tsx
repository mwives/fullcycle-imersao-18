export type ErrorMessageProps = {
  error: string;
};

export function ErrorMessage(props: ErrorMessageProps) {
  return (
    <div className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
      {props.error}
    </div>
  );
}
