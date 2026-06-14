declare module 'react' {
  export const useState: any;
  export const useEffect: any;
  export const createContext: any;
  export const useContext: any;
  export const ReactNode: any;

  export namespace React {
    type FormEvent<T = any> = any;
    type ChangeEvent<T = any> = any;
  }

  const React: any;
  export default React;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}


