export interface BasicPageParams {
  page: number;
  pageSize: number;
}

export interface BasicFetchResult<T> {
  items: T[];
  total: number;
}

export interface BasicDatabaseModel {
  ID: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  DeletedAt?: Date;
}
