type Link = {
  label: string;
  link: string;
  module?: string;
};

export type LinksGroupProps = {
  module?: string;
  label: string;
  icon: React.FC<any>;
  initiallyOpened?: boolean;
  link?: string;
  links?: Link[];
}