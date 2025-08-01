declare module 'react-input-mask' {
  import * as React from 'react';

  interface InputMaskProps extends React.InputHTMLAttributes<HTMLInputElement> {
    mask: string;
    maskChar?: string;
    alwaysShowMask?: boolean;
    // Adicione outras props necessárias aqui
  }

  const InputMask: React.ForwardRefExoticComponent<
    InputMaskProps & React.RefAttributes<HTMLInputElement>
  >;
  
  export default InputMask;
}