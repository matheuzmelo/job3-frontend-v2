export type TBotaoGenerico = {
  icon: React.ReactNode;
  handle?: () => void;
  label?: string;
  variant?: "black" | "white";
  size?: "small" | "medium" | "large";
  component?: string;
};
