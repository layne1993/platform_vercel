declare class PaginationParams {
  currentPage: number;
  pageSize: number;
}

declare class CustomPaginationMeta {
  constructor(
    public readonly pageSize: number,
    public readonly totalCounts: number,
    public readonly totalPages: number,
    public readonly currentPage: number,
  ) {}
}

declare type Payload = {
  status?: number;
  id: string;
  username: string;
  nickname?: string;
  email?: string;
  mobile: string;
  department?: string;
  departmentId?: string;
};
