import { EyeIcon, EyeOffIcon } from "lucide-react";
import React from "react";
import { useState } from "react";

import { Control, Path } from "react-hook-form";
import { FieldValues } from "react-hook-form";

export interface CommonReactHookFormProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T, any>;
}

interface PasswordProps
  extends React.InputHTMLAttributes<
    HTMLInputElement & CommonReactHookFormProps<FieldValues>
  > {}

function Password(props: PasswordProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id="password"
        autoComplete="current-password"
        className="block w-full bg-white dark:bg-neutral-900 px-4 rounded-md border border-neutral-200 dark:border-neutral-800 py-1.5 text-black dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-[#0aa6fd] focus:border-transparent focus:outline-none sm:text-sm sm:leading-6"
        {...props}
        type={show ? "text" : "password"}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {!show && (
          <EyeIcon
            onClick={() => setShow(true)}
            className="text-neutral-400 cursor-pointer h-4 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          />
        )}
        {show && (
          <EyeOffIcon
            onClick={() => setShow(false)}
            className="text-neutral-400 cursor-pointer h-4 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          />
        )}
      </div>
    </div>
  );
}

export default Password;
