import Link from 'next/link';
import React from 'react';

/** Props for the DropdownNavigation component */
interface DropdownNavigationProps {
  /** The label to display in the button */
  label: string,
  /** The list of dropdown options */
  options: {
    /** The label to display for the option */
    label: string,
    /** The path to navigate to for the option */
    path: string,
  }[]
}

export default function DropdownNavigation({ label, options }: DropdownNavigationProps) {
  return (
    <details className="dropdown drop-shadow-md flex-auto">
      <summary className="btn">
        {label}
      </summary>
      <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
        {options
          .map((option) => (
            <li key={option.path}>
              <Link href={option.path}>{option.label}</Link>
            </li>
          ))}
      </ul>
    </details>
  );
}
