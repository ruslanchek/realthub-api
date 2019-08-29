export interface IApiResponse<T = any> {
  data?: T;
  error?: string;
}

export interface IPropertyImage {
  id: string;
  src: string;
  title: string;
  isDefault?: boolean;
}

export interface IPropertyParam {
  id: string;
  value: string;
  type: string;
}

export interface IProperty {
  id: string;
  title: string;
  address: string;
  price: string;
  images: IPropertyImage[];
  params: IPropertyParam[];
  geo: {
    lat: number;
    lng: number;
  };
}
