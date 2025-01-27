export interface Tag {
  tagId: number;
  allNamesByLocale: { [key: string]: string };
  parentTagIds?: number[];
}

export interface TagsResponse {
  tags: Tag[];
}
