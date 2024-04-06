export type Toptions = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
};

export type ToptionsResult = {
  page: number;
  take: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};
