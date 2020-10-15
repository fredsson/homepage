
export interface ModelMapper<R, T> {
  fromResponse(jsonData: R): T;
}
