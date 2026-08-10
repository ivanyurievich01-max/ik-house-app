"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

const PasswordInput = forwardRef<HTMLInputElement, Props>(
  function PasswordInput(props, ref) {
    const [show, setShow] = useState(false);
    return (
      <div className="relative">
        <input
          {...props}
          ref={ref}
          type={show ? "text" : "password"}
          className="input pr-10"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={show ? "Скрыть пароль" : "Показать пароль"}
          onClick={() => setShow((v) => !v)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  },
);

export default PasswordInput;
