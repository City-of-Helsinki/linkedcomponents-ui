export type NavigationGroup = {
  heading: string;
  headingLink: string;
  items?: NavigationGroupItem[];
};

export type NavigationGroupItem = {
  label: string;
  url: string;
};
