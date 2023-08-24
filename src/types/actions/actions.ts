export interface FetchDefaultPostsOptions {
  page?: number;
}

export interface FetchCommunityPostsOptions {
  subnexusName: string;
  page?: number;
}

export interface CreateCommunityPostOptions {
  data: {
    title: string;
    content: string;
    subnexusName: string;
  };
}

export interface CreateCommunityPostResposne {
  status: number;
  data: {
    title: string;
    description: string;
  };
}
