import { PropsWithChildren } from "react";

export type TitleProps = {
  className?: string;
};

export function Title({ className, children }: PropsWithChildren<TitleProps>) {
  return (
    <h1 className={`text-left text-[24px] font-semibold ${className}`}>
      {children}
    </h1>
  );
}
